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

const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchCourses();
    }   
});

function searchCourses() {
    const query = searchInput.value.trim();
        if (query) {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            params.set("search", query);

            if (document.title === "Our Courses") {
                params.delete("page");
                // Perform AJAX request
                window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}?${params.toString()}`
                );
                fetchCoursesData(params);
            } else {
                // Redirect to /courses?search
                url.search = params.toString();
                window.location.href = `/courses?${params.toString()}`;
            }
        }   
}

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

