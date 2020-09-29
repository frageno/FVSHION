// Filtering items with jQuery
$('.products__item').click(function(){
    let value = $(this).attr('data-filter');
    if (value === 'all'){
        $('.filter').show(300);
    }
    else {
        $('.filter').not('.'+value).hide(300);
        $('.filter').filter('.'+value).show(300);
    }

});



// Adding active class on clicked list item and removing this class for rest of them
$('.products__item').click(function(){
    $(this).addClass('products__item-active').siblings().removeClass('products__item-active');

});

// Add background and change colors to navbar elements during scrolling
$(window).scroll(()=>{
    let position = $(this).scrollTop();
    if(position >= 30){
        $('.navbar').addClass('c-nav__bg');
        $('.c-nav__span-desktop, .c-nav__span').addClass('c-nav__change');
        $('.c-nav__cart-desktop,.c-nav__list-item,.c-nav__brand-name,.c-nav__cart, .c-nav__bars').addClass('c-nav__color');
    }else {
        $('.navbar').removeClass('c-nav__bg');
        $('.c-nav__span-desktop, .c-nav__span').removeClass('c-nav__change');
        $('.c-nav__cart-desktop,.c-nav__list-item,.c-nav__brand-name,.c-nav__cart, .c-nav__bars').removeClass('c-nav__color');


    }
});


// Change the bars into a times icon

let barsIcon = document.querySelector('.c-nav__bars');

barsIcon.addEventListener('click', function(){
    if(barsIcon.classList.contains('fa-bars')){
        barsIcon.classList.toggle('fa-times');
    }
    else {
        barsIcon.classList.remove('fa-times');
    }
});

// Open more products

let more = document.getElementById('more');
more.addEventListener('click', ()=>{
    location.href="more-new-products.html";
});



// Getting cart DOM from html
let cartBtn = document.getElementById('cart');
let cartClose = document.getElementById('cart-close');
let cartOverlay = document.querySelector('.c-cart__overlay');
let cartBody = document.querySelector('.c-cart');


// Getting elements from DOM

const productDOM = document.querySelector('.products__center');
let cartTotal = document.querySelector('#c-cart__total');
let cartCount = document.querySelector('#cart-count');
const cartContent = document.querySelector('.c-cart__item');
// Cart
let cart = [];
// Buttons
let buttonsDOM = [];
// Access to json file
class Products {
    async getProduct(){
        try {
            let result = await fetch ("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title,price,sex,show,type} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {id,title,price,sex,image,show,type};
            })
            return products;
        }
        catch(error){
            console.log(error);
        }
    }
}
// Filling the interface
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `

            <div class="col-lg-4 col-md-6 col-sm-9 py-4 py-lg-2 filter all ${product.sex} ${product.type}">

                        <div class="${product.show}">
                            <div class="products__box">
                                <img src=${product.image} class="img-fluid">
                                <button class="far fa-heart" id="heart"></button>
                            </div>
                            <div class="products__content">
                                <h5>${product.title}</h5>
                                <strong>$${product.price}</strong>
                            </div>
                            <div class="products__buttons">
                                <button class="products__btn-add" id="add" data-id=${product.id}>Add to cart</button>
                                <button class="products__btn-view">View</button>
                            </div>

                        </div>
            </div>

            `;

        });


        productDOM.innerHTML = result;


    }
    getBagButtons(){
        const btns = [...document.querySelectorAll('#add')];
        buttonsDOM = btns;
        btns.forEach(button=>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){ 
                button.disabled = true;

            }
            else {

                button.addEventListener('click', (event)=>{
                    event.target.innerText = 'Added to cart';
                    event.target.disabled = true;

                    // Get product from products
                    let cartItem = {...Storage.getProduct(id),amount:1};
                    // Add product to the cart
                    cart= [...cart,cartItem];
                    // Save cart in local storage
                    Storage.saveCart(cart);
                    // Set cart values
                    this.setCartValues(cart);
                    // Display cart item
                    this.addCartItem(cartItem);
                    // Show the cart
                });

            }

        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let totalCount = 0;

        cart.map(item=>{
            tempTotal += item.price * item.amount;
            totalCount += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartCount.innerText = totalCount;


    }
    addCartItem(item){
            const div = document.createElement('div');
            div.classList.add('c-cart__content');
            div.innerHTML = `
            <img src=${item.image}>
            <div class="c-cart__info">
                <h4>${item.title}</h4>
                <h4>Price : $${item.price}</h4>
                <i class="fas fa-arrow-circle-left"></i>
                ${item.amount}
                <i class="fas fa-arrow-circle-right"></i>
                <span class="d-block">Remove</span>
                
            </div>
            

        `;

        cartContent.appendChild(div);

    }
    showCart() {
        cartBody.classList.add('c-cart__visible');
        cartOverlay.classList.add('c-cart__visible');
    }
    hideCart(){
        cartBody.classList.remove('c-cart__visible');
        cartOverlay.classList.remove('c-cart__visible');
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        cartClose.addEventListener('click',this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item =>this.addCartItem(item));
    }
}

// Local Storage
class Storage{
    static saveProduct(products){
        localStorage.setItem("products",JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')): [];
    }
}

// Listener for DOM Content
document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    const products = new Products();
    // Setup APP

    ui.setupAPP();

    products.getProduct().then(products => {
    ui.displayProducts(products)
    Storage.saveProduct(products);
}).then(()=>{
    ui.getBagButtons();
    });
});





