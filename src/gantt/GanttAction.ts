import { Task } from "./Task";

export enum ActionType {
    AddTask,
    SetSelectedTask,
}

export type GanttAction = 
    | { type: ActionType.AddTask, data: Task }
    | { type: ActionType.SetSelectedTask, data: Task | number }