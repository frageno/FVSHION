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

// Listeners for open and close the cart
cartBtn.addEventListener('click', ()=>{
    cartBody.classList.toggle('c-cart__visible')
    cartOverlay.classList.toggle('c-cart__visible');
});

cartClose.addEventListener('click', () => {
    cartBody.classList.remove('c-cart__visible')
    cartOverlay.classList.remove('c-cart__visible');
});

// Getting elements from DOM

const productDOM = document.querySelector('.products__center');

let cart = [];
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

            <div class="col-lg-4 col-md-6 col-sm-9 py-3 py-lg-4 filter all ${product.sex} ${product.type}">

                        <div class="${product.show}">
                            <div class="products__box">
                                <img src=${product.image} class="img-fluid">
                                <i class="far fa-heart" id="heart"></i>
                            </div>
                            <div class="products__content">
                                <h5>${product.title}</h5>
                                <strong>$${product.price}</strong>
                            </div>
                            <div class="products__buttons">
                                <button class="products__btn-add">Add to cart</button>
                                <button class="products__btn-view">View</button>
                            </div>
                        </div>
            </div>

            `;

        });


        productDOM.innerHTML = result;
        // initiation count
        let count = 0;

        // Click for every heart which increase count and alsoe addind and removing class
        document.querySelectorAll('#heart').forEach(item =>{
            item.addEventListener('click', event =>{
                item.classList.toggle('fas');
                let heartCount = document.getElementById('heart-count');
                if(item.classList.contains('fas')){
                    count++;
                    heartCount.innerText = count;
                }
                else {
                    count--;
                    heartCount.innerText = count;
                }
            });

        });
    }
}

// Listener for DOM Content
document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    const products = new Products();

    products.getProduct().then(products => ui.displayProducts(products));

});





