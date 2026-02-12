#!/usr/bin/env node

/**
 * Script to launch Live Server with fallback for SPA routing
 * This enables HTML5 History API routing to work with Live Server
 */

const liveServer = require('live-server');

const params = {
    port: 8080, // Set the port
    host: "0.0.0.0", // Listen on all addresses
    root: "./", // Set root directory
    open: true, // Open the browser
    file: "index.html", // Default file to serve for non-static routes
    wait: 1000, // Wait for changes
    logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
};

// Start the live server
liveServer.start(params);

console.log('Live Server started. Access the application at http://localhost:8080');