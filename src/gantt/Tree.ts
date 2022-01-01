import { Task } from './Task'

export class Tree extends Task { // represents a project
    nextId: number = 1
    constructor(projectName: string) {
        super(projectName)
        this.id = 0
    }

    add(task: Task, parent?: Task, after?: Task): Task {
        task.id = this.nextId++
        parent = parent ?? this
        task.parent = parent.id
        if (after) {
            parent.children.splice(parent.children.indexOf(after) + 1, 0, task)
        } else {
            parent.children.push(task)
        }
        return task

        // TODO: need to update duration and progress;
        //       this should probably be a recursive action
        //       for parent tasks
    }

    addChild(task: Task, parent?: Task): Task {
        return this.add(task, parent ?? this)
    }

    getById(id: number): Task {
        if (this.id === id) return this
        const result = this.getChildById(id)
        if (!result)
            throw new Error(`Task with id ${id} not found`)
        return result
    }

    resolve(task: Task | number): Task {
        if (typeof task === 'number')
            return this.getById(task)
        else
            return task
    }

    // adds a task after the specified task to the same parent
    addAfter(task: Task, after: Task): Task {
        return this.add(task, this.getById(after.parent || 0), after)
    }

    getParent(task: Task | number): Task | undefined {
        task = this.resolve(task)
        if (!task.parent) return
        return this.getById(task.parent!)
    }

    // get lineage of parents for a given task up to the root task
    // (with the root task as the last element)
    getLineage(task: Task): Task[] {
        const lineage: Task[] = []
        let current = task
        while (current) {
            lineage.push(current)
            if (current.parent)
                current = this.getParent(current)!
            else
                break;
        }
        return lineage
    }

    // TODO: need to check for dependencies
    delete(task: Task | number) {
        task = this.resolve(task)
        const parent = this.getParent(task)
        if (!parent) // cannot delete root task
            return
        parent.children.splice(parent.children.indexOf(task), 1)
    }

    update(task: Task | number, update: (task: Task) => void): Task {
        task = this.resolve(task)
        this.protectedUpdate(task, update)
        return task
    }

    // generates an error if a disallowed operation was attempted
    private protectedUpdate(task: Task, update: (task: Task) => void) {
        // save properties that can't be modified in an update
        const { id, parent, children } = task

        // update the task
        update(task)

        if (task.id !== id)
            throw new Error('Task id can\'t be modified in an update')
        
        if (task.parent !== parent)
            throw new Error('Task parent can\'t be modified in an update')
        
        if (task.children !== children)
            throw new Error('Task children can\'t be modified in an update')
    }

    // move a task one place higher in the children of the same parent
    moveUp(task: Task | number) {
        task = this.resolve(task)
        const parent = this.getParent(task)
        if (!parent) return
        const index = parent.children.indexOf(task)
        if (index === 0)
            return // can't move any higher

        // remove task from children and re-insert it at the previous index
        parent.children.splice(index, 1)
        parent.children.splice(index - 1, 0, task)
    }

    moveDown(task: Task | number) {
        task = this.resolve(task)

        const parent = this.getParent(task)
        if (!parent) return
        const index = parent.children.indexOf(task)
        if (index === parent.children.length - 1)
            return // can't move any lower

        // remove task from children and re-insert it at the next index
        parent.children.splice(index, 1)
        parent.children.splice(index + 1, 0, task)
    }
}