import USER_TYPE from 'constant/userTypes';
import axiosServices from 'utils/service/axiosServices';
import jwt_decode from 'jwt-decode';
import { userService } from 'services';
const prefix = 'users/';
export const getProfileUser = auth_token => dispatch => {
  dispatch({
    type: USER_TYPE.GET_DATA_USER_REQUEST
  });
  const type = JSON.parse(localStorage.getItem('type'));
  let decoded = null;
  if (auth_token) decoded = jwt_decode(auth_token.accessToken);
  const value = decoded?.data?.phone || decoded?.data?.email;
  return axiosServices.get(`${prefix}detail?${type}=${value}`).then(res => {
    const { error, data } = res.data;
    if (error) {
      dispatch({
        type: USER_TYPE.GET_DATA_USER_FAILURE
      });
      return error;
    }
    if (!error) {
      dispatch({
        type: USER_TYPE.GET_DATA_USER_SUCCESS,
        payload: data
      });
    }
  });
};
export const updateProfileUser = dataDispatch => async dispatch => {
  dispatch({
    type: USER_TYPE.UPDATE_USER_REQUEST
  });
  return userService
    .updateProfileUserService(dataDispatch)
    .then(res => {
      const { error } = res.data;
      if (!error) {
        dispatch({
          type: USER_TYPE.UPDATE_USER_SUCCESS,
          payload: dataDispatch
        });
      }
    })
    .catch(err => {
      const { error, data, message } = err.response?.data;
      dispatch({
        type: USER_TYPE.UPDATE_USER_FAILURE
      });
      return { error, data, message };
    });
};
export const updateOtpUser = dataDispatch => dispatch => {
  dispatch({
    type: USER_TYPE.UPDATE_USER_REQUEST
  });
  return userService
    .updateOtpUserService(dataDispatch)
    .then(res => {
      const { error, message } = res.data;
      if (!error) {
        dispatch({
          type: USER_TYPE.UPDATE_USER_SUCCESS
        });
      }
      return { message };
    })
    .catch(err => {
      const { error, data, message } = err.response?.data;
      dispatch({
        type: USER_TYPE.UPDATE_USER_FAILURE
      });
      return { error, data, message };
    });
};
