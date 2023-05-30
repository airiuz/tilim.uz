export const delay = new Promise<boolean>((resolve, reject) => {
  setTimeout(() => resolve(true), 1000);
});
