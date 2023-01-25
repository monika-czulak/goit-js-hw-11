import { Notify } from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const parameters = {
  API_KEY: '33117991-e676598b9a80b077edaeb8d01',
  IMG_TYPE: 'photo',
  ORIENTATION: 'horizontal',
  SAFE_SEARCH: 'true',
  PER_PAGE: 40,
};

const { API_KEY, IMG_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = parameters;

let currentPage = 1;
let query = '';
let totalPages;

// const lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

function handleSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  query = e.srcElement[0].value;
  console.log(query);

  if (query.trim() === '') {
    return;
  } else {
    fetchImages().then(response => {
      totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
      if (response.data.totalHits > 0) {
        // renderImages(response);
        // loadMoreBtn.style.display = 'block';
        currentPage++;

        return Notify.success(
          `Hooray! We found ${response.data.totalHits} images matching your search.`
        );
      }
      Notify.failure('Sorry, there are no images matching your search.');
    });
  }
}

async function fetchImages() {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${currentPage}`;
  try {
    const response = await axios.get(URL);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

form.addEventListener('submit', handleSubmit);
