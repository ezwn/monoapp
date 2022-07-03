import React from 'react';
import { pathToFileUrl } from '../fs4webapp-client';

interface VideoPlayerCmpProps {
    filePath: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerCmpProps> =
    ({ filePath, onEnded = () => { }, autoPlay = false }) => (<div className="video-player-cmp">
        <video src={pathToFileUrl(filePath)} onEnded={onEnded} key={filePath} controls autoPlay={autoPlay}>
            Your browser does not support the audio element.
        </video>
        <div>Playing video: {filePath}</div>
    </div>);
