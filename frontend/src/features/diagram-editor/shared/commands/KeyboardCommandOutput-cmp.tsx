import React from 'react';
import { Command } from './Command-ctx';
import { useKeyCommandDispatcherContext } from './KeyboardCommandDispatcher-ctx';

import './KeyboardCommandOutput-cmp.css';

export type KeyboardCommandOutputCmpProps = {};

const CandidateCmp: React.FC<{ candidate: Command }> = ({ candidate }) => <div>{candidate.title}</div>

export const KeyboardCommandOutputCmp: React.FC<KeyboardCommandOutputCmpProps> = () => {

    const { candidates } = useKeyCommandDispatcherContext();

    const uniqueCandidates = candidates.filter(candidate => !candidate.group);

    const candidateGroups = candidates
        .filter(candidate => candidate.group)
        .reduce(
            (unique: Command[], item) => unique.some(itemB => itemB.group === item.group) ? unique : [...unique, item],
            []
        );

    return <div className='candidate-list'>
        {uniqueCandidates.map(candidate => <CandidateCmp key={candidate.shortcut} candidate={candidate} />)}
        {candidateGroups.map(candidate => <CandidateCmp key={candidate.shortcut} candidate={candidate} />)}
    </div>;
}
