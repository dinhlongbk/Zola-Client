import { MESSAGE_TYPE } from 'constant/messageType';

const initialState = {
  paginator: null,
  messageRooms: [],
  loading: false,
  infoMessRoom: []
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    //DELETE friend Contact
    case MESSAGE_TYPE.FETCH_LIST_MESSAGE_REQUEST: {
      return { ...state, loading: true };
    }
    case MESSAGE_TYPE.FETCH_LIST_MESSAGE_SUCCESS: {
      return {
        ...state,
        messageRooms: action.payload.messageRooms,
        paginator: action.payload.paginator
      };
    }
    case MESSAGE_TYPE.FETCH_LIST_MESSAGE_FAILURE: {
      return { ...state, loading: false };
    }
    case MESSAGE_TYPE.GET_INFO_MESSAGE_ROOM_SUCCESS: {
      return {
        ...state,
        infoMessRoom: action.payload
      };
    }
    default:
      return state;
  }
};
export default messageReducer;
