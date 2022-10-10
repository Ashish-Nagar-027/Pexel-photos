const auth = "563492ad6f917000010000015ade93ff6c6a4fa39561d0715090fe53"
const gallery = document.querySelector('.gallery')
const searchInput = document.querySelector('.search-input')
const form = document.querySelector('.search-form')
const more = document.querySelector('.more') 
const mode = document.querySelector('.dark-light-mode') 
let searchValue;
let page = 1;
let fetchLink;
let loading;

  // logo link
  const myLogo = document.querySelector('.logo-img')
  myLogo.addEventListener('click',()=> {
      window.open("https://ashish-nagar.netlify.app/", '_blank');
  })

// light dark mode
mode.addEventListener('click', (e)=> {

    if (e.currentTarget.classList.contains('enable-dark-mode')) {
        myLogo.src = './Logo/png/blue theme.png'
        e.currentTarget.classList.remove('enable-dark-mode')
        document.documentElement.classList.remove('dark-theme')
    }
    else {
        myLogo.src = './Logo/png/white-logo.png'
        e.currentTarget.classList.add('enable-dark-mode')
        document.documentElement.classList.add('dark-theme')
    }
})


// Event Listners
searchInput.addEventListener('input', updateInput);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchPhotos(searchValue);
})

more.addEventListener('click', loadMore)


function updateInput(e) {
    searchValue = e.target.value
}

async function fetchApi(url) {
    loading = document.createElement('div')
    loading.innerHTML = `<p class="Warning-text">  
    Fetching data . . .<p>`

    gallery.appendChild(loading)

    try {
        const dataFetch = await fetch(url, {
            method: 'GET' ,
            headers : {
                Accept : 'application/json',
                Authorization : auth
            }
           });
           const data = await dataFetch.json();
           return data;
    } catch (error) {
        try {
            const dataFetch = await fetch(url, {
                method: 'GET' ,
                headers : {
                    Accept : 'application/json',
                    Authorization : auth
                }
               });
               const data = await dataFetch.json();
               return data;
        } catch (error) {
            gallery.innerHTML = `<p class="Warning-text"> <span class="warning-red">Warning :</span> Looks like Api Requests have reached to end for this hour .Try after  few hours.
             <br/><p>`
        }
    }
  
}

function generatePictures(data){

    gallery.removeChild(loading)

    data.photos.forEach(photo => {
        const  galleryImg = document.createElement("div")
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <img src="${photo.src.large}" alt="" />
        `
        gallery.appendChild(galleryImg);
    })

}

async function curatedPhotos() {
   fetchLink = "https://api.pexels.com/v1/curated?page=1&per_page=8"
   const data = await fetchApi(fetchLink);
   generatePictures(data)
    
}

async function searchPhotos(query){
     clear() 
     fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=8`
      const data = await fetchApi(fetchLink)
     generatePictures(data)
}

function clear() {
    gallery.innerHTML = '';
    // searchInput.value = ''
}


async function loadMore() {
    page++;
    if(searchValue) { 
        fetchLink = `https://api.pexels.com/v1/search?query=${searchValue}&per_page=8&page=${page}`
    }else {
        fetchLink = `https://api.pexels.com/v1/curated?page=${page}&per_page=8`
    }

    const data = await fetchApi(fetchLink)
     generatePictures(data)
}

curatedPhotos();


// ityped library
window.ityped.init(document.querySelector('.search-input') ,{
    strings: ['Search here . . .', 'eg cars . . .', 'eg Dogs . . .' ],
    loop: true,
    placeholder: true,
    typeSpeed:  150,
    startDelay: 2000,
    showCursor: false,
})