import { Task } from './Task'

// actions that can be performed on a specific task without any additional info
export enum TaskAction {
    Indent,         // make child of previous task
    Outdent,        // make sibling of parent task
    MoveUp,         // move task up in sibling order
    MoveDown,       // move task down in sibling order
    Delete,         // delete task
    Select,         // select task
    SelectPrevious, // select previous task
    SelectNext,     // select next task
}

export enum GanttAction {
    AddTask,
}

export type ActionType = 
    | { type: TaskAction, data: Task | number }
    | { type: GanttAction.AddTask, data: { task: Task | number, parent?: Task, after?: Task } }