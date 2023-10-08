import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.search-form input'),
  loadMore: document.querySelector('.load-more'),
};


const lightbox = new SimpleLightbox('.gallery-container a', {
    captions: true,
    captionsData: 'alt',
  });



let currentPage = 1;
let totalResults = 0;

refs.form.addEventListener('submit', searchFunction);
refs.loadMore.addEventListener('click', loadMoreImages);

async function searchFunction(e) {
  e.preventDefault();
  const searchQuery = refs.input.value;

  

  if (currentPage === 1) {
    refs.gallery.innerHTML = '';
  }

  const params = {
    key: '39901627-719ccf8971235dd54bb900542',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40,
  };


  try {
    const response = await axios.get('https://pixabay.com/api/', { params });
    const images = response.data.hits;

    totalResults = response.data.totalHits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const imageCards = images
        .map(image => {
          return `
        <div class="gallery-container">
            <a href="${image.webformatURL}" >
                <img src="${image.webformatURL}" alt="${image.tags}" />
            </a>
            
            <div>
                <ul>
                    <li> 
                        <h2>Likes</h2>
                        <p>${image.likes}</p>
                    </li>
                    <li> 
                        <h2>Views</h2>
                        <p>${image.views}</p>
                    </li>
                    <li> 
                        <h2>Comments</h2>
                        <p>${image.comments}</p>
                    </li>
                    <li> 
                        <h2>Downloads</h2>
                        <p>${image.downloads}</p>
                    </li>
                </ul>            
            </div> 
        </div>       
        `;
        })
        .join('');

        Notiflix.Notify.success(`Hooray! We found ${totalResults} images.`);

      refs.gallery.insertAdjacentHTML("beforeend", imageCards);

      if (totalResults > currentPage * 40) {
        refs.loadMore.style.display = 'block';
      } else {
        refs.loadMore.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }

       lightbox.refresh();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

async function loadMoreImages() {
  currentPage += 1;
  searchFunction(new Event('submit'));
}
