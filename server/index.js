const fs = require('fs');
const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
const USER_DIR_NAME = 'userFiles';
const userDir = path.join(__dirname, USER_DIR_NAME);
app.use(express.static(userDir));
app.use(express.json());

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
                    content: '',
                };
            }
        });
    }

    return readDirectory(dirPath);
}

function createInitialDirectory() {
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
    }
}

app.get('/files', async (req, res) => {
    res.send(JSON.stringify(buildDirectoryStructure(userDir), null, 2));
});

app.get('/file/:path', async (req, res) => {
    const filePath = path.join(__dirname, ...req.params.path.split('-'));
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        if (filePath.split('.').pop() === '.png') {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        } else {
            res.send(JSON.stringify(data));
        }
    });
});

app.put('/file/', async (req, res) => {
    const filePath = path.join(__dirname, ...req.body.path.split('-'));
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('READ FILE ERROR: ', err);
            return;
        }
        fs.writeFile(filePath, req.body.content, (err) => {
            if (err) {
                console.error('WRITE FILE ERROR: ', err);
                return;
            }
            res.send('File updated');
        });
    });
});

app.post('/file/', async (req, res) => {
    let filePath = path.join(
        __dirname,
        ...req.body.path.split('-'),
        req.body.name
    );
    if (req.body.path === '') {
        filePath = path.join(userDir, req.body.name);
    }
    const type = req.body.type;
    if (type === 'folder') {
        fs.mkdir(filePath, { recursive: true }, (err) => {
            if (err) {
                console.error('CREATE FOLDER ERROR: ', err);
                return;
            }
            res.send('Folder created');
        });
    } else {
        fs.writeFile(
            filePath + '.' + req.body.type,
            req.body.content,
            (err) => {
                if (err) {
                    console.error('CREATE FILE ERROR: ', err);
                    return;
                }
                res.send('File created');
            }
        );
    }
});

app.delete('/file/', async (req, res) => {
    const filePath = path.join(__dirname, ...req.body.path.split('-'));
    fs.rm(filePath, { recursive: true }, (err) => {
        if (err) {
            console.error('DELETE FILE ERROR: ', err);
            return;
        }
        res.send('File deleted');
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    createInitialDirectory();
});
