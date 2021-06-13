// $(".prod_detail_small_img").forEach((element) => {
//   console.log(element);
// });
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

// populating the cart page
const populateCartPage = () => {
  let sproduct = getProductFromStorage();

  sproduct.forEach((product) => {
    // coupon calculation
    const couponBtn = document.querySelector(`.coupon_btn`);
    const couponCode = document.querySelector(`#cpcode`);

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
        let totalAmount = product.total * 0.5;
        //update total amount on the UI
        document.querySelector(`.total_price_val`).textContent = totalAmount;
        document.querySelector(`.estitotal_val`).textContent = totalAmount;
        //clear error msg
        document.querySelector(`.errorMsg`).textContent = ``;
      } else {
        document.querySelector(`.errorMsg`).textContent = `Coupon Code Invalid`;
      }
    });

    document.querySelector(`.oprod_img`).src = product.imgSrc;
    document.querySelector(`.oprod_title`).textContent = product.title;
    document.querySelector(`.oprod_id`).textContent = product.id;
    document.querySelector(`.unit_price_val`).textContent = product.price;
    document.querySelector(`.total_price_val`).textContent = product.total;
    document.querySelector(`.dcolor`).textContent = product.color;
    document.querySelector(`.dsize`).textContent = product.size;
    document.querySelector(`.summarycount`).textContent = product.qty;
    document.querySelector(`.subtotal_val`).textContent = product.total;
    document.querySelector(`.estitotal_val`).textContent = product.total;
    document.querySelector(`.count`).textContent = product.qty;
  });
};
populateCartPage();
