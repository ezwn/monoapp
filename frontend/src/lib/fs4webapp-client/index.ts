
const { REACT_APP_BE_PORT } = process.env;

export const pathToFileUrl = (path: string) => `http://${window.location.hostname}:${REACT_APP_BE_PORT}/files${path}`;
export const pathToFileUploadUrl = (path: string) => `http://${window.location.hostname}:${REACT_APP_BE_PORT}/upload_file${path}`;
export const pathToScriptUrl = (path: string) => `http://${window.location.hostname}:${REACT_APP_BE_PORT}/scripts${path}`;

export interface FS4JFile {
  name: string,
  path: string,
  isDirectory: boolean
}

export const parentPath = (path: string) => {
  const o = path.lastIndexOf("/");
  return path.substring(0, o);
}

export const ls = async (path: string): Promise<FS4JFile[]> => {
  try {
    const response = await fetch(pathToFileUrl(path), {
      method: 'GET'
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const loadTextFile = async (path: string): Promise<string> => {
  const response = await fetch(pathToFileUrl(path));
  return await response.text();
}

export const loadFile = async <T>(path: string): Promise<T> => {
  const response = await fetch(pathToFileUrl(path));
  return await response.json();
}

export const loadFileNull = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(pathToFileUrl(path));
  return await response.json();
}

export const runScript = async (path: string, content: string): Promise<string> => {
  try {
    const scriptPath = pathToScriptUrl(path);

    const result = await fetch(scriptPath, {
      method: 'POST',
      body: content,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    return await result.text();
  } catch (error) {
    throw (error);
  }
}

export const saveJSONFile = async <T>(path: string, content: T): Promise<void> => {
  try {
    await fetch(pathToFileUrl(path), {
      method: 'POST',
      body: JSON.stringify(content, null, 2),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export const uploadFile = async (path: string, file: File, onProgress: (e: ProgressEvent) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', pathToFileUploadUrl(`${path}`));

    request.upload.addEventListener('progress', onProgress);

    request.addEventListener('load', function (e) {
      console.log(request.status);
      console.log(request.response);
      resolve();
    });

    request.send(formData);
  });
}

export const uploadFiles = (path: string, files: FileList, onProgress: (e: ProgressEvent) => void): Promise<void[]> => {
  return Promise.all(Array.from(files).map(file => uploadFile(path, file, onProgress)));
}

export const saveFileWithContentType = async (path: string, content: BodyInit): Promise<void> => {
  try {
    fetch(pathToFileUrl(path), {
      method: 'POST',
      body: content,
      headers: {
        'Content-Type': 'image/octet-stream'
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export const fileToTitle = (extension: string) => (file: FS4JFile) => {
  const title = file.name.substring(0, file.name.length - extension.length);
  return title;
}

export const extractNameAndExtension = (extensions: string[]) => (name: string) => {
  const extension = extensions
    .find(extension => name.endsWith(extension));

  if (!extension)
    return undefined;

  return [name.substring(0, name.length - extension.length), extension];
}
