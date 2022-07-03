import { ReactNode } from "react";
import { FS4JFile } from "../fs4webapp-client";

export interface FileTypeConfig {
    tabTitle: (file: FS4JFile) => string;
    fileLabelCmp: React.FC<{ file: FS4JFile }>;
    mainView: React.FC;
    withGlobalProvider?: (node: ReactNode) => ReactNode;
    closable: boolean;
}

export interface FileBasedFeature {
    fileConfigFor: (file: FS4JFile) => FileTypeConfig | null;
}
