import { useContext, useEffect } from 'react'
import { TaskAction } from './GanttAction'

import { GanttContext } from './GanttContext'
import { Tree } from './Tree'
import { TreeNode } from './TreeNode'

export const TaskTree = ({ tree } : { tree: Tree}) => {
    const { state, dispatch } = useContext(GanttContext)
    const keyHandler = (e: KeyboardEvent) => {
        e.preventDefault()
        if (e.key === 'Tab')
            if (e.shiftKey)
                dispatch({ type: TaskAction.Outdent, data: state.selectedTaskId })
            else
                dispatch({ type: TaskAction.Indent, data: state.selectedTaskId })
        
        if (e.key === 'ArrowUp')
            dispatch({ type: TaskAction.SelectPrevious, data: state.selectedTaskId })
        if (e.key === 'ArrowDown')
            dispatch({ type: TaskAction.SelectNext, data: state.selectedTaskId })
        console.log(e)
    }

    useEffect(() => {
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    }, [state])

    return <table style={{ textAlign: 'left' }}>
        <thead>
            <tr><th>Task</th></tr>
        </thead>
        <tbody>
            <TreeNode task={tree} />
        </tbody>
    </table>
}