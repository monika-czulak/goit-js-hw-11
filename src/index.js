import { Notify } from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

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

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

function handleSubmit(e) {
  loadMoreBtn.classList.add('hidden');
  e.preventDefault();
  gallery.innerHTML = '';
  query = e.srcElement[0].value;
  console.log(query);

  if (query.trim() === '') {
    return;
  } else {
    fetchImages()
      .then(response => {
        if (response.data.totalHits > 0) {
          totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
          const data = response.data.hits;
          data.forEach(image => renderImages(image));
          lightbox.refresh();
          console.log(response);
          return Notify.success(
            `Hooray! We found ${response.data.totalHits} images matching your search.`
          );
        }
        Notify.failure('Sorry, there are no images matching your search.');
      })
      .then(() => loadMoreBtn.classList.remove('hidden'))
      .then(() => (currentPage = 1));
  }
}

function handleLoadMore() {
  fetchImages()
    .then(response => {
      totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
      const data = response.data.hits;
      data.forEach(image => renderImages(image));

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => console.log(error));

  currentPage++;

  if (currentPage > totalPages) {
    loadMoreBtn.classList.add('hidden');
    return Notify.info("You've reached the end of search results.");
  }
  console.log('currPage', currentPage, 'totalPages', totalPages);
}

async function fetchImages() {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${currentPage}`;
  try {
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

function renderImages(image) {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
            <a href="${image.largeImageURL}">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>`
  );
}
