document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    const userList = document.getElementById('userList');
    const popupModal = document.getElementById('popupModal');
    const addUserModal = document.getElementById('addUserModal');
    const auditLogModal = document.getElementById('auditLogModal');
    const popupUsername = document.getElementById('popupUsername');
    const popupPassword = document.getElementById('popupPassword');
    const closeBtn = document.querySelector('.close');
    const closeAddBtn = document.querySelector('.close-add');
    const closeAuditBtn = document.querySelector('.close-audit');
    const openAddUserModalButton = document.getElementById('openAddUserModalButton');
    const viewAuditLogButton = document.getElementById('viewAuditLogButton');
    const auditLogList = document.getElementById('auditLogList');
    const configLoginButton = document.getElementById('configLoginButton');

    configLoginButton.addEventListener('click', function() {
        window.location.href = '/login';
    });

    function loadUsers() {
        console.log('Emitting get-users event');
        socket.emit('get-users', (users) => {
            console.log('Received user data:', users);
            userList.innerHTML = '';
            users.forEach((user) => {
                const li = document.createElement('li');
                li.textContent = user.username;

                const buttonContainer = document.createElement('div');

                const showPasswordButton = document.createElement('button');
                showPasswordButton.textContent = 'Show Password';
                showPasswordButton.addEventListener('click', () => {
                    popupUsername.textContent = `Username: ${user.username}`;
                    popupPassword.textContent = `Password: ${user.password}`;
                    popupModal.style.display = 'block';
                });

                const changePasswordButton = document.createElement('button');
                changePasswordButton.textContent = 'Change Password';
                changePasswordButton.addEventListener('click', () => {
                    const newPassword = prompt('Enter new password:');
                    if (newPassword) {
                        socket.emit('change-password', { username: user.username, password: newPassword }, (response) => {
                            if (response) {
                                alert('Password changed successfully');
                                loadUsers();
                            } else {
                                alert('Failed to change password');
                            }
                        });
                    }
                });

                const changeUsernameButton = document.createElement('button');
                changeUsernameButton.textContent = 'Change Username';
                changeUsernameButton.addEventListener('click', () => {
                    const newUsername = prompt('Enter new username:');
                    if (newUsername) {
                        socket.emit('change-username', { oldUsername: user.username, newUsername: newUsername }, (response) => {
                            if (response) {
                                alert('Username changed successfully');
                                loadUsers();
                            } else {
                                alert('Failed to change username');
                            }
                        });
                    }
                });

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove User';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', () => {
                    const confirmRemoval = confirm(`Are you sure you want to remove user ${user.username}?`);
                    if (confirmRemoval) {
                        socket.emit('remove-user', user.username, (response) => {
                            if (response) {
                                alert('User removed successfully');
                                loadUsers();
                            } else {
                                alert('Failed to remove user');
                            }
                        });
                    }
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
        console.log('Emitting get-audit-log event');
        socket.emit('get-audit-log', (log) => {
            console.log('Received audit log:', log);
            auditLogList.innerHTML = '';
            log.forEach((entry) => {
                const div = document.createElement('div');
                div.classList.add('audit-log-entry');

                const title = document.createElement('h3');
                title.textContent = entry.type;
                div.appendChild(title);

                const username = document.createElement('p');
                username.textContent = `Username: ${entry.username}`;
                div.appendChild(username);

                const timestamp = document.createElement('p');
                timestamp.textContent = `Timestamp: ${entry.timestamp}`;
                div.appendChild(timestamp);

                auditLogList.appendChild(div);
            });
        });
    }

    document.getElementById('addUserForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from refreshing the page
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;

        console.log('Emitting add-login event');
        socket.emit('add-login', { username: newUsername, password: newPassword }, (response) => {
            if (response) {
                alert('User added successfully');
                document.getElementById('addUserForm').reset();
                addUserModal.style.display = 'none';
                loadUsers();
            } else {
                alert('Failed to add user');
            }
        });
    });

    // Open the add user modal
    openAddUserModalButton.addEventListener('click', function() {
        addUserModal.style.display = 'block';
    });

    // Open the audit log modal
    viewAuditLogButton.addEventListener('click', function() {
        loadAuditLog();
        auditLogModal.style.display = 'block';
    });

    // Close the popup modal when the close button is clicked
    closeBtn.addEventListener('click', function() {
        popupModal.style.display = 'none';
    });

    // Close the add user modal when the close button is clicked
    closeAddBtn.addEventListener('click', function() {
        addUserModal.style.display = 'none';
    });

    // Close the audit log modal when the close button is clicked
    closeAuditBtn.addEventListener('click', function() {
        auditLogModal.style.display = 'none';
    });

    // Close the popup modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === popupModal) {
            popupModal.style.display = 'none';
        }
        if (event.target === addUserModal) {
            addUserModal.style.display = 'none';
        }
        if (event.target === auditLogModal) {
            auditLogModal.style.display = 'none';
        }
    });

    // Close modals with escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (popupModal.style.display === 'block') {
                popupModal.style.display = 'none';
            }
            if (addUserModal.style.display === 'block') {
                addUserModal.style.display = 'none';
            }
            if (auditLogModal.style.display === 'block') {
                auditLogModal.style.display = 'none';
            }
        }
    });

    loadUsers();
});
