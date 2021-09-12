const API_KEY = 'AIzaSyAYXxYUwa_ikKMxjmddSVyxoR75f_uAXhM';
const input = document.querySelector('.book-search-input');

// To create, append each element and add few classes 
function createAndAppend(el, appendTo, ...className) {
  const createEl = document.createElement(el);
  createEl.classList.add(...className);
  appendTo.appendChild(createEl);
  return createEl;
}

// Shows results when you click on the button search
const btnSearch = document.querySelector('.book-search-btn');
btnSearch.addEventListener('click', function () {
  let search = input.value;
  const container = document.querySelector('.container');

  // Search by keyword only in the title. Shows max result - 40 books
  const URL = `https://www.googleapis.com/books/v1/volumes?q=intitle:"${search}":keyes&key=${API_KEY}&maxResults=40`;

  //Creates and removes results
  let result = document.querySelector('.book-search-result', 'card', 'mb-3');
  result.remove();
  result = createAndAppend('div', container, 'book-search-result');
  
  // Remove not found GIF if it exists
  let notFound = document.querySelector('.not-found');
  if (notFound) notFound.remove();

  // SHOW RESULT IF > 3 characters
  const myPromise = new Promise(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        let resultNotFound = createAndAppend('img', container, 'not-found');
        
        // Shows GIF "NO RESULT" IF no result 
        if (!data.items) {
          resultNotFound.src =
            'https://cdn.dribbble.com/users/2382015/screenshots/6065978/no_result.gif';
          return;
        }

        // Returns result
        let books = data.items.map(function (book) {
          if (search.length >= 3) return book.volumeInfo;
        });

        for (let i = 0; i < books.length; i++) {
          // BOOK CARD CONTAINER
          const resultItem = createAndAppend(
            'div',
            result,
            'result-item',
            'row',
            'g-0',
            'mb-3'
          );
          resultItem.style.maxWidth = '640px';

          // IMG
          const imgBlock = createAndAppend(
            'div',
            resultItem,
            'result-img',
            'col-md-4'
          );
          let img = createAndAppend(
            'img',
            imgBlock,
            'result-img',
            'img-fluid',
            'rounded-start'
          );
          if (!books[i].imageLinks) {
            let bookCoverNotFound = createAndAppend(
              'img',
              imgBlock,
              'result-img',
              'img-fluid',
              'rounded-start'
            );
            bookCoverNotFound.src =
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png';
          } else {
            img.src = books[i].imageLinks.smallThumbnail;
          }

          // RIGHT SIDE - TEXT SECTION
          const textBlock = createAndAppend(
            'div',
            resultItem,
            'result-text',
            'col-md-8'
          );
          const textBody = createAndAppend(
            'div',
            textBlock,
            'card-body',
            'd-flex',
            'flex-column',
            'pt-0'
          );

          //   LINK
          let link = createAndAppend(
            'a',
            textBody,
            'result-link',
            'link-dark',
            'text-decoration-none'
          );
          link.href = books[i].previewLink;
          link.innerText = 'books.google.com' + ' > books';
          link.target = '_blank';

          // TITLE
          let title = createAndAppend(
            'a',
            textBody,
            'result-title',
            'card-title',
            'fw-normal',
            'text-decoration-none',
            'fs-5'
          );
          title.innerText = books[i].title;
          title.href = books[i].previewLink;
          title.target = '_blank';

          const authorBlock = createAndAppend(
            'div',
            textBody,
            'result-author-block',
            'd-flex'
          );
          // AUTHOR
          let author = createAndAppend(
            'span',
            authorBlock,
            'result-author',
            'me-2'
          );
          author.innerText = books[i].authors;
          if (!books[i].authors) author.innerText = books[i].publisher;
          if (!books[i].publisher) author.innerText = '';

          // DATE
          let date = createAndAppend('span', authorBlock, 'result-date');
          date.innerText = books[i].publishedDate;
          if (!books[i].publishedDate) {
            date.innerText = '';
          } else {
            date.innerText = books[i].publishedDate.slice(0, -6); //SLICE DATE TO YEAR
          }

          // DESCRIPTION
          let description = createAndAppend(
            'p',
            textBody,
            'result-description',
            'card-text'
          );
          description.innerText = books[i].description;
          description.innerText =
            description.innerText.substring(0, 214) + '...'; //Shows max 217 characters
          if (!books[i].description) description.innerText = '';
        }
      })
      .catch((error) => console.log('in error', error));
  });
});
