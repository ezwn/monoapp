import debounce from "debounce";
import { FS4JFile, parentPath, runScript } from "../fs4webapp-client";

const enableGit = true;

export const pushState = async (file: FS4JFile | null, message: string): Promise<void> => {
  if (!file)
    return;

  const path = file.isDirectory ? file.path : parentPath(file.path);

  if (enableGit) {
    const response = await runScript(path, [
      `git add "${file.name}"`,
      `git commit -m "${message}"`
    ].join("\n"));

    console.log(response);
  }
};

export const pushStateShortDebounced = debounce(pushState, 400);
export const pushStateLongDebounced = debounce(pushState, 800);

export const popState = async (file: FS4JFile | null): Promise<void> => {
  if (!file)
    return;

  const path = file.isDirectory ? file.path : parentPath(file.path);

  if (enableGit) {
    const response = await runScript(path, [
      "git reset --hard HEAD~1"
    ].join("\n"));

    console.log(response);
  }
}
