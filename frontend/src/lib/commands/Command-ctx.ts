import { ReactNode } from 'react';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';

export interface Command {
    shortcut: string;
    title: ReactNode;
    isAvailable(): boolean;
    execute(): void;
    group?: string;
}

export interface CommandProps {
    commands: Command[];
}

export interface CommandValue {
    commands: Command[];
};

const defaultValue: CommandValue = {
    commands: []
};

let useCommandContext2: () => CommandValue;

const useCommand: (props: CommandProps) => CommandValue = ({ commands }) => {
    const { commands: inheritedCommands } = useCommandContext2();
    return { commands: [...inheritedCommands, ...commands] };
};

const hookBasedContext = createHookBasedContext(useCommand, defaultValue);

export const CommandProvider = hookBasedContext.Provider;
export const useCommandContext = hookBasedContext.useContext;

useCommandContext2 = useCommandContext;
