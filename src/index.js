import axios from 'axios';
import markup from './js/tamplates/markup.hbs';
import './sass/index.scss';
import Notiflix from 'notiflix';
// import { getPicture } from './js/request';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
const base_URL = `https://pixabay.com/api/`;
const KEY = `30718387-37dd0a29c3a586dd3ee616e94`;

// const input = document.querySelector('input');
// const btn = document.querySelector(`button`);
// const loadBtn = document.querySelector(`.load-more`);
const form = document.querySelector('#search-form');
const list = document.querySelector(`.gallery`);
const guard = document.querySelector('.guard');

let pictureValue = ``;

var lightbox = new SimpleLightbox('.gallery a', {
  navText: ['<', '>'],
  close: false,
  animationSpeed: 300,
  docClose: true,
});
let page = 1;

const options = {
      root: null,
      rootMargin: `50px`,
      threshold: 1,
    };
    const observer = new IntersectionObserver(onLoad, options);
 function onLoad(entries) {console.log(`завантажилось чомусь`)
               entries.forEach(entry => {
              if (entry.isIntersecting) {
          page += 1;

          getPicture(pictureValue, page).then(response => {console.dir(response)
            if (!response || response.status === 400 || response.data.hits.length === 0) {
             
              return Notiflix.Notify.failure(
                ' We are sorry, but you have reached the end of search results.'
              );
            }
            else {
              console.log(response.data.hits.length)
              list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));
              lightbox.refresh();
              
              const itemCard =
                document.querySelector('.gallery').firstElementChild;
              console.log(itemCard);
              const { height: cardHeight } = itemCard.getBoundingClientRect();
              console.dir(itemCard.getBoundingClientRect());
              window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
              });

              // list.addEventListener('click', showgallery);
              // function showgallery(e) {
              //   e.preventDefault();
              // }
            }
          });
        } else (console.log( `nothing`))
      });
}
        
const getPicture = async () => {
    try {
      const response = await axios.get(
        `${base_URL}?key=${KEY}&q=${pictureValue}&image_type&orientation&safesearch=true&page=${page}&per_page=40`
      );
     console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

form.addEventListener(`submit`, onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  list.innerHTML = ``;
  observer.disconnect(guard);
  page = 1;
  pictureValue = evt.currentTarget.elements[0].value.trim();
  if (evt.currentTarget.elements[0].value.trim() !== ``) { 
 
  
  getPicture(pictureValue, page).then(response => { 
    const totalHits = response.data.totalHits;
    console.log (totalHits)
      if (
      response.status === 404 ||
     totalHits === 0 ||
      response.status === 400
    ) {
      list.innerHTML = ``;
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      }
          else {
      list.innerHTML = ``;
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images." `);
      list.insertAdjacentHTML(`beforeend`, markup(response.data.hits));

        observer.observe(guard);

        list.addEventListener('click', showgallery);
      function showgallery(e) {
        e.preventDefault();
      
      }
        lightbox.refresh();
        
              }
  
  })
    .catch(error => {
  Notiflix.Notify.failure(error.message);
});
    
  } else {
   list.innerHTML = ``;
    Notiflix.Notify.failure(`Enter a request`)
  }
  
   
    
  
    
    // loadBtn.removeAttribute('hidden');

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
