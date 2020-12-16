import ROOMS_TYPE from 'constant/roomsTypes';

const initialState = {
  messageEditName: '',
  messageAddUserToGroup: '',
  infoRoomAfterAddUserToGroup: [],
  error: null
};

const RoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ROOMS_TYPE.EDIT_ROOM_NAME_SUCCESS: {
      return { ...state, messageEditName: action.payload };
    }

    case ROOMS_TYPE.ADD_USER_TO_GROUP_SUCCESS: {
      return { ...state, messageAddUserToGroup: action.payload };
    }

    case ROOMS_TYPE.GET_DETAIL_GROUP_SUCCESS: {
      return { ...state, infoRoomAfterAddUserToGroup: action.payload };
    }
    case 'DEFAULT_ROOMS_ACTION': {
      return {
        ...state,
        messageEditName: '',
        error: null
      };
    }
    case 'DEFAULT_MESSAGE_ADD_USER_TO_GROUP_ACTION': {
      return {
        ...state,
        messageAddUserToGroup: ''
      };
    }
    default:
      return { ...state };
  }
};

export default RoomsReducer;
