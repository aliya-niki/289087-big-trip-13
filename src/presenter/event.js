import TripEventView from "../view/trip-event.js";
import EditEventFormView from "../view/edit-event-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY} from "../utils/common.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventPresenter {
  constructor(eventsListContainer, changeData, changeMode) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._handleClick = this._handleClick.bind(this);
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
    this._editEventComponent = new EditEventFormView(event);
    this._eventComponent.setClickHandler(this._handleClick);
    this._editEventComponent.setDeleteEventClickHandler(this._handleDeleteClick);


    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (!this._editEventComponent._isNewEvent) {
      this._editEventComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);
    }

    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._editEventComponent.reset(this._event);
      this._replaceFormToCard();
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

  _handleClick() {
    this._replaceCardToForm();
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        event
    );
    this._replaceFormToCard();
  }

  _handleRollupButtonClick() {
    this._editEventComponent.reset(this._event);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }
}


