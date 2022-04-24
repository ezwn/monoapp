import React from 'react';
import { Command } from './Command-ctx';
import { useCommandDispatcherContext } from './CommandDispatcher-ctx';

import './CommandStatusBar-cmp.css';

export type CommandStatusBarProps = {};

const CandidateCmp: React.FC<{ candidate: Command }> = ({ candidate }) => <div className='flex-1 candidate'>{candidate.title}</div>

export const CommandStatusBarCmp: React.FC<CommandStatusBarProps> = () => {

    const { sentence, candidates, enabled } = useCommandDispatcherContext();

    const uniqueCandidates = candidates.filter(candidate => !candidate.group);

    const candidateGroups = candidates
        .filter(candidate => candidate.group)
        .reduce(
            (unique: Command[], item) => unique.some(itemB => itemB.group === item.group) ? unique : [...unique, item],
            []
        );

    if (!enabled)
        return null;

    return <div className='candidate-list'>
        <div className='sentence'>{sentence}|</div>
        { !uniqueCandidates.length && !candidateGroups.length && <div className='flex-1'></div> }
        {uniqueCandidates.map(candidate => <CandidateCmp key={candidate.shortcut} candidate={candidate} />)}
        {candidateGroups.map(candidate => <CandidateCmp key={candidate.shortcut} candidate={candidate} />)}
    </div>;
}
