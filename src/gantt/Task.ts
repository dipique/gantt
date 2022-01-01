import { Tree } from './Tree'

export class Task {
    id?          : number
    text         : string   = ''
    children     : Task[]   = []
    start_date?  : Date
    duration     : number   = 1 // in days
    progress     : number   = 0
    parent?      : number
    dependencies : number[] = [] // task ids

    constructor(text: string) {
        this.text = text
    }

    static getId(task: Task | number): number {
        if (typeof task === 'number') return task
        return task.id!
    }

    isMilestone() {
        return !!this.duration
    }

    isComplete(): boolean {
        return this.progress >= 100
    }

    getChildById(id: number): Task | undefined {
        for (const child of this.children) {
            if (child.id === id) return child
            const result = child.getChildById(id)
            if (result) return result
        }
    }

    getDependencies(tree: Tree): Task[] {
        return this.dependencies.map(id => tree.getById(id))
    }
}