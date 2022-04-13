import React from 'react';
import { File } from '../../lib/fs4webapp-client';
import { DiagramCmp } from './diagram/Diagram-cmp';


const extension = ".dia.json"

const mainView = () => <DiagramCmp />;

const fileLabel: React.FC<{ file: File }> = ({ file }) => <>
  {file.name.substring(0, file.name.length - extension.length)}
</>;

export const fileConfigFor = (file: File) => file.name.endsWith(extension) ? {
  fileLabel,
  mainView
} : null;
