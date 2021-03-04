const path = require('path'),
    fs = require('fs');

function findFile(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        // Directory not found
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            // Recursive
            findFile(filename, filter, callback);
        } else if (filename.indexOf(filter) >= 0) {
            // File found
            callback(filename);
        }
    };
};

if (typeof exports !== 'undefined') {
    exports.findFile = findFile;
}