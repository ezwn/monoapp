import { extractNameAndExtension } from '../fs4webapp-client';
import { AudioPlayer } from './AudioPlayer-cmp';
import { VideoPlayer } from './VideoPlayer-cmp';

import './MediaPlayer-cmp.css';

export const imageExtensions = [".jpg", ".jpeg", ".png"];
export const audioExtensions = [".mp3", ".m4b"];
export const videoExtensions = [".avi", ".mp4", ".wmv", ".mkv"];

export const mediaExtensions = [...imageExtensions, ...audioExtensions, ...videoExtensions];

export const extractMediaFileNameAndExtension = extractNameAndExtension(mediaExtensions);

interface MediaPlayerCmpProps {
    filePath: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}


export const MediaPlayerCmp: React.FC<MediaPlayerCmpProps> = ({ filePath, onEnded = () => { }, autoPlay = false }) => {
    const fileNameAndExtension = extractMediaFileNameAndExtension(filePath);

    if (!fileNameAndExtension)
        return null;

    const [, fileExtension] = fileNameAndExtension;

    let player = null;
    if (audioExtensions.includes(fileExtension))
        player = <AudioPlayer filePath={filePath} onEnded={onEnded} autoPlay={autoPlay} />;
    else if (videoExtensions.includes(fileExtension))
        player = (<VideoPlayer filePath={filePath} onEnded={onEnded} autoPlay={autoPlay} />);
    else
        return null;

    return <div className='media-player-cmp'>{player}</div>
}
