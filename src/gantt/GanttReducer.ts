import { GanttState } from './GanttState'
import { ActionType, GanttAction } from './GanttAction'
import { Task } from './Task'

export const applyChanges = <S, K extends keyof S>(state : S, changes : Pick<S, K>) : S =>
    Object.assign({}, state, changes);

export const GanttReducer = (state: GanttState, action: GanttAction): GanttState => {
    switch (action.type) {
        case ActionType.SetSelectedTask:
            return applyChanges(state, { selectedTaskId: Task.getId(action.data) })
    }
    return state
}