function openNav() {
    document.getElementById("Sidenav").style.width = "200px";
}

function closeNav() {
    document.getElementById("Sidenav").style.width = "0";
}
// function logout() {
//     localStorage.removeItem("cart");
//     fetch("/logout", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({}), // You can pass any data you want in the body
//     }).catch((error) => {
//         console.error("An error occurred during logout:", error);
//     });
// }
// Load cart from localStorage

let carts = [];
function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        carts = JSON.parse(cartData);
    }
    const cartCount = document
        .querySelectorAll("#cart-count")
        .forEach((element) => {
            if (element) {
                element.innerText = carts.length;
            } else {
                console.error("Element with ID 'cart-count' not found.");
            }
        });
}
window.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);
