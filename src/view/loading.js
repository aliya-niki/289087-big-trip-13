import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return `<p class="trip-events__msg">
    Loading...
  </p>`;
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
