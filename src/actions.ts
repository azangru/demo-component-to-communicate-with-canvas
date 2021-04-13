
export enum MessagingAction {
    ACTIVATE = 'activate',
    MOVE_RIGHT = 'move_right',
    MOVE_LEFT = 'move_left',
    TEXT_MOVED = 'text_moved',
    RESET = 'reset',
    CHANGE_TEXT = 'change_text'
}


type ActivateAction = {
    action: MessagingAction.ACTIVATE;
    payload: undefined
}

type MoveRightAction = {
    action: MessagingAction.MOVE_RIGHT;
    payload: undefined
}

type MoveLeftAction = {
    action: MessagingAction.MOVE_LEFT;
    payload: undefined
}

type ResetAction = {
    action: MessagingAction.RESET;
    payload: undefined
}

type ChangeTextAction = {
    action: MessagingAction.CHANGE_TEXT;
    payload: {
        text: string
      }
}

type TextMovedAction = {
    action: MessagingAction.TEXT_MOVED;
    payload: {
        x: number
    }
}

export type Message = 
    | ActivateAction
    | MoveRightAction 
    | MoveLeftAction
    | ResetAction
    | ChangeTextAction
    | TextMovedAction;



export const createMessagingAction = (message: Message) => {


    return {...message}
}