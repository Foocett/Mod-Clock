document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  const adminLoginForm = document.getElementById("adminLoginForm");
  const configLoginButton = document.getElementById("configLoginButton");

  configLoginButton.addEventListener("click", function () {
    window.location.href = "/login";
  });

  adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const password = document.getElementById("adminPassword").value;

    socket.emit("validate-admin-password", { password }, (response) => {
      if (response.valid) {
        window.location.href = "/manage";
      } else {
        alert("Invalid admin password");
      }
    });
  });
});
