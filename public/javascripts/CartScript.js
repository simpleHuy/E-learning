// Add to cart logic
let cart = [];
// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        cart = JSON.parse(cartData);
    }
    const cartCount = document
        .querySelectorAll("#cart-count")
        .forEach((element) => {
            if (element) {
                element.innerText = cart.length;
            } else {
                console.error("Element with ID 'cart-count' not found.");
            }
        });
}
// Call the loadCartFromLocalStorage function to load cart data when the page is loaded
window.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);
function addToCart(CourseId) {
    const existingCourse = cart.find((course) => course._id === CourseId);
    if (existingCourse) {
        console.log("Course already in cart:", existingCourse);
        alert("Course already in cart");
        return;
    }
    const xhr = new XMLHttpRequest();
    // Xử lý phản hồi từ server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // Kiểm tra khi request hoàn tất
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    console.log("Added to cart:", response.course);
                    console.log("Current cart:", cart);
                    cart.push(response.course);
                    saveCartToLocalStorage();
                    const cartCount = document
                        .querySelectorAll("#cart-count")
                        .forEach((element) => {
                            if (element) {
                                element.innerText = cart.length;
                            } else {
                                console.error(
                                    "Element with ID 'cart-count' not found."
                                );
                            }
                        });
                } else {
                    console.error("Failed to add to cart:", response);
                }
            } else {
                console.error("Request failed with status:", xhr.status);
            }
        }
    };
    xhr.open("POST", "/courses/add-to-cart", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ courseid: CourseId }));
}
