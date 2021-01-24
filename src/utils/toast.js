const toastContainerElement = document.createElement(`div`);
toastContainerElement.classList.add(`toast-container`);
document.body.append(toastContainerElement);

export const toast = (message) => {
  if (!Array.from(document.querySelectorAll(`.toast-item`)).find((element) => element.textContent === message)) {
    const toastItem = document.createElement(`div`);
    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainerElement.append(toastItem);

    window.addEventListener(`online`, () => {
      toastItem.remove();
    });
  }
};
