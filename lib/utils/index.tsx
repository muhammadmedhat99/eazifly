import axios from "axios";
const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function postData(
  url: string,
  data: any,
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

export async function putData(url: string, data: any, headerData: any) {
  const res = await fetch(BaseUrl + url, {
    method: "PUT",
    headers: headerData,
    body: data,
    redirect: "follow",
  });
  const result = await res.json();
  return result;
}

export async function deleteData(url: string, data: any, headerData: any) {
  const res = await fetch(BaseUrl + url, {
    method: "DELETE",
    headers: headerData,
    body: data,
    redirect: "follow",
  });
  const result = await res.json();
  return result;
}

export const fetchData = async (endpoint: string, token?: string) => {
  try {
    const url = `${BaseUrl}${endpoint}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClient = async (endpoint: string, config: any) => {
  try {
    const response = await axios.get(`${BaseUrl}${endpoint}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
