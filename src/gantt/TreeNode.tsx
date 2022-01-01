import { useContext, useState, useEffect } from 'react'
import { Task } from './Task'
import { GanttContext } from './GanttContext'
import { ActionType } from './GanttAction'

export const TreeNode = ({ task, indentLevel = 0 }: {
    task: Task
    indentLevel?: number
}) => {
    const { state, dispatch } = useContext(GanttContext)
    const [ selectedTxt, setSelectedTxt ] = useState('')
    useEffect(
        () => setSelectedTxt(state.selectedTaskId === task.id ? ' (selected)' : ''
    ), [ state.selectedTaskId ])

    const children = task.children.map(child => (
        <TreeNode key={child.id} task={child} indentLevel={indentLevel + 1} />
    ))
    const style = {
        paddingLeft: indentLevel * 20,
        border: '1px solid black',
    }


    return <>
        <tr key={task.id}>
            <td style={style} onClick={() => dispatch({ type: ActionType.SetSelectedTask, data: task })}>{task.text}{selectedTxt}</td>
        </tr>
        {children}
    </>
}