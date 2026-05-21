import { products } from "../data/products.js";
import { cart, removefromcart } from "../data/cart.js";
import { formatcurrency } from "./utils/price.js";
import { storecartquantity } from "./utils/cartcount.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const today = dayjs();
const deliverydate = today.add(7, "days");
console.log(deliverydate.format("dddd, MMMM, D"));
let checkoutHTML = "";

cart.forEach((cartitem) => {
  const productId = cartitem.productId;
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  checkoutHTML += `<div class="cart-item-container cart-item-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">
                 $${formatcurrency(matchingProduct.priceCents)}

                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartitem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
});
document.querySelector(".order-summary").innerHTML = checkoutHTML;

// delete link

document.querySelectorAll(".delete-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removefromcart(productId);

    const container = document.querySelector(`.cart-item-${productId}`);
    container.remove();
  });
});

const checkoutcount = document.getElementById("checkoutcount");
function checkoutquantity() {
  let cartquantity = 0;
  cart.forEach((cartitem) => {
    cartquantity += cartitem.quantity;
  });

  storecartquantity();

  checkoutcount.innerHTML = cartquantity;
}
checkoutquantity();
