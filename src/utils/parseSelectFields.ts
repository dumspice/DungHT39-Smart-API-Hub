export const parseSelectField = (fieldsQuery: any) => {
  if (!fieldsQuery || typeof fieldsQuery !== "string") {
    return undefined;
  }

  const selectObj = fieldsQuery
    .split(",")
    .map((f) => f.trim())
    .filter((f) => f.length > 0) // Remove empty string
    .reduce((acc: any, field: string) => {
      acc[field] = true;
      return acc;
    }, {});

  return Object.keys(selectObj).length > 0 ? selectObj : undefined;
};
