const socket = io();
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        socket.emit('authenticate', { username, password }, (response) => {
            if (response) {
                window.location.href = '/config';
            } else {
                alert('Login failed');
            }
        });
    });
})
