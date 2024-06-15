
const socket = io();
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from refreshing the page
        const adminPassword = document.getElementById('adminPassword').value;

        socket.emit('validate-admin-password', { password: adminPassword }, (response) => {
            if (response.valid) {
                window.location.href = '/manage';
            } else {
                alert('Invalid admin password');
            }
        });
    });
});