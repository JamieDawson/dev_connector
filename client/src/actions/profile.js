import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';

//Get current users profile (from routes/api/profile)
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me'); //token will have user id

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
//
