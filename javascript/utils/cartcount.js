import { cart } from "../../data/cart.js";

export function storecartquantity() {
  let cartquantity = 0;
  cart.forEach((cartitem) => {
    cartquantity += cartitem.quantity;
  });
  localStorage.setItem('cartquantity', JSON.stringify(cartquantity));
  return cartquantity;
}