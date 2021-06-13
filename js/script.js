const couponBtn = document.querySelector(`.coupon_btn`);
const couponCode = document.querySelector(`#cpcode`);

// Viewing Product Variations
const smallImg = document.querySelectorAll(".prod_detail_small_img");
smallImg.forEach((el) => {
  el.onclick = () => {
    const bigImg = document.querySelector(".prod_detail_large_img");
    bigImg.src = el.src;
  };
});

// get all the products info if there is any in the local storage
function getProductFromStorage() {
  return localStorage.getItem("foundationminiproject")
    ? JSON.parse(localStorage.getItem("foundationminiproject"))
    : [];
  // returns empty array if there isn't any product info
}

/**
 * ====================================
 * ADDING THE ORDER TOTALS
 * ====================================
 */
let orderTotals = [];
let orderQty = [];
let OrderTotals;
let totalOrderQty;

const addOrderTotal = () => {
  let orders = getProductFromStorage();

  orders.forEach((order) => {
    orderTotals.push(order.total);
    orderQty.push(order.qty);
  });
};
addOrderTotal();

/**
 * ====================================
 * COUPON AND UPDATES
 * ====================================
 */

const couponUpdates = () => {
  // let sproduct = getProductFromStorage();

  function tallyOrderTotals(totalTally, currentValue) {
    //return totalTally + currentValue so the next loop can use it
    return totalTally + currentValue;
  }

  const sumOfOrderTotals = orderTotals.reduce(tallyOrderTotals, 0);
  const orderQuantity = orderQty.reduce(tallyOrderTotals, 0);
  totalOrderQty = orderQuantity; //setting the new quantity
  console.log(orderQuantity);
  document.querySelector(`.subtotal_val`).textContent = sumOfOrderTotals;
  document.querySelector(`.estitotal_val`).textContent = sumOfOrderTotals;

  orderTotals = sumOfOrderTotals; //setting global orderTotals to sumOfOrderTotals
  // sproduct.forEach((product) => {
  // coupon calculation
  couponCode.addEventListener(`input`, () => {
    if (!(couponCode.value.length > 5 || couponCode.value.length < 5)) {
      couponBtn.disabled = false;
      document.querySelector(`.errorMsg`).textContent = ``;
    } else {
      document.querySelector(`.errorMsg`).textContent = `Invalid code`;
      couponBtn.disabled = true;
    }
  });

  couponBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    if (!(couponCode.value.length > 5 || couponCode.value.length < 5)) {
      //calculate the total amount after coupon %
      let totalAmount = sumOfOrderTotals * 0.5;
      //update total amount on the UI
      // document.querySelector(`.total_price_val`).textContent = totalAmount;
      document.querySelector(`.estitotal_val`).textContent = totalAmount;
      //clear error msg
      document.querySelector(`.errorMsg`).textContent = ``;
    } else {
      document.querySelector(`.errorMsg`).textContent = `Coupon Code Invalid`;
    }
  });
  // }); //end forEach
}; //end couponUpdates()

couponUpdates();

/**
 * ====================================
 * POPULATING THE CART PAGE
 * ====================================
 */

// populating the cart page
const populateCartPage = () => {
  let sproduct = getProductFromStorage();

  sproduct.forEach((product) => {
    // console.log(product);
    // console.log(totalOrderQty);
    document.querySelector(`.summarycount`).textContent = totalOrderQty;
    document.querySelector(`.count`).textContent = totalOrderQty;
    //creating tr for each order
    document.querySelector(`tbody`).innerHTML += `
     <tr data-id="${product.id}">
                   <td class="my_bag_table_img">
                     <div class="table_img">
                       <a href="product-details.html">
                         <img
                           src="${product.imgSrc}"
                           class="oprod_img"
                           alt="headphone"
                         />
                       </a>
                     </div>
                     <div class="table_img_desc">
                       <a
                         class="oprod_title"
                         href="product-details.html"
                         target="_blank"
                         rel="noopener noreferrer"
                         >${product.title}</a
                       >
                       <span class="oprod_id" hidden></span>
                       <div class="img_color_size">
                         <a href="" class="dcolor">Color: <span>${product.color}</span></a> |
                         <a href="" class="dsize">Size: <span>${product.size}</span></a>
                       </div>
                       <div class="img_modify_links">
                         <a href="product-details.html">Edit</a> |
                         <a href="">Move to Wishlist</a> |
                         <button id="deleteBtn">Remove</button>
                       </div>
                     </div>
                   </td>
                   <td class="td_wrap_qty">
                     <div class="wrap_qty">
                       <div class="wrap_qty option">
                         <select class="qty_control" id="myqty">
                           <option selected>1</option>
                           <option>2</option>
                           <option>3</option>
                           <option>4</option>
                           <option>5</option>
                           <option>6</option>
                           <option>7</option>
                           <option>8</option>
                           <option>9</option>
                           <option>10</option>
                         </select>
                       </div>
                       <div class="wrap_qty priceqty">
                         <p class="unit_price">UNIT PRICE</p>
                         <p class="unit_pvalue">
                           &#64; GH<span>&#162;</span>
                           <span class="unit_price_val">${product.price}</span>
                         </p>
                       </div>
                     </div>
                     <div class="wrap_qty mygift">
                       <input type="checkbox" name="mygift" id="mygift" />
                       <label for="mygift">Free gift package?</label>
                     </div>
                   </td>
                   <td class="my_deli_mode">
                     <input type="radio" name="delivery" id="del_ship" /> Ship to
                     Me <br />
                     <input type="radio" name="delivery" id="del_instore" />
                     In-Store Pickup <br />
                     <input type="radio" name="delivery" id="del_curbside" />
                     Curbside Pickup
                   </td>
                   <td>
                     <p>
                       GH<span>&#162;</span
                       ><span class="total_price_val">${product.total}</span>
                     </p>
                   </td>
                 </tr>
   
   `;
  });
};
populateCartPage();

const deleteBtn = document.getElementById(`deleteBtn`);

deleteBtn.addEventListener(`click`, deleteProduct);
// console.log(deleteBtn);

// delete product from cart list and local storage
function deleteProduct(e) {
  let cartItem;
  // console.log(e.target.tagName);
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.closest(`tr`);
    cartItem.remove(); // this removes from the DOM only
  }
  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    // console.log(typeof product.id);
    return parseInt(product.id) !== parseInt(cartItem.dataset.id);
  });

  // console.log(updatedProducts);

  localStorage.setItem(
    "foundationminiproject",
    JSON.stringify(updatedProducts)
  ); // updating the product list after the deletion
  populateCartPage(); //Update the UI
}
