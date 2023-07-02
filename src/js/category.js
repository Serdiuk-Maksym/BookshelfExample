import {
  fetchCategoryList,
  fetchTopBooks,
  fetchCertainCategory,
} from './api_request';
import Notiflix from 'notiflix';
import { showLoader, hideLoader } from './loader';

const categoryEl = document.querySelector('.category-list');
const booksCategoryEl = document.querySelector('.books-category');
const h1El = document.querySelector('.title-category');

allCategories();

async function allCategories() {
  showLoader();

  await fetchTopBooks().then(topBooks => {
    topBooks.map(books => renderTopBooks(books));
  });

  hideLoader();
}

addCategories();

async function addCategories() {
  showLoader();

  await fetchCategoryList().then(categories => renderCategories(categories));

  hideLoader();
}

function renderCategories(arr) {
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
    allCategories();
  }

  let AllTitle = category.split(' ');
  let lastWord = AllTitle.pop();
  h1El.innerHTML = ` <h1 class="title-category"> ${AllTitle.join(
    ' '
  )} <span class="title-secondary">${lastWord}</span></h1>`;

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
    .map(({ _id, book_image, author, title }) => {
      return `
      <a href="#" class="book-card" id="${_id}">
      <div class="book-carts"> 
        <img src="${book_image}" alt="${title}" class="book-img" loading="lazy" width=335>
        <div class="book-description"> 
          <p class="book-title">${title}</p>
          <p class="book-author">${author}</p>
        </div>
      </div>
      </a>
      
      `;
    })
    .join('');
  booksCategoryEl.innerHTML = markup;
}

function renderTopBooks(arr) {
  const markupBook = arr.map(
    ({ _id, book_image, title, author, list_name }) => {
      return `
     <div class="best-sellers-wraper">
    <ul class="best-sellers-all-category-list">
        <li class="best-sellers-own-category-list">
            <p class="best-sellers-title">${list_name}</p>
            <ul class="best-sellers-own-category-books">
                <li class="best-sellers-book">
                    <a href="#" id="${_id}"> <img src="${book_image}" alt="${title}" class="book-img">
                        <div class="book-title"> 
                        <p>${title}</p>
                        <p class="book-author">${author}</p>
                        </div></a>
                </li>
            </ul>
        </li>
    </ul>
</div>
       
      `;
    }
  );

  const markupBtn = `<button class="see-more">see more</button>`;
  const screenWidth = window.screen.width;
  const markupMobile = markupBook.slice(0, 1).join('');
  const markupLaptop = markupBook.slice(0, 3).join('');
  const markupDesktop = markupBook.slice(0, 5).join('');

  let markup = '';
  if (screenWidth < 767) {
    markup = `<ul class="category-item-list">${markupMobile}  ${markupBtn}</ul>`;
  } else if (screenWidth < 1440 && screenWidth >= 768) {
    markup = `<ul class="category-item-list">${markupLaptop}  ${markupBtn}</ul>`;
  } else {
    markup = `<ul class="category-item-list">${markupDesktop}  ${markupBtn}</ul>`;
  }
  booksCategoryEl.insertAdjacentHTML('beforeend', markup);
}
