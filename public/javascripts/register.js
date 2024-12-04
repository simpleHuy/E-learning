document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn form gửi mặc định

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("passwordInput").value;
        console.log(username, email, password);
        const xhr = new XMLHttpRequest();

        // Xử lý phản hồi từ server
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Kiểm tra khi request hoàn tất
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    document.getElementById("usernameError").textContent = "";
                    document.getElementById("emailError").textContent = "";
                    document.getElementById("passwordError").textContent = "";

                    document.getElementById("registerForm").submit();
                } else {
                    const error = JSON.parse(xhr.responseText);
                    if (error.field === "username") {
                        document.getElementById("usernameError").textContent =
                            error.message;
                    }
                    if (error.field === "email") {
                        document.getElementById("emailError").textContent =
                            error.message;
                    }
                    if (error.field === "password") {
                        document.getElementById("passwordError").textContent =
                            error.message;
                    }
                }
            }
        };
        xhr.open("POST", "/validate", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify({ username, email, password }));
    });
