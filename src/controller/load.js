const path = require('path'),
    fs = require('fs'),
    archiveFolder = './archive';

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
        }
        else if (filename.indexOf(filter) >= 0) {
            // File found
            callback(filename);
        };
    };
};

const loadQuickie = async (req, res) => {
    findFile(archiveFolder, 'quickie-' + req.params.id + '.json', (filePath) => {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) { throw err };

            res.send(data);
        });
    });
}

module.exports = loadQuickie;

// const fs = require('fs'),
//     archiveFolder = './archive',
//     myFunctions = require('../functions/common.js');

// const loadQuickie = async (req, res) => {
//     myFunctions.findFile(archiveFolder, 'quickie-' + req.params.id + '.json', (filePath) => {
//         fs.readFile(filePath, 'utf8', function (err, data) {
//             if (err) { throw err };

//             return res.send(data);
//         });
//     });
// }

// module.exports = loadQuickie;