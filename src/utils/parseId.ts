export const parseId = (id: string) => {
  // If the ID is a number, parse it as a number; if the ID is a UUID, keep the string.
  return isNaN(Number(id)) ? id : Number(id);
};
