import {cart} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';

export function paymentSummary(){
    let itemQuantity = 0;
    cart.forEach(item => {
        itemQuantity +=item.quantity;
    });

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach(cartItem => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    })

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents*0.1;
    const totalAfterTaxCents = totalBeforeTaxCents + taxCents;
    let paymentHTML = '';
    paymentHTML+=`
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${itemQuantity}):</div>
            <div class="payment-summary-money">$${(productPriceCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(shippingPriceCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(totalBeforeTaxCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(taxCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(totalAfterTaxCents/100).toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>`

        document.querySelector('.payment-summary').innerHTML = paymentHTML;
}