const auth = "563492ad6f917000010000015ade93ff6c6a4fa39561d0715090fe53";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const mode = document.querySelector(".dark-light-mode");
const hertImg = document.querySelectorAll(".fa-heart");
const yourFav = document.querySelector(".your-fav");
const homeTab = document.querySelector(".home-button");
const favoritesNum = document.querySelector(".fav-num");
const yourFavoritesNav = document.querySelector(".your-favorite");
const favoriteWarning = document.querySelector(".fav-add-removed-warning");
const imgModal = document.querySelector(".img-details-modal");
const imgDiv = document.querySelector(".image-div");
const downloadBtn = document.querySelector(".download-btn");
const imageInModal = document.querySelector(".img-modal-bottom");
const photographerNameInModel = document.querySelector(".photographer-name");

const prevImageBtn = document.getElementById('prev-btn')
const nextImageBtn = document.getElementById('next-btn')


let favorite = [];

let FavTab = false;

let searchValue;
let page = 1;
let fetchLink;
let loading;
let imagesData
let currentImageIndex
let allImagesArray = []


//================================
//       image modal
//================================

// add image in modal
function addModalImage() {
  
   // checking favorite
   function addFavoriteClass() {
    if (favorite.length > 0) {
      if (
        favorite.find(
          (photoValues) => photoValues.originalPhoto === imagesData[currentImageIndex].src.original
        )
      ) {
        return "fa-heart fa-solid model-fav-icon";
      }
      return "fa-heart fa-regular model-fav-icon";
    } else {
      return "fa-heart fa-regular model-fav-icon";
    }
  }
 
  

  // imageInModal.innerHTML = `<img src=${FavTab ? imagesData[currentImageIndex].largePhoto :imagesData[currentImageIndex].src.large }>`
  // photographerNameInModel.innerHTML = `<p>Photographer : ${imagesData[currentImageIndex].photographer}</p>`

  imageInModal.innerHTML = `<img src=${FavTab ? allImagesArray[currentImageIndex].largePhoto :allImagesArray[currentImageIndex].src.large }>`
  photographerNameInModel.innerHTML = `<p>Photographer : ${allImagesArray[currentImageIndex].photographer}</p>`

}

// show modal
const imageModalHandler = (index)=> {

  currentImageIndex = index
  imgModal.classList.toggle('open-modal')
  addModalImage()
}

// close modal
imgModal.addEventListener('click', (e) => {
  if(e.target.classList.contains('img-details-modal') || e.target.classList.contains('fa-circle-xmark') ){
    imgModal.classList.remove('open-modal')
  }
})

// modal next button
nextImageBtn.addEventListener('click', ()=> {
  if(currentImageIndex < allImagesArray.length-1) {
    currentImageIndex++;
   addModalImage()
  }
})

// modal previous
prevImageBtn.addEventListener('click', ()=> {
  if(currentImageIndex > 0) {
    currentImageIndex--;
    addModalImage()
  }
})

// modal img download button
downloadBtn.addEventListener('click', ()=> {
  FavTab ?  window.open(imagesData[currentImageIndex].originalPhoto) :
  window.open(imagesData[currentImageIndex].src.original)
})

//==========================================
//   Top tab buttons {home and favorites}
//==========================================

yourFavoritesNav.addEventListener("click", (e) => {
  if (e.target.textContent === "Home") {
    FavTab = false;
    if (!FavTab) {
      homeTab.style.backgroundColor = "var(--hover-color)";
      yourFav.style.backgroundColor = "inherit";
      clear();
      curatedPhotos();
      more.style.display = "flex";
      if(searchInput.value !== '') searchInput.value = ""
    }
  }
  if (e.target.textContent === `Favorites  ( ${favorite.length} )`) {
    FavTab = true;
    if (FavTab) {
      yourFav.style.backgroundColor = "var(--hover-color)";
      homeTab.style.backgroundColor = "inherit";
      generatePicturesFromLocal();
    }
  }
});

//==========================================
//             logo link
//==========================================
const myLogo = document.querySelector(".logo-img");
myLogo.addEventListener("click", () => {
  window.open("https://ashish-nagar.netlify.app/", "_blank");
});

// logo link
const mainLogo = document.querySelector(".title-logo-text");
mainLogo.addEventListener("click", () => {
  window.open("./", "_self");
});


//==========================================
//           light dark mode
//==========================================
      
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
//==========================================
//         search image
//==========================================
searchInput.addEventListener("input", updateInput);

function updateInput(e) {
  searchValue = e.target.value;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchPhotos(searchValue);
});

// handling search api
async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=8`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}





//==========================================
//         fetching data from api
//==========================================
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


//==========================================
//  generate photos,and data  from api data
//==========================================
let photoNum 
function generatePictures(data) {
  
   allImagesArray = [...allImagesArray, ...data.photos]
  // allImagesArray.push(...data.photos)

  // updating favorites
  getFromLocal();
  getFavNumber()
  imagesData = data?.photos
  photoNum = photoNum === undefined ? 0 : photoNum+8 
  data.photos.map((photo,index) => {
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

    /// handle if photographer has big name
    let photographer = function handleName(){
      if(photo.photographer.length > 16) {
       return photo.photographer.slice(0,16) + '...'
      }
      return photo.photographer
    }


    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        <div class="gallery-info">
        <p class="photographer-title">${photographer()}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <div class='image-div'>
        <img src="${photo.src.large}" alt="" onClick="imageModalHandler('${index+photoNum}')" />
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



function clear() {
  gallery.innerHTML = "";
}

//==========================================
//         load more images
//==========================================
// load button
more.addEventListener("click", loadMore);

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


//==========================================
//            ityped library
//==========================================
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
  getFavNumber()
};

function getFromLocal() {
  if (localStorage.getItem("favorite") === null) {
    favorite = [];
  } else {
    favorite = JSON.parse(localStorage.getItem("favorite"));
  }
  getFavNumber()
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
    
    showFavWarning('Added !')
  //  checking if already availabe
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
    favorite[indexItem].inFav = false
   
    showFavWarning('Removed !')
    favorite.splice(indexItem, 1);
    
    saveToLocal();
    if(FavTab){
      generatePicturesFromLocal()
    }
  }
};

function generatePicturesFromLocal() {
  clear();
  more.style.display = "none";
  
  // updating favorites
  getFromLocal();
  getFavNumber()
  imagesData = favorite
  if (favorite.length > 0) {
    favorite.map((photo,index) => {
      const galleryImg = document.createElement("div");
      galleryImg.classList.add("gallery-img");
      galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.originalPhoto}>Download</a>
        </div>
        <div class='image-div'>
        <img src="${photo.largePhoto}" alt="" onClick="imageModalHandler('${index}')" />
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

function getFavNumber() {
  favoritesNum.innerHTML = `<p>( ${favorite.length} )</P>`
}

// showing warning 
function showFavWarning(addedOrRemoved) {
  favoriteWarning.style.display = 'flex'
  favoriteWarning.textContent = addedOrRemoved;
  setTimeout(() => {
    favoriteWarning.style.display = 'none'
  }, 1500);
}

