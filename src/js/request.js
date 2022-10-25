import axios from 'axios';
const base_URL = `https://pixabay.com/api/`;
const KEY = `30718387-37dd0a29c3a586dd3ee616e94`;

export async function getPicture(pictureValue, page = 1) {
  const array = await axios.get(
    `${base_URL}?key=${KEY}&q=${pictureValue}&image_type&orientation&safesearch=true&page=${page}&per_page=40`
  );
  return array;
}
