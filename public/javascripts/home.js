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

let cart = []; // Biến lưu trữ giỏ hàng hiện tại

// Lấy giỏ hàng từ localStorage hoặc server
function loadCart(isLoggedIn) {
    if (isLoggedIn) {
        cart = [];
        // Nếu đã đăng nhập, lấy giỏ hàng từ server
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/cart/get", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Đã hoàn thành yêu cầu
                if (xhr.status === 200) {
                    // Thành công
                    var data = JSON.parse(xhr.responseText);
                    cart = data.courses; // Gán giỏ hàng từ server
                    localStorage.removeItem("cart"); // Xóa giỏ hàng cục bộ
                    localStorage.setItem("cart", JSON.stringify(cart)); // Lưu vào localStorage
                    const cartCount = document.getElementById("cart-count");
                    if (cartCount) {
                        cartCount.innerText = cart.length;
                    }
                } else {
                    alert("Failed to load cart from server.");
                }
            }
        };

        xhr.send();
    } else {
        // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        renderCart();
    }
}

// Đồng bộ giỏ hàng từ localStorage lên server khi đăng nhập
function syncCartToServer() {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/cart/sync", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Chuyển đổi đối tượng localCart thành chuỗi JSON
    var data = JSON.stringify({ cart: localCart });

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // Đã hoàn thành yêu cầu
            if (xhr.status === 200) {
                // Thành công
                try {
                    localStorage.removeItem("cart");
                } catch (e) {
                    console.log(e);
                }
                // Xóa giỏ hàng cục bộ sau khi đồng bộ
                loadCart(true); // Tải lại giỏ hàng từ server
            } else {
                console.log("Failed to sync cart with server.");
            }
        }
    };

    // Gửi yêu cầu
    xhr.send(data);
}
window.addEventListener("DOMContentLoaded", syncCartToServer);
