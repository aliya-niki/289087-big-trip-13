const toastContainer = document.createElement(`div`);
toastContainer.classList.add(`toast-container`);
document.body.append(toastContainer);

export const toast = (message) => {
  if (!Array.from(document.querySelectorAll(`.toast-item`)).find((element) => element.textContent === message)) {
    const toastItem = document.createElement(`div`);
    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainer.append(toastItem);

    window.addEventListener(`online`, () => {
      toastItem.remove();
    });
  }
};
