const readdir = require('fs').promises.readdir;
const fs = require('fs');
const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
const USER_DIR_NAME = 'userFiles';
const userDir = path.join(__dirname, USER_DIR_NAME);
const userFiles = [];

function getRelativePath(filePath) {
    const pathArr = filePath.split(path.sep);
    return path.join(...pathArr.slice(pathArr.indexOf(USER_DIR_NAME)));
}

function buildDirectoryStructure(dirPath) {
    function readDirectory(currentPath) {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });
        return items.map((item) => {
            const itemPath = path.join(currentPath, item.name);
            if (item.isDirectory()) {
                return {
                    name: item.name,
                    path: getRelativePath(itemPath),
                    content: readDirectory(itemPath),
                };
            } else {
                return {
                    name: item.name,
                    path: getRelativePath(itemPath),
                };
            }
        });
    }

    return readDirectory(dirPath);
}

// const directoryStructure = buildDirectoryStructure(userDir);

app.get('/', async (req, res) => {
    // console.log(JSON.stringify(directoryStructure, null, 2));
    res.send(JSON.stringify(buildDirectoryStructure(userDir), null, 2));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
