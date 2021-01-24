import FilterView from "../view/filters.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {FilterType, UpdateType} from "../const.js";
import {applyFilter} from "../utils/filter.js";

export default class FiltersPresenter {
  constructor(filterContainer, filtersModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._eventsModel = eventsModel;
    this._activeFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filtersModel.addObserver(this._handleModelEvent);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._activeFilter = this._filtersModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._activeFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._activeFilter === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  disableFilters() {
    this._filterComponent.disableFilters();
  }

  enableFilters() {
    this._filterComponent.disableFilters();
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        number: applyFilter[FilterType.EVERYTHING](this._eventsModel.getEvents()).length
      },
      {
        type: FilterType.PAST,
        number: applyFilter[FilterType.PAST](this._eventsModel.getEvents()).length
      },
      {
        type: FilterType.FUTURE,
        number: applyFilter[FilterType.FUTURE](this._eventsModel.getEvents()).length
      }
    ];
  }
}
