import { cart } from "../../data/cart.js";
import { getproduct } from "../../data/products.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryoptions.js";
import { formatcurrency } from "../utils/price.js";

export function renderpayment() {
    // price calculation
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  cart.forEach((cartitem) => {
    const product = getproduct(cartitem.productId);
    productPriceCents += product.priceCents * cartitem.quantity;
    const deliveryOption = getDeliveryOption(cartitem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const TaxCents = totalBeforeTaxCents * 0.1;
  const totalAfterTaxCents = totalBeforeTaxCents + TaxCents;

//   render payment section
  let paymentHTML;

  paymentHTML = `
      <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cart.length}):</div>
            <div class="payment-summary-money">$${formatcurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatcurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatcurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatcurrency(TaxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatcurrency(totalAfterTaxCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `;
    document.querySelector('.payment-summary').innerHTML = paymentHTML;
}
