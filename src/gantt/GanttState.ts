import { Tree } from './Tree'

export class GanttState {
    tree: Tree
    selectedTaskId: number = 0

    constructor(tree: Tree) {
        this.tree = tree
    }
}