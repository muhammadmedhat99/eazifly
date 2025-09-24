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

export async function fetchPermissions(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}client/get/client/permission`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      local: "ar",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch permissions");

  const data = await res.json();
  
  return data.data;
}
