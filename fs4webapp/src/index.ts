import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { exec } from "child_process";
import multer from "multer";

const { BE_PORT, BE_DATAPATH } = process.env;

const app = express();
const port = parseInt(BE_PORT || "80", 10);
const dataPath = BE_DATAPATH || "/var/monoapp";
const fileEndpointMapping = "/files";
const scriptEndpointMapping = "/scripts";
const uploadFileEndpointMapping = "/upload_file";

const tmpDir = ".tmp";

const upload = multer({ dest: `${dataPath}/${tmpDir}` });

app.use(bodyParser.urlencoded({ type: 'image/png', extended: false, limit: '100mb' }));
app.use(bodyParser.urlencoded({ type: 'image/jpeg', extended: false, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.text({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'image/octet-stream' }));
app.use(express.static('public'));
app.use(cors());

const extractFilePath = (req: express.Request) => decodeURIComponent(req.path.substring(fileEndpointMapping.length));
const extractFileUploadPath = (req: express.Request) => decodeURIComponent(req.path.substring(uploadFileEndpointMapping.length));
const extractScriptPath = (req: express.Request) => decodeURIComponent(req.path.substring(scriptEndpointMapping.length));

const clientPathToFSPath = (path: string) => `${dataPath}${path}`;

app.get("/files*", (req, res) => {
  const urlPath = extractFilePath(req);
  const fileFsPath = clientPathToFSPath(urlPath);
  fs.lstat(fileFsPath, (errA, stats) => {

    if (errA) {
      res.sendStatus(500);
      return;
    }

    if (stats.isFile()) {
      res.sendFile(fileFsPath);
    } else if (stats.isDirectory()) {
      fs.readdir(fileFsPath, (errB, names) => {

        if (errB) {
          res.sendStatus(500);
          return;
        }

        res.send(names.filter(name => !name.startsWith(".") && name !== "lost+found")
          .map(name => ({
            name,
            path: `${extractFilePath(req)}/${name}`
          }))
          .map(({ name, path }) => ({
            name,
            path,
            isDirectory: fs.lstatSync(clientPathToFSPath(path)).isDirectory()
          }))
        );
      });
    }
  });

});

const imageExtensions = [".jpg", ".jpeg", ".png"];
const audioExtensions = [".mp3", ".m4b"];
const videoExtensions = [".avi", ".mp4", ".wmv", ".mkv"];
const knownExtensions = [...audioExtensions, ...videoExtensions, ...imageExtensions];

const unwantedSubstrings = [
  "Official Music Video",
  "Official Video",
  "BDRip",
  "DVDRip",
  "XviD",
  "X264"
];

const fixFileName = (filename: string) => {
  const knownExtension = knownExtensions.find(ext => filename.endsWith(ext));

  if (knownExtension) {
    const name = filename.substring(0, filename.length - knownExtension.length);

    let lematizedName = name
      .replace(/[_\.]/g, " ")
      .replace(/([^ ])[-]([^ ])/g, "$1 $2")
      .toLocaleLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase())
    ;

    unwantedSubstrings.forEach(sentence => lematizedName = lematizedName.replace(sentence, ""))

    return lematizedName.replace(/[ ]+/, " ").trim() + knownExtension;
  } else {
    return filename;
  }
}

app.post("/upload_file/*", upload.single("file"), (req, res) => {
  const urlPath = extractFileUploadPath(req);
  const fileFsPath = clientPathToFSPath(urlPath);

  const { path, originalname } = req.file as { path: string, originalname: string };

  const fixedFileName = fixFileName(originalname);

  fs.rename(path, `${fileFsPath}/${fixedFileName}`, () => {
    console.log(`${fixedFileName} ready.`)
    res.sendStatus(200);
  });
});

app.post("/files*", (req, res) => {
  const urlPath = extractFilePath(req);
  const fileFsPath = clientPathToFSPath(urlPath);

  if (req.header("content-type") === "image/octet-stream") {
    fs.writeFile(
      fileFsPath,
      req.body,
      'base64',
      (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      }
    );
  } else {
    fs.writeFile(
      fileFsPath,
      req.body,
      (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      }
    );
  }
});

app.post("/scripts*", (req, res) => {
  const urlPath = extractScriptPath(req);
  const fileFsPath = clientPathToFSPath(urlPath);

  const script = `cd ${fileFsPath}\n${req.body}`;
  console.log("---");
  console.log(script);

  exec(script, (error, stdout, stderr) => {
    if (error !== null) {
      console.log(`exec error: ${error}`);
      res.send(stderr);
    } else {
      res.send(stdout);
    }
  });

});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`FS4WebApp mounted at http://localhost:${port}${fileEndpointMapping}`);
});
