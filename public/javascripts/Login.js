const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');
const eyeIcon = document.getElementById('eyeIcon');

togglePassword.addEventListener('click', () => {
    // Toggle the type of the password input
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-solid fa-eye');
        eyeIcon.classList.add('fa-solid fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-solid fa-eye-slash');
        eyeIcon.classList.add('fa-solid fa-eye');
    }
});
