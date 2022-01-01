import { useState } from 'react'
import { Task } from './Task'
import { Tree } from './Tree'
import { TreeNode } from './TreeNode'

export const TaskTree = ({ tree } : { tree: Tree}) => {
    const [ selectedTaskId, setSelectedTaskId ] = useState(0)

    return <table style={{ textAlign: 'left' }}>
        <thead>
            <tr><th>Task</th></tr>
        </thead>
        <tbody>
            <TreeNode task={tree} />
        </tbody>
    </table>
}