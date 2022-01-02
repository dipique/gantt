import { GanttState } from './GanttState'
import { TaskAction, GanttAction, ActionType } from './GanttAction'
import { Task } from './Task'

export const applyChanges = <S, K extends keyof S>(state : S, changes : Pick<S, K>) : S =>
    Object.assign({}, state, changes)

export const GanttReducer = (state: GanttState, action: ActionType): GanttState => {
    switch (action.type) {
        case TaskAction.Select:
            return applyChanges(state, { selectedTaskId: Task.getId(action.data) })
        case TaskAction.Indent:
            return applyChanges(state, { tree: state.tree.indent(action.data) })
        case TaskAction.Outdent:
            return applyChanges(state, { tree: state.tree.outdent(action.data) })
        case TaskAction.MoveUp:
            state.tree.moveUp(action.data)
            return state
        case TaskAction.MoveDown:
            state.tree.moveDown(action.data)
            return state
        case TaskAction.Delete:
            state.tree.delete(action.data)
            return state
        case TaskAction.SelectNext:
            return applyChanges(state, { selectedTaskId: state.tree.getNext(action.data).id! })
        case TaskAction.SelectPrevious:
            return applyChanges(state, { selectedTaskId: state.tree.getPrevious(action.data).id! })
        default: return state
    }
}