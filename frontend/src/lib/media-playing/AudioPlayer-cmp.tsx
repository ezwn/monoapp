import React from 'react';
import { pathToFileUrl } from '../fs4webapp-client';
import './AudioPlayer-cmp.css';

interface AudioPlayerCmpProps {
    filePath: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerCmpProps> =
    ({ filePath, onEnded = () => { }, autoPlay = false }) => (<div className="audio-player-cmp">
        <audio onEnded={onEnded} key={filePath} controls autoPlay={autoPlay}>
            <source src={pathToFileUrl(filePath)} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <div>Playing audio: {filePath}</div>
    </div>);
