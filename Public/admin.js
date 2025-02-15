document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  const userList = document.getElementById("userList");
  const popupModal = document.getElementById("popupModal");
  const addUserModal = document.getElementById("addUserModal");
  const auditLogModal = document.getElementById("auditLogModal");
  const popupUsername = document.getElementById("popupUsername");
  const popupPassword = document.getElementById("popupPassword");
  const closeBtn = document.querySelector(".close");
  const closeAddBtn = document.querySelector(".close-add");
  const closeAuditBtn = document.querySelector(".close-audit");
  const openAddUserModalButton = document.getElementById(
    "openAddUserModalButton"
  );
  const viewAuditLogButton = document.getElementById("viewAuditLogButton");
  const auditLogList = document.getElementById("auditLogList");
  const configLoginButton = document.getElementById("configLoginButton");
  const crypto = new SimpleCrypto("javascript-is-mid");

  configLoginButton.addEventListener("click", function () {
    window.location.href = "/login";
  });

  function loadUsers() {
    console.log("Emitting get-users event");
    socket.emit("get-users", (users) => {
      users = crypto.decrypt(users);
      console.log("Received user data:", users);
      userList.innerHTML = "";
      users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = user.username;

        const buttonContainer = document.createElement("div");

        const showPasswordButton = document.createElement("button");
        showPasswordButton.classList.add("blue-gradient-hover");
        showPasswordButton.textContent = "Show Password";
        showPasswordButton.addEventListener("click", () => {
          popupUsername.textContent = `Username: ${user.username}`;
          popupPassword.textContent = `Password: ${user.password}`;
          popupModal.style.display = "block";
        });

        const changePasswordButton = document.createElement("button");
        changePasswordButton.classList.add("blue-gradient-hover");
        changePasswordButton.textContent = "Change Password";
        changePasswordButton.addEventListener("click", () => {
          createInputModal("Enter new password:", (newPassword) => {
            if (newPassword) {
              socket.emit(
                "change-password",
                { username: user.username, password: newPassword },
                (response) => {
                  if (response) {
                    alert("Password changed successfully");
                    loadUsers();
                  } else {
                    alert("Failed to change password");
                  }
                }
              );
            }
          });
        });

        const changeUsernameButton = document.createElement("button");
        changeUsernameButton.classList.add("blue-gradient-hover");
        changeUsernameButton.textContent = "Change Username";
        changeUsernameButton.addEventListener("click", () => {
          createInputModal("Enter new username:", (newUsername) => {
            if (newUsername) {
              socket.emit(
                "change-username",
                { oldUsername: user.username, newUsername: newUsername },
                (response) => {
                  if (response) {
                    alert("Username changed successfully");
                    loadUsers();
                  } else {
                    alert("Failed to change username");
                  }
                }
              );
            }
          });
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button", "red-gradient-hover");
        removeButton.textContent = "Remove User";
        removeButton.addEventListener("click", () => {
          createConfirmationModal(
            `Are you sure you want to remove user ${user.username}?`,
            () => {
              socket.emit("remove-user", user.username, (response) => {
                if (response) {
                  alert("User removed successfully");
                  loadUsers();
                } else {
                  alert("Failed to remove user");
                }
              });
            }
          );
        });

        buttonContainer.appendChild(showPasswordButton);
        buttonContainer.appendChild(changePasswordButton);
        buttonContainer.appendChild(changeUsernameButton);
        buttonContainer.appendChild(removeButton);
        li.appendChild(buttonContainer);
        userList.appendChild(li);
      });
    });
  }

  function loadAuditLog() {
    console.log("Emitting get-audit-log event");
    socket.emit("get-audit-log", (log) => {
      console.log("Received audit log:", log);
      auditLogList.innerHTML = "";
      log.forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("audit-log-entry");

        const title = document.createElement("h3");
        title.textContent = entry.type;
        div.appendChild(title);

        const username = document.createElement("p");
        username.textContent = `Username: ${entry.username}`;
        div.appendChild(username);

        const timestamp = document.createElement("p");
        timestamp.textContent = `Timestamp: ${entry.timestamp}`;
        div.appendChild(timestamp);

        auditLogList.appendChild(div);
      });
    });
  }

  document
    .getElementById("addUserForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from refreshing the page
      const newUsername = document
        .getElementById("newUsername")
        .value.toLowerCase();
      const newPassword = document.getElementById("newPassword").value;

      console.log("Emitting add-login event");
      socket.emit(
        "add-login",
        { username: newUsername, password: newPassword },
        (response) => {
          if (response) {
            alert("User added successfully");
            document.getElementById("addUserForm").reset();
            addUserModal.classList.add("slide-out");
            setTimeout(() => {
              addUserModal.style.display = "none";
              addUserModal.classList.remove("slide-out");
            }, 300);
            loadUsers();
          } else {
            alert("Failed to add user");
          }
        }
      );
    });

  // Open the add user modal
  openAddUserModalButton.addEventListener("click", function () {
    addUserModal.style.display = "block";
  });

  // Open the audit log modal
  viewAuditLogButton.addEventListener("click", function () {
    loadAuditLog();
    auditLogModal.style.display = "block";
  });

  // Close the popup modal when the close button is clicked
  closeBtn.addEventListener("click", function () {
    popupModal.classList.add("slide-out");
    setTimeout(() => {
      popupModal.style.display = "none";
      popupModal.classList.remove("slide-out");
    }, 300);
  });

  // Close the add user modal when the close button is clicked
  closeAddBtn.addEventListener("click", function () {
    addUserModal.classList.add("slide-out");
    setTimeout(() => {
      addUserModal.style.display = "none";
      addUserModal.classList.remove("slide-out");
    }, 300);
  });

  // Close the audit log modal when the close button is clicked
  closeAuditBtn.addEventListener("click", function () {
    auditLogModal.classList.add("slide-out");
    setTimeout(() => {
      auditLogModal.style.display = "none";
      auditLogModal.classList.remove("slide-out");
    }, 300);
  });

  // Close the popup modal when clicking outside of the modal content
  window.addEventListener("click", function (event) {
    if (event.target === popupModal) {
      popupModal.classList.add("slide-out");
      setTimeout(() => {
        popupModal.style.display = "none";
        popupModal.classList.remove("slide-out");
      }, 300);
    }
    if (event.target === addUserModal) {
      addUserModal.classList.add("slide-out");
      setTimeout(() => {
        addUserModal.style.display = "none";
        addUserModal.classList.remove("slide-out");
      }, 300);
    }
    if (event.target === auditLogModal) {
      auditLogModal.classList.add("slide-out");
      setTimeout(() => {
        auditLogModal.style.display = "none";
        auditLogModal.classList.remove("slide-out");
      }, 300);
    }
  });

  // Close modals with escape key
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (popupModal.style.display === "block") {
        popupModal.classList.add("slide-out");
        setTimeout(() => {
          popupModal.style.display = "none";
          popupModal.classList.remove("slide-out");
        }, 300);
      }
      if (addUserModal.style.display === "block") {
        addUserModal.classList.add("slide-out");
        setTimeout(() => {
          addUserModal.style.display = "none";
          addUserModal.classList.remove("slide-out");
        }, 300);
      }
      if (auditLogModal.style.display === "block") {
        auditLogModal.classList.add("slide-out");
        setTimeout(() => {
          auditLogModal.style.display = "none";
          auditLogModal.classList.remove("slide-out");
        }, 300);
      }
    }
  });

  function createInputModal(promptText, callback) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
            <div class="modal-content">
                <span class="close-input">&times;</span>
                <p>${promptText}</p>
                <input type="text" id="inputModalValue" required>
                <button id="inputModalSubmit" class="blue-gradient-hover">Submit</button>
            </div>
        `;
    document.body.appendChild(modal);

    const closeInput = modal.querySelector(".close-input");
    const inputModalSubmit = modal.querySelector("#inputModalSubmit");
    const inputModalValue = modal.querySelector("#inputModalValue");

    modal.style.display = "block";

    closeInput.addEventListener("click", () => {
      modal.classList.add("slide-out");
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    inputModalSubmit.addEventListener("click", () => {
      const value = inputModalValue.value;
      modal.classList.add("slide-out");
      setTimeout(() => {
        modal.remove();
        callback(value);
      }, 300);
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        modal.classList.add("slide-out");
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });

    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.add("slide-out");
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });
  }

  function createConfirmationModal(message, callback) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
            <div class="modal-content">
                <span class="close-confirmation">&times;</span>
                <p>${message}</p>
                <button id="confirmationYes" class="red-gradient-hover">Yes</button>
                <button id="confirmationNo" class="blue-gradient-hover">No</button>
            </div>
        `;
    document.body.appendChild(modal);

    const closeConfirmation = modal.querySelector(".close-confirmation");
    const confirmationYes = modal.querySelector("#confirmationYes");
    const confirmationNo = modal.querySelector("#confirmationNo");

    modal.style.display = "block";

    closeConfirmation.addEventListener("click", () => {
      modal.classList.add("slide-out");
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    confirmationYes.addEventListener("click", () => {
      modal.classList.add("slide-out");
      setTimeout(() => {
        modal.remove();
        callback();
      }, 300);
    });

    confirmationNo.addEventListener("click", () => {
      modal.classList.add("slide-out");
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        modal.classList.add("slide-out");
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });

    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.add("slide-out");
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });
  }

  loadUsers();
});
