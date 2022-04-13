import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";

const { BE_PORT } = process.env;

const app = express();
const port = parseInt(BE_PORT || "8080", 10);
const dataPath = "/home/nicolas/Data/synchronized-data";
const endpointMapping = "/files";

app.use(bodyParser.urlencoded({ type: 'image/png', extended: false, limit: '50mb' }));
app.use(bodyParser.urlencoded({ type: 'image/jpeg', extended: false, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'image/octet-stream' }));
app.use(express.static('public'));
app.use(cors());

const extractPath = (req: express.Request) => decodeURIComponent(req.path.substring(endpointMapping.length));

const clientPathToFSPath = (path: string) => `${dataPath}${path}`;

app.get("*", (req, res) => {
  const urlPath = extractPath(req);
  const fileFsPath = clientPathToFSPath(urlPath);
  const stats = fs.lstatSync(fileFsPath);

  if (stats.isFile()) {
    res.sendFile(fileFsPath);
  } else if (stats.isDirectory()) {
    res.send(
      fs.readdirSync(fileFsPath)
        .filter(name => !name.startsWith("."))
        .map(name => ({
          name,
          path: `${extractPath(req)}/${name}`
        }))
        .map(({ name, path }) => ({
          name,
          path,
          isDirectory: fs.lstatSync(clientPathToFSPath(path)).isDirectory()
        }))
    );
  }
});

app.post("*", (req, res) => {
  const urlPath = extractPath(req);
  const fileFsPath = clientPathToFSPath(urlPath);

  if (req.header("content-type") === "image/octet-stream") {
    fs.writeFile(
      fileFsPath,
      req.body,
      'base64',
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } else {
    fs.writeFileSync(
      fileFsPath,
      req.body
    );
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`FS4WebApp mounted at http://localhost:${port}${endpointMapping}`);
});
