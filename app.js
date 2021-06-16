'use strict'

const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const INFO_URL = 'https://api.artic.edu/api/v1/artworks?fields=id,title,artist_title,date_display,classification_titles,image_id,style_title,place_of_origin'
const CONTENT_URL = 'https://api.artic.edu/api/v1/artworks/@id?fields=title,artist_title,date_display,classification_titles,image_id,style_title,place_of_origin,artist_display,medium_display'
const IMAGE_URL = 'https://api.artic.edu/api/v1/artworks/21678?fields=id,title,image_id'
const DESCRIPTION_URL = 'https://api.artic.edu/api/v1/artworks/@id/manifest.json'


function getData(url) {
  ajax.open('GET', url, false)
  ajax.send()
  return JSON.parse(ajax.response)
}
const artInfo = getData(INFO_URL)


function artList() {
  const artList = []
  let template = `
  <nav class="navbar navbar-expand-lg bg-white">
  <div class="container justify-content-center p-4">
  <a class="display-4 text-decoration-none text-dark" href="#" style="font-family: 'Viaoda Libre', cursive;">Art Now.</a>
  </div>
  </nav>
  
  <!--swiper-->
  <div class="swiper-container mySwiper" 
  style="width:100%; height:100%; position:absolute; top:46%; left:50%; transform:translate(-50%, -50%)">
    <div class="swiper-wrapper" style="display: flex; align-items:center; padding: 5% 0">
  
  {{__artList__}}
  
    </div>
    <div class="swiper-pagination" style="position: fixed; bottom: 0px;"></div>
  </div>
  `
  
  for (let i = 0; i < artInfo.data.length; i++) {
    const posClass = ['painting', 'print', 'prints and drawing']
    if (
      posClass.some(el => artInfo.data[i].classification_titles.includes(el))
      ) {
        artList.push(`
      <div class="swiper-slide" 
      style="
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;">
      <a href="#/artwork/${artInfo.data[i].id}">
        <img src="https://www.artic.edu/iiif/2/${artInfo.data[i].image_id}/full/300,/0/default.jpg" alt="" 
        style="display: block; width: 100%; height: 100%; object-fit: cover; filter: drop-shadow(6px 6px 10px rgba(0, 0, 0, 0.3)"/>
      </div>
      </a>
      `)
    }
  }

  template = template.replace('{{__artList__}}', artList.join(''))
  container.innerHTML = template
}


function artDescription() {
  const id = location.hash.substr(10)
  const artContent = getData((CONTENT_URL.replace('@id', id)))
  const artDescription = getData(DESCRIPTION_URL.replace('@id', id))
  console.log(artDescription.description[0].value)
  let template = `
    <nav class="navbar navbar-expand-lg bg-white">
    <div class="container justify-content-center p-4">
    <a class="display-4 text-decoration-none text-dark" 
      href="#" style="font-family: 'Viaoda Libre', cursive;">
        Art Now.
      </a>
    </div>
    </nav>

    <div style="display:flex; width:100%; height:100%;">
      <div style="display:flex; align-items:center; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); margin:20px 0;">
        <img src="https://www.artic.edu/iiif/2/${artContent.data.image_id}/full/400,/0/default.jpg" alt=""
        style="margin-right:200px; max-height:460px; height:auto; filter: drop-shadow(6px 6px 10px rgba(0, 0, 0, 0.2)" >
        <div style="width:300px;">
          <h2 style="font-family: 'Viaoda Libre', cursive;"><strong>${artContent.data.artist_title} </strong></h2>
          <p><small>${artContent.data.artist_display.toString().split('\n')[1]}</small></p>
          <br>
          <h5><em>${artContent.data.title}</em></h5>
          <p><small>${artContent.data.date_display}</br>
          ${artContent.data.medium_display}</small></p>
        </div>
      </div>  
      <div style="width:58%; position:absolute; top:100%; left:50%; transform:translate(-50%, -50%); padding-bottom:30px">
      <p><small>${artDescription.description[0].value}</small></p>
      </div>
    </div>
    `

  container.innerHTML = template
}


//----------router
function router() {
  const routerPath = location.hash

  if (routerPath === '') {
    artList()
    
  } else {
    artDescription()
  }
}

window.addEventListener('hashchange', router)
router()

window.onpopstate = function(event) {
  window.location.reload()
}

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 30,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay:{
    delay:5000
  },
  loop: true
});