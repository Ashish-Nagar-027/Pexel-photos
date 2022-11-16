const auth = "563492ad6f917000010000015ade93ff6c6a4fa39561d0715090fe53";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const mode = document.querySelector(".dark-light-mode");
const hertImg = document.querySelectorAll(".fa-heart");
const yourFav = document.querySelector(".your-fav");
const homeTab = document.querySelector(".home-button");
const yourFavoritesNav = document.querySelector(".your-favorite");
let favorite = [];

let FavTab = false;

let searchValue;
let page = 1;
let fetchLink;
let loading;

// Top tab buttons {home and favorites}

yourFavoritesNav.addEventListener("click", (e) => {
  if (e.target.textContent === "Home") {
    FavTab = false;
    if (!FavTab) {
      homeTab.style.backgroundColor = "var(--hover-color)";
      yourFav.style.backgroundColor = "inherit";
      clear();
      curatedPhotos();
      more.style.display = "flex";
    }
  }
  if (e.target.textContent === "Favorites") {
    FavTab = true;
    if (FavTab) {
      yourFav.style.backgroundColor = "var(--hover-color)";
      homeTab.style.backgroundColor = "inherit";
      generatePicturesFromLocal();
    }
  }
});

// logo link
const myLogo = document.querySelector(".logo-img");
myLogo.addEventListener("click", () => {
  window.open("https://ashish-nagar.netlify.app/", "_blank");
});
// logo link
const mainLogo = document.querySelector(".title-logo-text");
mainLogo.addEventListener("click", () => {
  window.open("./", "_self");
});

// light dark mode
mode.addEventListener("click", (e) => {
  if (e.currentTarget.classList.contains("enable-dark-mode")) {
    myLogo.src = "./Logo/png/blue theme.png";
    e.currentTarget.classList.remove("enable-dark-mode");
    document.documentElement.classList.remove("dark-theme");
  } else {
    myLogo.src = "./Logo/png/white-logo.png";
    e.currentTarget.classList.add("enable-dark-mode");
    document.documentElement.classList.add("dark-theme");
  }
});

// Event Listners
searchInput.addEventListener("input", updateInput);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchPhotos(searchValue);
});

// load button
more.addEventListener("click", loadMore);

//
function updateInput(e) {
  searchValue = e.target.value;
}

// fetching data from api
async function fetchApi(url) {
  // fetching  data text ...
  loading = document.createElement("div");
  loading.innerHTML = `
    <br>
    <p class="Warning-text">  
    Fetching data . . .<p>`;

  gallery.appendChild(loading);

  // Handling api
  try {
    const dataFetch = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });
    const data = await dataFetch.json();

    // removing loading text
    gallery.removeChild(loading);
    return data;
  } catch (error) {
    try {
      const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: auth,
        },
      });
      const data = await dataFetch.json();

      // removing loading text
      gallery.removeChild(loading);

      return data;
    } catch (error) {
      gallery.innerHTML = `<p class="Warning-text"> <span class="warning-red">Warning :</span> please refresh this page.<br />.
             <br/><p>`;
    }
  }
}

// generate photos,and data  from api data

function generatePictures(data) {
  // updating favorites
  getFromLocal();
  data.photos.forEach((photo) => {
    // checking favorite
    function addFavoriteClass() {
      if (favorite.length > 0) {
        if (
          favorite.find(
            (photoValues) => photoValues.originalPhoto === photo.src.original
          )
        ) {
          return "fa-heart fa-solid";
        }
        return "fa-heart fa-regular";
      } else {
        return "fa-heart fa-regular";
      }
    }

    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <div class='image-div'>
        <img src="${photo.src.large}" alt="" />
        <i class="${addFavoriteClass()}" onclick="addFav(event,'${
      photo.src.original
    }','${photo.src.large}','${photo.photographer}')" ></i>
        </div>
        `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?page=1&per_page=8";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

// handling search api
async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=8`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  // searchInput.value = ''
}

async function loadMore() {
  page++;
  if (searchValue) {
    fetchLink = `https://api.pexels.com/v1/search?query=${searchValue}&per_page=8&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?page=${page}&per_page=8`;
  }

  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

// ityped library
window.ityped.init(document.querySelector(".search-input"), {
  strings: [
    "Search here . . .",
    " Lamborgini . . .",
    " Dinosaur . . .",
    "babies . . .",
  ],
  loop: true,
  placeholder: true,
  typeSpeed: 150,
  startDelay: 2000,
  showCursor: false,
});

//  save to favorite function
// favorites

let saveToLocal = () => {
  localStorage.setItem("favorite", JSON.stringify(favorite));
};

function getFromLocal() {
  if (localStorage.getItem("favorite") === null) {
    favorite = [];
  } else {
    favorite = JSON.parse(localStorage.getItem("favorite"));
  }
}

const addFav = (event, originalPhoto, largePhoto, photographer) => {
  let photoDetails = {
    originalPhoto,
    largePhoto,
    photographer,
  };

  //
  if (event.target.classList.contains("fa-regular")) {
    event.target.classList.replace("fa-regular", "fa-solid");
    if (
      !favorite.find(
        (photoValues) => photoValues.originalPhoto === originalPhoto
      )
    ) {
      favorite.push(photoDetails);
      saveToLocal();
    }
  } else {
    event.target.classList.replace("fa-solid", "fa-regular");
    let indexItem = favorite.findIndex(
      (photoValues) => photoValues.originalPhoto === originalPhoto
    );
    favorite.splice(indexItem, 1);
    saveToLocal();
  }
};

function generatePicturesFromLocal() {
  clear();
  more.style.display = "none";

  // updating favorites
  getFromLocal();
  if (favorite.length > 0) {
    favorite.forEach((photo) => {
      const galleryImg = document.createElement("div");
      galleryImg.classList.add("gallery-img");
      galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.originalPhoto}>Download</a>
        </div>
        <div class='image-div'>
        <img src="${photo.largePhoto}" alt="" />
        <i class="fa-heart fa-solid" onclick="addFav(event,'${photo.originalPhoto}','${photo.largePhoto}','${photo.photographer}')" ></i>
        </div>
        `;
      gallery.appendChild(galleryImg);
    });
  } else {
    gallery.innerHTML = `<p class="Warning-text"> <span class="warning-red">Empty :</span> you haven't added any favorite 😁.
    <br> please go to gallary and like photos to see here. <br> Thank you 😎  `;
  }
}


// image hover effect
