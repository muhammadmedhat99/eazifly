const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function postData(
  url: string,
  data: BodyInit,
  headerData: HeadersInit
) {
  const res = await fetch(BaseUrl + url, {
    method: "POST",
    headers: headerData,
    body: data,
    redirect: "follow",
  });
  const result = await res.json();
  return result;
}
