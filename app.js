'use strict'

const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const INFO_URL = 'https://api.artic.edu/api/v1/artworks?fields=id,title,artist_title,date_display,classification_titles,image_id,style_title,place_of_origin'
const CONTENT_URL = 'https://api.artic.edu/api/v1/artworks/@id?fields=title,artist_title,date_display,classification_titles,image_id,style_title,place_of_origin,artist_display,medium_display'
const IMAGE_URL = 'https://api.artic.edu/api/v1/artworks/21678?fields=id,title,image_id'

function getData(url) {
  ajax.open('GET', url, false)
  ajax.send()
  return JSON.parse(ajax.response)
}

const artInfo = getData(INFO_URL)

function artList() {
  const artList = []

  let template = `
    <ul>
    {{__artList__}}
    </ul>
  `

  for (let i = 0; i < artInfo.data.length ; i++) {
    const posClass = ['painting', 'print', 'prints and drawing']
    if (
      posClass.some(el => artInfo.data[i].classification_titles.includes(el))
      ) {
      artList.push(`
        <li>
          <a href="#/description/${artInfo.data[i].id}">
          <img src="https://www.artic.edu/iiif/2/${artInfo.data[i].image_id}/full/300,/0/default.jpg" alt="">
          <h2>${artInfo.data[i].artist_title}</h2>
          <h3>${artInfo.data[i].title}</h3>
          </a>
        </li>
      `)
    }
  }

  template = template.replace('{{__artList__}}', artList.join(''))
  container.innerHTML = template
}


function artDescription() {
  const id = location.hash.substr(14)
  const artContent = getData((CONTENT_URL.replace('@id', id)))

  let template = `
    <img src="https://www.artic.edu/iiif/2/${artContent.data.image_id}/full/300,/0/default.jpg" alt="">
    <h2>${artContent.data.artist_title} </h2>
    <p>${artContent.data.artist_display.toString().split('\n')[1]}</p>
    <h3>${artContent.data.title}</h3><span>${artContent.data.date_display}</span>
    <p>
    ${artContent.data.style_title}
    ${artContent.data.medium_display}
    </p>
  `

  container.innerHTML = template.replace('null', '')
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

window.onhashchange = router
router()
