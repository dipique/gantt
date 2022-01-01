import { createContext, Dispatch } from 'react'
import { GanttAction } from './GanttAction'
import { GanttState } from './GanttState'
import { Tree } from './Tree'

const def_context = {
    state: new GanttState(new Tree('Project')),
    dispatch: (action: GanttAction) => {}
}

export const GanttContext = createContext<{
    state: GanttState
    dispatch: Dispatch<GanttAction>
}>(def_context) // dummy context to avoid null union