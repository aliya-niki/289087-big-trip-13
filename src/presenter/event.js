import TripEventView from "../view/trip-event.js";
import EditEventFormView from "../view/edit-event-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

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
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new TripEventView(event);
    this._editEventComponent = new EditEventFormView(event);
    this._eventComponent.setClickHandler(this._handleClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
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
      this._replaceFormToCard();
    }
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._editEventComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToForm() {
    replace(this._editEventComponent, this._eventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _handleClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(event) {
    this._changeData(event);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
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


