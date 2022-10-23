'use strict'

var productApi = "http://localhost:3000/products"

function start() {
    getProducts(renderProducts);

}

start();

// funtions
function getProducts(callback) {
    fetch(productApi)
        .then(function(responsive) {
            return responsive.json();
        })
        .then(callback);
}

function renderProducts(products) {
    var listProductHome = document.querySelector('.home-product .row');
    var htmls = products.map(function(product){
        var priceCurrrent = product.priceOld - product.priceOld * product.saleOff / 100;
        return `
                <div class="col-2-4" data="${product.id}">
                    <a class="home-product-item" href="product.html">
                        <div class="home-product-item__img" style="background-image: url(${product.image});"></div>
                        <div class="home-product-item__header">
                            <h4 class="home-product-item__name">${product.name}</h4>
                            <div class="home-product-item__sub-header">
                                <span class="home-product-item__installment">0% TRẢ GÓP</span>
                            </div>
                        </div>
                        <div class="home-product-item__price">
                            <span class="home-product-item__price-old">₫${product.priceOld}</span>
                            <span class="home-product-item__price-current">
                                <span class="home-product-item__price-currentcy-unit">đ</span>
                                <span class="home-product-item__price-lbl">${priceCurrrent}</span>
                            </span>
                        </div>
                        <div class="home-product-item__action">
                            <!-- no rateting: home-product-item__no-rating -->
                            <span class="home-product-item__rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </span>
                            <!-- no sold: home-product-item__sold -->
                            <span class="home-product-item__sold">Đã bán ${product.sold}</span>
                        </div>
                        <div class="home-product-item__origin">
                            <span class="home-product-item__origin-name">${product.address}</span>
                        </div>
                        <div class="home-product-item__mall">
                            <span>Mall</span>
                        </div>
                    <div class="home-product-item__sale-off">
                            <span class="home-product-item__sale-off-percent">${product.saleOff}%</span>
                            <span class="home-product-item__sale-off-label">GIẢM</span>
                        </div> 
                    </a>
                </div>  
        `;
        
    });


    console.log(htmls)

    listProductHome.innerHTML = htmls.join('');

    for(var i = 1; i<=products.length; i++){
        var select = document.querySelector('.col-2-4')
        
        ratingProduct(ratingPoint);

    }
        
    console.log(products)
}

function ratingProduct(ratingPoint) {
    const stars = document.querySelectorAll('.fa-star');
    
    for(var i = 0; i < ratingPoint-1; i++){
        console.log(ratingPoint)
        stars[i].classList.add('star-active');
        if(i >= ratingPoint) i=0;
    }
}