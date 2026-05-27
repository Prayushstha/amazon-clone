export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
  cart = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 3,
    deliveryOptionId: '2'

  },
];
}
 
export function storecart(){
    localStorage.setItem('cart',JSON.stringify(cart));
}

// Add to cart
export function addtocart(productid) {
  let matchingItem;
  cart.forEach((cartitem) => {
    if (productid === cartitem.productId) {
      matchingItem = cartitem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productid,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }
  storecart();
}

export function removefromcart(productId){
    const newcart = [];

    cart.forEach((cartitem)=>{
        if(cartitem.productId !==productId){
            newcart.push(cartitem);
        }
    });
    cart = newcart;
      storecart();

}

export function updateDeliveryOption(productId,deliveryOptionId){
  let matchingItem;
  cart.forEach((cartitem) => {
    if (productId === cartitem.productId) {
      matchingItem = cartitem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  storecart();
};

