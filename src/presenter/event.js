import TripEventView from "../view/trip-event.js";
import EditEventFormView from "../view/edit-event-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, isOnline} from "../utils/common.js";
import {toast} from "../utils/toast.js";
import {UserAction, UpdateType, State} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventPresenter {
  constructor(eventsListContainer, offersModel, destinationsModel, changeData, changeMode) {
    this._eventsListContainer = eventsListContainer;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onFormEscPressHandler = this._onFormEscPressHandler.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new TripEventView(event);
    this._editEventComponent = new EditEventFormView(event, this._offersModel.getAllOffers(), this._destinationsModel.getDestinations());
    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._editEventComponent.setDeleteEventClickHandler(this._handleDeleteClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    if (!this._editEventComponent._isNewEvent) {
      this._editEventComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);
    }

    if (prevEventComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEditEventComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._editEventComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editEventComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editEventComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._editEventComponent.shake(resetFormState);
        break;
    }
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener(`keydown`, this._onFormEscPressHandler);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToForm() {
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onFormEscPressHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _onFormEscPressHandler(evt) {
    if (evt.key === ESC_KEY) {
      evt.preventDefault();
      this._editEventComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(`You can't edit event offline`);
      this.setViewState(State.ABORTING);
      return;
    }

    this._replaceCardToForm();
  }

  _handleDeleteClick(event) {
    if (!isOnline()) {
      toast(`You can't delete event offline`);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleFormSubmit(event) {
    if (!isOnline()) {
      toast(`You can't save event offline`);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleRollupButtonClick() {
    this._editEventComponent.reset(this._event);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }
}

