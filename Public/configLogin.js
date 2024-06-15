document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    const loginForm = document.getElementById('loginForm');
    const adminLoginButton = document.getElementById('adminLoginButton');

    adminLoginButton.addEventListener('click', function() {
        window.location.href = '/admin';
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        socket.emit('authenticate', { username, password }, (response) => {
            if (response) {
                window.location.href = '/config';
            } else {
                alert('Invalid credentials');
            }
        });
    });
});
