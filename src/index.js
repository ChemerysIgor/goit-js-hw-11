import axios from 'axios';
import markup from './js/tamplates/markup.hbs';
import './sass/index.scss';
import Notiflix from 'notiflix';
import { getPicture } from './js/request';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const base_URL = `https://pixabay.com/api/`;
const KEY = `30718387-37dd0a29c3a586dd3ee616e94`;
const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const btn = document.querySelector(`button`);
const list = document.querySelector(`.gallery`);

const loadBtn = document.querySelector(`.load-more`);
let page = 1;
let totalPages;
let pictureValue = ``;
console.log(pictureValue);

var lightbox = new SimpleLightbox('.gallery a', {
  navText: ['<', '>'],
  close: false,
  animationSpeed: 300,
  docClose: true,
});

form.addEventListener(`submit`, onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  list.innerHTML = ``;
  pictureValue = evt.currentTarget.elements[0].value;

  getPicture(pictureValue, page)
    .then(response => {
      totalPages = Math.ceil(response.data.totalHits / 40);
      const totalHits = response.data.totalHits;
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images." `);
      console.log(response);
      if (response.status === 404 || response.data.hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (response.data.totalHits < 40) {
        Notiflix.Notify.failure(
          ' We are sorry, but you have reached the end of search results.'
        );
      }

      list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));

      const itemCard = document.querySelector('.gallery').firstElementChild;
      // console.log(itemCard);
      const { height: cardHeight } = itemCard.getBoundingClientRect();
      // console.dir(itemCard.getBoundingClientRect());
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      list.addEventListener('click', showgallery);
      function showgallery(e) {
        e.preventDefault();

        // list.removeEventListener('click', showgallery);
      }
      lightbox.refresh();

      // ------------------ВАРІАНТ З СКРОЛОМ---------//
      const guard = document.querySelector('.guard');
      const options = {
        root: null,
        rootMargin: `200px`,
        threshold: 1,
      };
      const observer = new IntersectionObserver(onLoad, options);
      page = 1;
      observer.observe(guard);

      function onLoad(entries) {
        entries.forEach(entry => {
          console.log(entry);
          if (entry.isIntersecting) {
            page += 1;
            getPicture(pictureValue, page).then(response => {
              list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));
              lightbox.refresh();
              const itemCard =
                document.querySelector('.gallery').firstElementChild;
              // console.log(itemCard);
              const { height: cardHeight } = itemCard.getBoundingClientRect();
              // console.dir(itemCard.getBoundingClientRect());
              window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
              });

              list.addEventListener('click', showgallery);
              function showgallery(e) {
                e.preventDefault();
              }
              console.log(response.data.hits.length);
              if (response.data.hits.length === 0) {
                Notiflix.Notify.failure(
                  ' We are sorry, but you have reached the end of search results.'
                );

                // loadBtn.setAttribute('hidden', true);
              }
            });
          }
        });
      }
      // ------------//

      // loadBtn.removeAttribute('hidden');
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}
// --------------ВАРІФНТ З КНОПКОЮ-------------------//

// loadBtn.addEventListener(`click`, onLoad);
// function onLoad() {
//   page += 1;
//   console.log(page);
//   console.log(totalPages);

//   getPicture(pictureValue, page).then(response => {
//     list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));
//     var lightbox = new SimpleLightbox('.gallery a', {
//       navText: ['<', '>'],
//       close: false,
//       animationSpeed: 300,
//       docClose: true,
//     });

//     list.addEventListener('click', showgallery);
//     function showgallery(e) {
//       e.preventDefault();
//     }

//     lightbox.refresh();
//     const itemCard = document.querySelector('.gallery').firstElementChild;
//     const { height: cardHeight } = itemCard.getBoundingClientRect();
//     console.dir(itemCard.getBoundingClientRect());
//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });
//     if (page === totalPages) {
//       Notiflix.Notify.failure('Hooray! We found totalHits images.');

//       loadBtn.setAttribute('hidden', true);
//     }
//   });
// }
