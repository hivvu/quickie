const fs = require('fs');
const archiveFolder = './archive';

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

const archive = async (req, res) => {
    var archiveObj = { 'archive': '' }
    var foldersArr = [], filesArr = []

    // Get all archive folders and cycle trough them
    var folders = getDirectories(archiveFolder);
    for (const i in folders) {
        // Empty for each folder
        filesArr = [];

        // Cycle trough each file inside the current folder
        const files = fs.readdirSync(archiveFolder + '/' + folders[i])
        for (const file of files) {

            // Create new object for each file
            filesArr.push({
                'id': file.split('-')[1].split('.')[0],
                'file': file,
                'path': archiveFolder + '/' + folders[i] + '/' + file
            });
        }

        // Create new object for each folder
        foldersArr.push({
            "folder": folders[i],
            "count": files.length,
            "children": ""
        });

        // Add the files to the its folder
        foldersArr[i].children = filesArr
    }

    // Add everything to the main object
    // reverse array to show the latest firsts
    archiveObj.archive = foldersArr.reverse();

    res.status(200).send(archiveObj);
}

module.exports = archive;