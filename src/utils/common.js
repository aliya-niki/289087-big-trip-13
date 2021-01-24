export const ESC_KEY = `Escape`;

export const capitalizeFirstLetter = (str) => {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
