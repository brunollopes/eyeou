/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */





// Owl owlCarousel clientBlock JQuery
$(document).ready(function() {
    $('.loop').owlCarousel({
        // center: true,
        items: 1,
        loop: true,
        margin: 30,
        dots: true,
        autoplay: true,
        autoplayTimeout: 10000,
        autoplayHoverPause: true,
        nav: true,
        navText: ["<img src='../../assets/images/left-arrow.png'/>", "<img src='../../assets/images/arright.png'/>"],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1
            },
            768: {
                items: 2
            },
            990: {
                items: 2
            },
            1024: {
                items: 3
            }
        }
    });
});
$("#btnsuccess").on("click", function() {
    alert('helloo');
    $(".mypaypalbtn").trigger("click");
});