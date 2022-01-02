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
    // // break reference equivalence so updates can be triggered
    // shake(task: Task | number) {
    //     task = this.resolve(task)

    //     const lineage = this.getLineage(task)
    //     const parent = lineage[1]
    //     if (!parent) return

    //     // find task in parent's children
    //     const index = parent.children.indexOf(task)
    //     parent.children[index] = Object.assign({}, task)

    //     // const parent = this.getParent(task)
    //     // if (!parent) return

    //     // export const applyChanges = <S, K extends keyof S>(state : S, changes : Pick<S, K>) : S =>
    //     // Object.assign({}, state, changes)
    // }

    // break reference equivalence so updates can be triggered
    shake(task: Task | number): Tree {
        let lineage = this.getLineage(task).reverse() // get lineage except for current task
        // let [ _, ...lineage ] = this.getLineage(task) // get lineage except for current task
        // lineage.reverse() // reverse to root first
        let index = 0 // root
        do {
            const current = lineage[index]
            const child = lineage[index + 1]
            const childIdx = current.children.indexOf(child)
            current.children[childIdx] = Object.assign(new Task(''), child)
            current.children = current.children.slice()

        } while (index++ < (lineage.length - 1))

        return Object.assign(new Tree(''), this)


        // const parent = lineage[1]
        // if (!parent) return

        // find task in parent's children
        // const index = parent.children.indexOf(task)
        // parent.children[index] = Object.assign({}, task)

    }

    // adds a task after the specified task to the same parent
    addAfter(task: Task, after: Task): Task {
        return this.add(task, this.getById(after.parent || 0), after)
    }

    getParent(task: Task | number): Task | undefined {
        task = this.resolve(task)
        if (task.parent === undefined) return
        return this.getById(task.parent!)
    }

    // get previous task in appearance order
    getPrevious(task: Task | number): Task {
        task = this.resolve(task)

        const parent = this.getParent(task)
        if (!parent)
            return task
        const index = parent.children.indexOf(task)
        if (index === 0)
            return parent
        
        const prevSibling = parent.children[index - 1]

        // return the last child in the tree of previous sibling
        let current = prevSibling
        while (current.children.length)
            current = current.children[current.children.length - 1]
        return current
    }

    // get next task in appearance order
    getNext(task: Task | number): Task {
        task = this.resolve(task)
        let child = task

        // if it has children, get the first child
        if (child.children.length)
        return child.children[0]

        while (true) {
            // otherwise, get the next sibling
            const parent = this.getParent(child)
            if (!parent)
                return task
            const nextIndex = parent.children.indexOf(child) + 1
            if (nextIndex < parent.children.length)
                return parent.children[nextIndex]
            
            // if this is the last sibling, go to the parent and try again
            child = parent
        }
    }

    // get lineage of parents for a given task up to the root task
    // (with the root task as the last element)
    getLineage(task: Task | number): Task[] {
        task = this.resolve(task)
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
    delete(task: Task | number): Tree {
        task = this.resolve(task)
        const parent = this.getParent(task)
        if (!parent) // cannot delete root task
            return this
        parent.children.splice(parent.children.indexOf(task), 1)
        return this // return this.shake(parent)
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

    // make child of previous task
    indent(task: Task | number): Tree {
        task = this.resolve(task)
        const parent = this.getParent(task)
        if (!parent) return this

        // get index of task in children
        const index = parent.children.indexOf(task)
        if (index === 0) // if task is already the first child, can't indent
            return this

        // get the previous sibling
        const previous = parent.children[index - 1]

        // add to the end of the previous sibling's children
        previous.children.push(task)
        //previous.children.splice(0, 0, task) // insert task as first child of previous sibling

        // remove task from its parent's children
        parent.children.splice(index, 1)

        // update parent
        task.parent = previous.id

        return this // return this.shake(task)
    }

    // make sibling of parent task
    outdent(task: Task | number): Tree {
        task = this.resolve(task)
        const parent = this.getParent(task)
        if (!parent) return this
        const grandparent = this.getParent(parent)
        if (!grandparent) return this

        // get index of parent in grandparent's children        
        const index = grandparent.children.indexOf(parent)

        // add after the parent in the grandparent's children
        grandparent.children.splice(index + 1, 0, task)

        // remove task from its parent's children
        parent.children.splice(parent.children.indexOf(task), 1)

        // update parent
        task.parent = grandparent.id

        return this // return this.shake(task)
    }
}