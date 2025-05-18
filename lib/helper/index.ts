type FormatDateOptions = Intl.DateTimeFormatOptions;

export function formatDate(
  input: string | Date,
  locale: string = "en-US",
  options: FormatDateOptions = {
    dateStyle: "short",
    timeStyle: "short",
  }
): string {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to formatDate:", input);
    return "";
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
