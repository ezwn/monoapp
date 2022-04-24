import { ReactNode } from "react";
import { File } from "../fs4webapp-client";

export interface FileTypeConfig {
    fileLabel: React.FC<{ file: File }>;
    mainView: React.FC;
    withGlobalProvider?: (node: ReactNode) => ReactNode;
}

export interface FileBasedFeature {
    fileConfigFor: (file: File) => FileTypeConfig | null;
}
