// This is the main file which controls communication between all the different pages
// If you don't know the difference between JavaScript and Node.js, I would recommend reading the article provided in README.md. This background will make much of this file easier to digest.

const port = 3000; // Port that the webserver will be hosted on

// Import the necessary modules
const fs = require('fs'); // Builtin Node.js module for managing files ('fs' stands for file system), used in this case to read JSON files
const express = require('express'); // Express is a web framework for Node.js that allows us to create more advanced websites, see the README file for more information
const http = require('http'); // Builtin Node.js module for creating HTTP servers
const { Server } = require('socket.io'); // Module for working with WebSockets, allowing communication between clients, here it is used to allow manual configuration of clock settings
const path = require('path'); // Builtin Node.js module for working with file and directory paths
const session = require('express-session'); // Express middleware for managing user sessions
const sharedSession = require('express-socket.io-session'); // Middleware to share sessions between Express and Socket.IO

const app = express(); // Create an instance of the Express application
const server = http.createServer(app); // Create an HTTP server using the Express app
const io = new Server(server); // Create a new instance of Socket.IO and attach it to the HTTP server
let clockData = require('./clockData.json'); // Load initial clock data from JSON file

// Middleware to parse JSON bodies
app.use(express.json());

const SimpleCrypto = require("simple-crypto-js").default;
let crypto = new SimpleCrypto("javascript-is-mid"); // Initialize SimpleCrypto with a secret key

// Read config data from JSON file
const config = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
// Read user data from JSON file
let userData;
try {
    userData = JSON.parse(fs.readFileSync('userdata.json', 'utf8')); // Parse the userdata.json file using UTF-8 encoding
    console.log('User data loaded:', userData);
} catch (err) {
    console.error('Error reading userdata.json:', err);
    userData = [];
}

// In-memory storage for admin authentication
let adminAuthenticated = false;

// Set up session management
const sessionMiddleware = session({
    secret: 'tooLazyToMakeAKey', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
});

app.use(sessionMiddleware);

// Share session with Socket.IO
io.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

// This basically tells the server to read from the "Public" file folder as the root folder
app.use(express.static(path.join(__dirname, 'Public')));

/**
 * Middleware to check if a user is authenticated. If they access /config without authenticating, they will be redirected to the login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.authenticated) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to the login page
    }
}

/**
 * Middleware to check if an admin is authenticated. If they access /add without authenticating, they will be redirected to the admin login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function isAdminAuthenticated(req, res, next) {
    if (adminAuthenticated) {
        next(); // Admin is authenticated, proceed to the next middleware
    } else {
        res.redirect('/admin'); // Admin is not authenticated, redirect to the admin login page
    }
}

// Serve the main clock page at the root URL
app.get('/', (req, res) => {
    res.redirect('/clock');
});

// Serve the main clock page at /clock URL
app.get('/clock', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'clock.html'));
});

// Serve the config page with authentication check at /config URL
app.get('/config', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'config.html'), (err) => {
        if (!err) {
            req.session.destroy(); // Destroy the session after serving the config page
        }
    });
});

// Serve the login page at /login URL
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'configLogin.html'));
});

// Serve the admin login page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'adminLogin.html'));
});

// Serve the admin add page with admin authentication check at /manage URL
app.get('/manage', isAdminAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'admin.html'));
});

/**
 * Function to log user activity.
 * @param {string} username - The username of the user.
 * @param {string} type - The type of activity.
 */
function logUserActivity(username, type) {
    const logEntry = {
        username,
        type,
        timestamp: new Date().toISOString()
    };
    let auditLog;
    try {
        auditLog = JSON.parse(fs.readFileSync('auditLog.json', 'utf8'));
    } catch (err) {
        auditLog = [];
    }
    auditLog.push(logEntry);
    fs.writeFileSync('auditLog.json', JSON.stringify(auditLog, null, 2));
}

// Listen for a connection event from a client
io.on('connection', (socket) => {
    console.log('A user connected');

    /**
     * Handle get-letter-day event from the client.
     * @param {Function} callback - The callback function to send the letter day index to the client.
     */
    socket.on('get-letter-day', (callback) => {
        callback(clockData["letter-day-index"]);
    });

    /**
     * Handle write-letter-day event from the client.
     * @param {number} value - The new letter day index.
     */
    socket.on("write-letter-day", (value) => {
        clockData["letter-day-index"] = value;
        updateClockInfo();
        io.emit('update-letter-day', value);
    });

    /**
     * Handle write-theme event from the client.
     * @param {string} theme - The new theme.
     */
    socket.on('write-theme', (theme) => {
        console.log(theme);
        io.emit('update-theme', (theme));
    });

    /**
     * Function to update clock data file.
     */
    function updateClockInfo() {
        fs.writeFile("./clockData.json", JSON.stringify(clockData), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }

    /**
     * Handle get-users event from the client.
     * @param {Function} callback - The callback function to send the encrypted user data to the client.
     */
    socket.on('get-users', (callback) => {
        console.log('get-users event received');
        console.log('Sending user data:', userData);
        let encrypted = crypto.encrypt(userData); // Encrypt the user data before sending
        callback(encrypted);
    });

    /**
     * Handle get-audit-log event from the client.
     * @param {Function} callback - The callback function to send the audit log data to the client.
     */
    socket.on('get-audit-log', (callback) => {
        console.log('get-audit-log event received');
        fs.readFile('auditLog.json', (err, data) => {
            if (err) {
                console.error('Error reading audit log:', err);
                callback([]);
                return;
            }
            try {
                const logData = JSON.parse(data);
                callback(logData);
            } catch (parseErr) {
                console.error('Error parsing audit log:', parseErr);
                callback([]);
            }
        });
    });

    /**
     * Handle admin password validation.
     * @param {Object} data - The data containing the admin password.
     * @param {Function} callback - The callback function to send the validation result to the client.
     */
    socket.on('validate-admin-password', (data, callback) => {
        if (data.password === config["adminPassword"]) {
            adminAuthenticated = true;
            callback({ valid: true });
        } else {
            callback({ valid: false });
        }
    });

    /**
     * Handle authentication request from client.
     * @param {Object} credentials - The user credentials.
     * @param {Function} callback - The callback function to send the authentication result to the client.
     */
    socket.on('authenticate', (credentials, callback) => {
        const { username, password } = credentials;
        console.log('Received credentials:', credentials);

        // Ensure userData is an array
        if (!Array.isArray(userData)) {
            console.error('userData is not an array:', userData);
            callback(false);
            return;
        }

        // Check if the provided credentials match any user
        const user = userData.find(user => user.username === username && user.password === password);

        if (user) {
            // Log user activity with type "User Login"
            logUserActivity(username, 'User Login');

            // Save the session upon successful authentication
            socket.handshake.session.authenticated = true;
            socket.handshake.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    callback(false); // Send failure response to client
                } else {
                    callback(true); // Send success response to client
                }
            });
        } else {
            callback(false); // Send failure response to client
        }
    });

    /**
     * Handle adding a new login.
     * @param {Object} newLogin - The new login credentials.
     * @param {Function} callback - The callback function to send the result to the client.
     */
    socket.on('add-login', (newLogin, callback) => {
        if (userData.find(user => user.username.toLowerCase() === newLogin.username.toLowerCase())) {
            callback(false); // Username already exists
            return;
        }
        userData.push(newLogin); // Add new login to userData array
        fs.writeFile('userdata.json', JSON.stringify(userData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to userdata.json:', err);
                callback(false);
            } else {
                callback(true); // New login added successfully
            }
        });
    });

    /**
     * Handle removing a user.
     * @param {string} username - The username of the user to be removed.
     * @param {Function} callback - The callback function to send the result to the client.
     */
    socket.on('remove-user', (username, callback) => {
        const index = userData.findIndex(user => user.username === username);
        if (index !== -1) {
            userData.splice(index, 1); // Remove user from userData array
            fs.writeFile('userdata.json', JSON.stringify(userData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to userdata.json:', err);
                    callback(false);
                } else {
                    callback(true); // User removed successfully
                }
            });
        } else {
            callback(false); // User not found
        }
    });

    // Handle disconnection event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});
