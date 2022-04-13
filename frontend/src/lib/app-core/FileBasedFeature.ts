import { File } from "../fs4webapp-client";

export interface FileTypeConfig {
    fileLabel: React.FC<{ file: File }>;
    mainView: React.FC;
}

export interface FileBasedFeature {
    fileConfigFor: (file: File) => FileTypeConfig | null;
}
