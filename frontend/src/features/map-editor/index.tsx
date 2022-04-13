import { File } from '../../lib/fs4webapp-client';
import { MapView } from './map-view/MapView-cmp';

const extension = ".map.json"

const fileLabel: React.FC<{ file: File }> = ({ file }) => <>
  {file.name.substring(0, file.name.length - extension.length)}
</>;

export const fileConfigFor = (file: File) => file.name.endsWith(extension) ? {
    mainView: MapView,
    fileLabel
} : null;