import { GanttState } from './GanttState'
import { TaskAction, GanttAction, ActionType } from './GanttAction'
import { Task } from './Task'

export const applyChanges = <S, K extends keyof S>(state : S, changes : Pick<S, K>) : S =>
    Object.assign({}, state, changes);

export const GanttReducer = (state: GanttState, action: ActionType): GanttState => {
    switch (action.type) {
        case TaskAction.Select:
            return applyChanges(state, { selectedTaskId: Task.getId(action.data) })
    }
    return state
}