
const { REACT_APP_BE_PORT } = process.env;

export const pathToUrl = (path: string) => `http://localhost:${REACT_APP_BE_PORT}/files${path}`;

export interface File {
  name: string,
  path: string,
  isDirectory: boolean
}

export const ls = async (path: string): Promise<File[]> => {
  try {
    const response = await fetch(pathToUrl(path), {
      method: 'GET'
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loadFile = async <T>(path: string): Promise<T> => {
  const response = await fetch(pathToUrl(path));
  return await response.json();
}

export const loadFileNull = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(pathToUrl(path));
  return await response.json();
}

export const saveJSONFile = async <T>(path: string, content: T): Promise<void> => {
  try {
    fetch(pathToUrl(path), {
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

export const saveFileWithContentType = async (path: string, content: string): Promise<void> => {
  try {
    fetch(pathToUrl(path), {
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
