import './sass/index.scss';
import Notiflix from 'notiflix';
import { fetchPicture } from './js/request';
const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const btn = document.querySelector(`button`);
const list = document.querySelector(`.gallery`);

fetchPicture()
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(`message`);
  });

btn.addEventListener(`submit`, onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
}

const createMurkup = arr => {
  arr.map(
    `<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`
  );
};
