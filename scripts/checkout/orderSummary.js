import {cart, removeFromCart, updateCartQuantity, saveToStorage} from '../../data/cart.js';
import { products} from '../../data/products.js';

export function checkout(){
    // searching the product ID
    function searchingProduct(productId){
        let matchingProduct;

        products.forEach((product) => {
            if(product.id === productId){
                matchingProduct = product;
            }
        });
        return matchingProduct;
    }

    // setting the delivery dates
    function deliveryDates(dateString, days){
        const newDate = new Date(dateString);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    // Html for checkout page
    let cartProduct = '';
    cart.forEach(cartItem => {
        const productId = cartItem.productId;
        let addedProduct = searchingProduct(productId);
        let date = cartItem.deliveryDate;
        cartProduct += `
            <div class="cart-item-container js-remove-from-cart-${addedProduct.id}">
                <div class="delivery-date">Delivery date: ${deliveryDates(date,7).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    <div class="cart-item-details-grid">
                        <img class="product-image" src="${addedProduct.image}">
                        <div class="cart-item-details">
                            <div class="product-name">
                                ${addedProduct.name}
                            </div>
                            <div class="product-price">
                                $${(addedProduct.priceCents/100).toFixed(2)}
                            </div>
                            <div class="product-quantity">
                                <span>
                                    Quantity: <span class="quantity-label js-update-product-quantity-${addedProduct.id}">${cartItem.quantity}</span>
                                </span>
                                <span class="update-quantity-link link-primary" data-product-id="${cartItem.productId}">
                                    Update
                                </span>
                                <span class="delete-quantity-link link-primary" data-product-id="${cartItem.productId}">
                                    Delete
                                </span>
                            </div>
                        </div>

                        <div class="delivery-options">
                            <div class="delivery-options-title">
                                Choose a delivery option:
                            </div>
                            <div class="delivery-option">
                                <input type="radio" checked class="delivery-option-input" name="${addedProduct.id}">
                                <div>
                                    <div class="delivery-option-date">
                                    ${deliveryDates(date,7).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div class="delivery-option-price">
                                        FREE Shipping
                                    </div>
                                </div>
                            </div>
                            <div class="delivery-option">
                                <input type="radio" class="delivery-option-input" name="${addedProduct.id}">
                                <div>
                                    <div class="delivery-option-date">
                                    ${deliveryDates(date,4).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div class="delivery-option-price">
                                        $4.99 - Shipping
                                    </div>
                                </div>
                            </div>
                            <div class="delivery-option">
                                <input type="radio" class="delivery-option-input" name="${addedProduct.id}">
                                <div>
                                    <div class="delivery-option-date">
                                    ${deliveryDates(date,1).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div class="delivery-option-price">
                                        $9.99 Shipping
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
    });

    // adding html to page
    document.querySelector('.checkout-details').innerHTML = cartProduct;
    updateCartQuantity();

    // changing delivery dates
    document.querySelectorAll(`.delivery-option-input`).forEach((date) => {
        date.addEventListener('change', () =>{
            const productId = date.name;
            const selectedDate = date.closest('.delivery-option').querySelector('.delivery-option-date').textContent;
            document.querySelector(`.js-remove-from-cart-${productId} .delivery-date`).innerHTML = `Delivery date: ${selectedDate}`;
            const cartItem = cart.find(item => item.productId === productId);
            if (cartItem) {
                cartItem.deliveryDate = selectedDate;
                saveToStorage();
            }
        })
    })
    // working of delete
    document.querySelectorAll('.delete-quantity-link').forEach((link) =>{
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-remove-from-cart-${productId}`);
            container.remove();
            updateCartQuantity();
        })
    })
    // working of update
    document.querySelectorAll('.update-quantity-link').forEach((link) =>{
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const quantityLabel = link.parentElement.querySelector('.quantity-label');

            if (!quantityLabel) return;

            const input = document.createElement('input');
            input.style.width = '30px';
            input.style.height = '15px';
            input.type = 'number';
            input.min = 1;
            input.value = quantityLabel.textContent;
            input.classList.add(`js-update-product-quantity-${productId}`);
            // Replace quantity label with input
            quantityLabel.replaceWith(input);

            link.textContent = 'Save';

            link.addEventListener('click', () => {
                const newQuantity = parseInt(input.value);
                const cartItem = cart.find(item => item.productId === productId);
                if (cartItem && newQuantity > 0) {
                    cartItem.quantity = newQuantity;
                    saveToStorage();
                    updateCartQuantity();
                    const newLabel = document.createElement('span');
                    newLabel.classList.add('quantity-label');
                    newLabel.textContent = newQuantity;
                    input.replaceWith(newLabel);
                    link.textContent = 'Update';
                }
            })
            updateCartQuantity();
        })
    })
}