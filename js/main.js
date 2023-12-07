// ! registation
document.addEventListener("DOMContentLoaded", function () {
  const registrationIcon = document.getElementById("registrationIcon");
  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Registration logic goes here!");
  });
});
function openRegistrationModal() {
  const registrationModal = document.getElementById("registrationModal");
  registrationModal.style.display = "block";
}
function closeRegistrationModal() {
  const registrationModal = document.getElementById("registrationModal");
  registrationModal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
  const registrationIcon = document.getElementById("registrationIcon");
  registrationIcon.addEventListener("click", function (event) {
    event.preventDefault();
    openRegistrationModal();
  });
  const registrationForm = document.getElementById("registrationForm");
  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    console.log("Name:", name);
    console.log("Address:", address);
    console.log("Email:", email);
    console.log("Phone:", phone);
    localStorage.setItem("name", name);
    localStorage.setItem("address", address);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    closeRegistrationModal();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const API = "http://localhost:8001/products";
  let btnBuy = document.querySelector(".btnBuy");
  const addProductModal = document.getElementById("addProductModal");
  const sectionProducts = document.querySelector(".sectionProducts");
  const inpName = document.getElementById("inpName");
  const inpPrice = document.getElementById("inpPrice");
  const inpImage = document.getElementById("inpImage");
  const inpAddress = document.getElementById("inpAddress");
  const btnAdd = document.querySelector(".btnAdd");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const prevButton = document.querySelector(".prev-slide");
  const nextButton = document.querySelector(".next-slide");
  //!Main pagination=======================================
  // Скрыть все слайды
  function hideSlides() {
    slides.forEach((slide) => {
      slide.style.display = "none";
    });
  }
  // Показать текущий слайд
  function showSlide(index) {
    hideSlides();
    slides[index].style.display = "flex";
  }

  // Переключение на предыдущий слайд
  function prevSlide() {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(currentSlide);
  }

  // Переключение на следующий слайд
  function nextSlide() {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(currentSlide);
  }

  // События кнопок для переключения слайдов
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  // Показать первый слайд при загрузке страницы
  showSlide(currentSlide);

  let closeBtn = document.getElementsByClassName("close")[0];
  let addBtn = document.querySelector(".addBtn");
  let modal = document.querySelector("#addProductModal");

  // Открываем модальное окно при клике на кнопку "Добавить продукт"
  btnAdd.onclick = function () {
    modal.style.display = "block";
  };

  // Закрываем модальное окно при клике на кнопку "Закрыть" (иконка X)
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Закрываем модальное окно при клике вне его области
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  addBtn.addEventListener("click", () => {
    if (
      //Проверка на заполненность полей
      !inpName.value.trim() ||
      !inpPrice.value.trim() ||
      !inpImage.value.trim() ||
      !inpAddress.value.trim()
    ) {
      alert("Заполните все поля");
      return;
    }
    //Создаем новый обьект, куда добавляем значения наших инпутов(Создание новой книги)
    let newProduct = {
      productName: inpName.value,
      productPrice: inpPrice.value,
      productImage: inpImage.value,
      productAddres: inpAddress.value,
    };
    creatProducts(newProduct);
    readProducts();
  });
  //!================CREATE=================
  async function creatProducts(product) {
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании продукта");
      }

      // Убедимся, что запрос завершился успешно, затем очистим инпуты и обновим отображение продуктов
      inpName.value = "";
      inpPrice.value = "";
      inpImage.value = "";
      inpAddress.value = "";
      modal.style.display = "none";
      // Вызываем функцию для обновления отображения продуктов
      readProducts();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  //!=============Read=======================
  async function readProducts() {
    const response = await fetch(`${API}?q=${searchValue}`);
    const data = await response.json(); //получения данных из db.json()
    sectionProducts.innerHTML = ""; //очищааем наш тег section,чтобы не было дубликатов
    data.forEach((item) => {
      sectionProducts.innerHTML += `
      <div class="detailsCard card" style="width: 19rem">
      <img
        id="${item.id}"
        src="${item.productImage}"
        alt=""
        class="card-img-top detailsCard"
        style="height: 280px"
      />
      <div class="card-body">
        <h5 class="card-title">${item.productName}</h5>
        <p class="card-text">${item.productPrice}</p>
        <span class="card-text">${item.productAddres}</span>
        <div>
    <button class="btn btn-outline-danger btnDelete" id="${item.id}">Удалить</button>
    <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Изменить</button>
    <button class="detailsCard btn btn btn-outline-warning">Details</button>
</div>
      </div>
    </div>
  `;
    });
  }
  readProducts();

  //!REGISTRATION==================================================

  //!================DELETE===============
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnDelete")) {
      let del_id = e.target.id;
      fetch(`${API}/${del_id}`, {
        method: "DELETE",
      })
        .then(() => {
          readProducts();
        })
        .catch((error) => {
          console.error("Ошибка при удалении:", error);
        });
    }
  });
  //!==============EDIT===================
  const editInpName = document.querySelector("#editInpName");
  const editInpPrice = document.querySelector("#editInpPrice");
  const editInpImage = document.querySelector("#editInpImage");
  const editInpAddress = document.querySelector("#editInpAddress");
  const editBtnSave = document.getElementById("editBtnSave");
  const editProductModal = document.getElementById("editProductModal");
  const editCloseBtn = editProductModal.querySelector(".close");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEdit")) {
      const edit_id = e.target.id;
      fetch(`${API}/${edit_id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          editInpName.value = data.productName;
          editInpPrice.value = data.productPrice;
          editInpImage.value = data.productImage;
          editInpAddress.value = data.productAddress;
          editBtnSave.setAttribute("data-id", data.id);
          editProductModal.style.display = "block"; // Отображение модального окна при получении данных для редактирования
        })
        .catch((error) => {
          console.error("Ошибка при загрузке данных:", error);
        });
    }
  });

  editCloseBtn.addEventListener("click", function () {
    editProductModal.style.display = "none";
  });

  // Обработчик события для кнопки "Save Changes" в модальном окне редактирования
  editBtnSave.addEventListener("click", function () {
    let id = editBtnSave.getAttribute("data-id");
    let editedProduct = {
      productName: editInpName.value,
      productPrice: editInpPrice.value,
      productImage: editInpImage.value,
      productAddress: editInpAddress.value,
    };
    editProduct(editedProduct, id);
    editProductModal.style.display = "none"; // Закрытие модального окна после сохранения изменений
  });

  async function editProduct(editedProduct, id) {
    try {
      let res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(editedProduct),
      });

      if (!res.ok) {
        throw new Error("Failed to edit the product");
      }

      // Обновляем отображение продуктов после успешного редактирования
      readProducts();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  readProducts();

  // ! search
  let searchValue = "";
  const searchIcon = document.getElementById("SearchIcon");
  const searchInput = document.getElementById("searchInput");

  searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("active");
  });

  searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.toLowerCase();
    // Perform search logic here
  });
  searchInput.addEventListener("input", (e) => {
    // это строка добавляет слушатель событий для поля ввода в inpSearch
    //он реагирует на событие input ,то есть каждый раз, когда пользователь что то вводит в  инпут.Внутри этого
    // случателя событий есть стрелочная функция которая выполняется при каждом событии инпут. e.target.value
    // содержит значение, введенное пользователем  в инпут.
    currentPage = 1;
    searchValue = e.target.value.trim();
    readProducts();
  });
});
