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
