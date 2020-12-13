/* eslint-disable react/prop-types */
// React Libary
import Avatar from 'react-avatar';
import React from 'react';
import { Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

//Redux
// import Avatar from 'react-avatar';

const prefix = 'room_bar';

const RoomBar = ({ ...props }) => {
  const { infoRoom } = props;
  console.log(infoRoom);
  return (
    <nav className={prefix}>
      <div className="info_room">
        {infoRoom?.avatar === null || infoRoom?.avatar === '' ? (
          <Avatar size="70px" className="avatar-chat" name={infoRoom?.name} />
        ) : (
          <img src={infoRoom.avatar} alt="avatar" id="avt-user" />
        )}
        <div className="content_room">
          <h1>{infoRoom?.name}</h1>
          <div className="info_user_room">
            <span style={{ fontSize: '13px', color: '#99a4b0' }}>
              Các bạn là bạn bè trên Zola
            </span>
          </div>
          <div className="action">
            <Button icon={<EllipsisOutlined />}></Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RoomBar;
