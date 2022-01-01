import { useReducer } from 'react'
import { GanttContext } from './GanttContext'

import { GanttReducer } from './GanttReducer'
import { GanttState } from './GanttState'
import { TaskTree } from './TaskTree'
import { Tree } from './Tree'

export const Gantt = ({ tree } : { tree: Tree}) => {
    const [ state, dispatch ] = useReducer(GanttReducer, new GanttState(tree))

    return <GanttContext.Provider value={{ state, dispatch }}>
        <TaskTree tree={tree} />
    </GanttContext.Provider>
}