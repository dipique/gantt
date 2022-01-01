import { createContext, Dispatch } from 'react'
import { ActionType } from './GanttAction'
import { GanttState } from './GanttState'
import { Tree } from './Tree'

const def_context = {
    state: new GanttState(new Tree('Project')),
    dispatch: (action: ActionType) => {}
}

export const GanttContext = createContext<{
    state: GanttState
    dispatch: Dispatch<ActionType>
}>(def_context) // dummy context to avoid null union