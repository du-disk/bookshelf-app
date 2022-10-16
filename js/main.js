/**
 * @author Dudi Iskandar
 * JS FE Web Pemula | Dicoding Submission
 */
let bookItems = []
let filteredBookItems = null;
const formBook = document.querySelector('#form-book');
const btnSearch = document.querySelector('#btn-search');
const btnAddNew = document.querySelector('#btn-add-new');
const btnDiscard = document.querySelector('#btn-discard');
const formWrapper = document.querySelector('#form-wrapper');
// Form
const inputBookId = document.querySelector('#book-id');
const inputYear = document.querySelector('#input-book-year');
const inputTitle = document.querySelector('#input-book-title');
const inputAuthor = document.querySelector('#input-book-author');
const inputIsComplete = document.querySelector('#input-book-isComplete');

window.addEventListener('load', () => {
    const serializedData = localStorage.getItem('book-items');
    const data = JSON.parse(serializedData) || [];
    bookItems = data;

    render();
})

btnAddNew.addEventListener('click', () => {
    formWrapper.classList.remove('hide');
})

btnDiscard.addEventListener('click', () => {
    formWrapper.classList.add('hide');
})

btnSearch.addEventListener('click', () => {
    const inputSearch = document.querySelector('#search-query');
    const searchQuery = inputSearch.value.toLowerCase();

    if (searchQuery) {
        const filtered = bookItems.filter((bookItem) => {
            return bookItem.title.toLowerCase().includes(searchQuery);
        });

        filteredBookItems = filtered;
    } else {
        filteredBookItems = null
    }
    render();
})

formBook.addEventListener('submit', () => {
    const id = +inputBookId.value;
    const bookTitle = inputTitle.value;
    const bookAuthor = inputAuthor.value;
    const bookYear = inputYear.value;
    const bookIsComplete = inputIsComplete.checked;

    const bookItem = {
        id: id || +new Date(),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: bookIsComplete
    }
    if (id) {
        const bookIndex = bookItems.findIndex(book => book.id === id);
        bookItems[bookIndex] = bookItem;

        formWrapper.classList.add('hide');
    } else {
        bookItems.push(bookItem);
    }
    inputBookId.value = '';
    inputTitle.value = '';
    inputAuthor.value = '';
    inputYear.value = '';
    inputIsComplete.checked = false;
    
    saveDateToStorage();
    render();
});

function removeBook(id) {
    if (confirm("Are you sure to delete this book?")) {
        const bookIndex = bookItems.findIndex(book => book.id === id);
        bookItems.splice(bookIndex, 1);

        saveDateToStorage();
        render();
    } else {
        return false;
    }
}

function updateBook(id) {
    const bookIndex = bookItems.findIndex(book => book.id === id);
    const book = bookItems[bookIndex];

    inputBookId.value = book.id;
    inputTitle.value = book.title;
    inputAuthor.value = book.author;
    inputYear.value = book.year;
    inputIsComplete.checked = book.isComplete;

    formWrapper.classList.remove('hide');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function moveBook(id) {
    const bookIndex = bookItems.findIndex(book => book.id === id);
    bookItems[bookIndex].isComplete = !bookItems[bookIndex].isComplete;

    saveDateToStorage();
    render();
}

function saveDateToStorage() {
    const serializedData = JSON.stringify(bookItems);
    localStorage.setItem('book-items', serializedData);
}

function clearBooksElement() {
    const booksElement = document.getElementsByTagName('article');
    while (booksElement.length > 0) {
        booksElement[0].parentNode.removeChild(booksElement[0]);
    }
}

function checkEmptyList(items, bookListCompletedElement, bookListNotCompletedElement) {
    const completed404 = bookListCompletedElement.querySelector('.card-404');
    const notCompleted404 = bookListNotCompletedElement.querySelector('.card-404');

    const isAvailableCompleted = items.some(book => book.isComplete);
    const isAvailableNotCompleted = items.some(book => !book.isComplete);

    if (!isAvailableCompleted) {
        completed404.classList.remove('hide')
    } else {
        completed404.classList.add('hide')
    }

    if (!isAvailableNotCompleted) {
        notCompleted404.classList.remove('hide')
    } else {
        notCompleted404.classList.add('hide')
    }
}

function render() {
    clearBooksElement();
    const items = (filteredBookItems || bookItems);
    const bookListCompletedElement = document.querySelector('#is-completed');
    const bookListNotCompletedElement = document.querySelector('#is-not-completed');

    checkEmptyList(items, bookListCompletedElement, bookListNotCompletedElement);

    items.forEach((book) => {
        const bookElement = document.createElement('article');
        bookElement.classList.add('card');
        bookElement.id = book.id;
        bookElement.innerHTML = `
            <div>
                <h3>${book.title}</h3>
                <small>Author: ${book.author} | Year: ${book.year}</small>
            </div>
            <div>
                <button class="btn btn-edit" onclick="updateBook(${book.id})">Edit</button>
                <button class="btn btn-delete" onclick="removeBook(${book.id})">Delete</button>
                <button class="btn btn-move" onclick="moveBook(${book.id})">Set to ${book.isComplete ? '' : 'Not'} Finished</button>
            </div>
        `;

        if (book.isComplete) {
            bookListCompletedElement.append(bookElement);
        } else {
            bookListNotCompletedElement.append(bookElement);
        }
    });
}
