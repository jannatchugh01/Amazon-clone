import {cart, removeFromCart, updateCartQuantity, saveToStorage, updateDeliveryOption} from '../../data/cart.js';
import { products, getProduct} from '../../data/products.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { paymentSummary } from './paymentSummary.js';

export function checkout(){

    // setting the delivery dates
    function deliveryDates(dateString, days){
        const newDate = new Date(dateString);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
    const today = new Date();
    const date = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    // Html for checkout page
    let cartProduct = '';
    cart.forEach(cartItem => {
        const productId = cartItem.productId;
        const addedProduct = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const deliveryDate = deliveryDates(date, deliveryOption.deliveryDays).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        cartProduct += `
            <div class="cart-item-container js-remove-from-cart-${addedProduct.id}">
                <div class="delivery-date">Delivery date: ${deliveryDate}</div>
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
                            ${deliveryOptionsHTML(addedProduct, cartItem)}
                        </div>
                    </div>
                </div>
            `
    });

    function deliveryOptionsHTML(addedProduct, cartItem){
        let html = '';
        deliveryOptions.forEach(deliveryOption => {
            const deliveryDate = deliveryDates(date,deliveryOption.deliveryDays).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const priceString = deliveryOption.priceCents === 0
            ? 'FREE'
            : `$${(deliveryOption.priceCents)/100} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
            <div class="delivery-option"
            data-product-id="${addedProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" 
                class="delivery-option-input" 
                name="delivery-option-${addedProduct.id}" 
                ${isChecked ? 'checked' : ''} >
                <div>
                    <div class="delivery-option-date">
                    ${deliveryDate}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>
            `
        })
        return html;
    }
    // adding html to page
    document.querySelector('.checkout-details').innerHTML = cartProduct;
    updateCartQuantity();

    // working of delete
    document.querySelectorAll('.delete-quantity-link').forEach((link) =>{
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-remove-from-cart-${productId}`);
            container.remove();
            updateCartQuantity();
            paymentSummary();
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
                    paymentSummary();
                    const newLabel = document.createElement('span');
                    newLabel.classList.add('quantity-label');
                    newLabel.textContent = newQuantity;
                    input.replaceWith(newLabel);
                    link.textContent = 'Update';
                }
            })
            updateCartQuantity();
            paymentSummary();
        })
    })

    // updating delivery date
    document.querySelectorAll('.delivery-option-input')
    .forEach((element) => {
      element.addEventListener('change', () => {
        const container = element.closest('.delivery-option');
        const {productId, deliveryOptionId} = container.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        checkout();
        paymentSummary();
      });
    });
}