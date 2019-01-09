const fs = require('fs');

function readAFile() {
    fs.readFile('a file that does not exist', (err, data) => {
        if (err) {
            console.error('There was an error reading the file!', err);
            return;
        }
        // Otherwise handle the data
    });
}

//This will not work because the callback function passed to fs.readFile() is called asynchronously. By the time the callback has been called, the surrounding code (including the try { } catch (err) { } block will have already exited. Throwing an error inside the callback can crash the Node.js process in most cases. If domains are enabled, or a handler has been registered with process.on('uncaughtException'), such errors can be intercepted.
function readAFileWrongThrow() {
    try {
        fs.readFile('/some/file/that/does-not-exist', (err, data) => {
            // mistaken assumption: throwing here...
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        // This will not catch the throw!
        console.error(err);
    }
}

module.exports = readAFile;