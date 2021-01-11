import EditEventFormView from "../view/edit-event-form.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {ESC_KEY, generateId} from "../utils/common.js";
import {BLANK_EVENT} from "../utils/events.js";
import {UserAction, UpdateType} from "../const.js";

export default class NewEventPresenter {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._destroyCallback = null;

    this._editEventComponent = null;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onFormEscPressHandler = this._onFormEscPressHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._editEventComponent !== null) {
      return;
    }
    this._editEventComponent = new EditEventFormView(BLANK_EVENT, true);
    this._editEventComponent.setDeleteEventClickHandler(this._handleDeleteClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._eventsListContainer, this._editEventComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._onFormEscPressHandler);
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._editEventComponent);
    this._editEventComponent = null;

    document.removeEventListener(`keydown`, this._onFormEscPressHandler);
  }

  _onFormEscPressHandler(evt) {
    if (evt.key === ESC_KEY) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, event)
    );
    this.destroy();
  }
}


