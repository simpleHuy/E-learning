let paymentHistory = []; // Variable to store the payment history

// Fetch the payment history from the server
function loadPaymentHistory(isLoggedIn) {
    if (isLoggedIn) {
        paymentHistory = [];
        // If logged in, fetch payment history from the server
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/paycourses/payhistory", true);


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // On success, set payment history from the server
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        paymentHistory = data.courses; // Updated key to match server response
                        renderPaymentHistory();
                    } else {
                        alert("Failed to load payment history: " + data.message);
                    }

                } else {
                    alert("Failed to load payment history.");
                }
            }
        };

        xhr.send();
    } else {
        // If not logged in, handle it as needed (maybe show a message)
        alert("Please log in to view payment history.");
    }
}

function renderPaymentHistory() {
    const paymentHistoryContainer = document.getElementById("cart-container");
    const summaryContainer = document.getElementById("cart-summary");

    paymentHistoryContainer.innerHTML = "";

    if (paymentHistory.length === 0) {
        paymentHistoryContainer.innerHTML = `
            <div class="text-center py-8">
                <h2 class="text-2xl font-bold text-gray-600">No payment history available</h2>
                <p class="text-gray-500 text-sm mt-2">Start making payments to view your history!</p>
            </div>
        `;
    }

    paymentHistory.forEach((payment) => {
        const statusText = payment.isPaid ? 'Paid' : 'Unpaid';
        const courseStatusClass = payment.isPaid ? 'bg-green-200' : 'bg-yellow-200';

        paymentHistoryContainer.innerHTML += `
            <div class="flex items-start border-t pt-4 mb-4 px-4 ${courseStatusClass}">
                <div class="flex-1">
                    <h2 class="font-bold text-lg">Payment ID: ${payment.id}</h2>
                    <p class="text-sm text-gray-600">Date: ${payment.date}</p>
                    <p class="text-sm text-gray-600">Amount: $${payment.amount}</p>
                    <p class="text-gray-500 text-sm mt-2">Status: ${statusText}</p>
                </div>
            </div>
        `;
    });

    summaryContainer.innerHTML = `
        <p class="text-3xl font-bold text-gray-600">Total Payments: </p>
        <p class="text-2xl font-bold text-[#4f75ff]">$${calculateTotal(paymentHistory)}</p>
    `;
}


// Calculate the total of all payments
function calculateTotal(payments) {
    let total = 0;
    payments.forEach((payment) => {
        total += payment.amount;
    });
    return total;
}

// Initialize payment history on page load
window.addEventListener("DOMContentLoaded", function () {
    loadPaymentHistory(isLoggedIn);
});
