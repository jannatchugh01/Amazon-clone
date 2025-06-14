export let cart= JSON.parse(localStorage.getItem('cart'));

if(!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
    },{
        productId: "54e0eccd-8f36-462b-b68a-8182611d9add",
        quantity: 1,
        deliveryOptionId: '1'
    },{
        productId: "dd82ca78-a18b-4e2a-9250-31e67412f98d",
        quantity: 3,
        deliveryOptionId: '1'
    }];
}

// saving cart items to storage
export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

// quantity  that should be added to cart
export function addToCart(productId, selectedValue){
    let matchingItem;
            cart.forEach(item =>{
                if(productId === item.productId){
                    matchingItem = item;
                }
               });
                if(matchingItem){
                    matchingItem.quantity += selectedValue ;
                }
                else{
                    cart.push({
                        productId : productId,
                        quantity : selectedValue,
                        deliveryOptionId: '1'
                    });
                };
        saveToStorage();
        updateCartQuantity();
};


// removing product from cart
export function removeFromCart(productId){
    const newCart = [];
    cart.forEach(cartItem => {
        if(productId !== cartItem.productId){
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
    updateCartQuantity();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
  
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    matchingItem.deliveryOptionId = deliveryOptionId;
  
    saveToStorage();
}

// updating the cart quantity in header

export function updateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach(item =>{
        cartQuantity += item.quantity;
    });
    saveToStorage();
    const cartQuantityElement = document.querySelector('.cart-quantity');
    if (cartQuantityElement) {
        cartQuantityElement.innerHTML = cartQuantity;
    }
    localStorage.setItem('product-quantity', JSON.stringify(cartQuantity));
}
