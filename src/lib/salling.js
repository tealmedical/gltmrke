export const SALLING_HOST = "https://api.sallinggroup.com";
export const SALLING_TOKEN = "45e8f1b8-2092-4a9d-8308-a5faecbd1eff";

export async function fetchSalling(path, params) {
  const url = new URL(SALLING_HOST + path)
  if (params) {
    url.search = new URLSearchParams(params)
  }
  const headers = {
    Authorization: `Bearer ${SALLING_TOKEN}`
  };
  const response = await fetch(url.toString(), { headers });
  return await response.json();
}