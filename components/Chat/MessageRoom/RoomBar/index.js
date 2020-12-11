/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// React Libary
import React, { useState } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Form, Input } from 'antd';

// Redux
import { useDispatch } from 'react-redux';
import useRenderAvatar from 'components/common/hook/useRenderAvatar';
import { editRoomNameAction } from 'actions/roomsAction';

const prefix = 'room_bar';

const RoomBar = ({ ...props }) => {
  const dispatch = useDispatch();
  const { infoRoom, statusRoom } = props;
  const [clickItemEdit, setClickItemEdit] = useState(false);
  const [valueInputEditRoomName, setValueInputEditRoomName] = useState('');

  const [renderAvatarUserGroup] = useRenderAvatar(
    infoRoom,
    {
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      marginRight: '5px'
    },
    '35px'
  );
  const [form] = Form.useForm();

  console.log('infoRoom', infoRoom);

  const handleClickEditGroupName = () => {
    setClickItemEdit(true);
    form.setFieldsValue({
      name: infoRoom?.name
    });
  };

  const handleUpdateRoomName = () => {
    if (Object.keys(infoRoom).length > 0) {
      const editName = {
        name: valueInputEditRoomName
      };
      dispatch(editRoomNameAction(infoRoom?._id, editName));
    }
  };

  const onFinish = values => {
    if (Object.keys(infoRoom).length > 0) {
      dispatch(editRoomNameAction(infoRoom?._id, values));
    }
  };

  const renderRoomBarGroup = (
    <div className="content_group_room">
      <div className="room_name">
        {!clickItemEdit ? (
          <h1>{infoRoom?.name}</h1>
        ) : (
          <Form
            initialValues={{
              name: infoRoom?.name
            }}
            className="form_editName"
            onFinish={onFinish}
          >
            <Form.Item name="name">
              <Input
                onChange={e => setValueInputEditRoomName(e.target.value)}
              />
            </Form.Item>
          </Form>
        )}
        {!clickItemEdit ? (
          <EditOutlined onClick={() => handleClickEditGroupName()} />
        ) : (
          <div className="after_clickEdit">
            <CloseOutlined onClick={() => setClickItemEdit(false)} />
            <CheckOutlined onClick={() => handleUpdateRoomName()} />
          </div>
        )}
      </div>
      <div className="info_user_room">
        <div className="count_user">
          <UserOutlined />
          <span>{infoRoom?.users?.length}</span>
        </div>
      </div>
    </div>
  );

  return (
    <nav className={prefix}>
      {statusRoom ? (
        <div className="info_room">
          <div className="friend-center-item-v2">
            <div className="avatar">{renderAvatarUserGroup()}</div>
          </div>
          {renderRoomBarGroup}
        </div>
      ) : (
        <div className="info_room">
          {/* {userFind.avatar === null || userFind.avatar === '' ? (
            <Avatar size="70px" className="avatar-chat" name={userFind?.name} />
          ) : (
            <img src={userFind.avatar} alt="avatar" id="avt-user" />
          )}
          <div className="content_room">
            <h1>{userFind?.name}</h1>
            <div className="info_user_room">
              <span style={{ fontSize: '13px', color: '#99a4b0' }}>
                Các bạn là bạn bè trên Zola
              </span>
            </div>
            <div className="action">
              <Button icon={<EllipsisOutlined />}></Button>
            </div>
          </div> */}
          XXXXXXXXXXXXXX
        </div>
      )}
    </nav>
  );
};

export default RoomBar;
