import axios from 'axios';
import markup from './js/tamplates/markup.hbs';
import './sass/index.scss';
import Notiflix from 'notiflix';
import { getPicture } from './js/request';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const input = document.querySelector('input');
// const btn = document.querySelector(`button`);
// const loadBtn = document.querySelector(`.load-more`);
const form = document.querySelector('#search-form');
const list = document.querySelector(`.gallery`);
let page = 1;
let pictureValue = ``;

var lightbox = new SimpleLightbox('.gallery a', {
  navText: ['<', '>'],
  close: false,
  animationSpeed: 300,
  docClose: true,
});

form.addEventListener(`submit`, onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  list.innerHTML = ``;
  pictureValue = evt.currentTarget.elements[0].value.trim();

  getPicture(pictureValue, page)
    .then(response => {
      const totalHits = response.data.totalHits;

      if (
        response.status === 404 ||
        pictureValue === `` ||
        response.status === 400
      ) {
        list.innerHTML = ``;
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (response.data.totalHits < 40) {
        Notiflix.Notify.failure(
          ' We are sorry, but you have reached the end of search results.'
        );
      } else {
        list.innerHTML = ``;
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images." `);
        list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));

        const itemCard = document.querySelector('.gallery').firstElementChild;
        const { height: cardHeight } = itemCard.getBoundingClientRect();
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

        // ------------------ВАРІАНТ ЗІ СКРОЛОМ---------//
        const guard = document.querySelector('.guard');
        const options = {
          root: null,
          rootMargin: `50px`,
          threshold: 1,
        };
        const observer = new IntersectionObserver(onLoad, options);
        page = 1;
        observer.observe(guard);

        function onLoad(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              page += 1;
              getPicture(pictureValue, page).then(response => {
                if (response.data.hits.length === 0) {
                  return Notiflix.Notify.failure(
                    ' We are sorry, but you have reached the end of search results.'
                  );
                } else if (
                  response.status === 404 ||
                  pictureValue === `` ||
                  response.status === 400
                ) {
                  list.innerHTML = ``;
                  Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                  );
                  list.innerHTML = ``;
                } else {
                  list.insertAdjacentHTML(
                    `beforeend`,
                    markup(response.data.hits)
                  );
                  lightbox.refresh();
                  const itemCard =
                    document.querySelector('.gallery').firstElementChild;
                  console.log(itemCard);
                  const { height: cardHeight } =
                    itemCard.getBoundingClientRect();
                  console.dir(itemCard.getBoundingClientRect());
                  window.scrollBy({
                    top: cardHeight * 2,
                    behavior: 'smooth',
                  });

                  list.addEventListener('click', showgallery);
                  function showgallery(e) {
                    e.preventDefault();
                  }
                }
              });
            }
          });
        }

        // loadBtn.removeAttribute('hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}
// }
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
