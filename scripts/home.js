import{addToCart, updateCartQuantity} from '../data/cart.js';
import{products} from '../data/products.js';

// Html of home page
let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
        <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                   ${product.name}
                </div>
                <div class="product-rating-container">
                    <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars*10}.png">
                    <div class="product-rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <div class="product-price">
                    $${(product.priceCents/100).toFixed(2)}
                </div>

                <div class="product-quantity-container">
                    <select>
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                    </select>
                </div>

                <div class="product-spacer"></div>

                <div class="added-to-cart">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>

                <button class="add-to-cart-button button-primary"
                data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
            `;
});
// adding html to home page
document.querySelector('.products-grid').innerHTML = productsHTML;
// opening and closing of location form
document.querySelector('.location-button').addEventListener('click', openForm);
document.querySelector('.amazon-logo').addEventListener('click', closeForm);
document.querySelector('.close-button').addEventListener('click', closeForm);




// showing added after clicking the add to cart

function addedToCart(productContainer){
                const addedToCart = productContainer.querySelector('.added-to-cart');
                addedToCart.style.opacity = '1';
        
                setTimeout(() => {
                addedToCart.style.opacity = '0';
                },3000);
}

// functioning of add to cart
let selectedValue = document.getElementsByClassName("product-quantity-container").value;
document.querySelectorAll('.add-to-cart-button')
    .forEach((button)=> {
        button.addEventListener('click', () =>{
            const productId = button.dataset.productId;
            const ProductContainer = button.closest('.product-container');
            const quantitySelector = ProductContainer.querySelector('select');
            selectedValue = parseInt(quantitySelector.value);
            addToCart(productId, selectedValue);
            updateCartQuantity();
            addedToCart(ProductContainer);
                
            });
    })

// functioning of location form 
function openForm() {
    document.querySelector(".form-popup").style.display = "block";
    document.body.classList.add("no-scroll");
  }
  
  function closeForm() {
    document.querySelector(".form-popup").style.display = "none";
    document.body.classList.remove("no-scroll"); 
  }
// cart-quantity after loading
  document.addEventListener('DOMContentLoaded', () => {
    updateCartQuantity();
  });
  

// things to correct on 1st page:
// scroll system
// drop-down of product-quantity-container