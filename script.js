let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];

// Add Book
document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();

    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        category: category,
        issued: false
    };

    books.push(newBook);

    saveBooks();
    displayBooks();

    document.getElementById("bookForm").reset();
});

// Save books
function saveBooks() {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
}

// Display books
function displayBooks(searchTerm = "") {

    const bookList = document.getElementById("bookList");

    bookList.innerHTML = "";

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredBooks.length === 0) {
        bookList.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No books found
                </td>
            </tr>
        `;
        updateDashboard();
        return;
    }

    filteredBooks.forEach((book, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.category}</td>

            <td>
                ${
                    book.issued
                    ? '<span class="issued">Issued</span>'
                    : '<span class="available">Available</span>'
                }
            </td>

            <td>

                ${
                    book.issued
                    ? `<button class="return-btn"
                        onclick="returnBook(${book.id})">
                        Return
                       </button>`
                    : `<button class="issue-btn"
                        onclick="issueBook(${book.id})">
                        Issue
                       </button>`
                }

                <button
                    class="delete-btn"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>

            </td>
        `;

        bookList.appendChild(row);
    });

    updateDashboard();
}

// Issue book
function issueBook(id) {

    const book = books.find(book => book.id === id);

    if (book) {
        book.issued = true;
    }

    saveBooks();
    displayBooks(
        document.getElementById("searchInput").value
    );
}

// Return book
function returnBook(id) {

    const book = books.find(book => book.id === id);

    if (book) {
        book.issued = false;
    }

    saveBooks();
    displayBooks(
        document.getElementById("searchInput").value
    );
}

// Delete book
function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    books = books.filter(book => book.id !== id);

    saveBooks();
    displayBooks(
        document.getElementById("searchInput").value
    );
}

// Search
document.getElementById("searchInput").addEventListener("input", function () {

    const searchTerm = this.value;

    displayBooks(searchTerm);
});

// Dashboard
function updateDashboard() {

    const total = books.length;

    const issued = books.filter(book => book.issued).length;

    const available = total - issued;

    document.getElementById("totalBooks").textContent = total;

    document.getElementById("availableBooks").textContent = available;

    document.getElementById("issuedBooks").textContent = issued;
}

// Initial display
displayBooks();