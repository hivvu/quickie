const path = require('path'),
    fs = require('fs'),
    archiveFolder = './archive';

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

const saveQuickie = (req, res) => {
    var file = 'quickie-' + req.params.id + '.json';
    var folders = getDirectories(archiveFolder);

    for (const i in folders) {

        // Cycle trough each file inside the current folder
        try {
            //file exists, overwrite
            fs.statSync(archiveFolder + '/' + folders[i] + '/' + file);
            fs.writeFileSync(archiveFolder + '/' + folders[i] + '/' + file, JSON.stringify(req.body));

        } catch (err) {
            if (err.code === 'ENOENT') {

                // File not found, create a new one
                var d = new Date();
                var directory = d.getFullYear() + '-' + parseInt(d.getMonth() + 1);

                var finalPath = archiveFolder + '/' + directory;

                // Creates the folder and subfolder
                fs.mkdir(finalPath, { recursive: true }, (err) => {
                    if (err) throw err;
                });

                fs.writeFileSync(finalPath + '/quickie-' + req.params.id + '.json', JSON.stringify(req.body));

            }
        }
    }

    return res.status(200).send({
        'id': req.params.id,
        'status': 'OK'
    });
}

module.exports = saveQuickie;