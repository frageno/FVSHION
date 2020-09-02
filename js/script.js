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
