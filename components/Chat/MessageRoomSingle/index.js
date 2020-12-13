// React Libary
import React, { useEffect } from 'react';
import { Button } from 'antd';
import ScrollToBottom from 'react-scroll-to-bottom';

//NextJS
import dynamic from 'next/dynamic';

//Common
import { classPrefixor } from 'utils/classPrefixor';
// import useChatWithSocket from 'components/common/hook/useChatWithSocket';
// import useFetchAllGroup from 'components/common/hook/useFetchAllGroup';

//Component
const InputChating = dynamic(() => import('./InputChat'));
const MessageList = dynamic(() => import('./MessageList'));
const RoomBar = dynamic(() => import('./RoomBar'));

const prefix = 'message-room';
const c = classPrefixor(prefix);
const MessageRoomSingle = ({ ...props }) => {
  const { userSingle, listRoom } = props;

  useEffect(() => {
    console.log(listRoom);
  }, [listRoom]);
  //   const { messages } = useChatWithSocket(infoRoom);

  return (
    <section className={prefix}>
      <div className={c`header`}>
        <RoomBar infoRoom={userSingle} />
      </div>
      <div className={c`content`}>
        <ScrollToBottom className="scroll-chat">
          <MessageList />
        </ScrollToBottom>
      </div>
      <div className={c`icon_chat_tab`}>
        <div className={`content__inside`}>
          <Button>
            <i className="fa fa-image"></i>
          </Button>
          <Button>
            <i className="fa fa-paperclip"></i>
          </Button>
        </div>
      </div>
      <hr style={{ background: 'rgba(0, 0, 0, 0.1)' }} />
      <InputChating />
    </section>
  );
};
export default MessageRoomSingle;
