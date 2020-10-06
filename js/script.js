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
let cartBtn = document.querySelector('#cart');
let heartBtn = document.querySelector('#heart-cart');
let cartClose = document.querySelector('#cart-close');
let cartOverlay = document.querySelector('.c-cart__overlay');
let cartBody = document.querySelector('.c-cart');




// Getting elements from DOM

let productDOM = document.querySelector('.products__center');
let cartTotal = document.querySelector('#c-cart__total');
let cartCount = document.querySelector('#cart-count');
let cartContent = document.querySelector('.c-cart__item');

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
                                <button class="products__btn-view" data-id=${product.id}>View</button>
                            </div>

                        </div>
            </div>

            `;

        });


        productDOM.innerHTML = result;

    }
    // Display info about single product after clicked view btn
    showSingleProduct(products){
        let viewBtn = [...document.querySelectorAll('.products__btn-view')];
        let viewBody = document.querySelector('.item__view');
        let viewOverlay = document.querySelector('.item__overlay');
        let viewContent = document.querySelector('.item__body');
        let display = '';
        

        viewBtn.forEach(button => {
            button.addEventListener('click', ()=>{
                viewBody.classList.add('item__show');
                viewOverlay.classList.add('item__show');
                let id = button.dataset.id;
                products.forEach(product => {
                    if( id === product.id){
                       
                            display = `
                            <div class="container-fluid py-5">
                            <div class="container py-5">
                            <div class="row">
                                <div class="col-lg-6 item">
                                    <img src=${product.image} class="img-fluid">
                                </div>
                                <div class="col-lg-6 item__second-column">
                                    <h4 class="item__heading">${product.title}</h4>
                                    <h4 class="item__price">Price $${product.price}</h4>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, magni mollitia maiores distinctio, dignissimos, fugiat minus cupiditate reprehenderit deserunt quaerat eligendi expedita!</p>
                                    
                                    <div class="">
                                        <select id="">
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>
                                        
                                        <button class="item__btn-add" id="add" data-id=${product.id}>Add to cart</button>
                                        
                                </div>
                            </div>
                            <div class="item__back-arr">
                            <i class="far fa-arrow-alt-circle-up fa-2x" id="close-info"></i>
                            </div>
                            </div> 
                        </div>
                            `
                    };
                        
                    
                    
                }); 
             
                viewContent.innerHTML = display; 
                this.getBagButtons();
                

                // Close the modal with info about the product
                let closeBtn = [...document.querySelectorAll('#close-info')];
                closeBtn.forEach(button=>{
                    button.addEventListener('click', ()=>{
                        viewBody.classList.remove('item__show');
                        viewOverlay.classList.remove('item__show');
                    })
                });
                    
                        
            }); 
            
                    
        });
        
            
    }
    
    
    
    // Method which allow us add product to cart and change some styles of button
    getBagButtons(){
        const btns = [...document.querySelectorAll('#add')];
        buttonsDOM = btns;
        btns.forEach(button=>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){ 
                button.style.color = "#000";
                button.style.pointerEvents = 'none';
                button.innerText = "In Bag";
                button.disabled = true;

            }
            else {

                button.addEventListener('click', (event)=>{
                    event.target.style.pointerEvents = 'none';
                    event.target.style.color = "#000";
                    event.target.innerText = 'In Bag';
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
                <div>
                <i class="fas fa-arrow-circle-left" data-id=${item.id}></i>
                <span class="item-amount">${item.amount}</span>
                <i class="fas fa-arrow-circle-right" data-id=${item.id}></i>
                </div>
                <span class="remove-item d-block" data-id=${item.id}>Remove</span>
                
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
    cartLogic(){
        // clear cart button
        let clearCartBtn = document.querySelector('.c-cart__clear');
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener('click', event =>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
                
            }
            else if (event.target.classList.contains('fa-arrow-circle-right')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.previousElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains('fa-arrow-circle-left')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.nextElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
            
        }
        
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerText = `Add to cart`;
        button.style.pointerEvents = 'auto';

        
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
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
    ui.displayProducts(products);
    ui.showSingleProduct(products);
    Storage.saveProduct(products);
}).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
    });
        
    
});





