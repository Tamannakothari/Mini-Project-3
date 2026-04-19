const booksContainer = document.getElementById("books");
const favoritesContainer = document.getElementById("favorites");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const noResults = document.getElementById("noResults");

// SEARCH BOOKS
async function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();

  // clear previous results
  booksContainer.innerHTML = "";
  noResults.classList.add("hidden");
  error.classList.add("hidden");

  if (!query) return;

  loading.classList.remove("hidden");

  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    const data = await res.json();

    loading.classList.add("hidden");

    if (!data.docs || data.docs.length === 0) {
      noResults.classList.remove("hidden");
      return;
    }

    const books = data.docs.slice(0, 12);

    books.forEach(book => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/150x220?text=No+Cover";

      card.innerHTML = `
        <img src="${cover}" alt="Book cover"/>
        <h3>${book.title}</h3>
        <p>${book.author_name ? book.author_name[0] : "Unknown Author"}</p>
        <button onclick='saveFavorite(${JSON.stringify(book)})'>⭐ Save</button>
      `;

      booksContainer.appendChild(card);
    });

  } catch (err) {
    loading.classList.add("hidden");
    error.classList.remove("hidden");
  }
}

// SAVE FAVORITE
function saveFavorite(book) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // avoid duplicates
  const exists = favorites.some(fav => fav.key === book.key);
  if (exists) return;

  favorites.push(book);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  displayFavorites();
}

// DISPLAY FAVORITES
function displayFavorites() {
  favoritesContainer.innerHTML = "";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/150x220?text=No+Cover";

    card.innerHTML = `
      <img src="${cover}" />
      <h3>${book.title}</h3>
      <button onclick='removeFavorite("${book.key}")'>❌ Remove</button>
    `;

    favoritesContainer.appendChild(card);
  });
}

// REMOVE FAVORITE
function removeFavorite(key) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter(book => book.key !== key);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  displayFavorites();
}

// YOUR PERSONAL BOOK LIST
const myBooks = [
  { title: "Zero to One", author: "Peter Thiel" },
  { title: "Rainmaking 101", author: "Precious Williams" },
  { title: "I Have Anxiety So What", author: "Wes Woodson" },
  { title: "Ikigai", author: "Hector Garcia & Francesc Miralles" },
  { title: "The Diary of a CEO", author: "Steven Bartlett" },
  { title: "Morning Routine Makeover", author: "Zoe McKey" },
  { title: "The Defining Decade", author: "Meg Jay" },
  { title: "The IDEATE Method", author: "Unknown" },
  { title: "The Year in Tech 2025", author: "Harvard Business Review" },
  { title: "9 Things Successful People Do Differently", author: "Heidi Grant Halvorson" },
  { title: "Plato’s Symposium", author: "Plato" },
  { title: "The Monk and The Riddle", author: "Randy Komisar" },
  { title: "Steal Like an Artist", author: "Austin Kleon" },
  { title: "How to Focus", author: "Thich Nhat Hanh" },
  { title: "Show Your Work", author: "Austin Kleon" },
  { title: "Do Epic Shit", author: "Ankur Warikoo" },
  { title: "The Psychology of Money", author: "Morgan Housel" },
  { title: "Keep Going", author: "Austin Kleon" },
  { title: "The Surest Way to Become Rich", author: "Parneet Sachdev" }
];

// DISPLAY YOUR BOOKS
function displayMyBooks() {
  const container = document.getElementById("myBooks");
  container.innerHTML = "";

  myBooks.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;

    container.appendChild(card);
  });
}

// LOAD ON PAGE START
displayFavorites();
displayMyBooks();