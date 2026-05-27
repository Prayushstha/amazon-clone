import { products, getproduct } from "../../data/products.js";
import { cart, removefromcart, updateDeliveryOption,storecart } from "../../data/cart.js";
import { formatcurrency } from "../utils/price.js";
import { storecartquantity } from "../utils/cartcount.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryoptions.js";
import { renderpayment } from "./payment.js";


export function rendercheckout() {
  let checkoutHTML = "";

  cart.forEach((cartitem) => {
    const productId = cartitem.productId;
    let matchingProduct = getproduct(productId);

    const deliveryOptionId = cartitem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliverydays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    checkoutHTML += `<div class="cart-item-container cart-item-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
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
                  <span class="item-quantity-link">
                    Quantity: <span class="quantity-label quantity-${matchingProduct.id}">${cartitem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
<input class="quantity-input" data-product-id="${matchingProduct.id}" style="width:30px">                    <span class="link-primary save-link" data-product-id="${matchingProduct.id}">
                Save
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
             ${deliveryOptionsHTML(matchingProduct, cartitem)} 
              </div>
            </div>
          </div>
          `;
  });
  document.querySelector(".order-summary").innerHTML = checkoutHTML;

  function deliveryOptionsHTML(matchingProduct, cartitem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliverydays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const pricestring =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatcurrency(deliveryOption.priceCents)} - `;
      const isChecked = deliveryOption.id === cartitem.deliveryOptionId;
      html += `<div class="delivery-option js-delivery-option" 
    data-product-id="${matchingProduct.id}" 
    data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio" ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${pricestring}  Shipping
                    </div>
                  </div>
                </div>
              `;
    });
    return html;
  }

  // delete link
  document.querySelectorAll(".delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removefromcart(productId);

      const container = document.querySelector(`.cart-item-${productId}`);
      container.remove();
      renderpayment();
      checkoutquantity();
    });
  });
  // updatelink
  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const cartItemContainer = document.querySelector(
        `.cart-item-${productId}`,
      );
      cartItemContainer.classList.add("is-editing-quantity");
      console.log(productId);
    });

   
  });
   document.querySelectorAll(".save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    // Read input value BEFORE re-rendering
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    const newQuantity = Number(quantityInput.value);

    const cartItemContainer = document.querySelector(`.cart-item-${productId}`);
    cartItemContainer.classList.remove("is-editing-quantity");

    updateQuantityLink(productId, newQuantity); // pass value in directly
  });
});

  checkoutquantity();

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      console.log("clicked:", productId, deliveryOptionId);
      updateDeliveryOption(productId, deliveryOptionId);
      rendercheckout();
      renderpayment();
    });
  });
}

function checkoutquantity() {
  const checkoutcount = document.getElementById("checkoutcount");
  let cartquantity = 0;
  cart.forEach((cartitem) => {
    cartquantity += cartitem.quantity;
  });
  storecartquantity();
  checkoutcount.innerHTML = cartquantity;
}

function updateQuantityLink(productId, newQuantity) {
  const cartItem = cart.find((item) => item.productId === productId);
  cartItem.quantity = newQuantity;
  storecartquantity();
  storecart();
  rendercheckout();
  renderpayment();
}