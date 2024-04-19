import { nanoid } from 'nanoid'

const productList = document.querySelector('.products-list') // контейнер для отрисовки товаров
const form = document.querySelector('form') // получение формы
const openModal = document.querySelector('#open-basket') // получение значка корзины товаров
const cardLenth = document.querySelector('.basket-count__info') //плашка с количеством товара в корзине
// получение элементов сайтбара
const saivBarStart = document.querySelector('.offcanvas-end')
const saivBarBackdrop = document.querySelector('.offcanvas-backdrop')
const clousSidebar = document.querySelector('.btn-close')
const saivBarBody = document.querySelector('.offcanvas-body')

init()

// инициализация функций при загрузке страницы
function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON()
  })
}

// Функция подгрузки данных из db.json
async function loadJSON() {
  try {
    const response = await fetch('http://localhost:3000/products')
    const data = await response.json()

    let html = ''

    if (data && Array.isArray(data)) {
      data.forEach((product) => {
        html += `
          <div class="main-card" data-id="">
              <div class="card-image">
                <img src="${product?.imgSrc}" alt="image">

                <div class="card-wishlist">
                  <div class="wishlist-rating">

                    <div class="rating-img">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z"
                          fill="#FFCE31" />
                      </svg>
                    </div>

                    <span class="rating-amount">${product?.rating}</span>
                  </div>

                  <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                    </path>
                  </svg>
                </div>
              </div>

              <h3 class="card-name">${product?.name}</h3>

              <p class="card-category">${product?.category}</p>

              <p class="card-price">${product?.price}</p>

              <button class="btn btn-primary">Add to cart</button>
            </div>
        `
        // здесь добавил предворительно для просмотра итога
      })
    }
    productList.insertAdjacentHTML('beforeend', html)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
  basketСard()
}

// Отправка данных при создании нового товара
form.addEventListener('submit', (event) => {
  event.preventDefault() // предотвр. отправку данных

  // целевой элемент, на к-ом произошел клик (форма)
  const targetElement = event.target

  // достаем все инпуты
  const inputLists = targetElement.querySelectorAll('input')

  // Объект для отправки на бек
  const userData = {
    id: nanoid(),
  }

  // пополняем объект по атрибуту name инпутов
  inputLists.forEach((input) => (userData[input?.name] = input?.value))

  fetch('http://localhost:3000/products', {
    method: 'POST', // Здесь так же могут быть GET, PUT, DELETE
    body: JSON.stringify(userData), // Тело запроса в JSON-формате
    headers: {
      // Добавляем необходимые заголовки
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      loadJSON()
    })
})

// логика открытия модалки
openModal.addEventListener('click', () => {
  saivBarStart.classList.add('show')
  saivBarBackdrop.classList.add('show')
})

// логика закрытия модалки
clousSidebar.addEventListener('click', () => {
  saivBarStart.classList.remove('show')
  saivBarBackdrop.classList.remove('show')
})

//функция получение и передачи карт в корзину
function basketСard() {
  const btnCard = document.querySelectorAll('.btn')
  btnCard.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const eventElement = event.currentTarget.parentElement
      console.log(eventElement)

      const eventElementObj = {
        id: '',
        name: eventElement.querySelector('.card-name').innerText,
        category: eventElement.querySelector('.card-category').innerText,
        rating: eventElement.querySelector('.rating-amount').innerText,
        price: eventElement.querySelector('.card-price').innerText,
        imgSrc: eventElement.querySelector('img').currentSrc,
      }

      saivBarBody.innerHTML += `
        <div class="card" style="width: 10rem; margin-top: 2rem;">
          <img src="${eventElementObj?.imgSrc}" alt="product"><img>
          <div class="card-body">
            <h5 class="card-title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${eventElementObj?.name}</font></font></h5>
            <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font>
            ${eventElementObj?.category}
            </p>
            <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font>
            ${eventElementObj?.price}
            </p>
          </div>
        </div>
        `
      cardLenth.innerHTML = document.querySelectorAll('.card')?.length
    })
  })
}
