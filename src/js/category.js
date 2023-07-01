import {
  fetchCategoryList,
  fetchTopBooks,
  fetchCertainCategory,
} from './api_request';
import { loader, showLoader, hideLoader } from './loader';
import Notiflix from 'notiflix';

const categoryEl = document.querySelector('.category-list');
const booksCategoryEl = document.querySelector('.books-category');
const h1El = document.querySelector('.title-category');

allCategorys();

async function allCategorys() {
  showLoader();

  try {
    const topBooks = await fetchTopBooks();
    topBooks.forEach(books => renderTopBooks(books));
  } catch (error) {
    console.error(error);
  }

  hideLoader();
}

addCategorys();

async function addCategorys() {
  showLoader();

  try {
    const categorys = await fetchCategoryList();
    renderCategorys(categorys);
  } catch (error) {
    console.error(error);
  }

  hideLoader();
}

function renderCategorys(arr) {
  const markup = arr
    .map(({ list_name }) => {
      return `
      <li>
        <a href="#" class="category-link">${list_name}</a>
      </li>
      `;
    })
    .join('');
  categoryEl.insertAdjacentHTML('beforeend', markup);
}

categoryEl.addEventListener('click', onSelectCategory);

function onSelectCategory(evt) {
  let category = evt.target.textContent;
  if (category === 'All categories') {
    allCategorys();
  }

  h1El.innerHTML = category;
  showLoader();

  fetchCertainCategory(category)
    .then(books => {
      renderBooks(books);
      hideLoader();
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure('Something went wrong. Please try again');
      hideLoader();
    });
}

function renderBooks(arr) {
  const markup = arr
    .map(({ book_image, author, title }) => {
      return `
      <div class="book-carts"> 
        <img src="${book_image}" alt="${title}" class="book-img" loading="lazy" width=335>
        <div class="book-description"> 
          <p class="book-title">${title}</p>
          <p class="book-author">${author}</p>
        </div>
      </div>
      `;
    })
    .join('');
  booksCategoryEl.innerHTML = markup;
}

function renderTopBooks(arr) {
  const markup = arr
    .map(({ book_image, title, author, list_name }) => {
      return `
      <div class="book-carts"> 
        <p class="category-section">${list_name}</p>
        <img src="${book_image}" alt="${title}" class="book-img" loading="lazy" width=335>
        <div class="book-description"> 
          <p class="book-title">${title}</p>
          <p class="book-author">${author}</p>
        </div>
      </div>
      <div class="test">
        <button class="btn-more">see more</button>
      </div>
      `;
    })
    .join('');
  booksCategoryEl.innerHTML = markup;
}
