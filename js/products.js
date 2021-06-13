// LOADING DATA FROM PRODUCTS JSON FILE AND DISPLAYING ON THE PAGE
let PRODUCTS = [];
$(document).ready(() => {
  $.ajax({
    method: "GET",
    url: "../assets/data/products.json",
    dataType: "json",
  }).done((json) => {
    PRODUCTS = json.products;
    // filter products section
    filterProduct(json);
  }); //done(end)
  CART.init();
}); //read(end)

// Filter products
const filterProduct = (data) => {
  $("#sort_prods").change(() => {
    let filterValue = $("#sort_prods option:selected").text();
    let matchFound = data.products.filter(
      (product) =>
        product.category === filterValue || filterValue === "All Products"
    );
    let showCategory = matchFound.map(
      (category) => `
      <div class="featured_prod_row2_ph">
            <img
              src="${category.image}"
              alt="Phone"
              id="img"
            />
            <div class="description">
              <h4>${category.title}</h4>
              <div class="rating">
                <i class="zmdi zmdi-star"></i>
                <i class="zmdi zmdi-star"></i>
                <i class="zmdi zmdi-star-half"></i>
                <i class="zmdi zmdi-star-outline"></i>
                <i class="zmdi zmdi-star-outline"></i>
              </div>
              <p class="price">GH<span>&#162;</span>${category.price}</p>
            </div>
          </div>
  `
    );
    $(".featured_prod_row2").html(showCategory);
  });
};

/**
 * ===================================
 * UPDATING THE COLORS AND SIZES
 * ===================================
 */
const colorpickers = document.querySelectorAll(`.prod_ccolor`);
const sizepickers = document.querySelectorAll(`.size_selection span`);

colorpickers.forEach((colorpicker) => {
  colorpicker.addEventListener(`click`, (e) => {
    document.querySelector(`.product_color_val`).textContent =
      e.target.dataset.color;
  });
});

sizepickers.forEach((sizepicker) => {
  sizepicker.addEventListener(`click`, (e) => {
    document.querySelector(`.prod_size_value`).textContent =
      e.target.dataset.size;
  });
});

/**
 * ===================================
 * UPDATING THE CART
 * ===================================
 */

const incrementCart = (event) => {
  event.preventDefault();
  // let id = parseInt(event.target.getAttribute("data-id"));
  let value = parseInt(document.getElementById("prod_order_qty").value);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById("prod_order_qty").value = value;
};

const decrementCart = (event) => {
  event.preventDefault();
  // let id = parseInt(event.target.getAttribute("data-id"));
  let value = parseInt(document.getElementById("prod_order_qty").value);
  value = isNaN(value) ? 0 : value;
  value < 1 ? (value = 1) : "";
  value--;
  document.getElementById("prod_order_qty").value = value;
};

/*********************MODAL********************** */
const modalInner = document.querySelector(`.modal__inner`);
const modalOuter = document.querySelector(`.modal__outer`);

function handleCartBtnClick(e) {
  //grab the product details from the details page
  const imgSrc = document.querySelector(`.prod_detail_large_img`).src;
  const title = document.querySelector(`.ordered_prod_title`).textContent;
  const id = document.querySelector(`.prod_id`).textContent;
  const pprice = document.querySelector(`.new_price`).textContent;
  const color = document.querySelector(`.product_color_val`).textContent;
  const size = document.querySelector(`.prod_size_value`).textContent;
  const pqty = document.querySelector(`#prod_order_qty`).value;
  let price = parseInt(pprice);
  let qty = parseInt(pqty);
  let total = price * qty;
  // create an array of the product details
  const prodObj = {
    id: id,
    title: title,
    qty: qty,
    price: price,
    image: imgSrc,
    size: size,
    color: color,
    total: total,
  };
  // save to local storage
  CART.add(prodObj);
  //populate the modal with the new data
  modalInner.querySelector(`.cart_confirmation_productimg`).src = imgSrc;
  modalInner.querySelector(`.cart_item_name`).textContent = title;
  modalInner.querySelector(`.prod_price_value`).textContent = price;
  modalInner.querySelector(`.prod_size`).textContent = size;
  modalInner.querySelector(`.prod_color`).textContent = color;
  modalInner.querySelector(`.cart_item_qty`).textContent = qty;
  modalInner.querySelector(`.prod_subtotal_value`).textContent = total;
  modalInner.querySelector(`.total_price`).textContent = total;

  //show the modal
  modalOuter.classList.add(`open`);
}
//close the modal
function closeModal() {
  modalOuter.classList.remove(`open`);
}
//identifying when a click event is outside the inner modal
modalOuter.addEventListener(`click`, (e) => {
  /**reture true for clicks outside the inner modal and vise versa */
  const isOutSide = !e.target.closest(`.modal__inner`); //
  if (isOutSide) {
    closeModal();
  }
});

//closing the modal with the escape key
window.addEventListener(`keydown`, (e) => {
  if (e.key === `Escape`) {
    closeModal();
  }
});

//relocate to the cart page
modalInner.querySelector(`.btn_checkout`).addEventListener(`click`, (e) => {
  closeModal();
  window.location.assign("/html/add-to-cart.html");
});
/*********************MODAL END********************** */

/**
 * ================================
 * CLICK PRODUCT ADD TO BAG, ADD AND REMOVE METHODS
 * ================================
 */
$(".btn_addToBag").click((ev) => {
  ev.preventDefault();
  //show the modal
  handleCartBtnClick();
});
// increment
$(".increment").click(incrementCart);
// decrement
$(".decrement").click(decrementCart);
/**
 * ================================
 * SETTING UP LOCALSTORAGE AND DECLARING METHODS
 * ================================
 */

const CART = {
  KEY: "foundationminiproject",
  contents: [],
  init: () => {
    //check localStorage and initialize the contents of CART.contents
    let storeContents = localStorage.getItem(CART.KEY);
    if (storeContents) {
      CART.contents = JSON.parse(storeContents);
    } else {
      CART.contents = []; //set localStorage
      CART.sync(); //update localStorage
    }
  },
  sync: () => {
    //set localStorage with CART contents
    let cartData = JSON.stringify(CART.contents);
    localStorage.setItem(CART.KEY, cartData);
  },
  find: (id) => {
    //find an item in the cart by it's id
    let match = CART.contents.filter((item) => {
      if (item.id == id) {
        return true;
      }
    });
    if (match && match[0]) {
      return match[0];
    }
  },
  add: (prodData) => {
    if (CART.find(prodData.id)) {
      CART.contents = CART.contents.map((item) => {
        if (item.id === prodData.id) {
          let nqty = item.qty + prodData.qty;
          let ntotal = nqty * item.price;
          item.qty = nqty;
          item.total = ntotal;
          // updating the modal view
          modalInner.querySelector(`.cart_item_qty`).textContent = nqty;
          modalInner.querySelector(`.prod_subtotal_value`).textContent = ntotal;
          modalInner.querySelector(`.total_price`).textContent = ntotal;
        }
        return item;
      });
      //update localStorage
      CART.sync();
    } else {
      console.log(prodData);
      const dataObj = {
        id: prodData.id,
        title: prodData.title,
        qty: prodData.qty,
        price: prodData.price,
        imgSrc: prodData.image,
        size: prodData.size,
        color: prodData.color,
        total: prodData.total,
      };
      CART.contents.push(dataObj);
      //update localStorage
      CART.sync();
    }
  },
};
