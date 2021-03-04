const fs = require('fs'),
    archiveFolder = './archive',
    myFunctions = require('../functions/common.js');
    
const deleteQuickie = (req, res) => {
    myFunctions.findFile(archiveFolder, 'quickie-' + req.params.id + '.json', (filePath) => {
        // Remove file
        fs.unlink(filePath, (err) => {
            if (err) { throw err };

            return res.status(200).send({'status': 'ok'});
        });
    });
}

module.exports = deleteQuickie;
