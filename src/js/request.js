const KEY = `30718387-37dd0a29c3a586dd3ee616e94`;
const base_URL = `https://pixabay.com/api/`;

export function fetchPicture() {
  fetch(
    `${base_URL}?key = ${KEY} & q & image_type & orientation & safesearch=true & page=1 & per_page=40`
  ).then(data => {
    if (!data.ok || data.status === 404) {
      throw new Error();
    }
    return data.json;
  });
}
