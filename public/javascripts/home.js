const faq = document.querySelectorAll(".faq");

faq.forEach((item) => {
    const open_close = item.querySelector(".open_close");
    const detail = item.querySelector(".detail");
    const img = open_close.querySelector(".img_btn");
    open_close.addEventListener("click", () => {
        if (detail.style.display === "none") {
            detail.style.display = "block";
            img.src = "../assets/icon/close_ques.svg";
        } else {
            detail.style.display = "none";
            img.src = "../assets/icon/open_ques.svg";
        }
    });
});

// SLIDE
const carousel = document.querySelector(".carousel");
const first = carousel.querySelector(".slide").offsetWidth;
const slides = carousel.querySelectorAll(".slide").length;

const prev = document.querySelector(".next");
const next = document.querySelector(".prev");

prev.addEventListener("click", () => {
    if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
        carousel.scrollLeft = 0;
    } else {
        carousel.scrollLeft += first;
        console.log(first);
    }
});

next.addEventListener("click", () => {
    if (carousel.scrollLeft === 0) {
        carousel.scrollLeft = carousel.scrollWidth - carousel.offsetWidth;
        console.log(carousel.scrollWidth);
    } else {
        carousel.scrollLeft -= first;
        console.log(first);
    }
});
