// Lấy dữ liệu từ local storage
// const cart = JSON.parse(localStorage.getItem("cart")) || [];

function calculateDiscount(price, sale) {
    return Math.floor(price * (1 - sale / 100));
}

function calculateTotal(cart) {
    let total = 0;
    cart.forEach((item) => {
        total += calculateDiscount(item.Price, item.Sale);
    });
    return total;
}

function calculateSaved(cart) {
    let saved = 0;
    cart.forEach((item) => {
        saved += item.Price - calculateDiscount(item.Price, item.Sale);
    });
    return saved;
}
//Login sẽ chuyển hết từ local storage sang database rồi xóa local storage
//Add to cart chuyển vào local storage, khi vào cart nếu login sẽ sync và load từ database

// function renderCart() {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const cartCount = document.getElementById("cart-count");
//     if (cartCount) {
//         cartCount.innerText = cart.length;
//     } else {
//         console.error("Element with ID 'cart-count' not found.");
//     }
//     const cartContainer = document.getElementById("cart-container");
//     const summaryContainer = document.getElementById("cart-summary");

//     cartContainer.innerHTML = "";

//     if (cart.length === 0) {
//         cartContainer.innerHTML = `
//             <div class="text-center py-8">
//                 <h2 class="text-2xl font-bold text-gray-600">Your cart is empty</h2>
//                 <p class="text-gray-500 text-sm mt-2">Browse our courses and start learning today!</p>
//                 <a href="/courses" class="mt-4 inline-block bg-[#4f75ff] text-white px-8 py-3 rounded-md">
//                     Explore Courses
//                 </a>
//             </div>
//         `;
//     }

//     cart.forEach((course) => {
//         const discountPrice = calculateDiscount(course.Price, course.Sale);

//         cartContainer.innerHTML += `
//             <div class="flex items-start border-t pt-4 mb-4">
//                 <!-- Hình ảnh khóa học -->
//                 <img src="${course.Img}" alt="${course.Title}" class="w-24 h-24 rounded object-cover mr-4">

//                 <!-- Thông tin khóa học -->
//                 <div class="flex-1">
//                     <h2 class="font-bold text-lg">${course.Title}</h2>
//                     <p class="text-sm text-gray-600">By ${course.Lecturer}</p>
//                     <div class="flex items-center text-yellow-500 mt-2">
//                         <span class="font-semibold">${course.Rate}</span>
//                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 .587l3.668 7.431 8.208 1.192-5.916 5.773 1.396 8.153L12 18.896l-7.356 3.87 1.396-8.153-5.916-5.773 8.208-1.192z" />
//                         </svg>
//                         <span class="text-gray-500 text-xs ml-2">(${course.Rate} ratings)</span>
//                     </div>
//                     <p class="text-gray-600 text-sm mt-1">${course.ShortDesc}</p>
//                     <p class="text-gray-500 text-sm mt-2">
//                         ${course.Duration} total hours • ${course.Modules.length} lectures • ${course.Level}
//                     </p>
//                 </div>

//                 <!-- Giá và nút hành động -->
//                 <div class="text-right">
//                     <p class="font-bold text-lg text-[#4f75ff]">
//                        $${discountPrice}
//                     </p>
//                     <p class="text-gray-500 line-through text-sm">$${course.Price}</p>
//                     <button class="text-[#4f75ff] hover:underline text-sm" onclick="removeFromCart('${course._id}')">Remove</button>
//                 </div>
//             </div>
//         `;
//     });

//     summaryContainer.innerHTML = `
//         <p class="text-3xl font-bold text-gray-600">Total: </p>
//         <p class="text-2xl font-bold text-[#4f75ff]">$${calculateTotal(
//             cart
//         )}</p>
//         <p class="text-md text-gray-500">You saved $${calculateSaved(
//             cart
//         )} on this order</p>
//         <button class="bg-[#4f75ff] text-lg text-white w-full px-8 py-3 rounded-md mt-4">Checkout</button>
//     `;
// }

// function removeFromCart(courseId) {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const updatedCart = cart.filter((item) => item._id !== courseId);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     console.log(cart, updatedCart);
//     renderCart();
// }
// document.addEventListener("DOMContentLoaded", renderCart);
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
                    renderCart();
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
    if (localCart.length > 0) {
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
                    alert("Cart synced with server!");
                    loadCart(true); // Tải lại giỏ hàng từ server
                } else {
                    alert("Failed to sync cart with server.");
                }
            }
        };

        // Gửi yêu cầu
        xhr.send(data);
    }
}

// Render giỏ hàng
function renderCart() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = cart.length;
    } else {
        console.error("Element with ID 'cart-count' not found.");
    }
    const cartContainer = document.getElementById("cart-container");
    const summaryContainer = document.getElementById("cart-summary");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-8">
                <h2 class="text-2xl font-bold text-gray-600">Your cart is empty</h2>
                <p class="text-gray-500 text-sm mt-2">Browse our courses and start learning today!</p>
                <a href="/courses" class="mt-4 inline-block bg-[#4f75ff] text-white px-8 py-3 rounded-md">
                    Explore Courses
                </a>
            </div>
        `;
    }

    cart.forEach((course) => {
        const discountPrice = calculateDiscount(course.Price, course.Sale);

        cartContainer.innerHTML += `
            <div class="flex items-start border-t pt-4 mb-4 px-4">
                <!-- Hình ảnh khóa học -->
                <img src="${course.Img}" alt="${course.Title}" class="w-24 h-24 rounded object-cover mr-4">
                
                <!-- Thông tin khóa học -->
                <div class="flex-1">
                    <h2 class="font-bold text-lg">${course.Title}</h2>
                    <p class="text-sm text-gray-600">By ${course.Lecturer}</p>
                    <div class="flex items-center text-yellow-500 mt-2">
                        <span class="font-semibold">${course.Rate}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .587l3.668 7.431 8.208 1.192-5.916 5.773 1.396 8.153L12 18.896l-7.356 3.87 1.396-8.153-5.916-5.773 8.208-1.192z" />
                        </svg>
                        <span class="text-gray-500 text-xs ml-2">(${course.Rate} ratings)</span>
                    </div>
                    <p class="text-gray-600 text-sm mt-1">${course.ShortDesc}</p>
                    <p class="text-gray-500 text-sm mt-2">
                        ${course.Duration} total hours • ${course.Modules.length} lectures • ${course.Level}
                    </p>
                </div>
                
                <!-- Giá và nút hành động -->
                <div class="text-right">
                    <p class="font-bold text-lg text-[#4f75ff]">
                       $${discountPrice}
                    </p>
                    <p class="text-gray-500 line-through text-sm">$${course.Price}</p>
                    <button class="text-[#4f75ff] hover:underline text-sm" onclick="removeFromCart('${course._id}')">Remove</button>
                </div>
            </div>
        `;
    });

    summaryContainer.innerHTML = `
        <p class="text-3xl font-bold text-gray-600">Total: </p>
        <p class="text-2xl font-bold text-[#4f75ff]">$${calculateTotal(
            cart
        )}</p>
        <p class="text-md text-gray-500">You saved $${calculateSaved(
            cart
        )} on this order</p>
        <button class="bg-[#4f75ff] text-lg text-white w-full px-8 py-3 rounded-md mt-4"    onclick="window.location.href='/paycourses'">Checkout</button>
    `;
}

// Xóa khóa học khỏi giỏ hàng
function removeFromCart(courseId) {
    if (isLoggedIn) {
        // Nếu đã đăng nhập, gửi yêu cầu DELETE lên server
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", `/cart/remove/${courseId}`, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Đã hoàn thành yêu cầu
                if (xhr.status === 200) {
                    // Thành công
                    // Cập nhật giỏ hàng trên client
                    cart = cart.filter((item) => item._id !== courseId);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                } else {
                    alert("Failed to remove item from cart.");
                }
            }
        };
        xhr.send();
    } else {
        // Nếu chưa đăng nhập, xóa khỏi localStorage
        cart = cart.filter((item) => item._id !== courseId);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

// Khởi tạo giỏ hàng khi tải trang
window.addEventListener("DOMContentLoaded", function () {
    console.log(isLoggedIn);
    if (isLoggedIn) syncCartToServer();
    loadCart(isLoggedIn);
});
