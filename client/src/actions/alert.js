import uuid from 'uuid'; //IS THIS ACTUALLY IN MY CODE?!?!?!?!
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid.v4(); //gives random long string.
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
};
