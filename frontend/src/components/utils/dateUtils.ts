export const transformerDate = (dateIso: string): string => {
  const dateObj = new Date(dateIso);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };

  return dateObj.toLocaleDateString("fr-FR", options);
};
