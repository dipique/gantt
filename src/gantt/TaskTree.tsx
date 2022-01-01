import { useState, useEffect } from 'react'
import { Tree } from './Tree'
import { TreeNode } from './TreeNode'

export const TaskTree = ({ tree } : { tree: Tree}) => {
    const keyHandler = (e: KeyboardEvent) => {
        console.log(e)
    }

    useEffect(() => {
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    }, []) // run once

    return <table style={{ textAlign: 'left' }}>
        <thead>
            <tr><th>Task</th></tr>
        </thead>
        <tbody>
            <TreeNode task={tree} />
        </tbody>
    </table>
}