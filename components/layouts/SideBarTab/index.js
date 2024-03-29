/* eslint-disable react-hooks/exhaustive-deps */
// React Libary
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Dropdown, Menu, Popconfirm, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, KeyOutlined } from '@ant-design/icons';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { accountLogout } from 'actions/accountAction';
import { fetchFriendsContactAction } from 'actions/friendAction';
import {
  deleteRoomAction,
  dispatchDefaulRoomstAction,
  getDetailGroupAction
} from 'actions/roomsAction';

// NextJS
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

//Component
const HomePage = dynamic(() => import('components/HomePage'));
const MessageRoom = dynamic(() => import('components/Chat/MessageRoom'));
const Directory = dynamic(() => import('components/Directory'));
const FriendList = dynamic(() => import('components/Directory/FriendList'));
const PhoneBook = dynamic(() => import('components/Directory/PhoneBook'));
const SearchComponent = dynamic(() => import('components/Search'));
const Update = dynamic(() => import('components/Account/Update'));
const GroupList = dynamic(() => import('components/Directory/GroupList'));
const ChangePasswordUser = dynamic(() =>
  import('components/Account/ChangePassword')
);

// Common
import { classPrefixor } from 'utils/classPrefixor';
import useFetchAllGroup from 'components/common/hook/useFetchAllGroup';
import useRenderAvatar from 'components/common/hook/useRenderAvatar';
import ManagePeopleInGroup from 'components/ManagePeople';
import { ManagePeopleGroupContext } from 'components/common/context/ManagePeopleGroupContext';
import { InfoRoomContext } from 'components/common/context/InfoRoomContext';
import InfoConversation from 'components/InfoConversation';

const prefix = 'sidebar-tab';
const c = classPrefixor(prefix);
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SideBarTab = () => {
  // react hook
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  // redux hook
  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.userData);
  const { listFriendContact } = useSelector(state => state.FriendReducer);
  const { infoRoomAfterAddUserToGroup, messageDeleteRoom } = useSelector(
    state => state.RoomsReducer
  );

  // custom hook
  const { listGroup } = useFetchAllGroup();

  // nextjs hook
  const { push } = useRouter();

  // Context
  const { clickPeopleIcon, setClickPeopleIcon, clickSideBarIcon } = useContext(
    ManagePeopleGroupContext
  );
  const {
    setStatusRoom,
    setInfoRoom,
    setLoading,
    infoRoom,
    sendMessage,
    setSendMessage
  } = useContext(InfoRoomContext);
  // variable Global
  const totalFriend = listFriendContact?.length;

  const RenderAvatarUserGroup = group => {
    const [renderAvatarUserGroup] = useRenderAvatar(
      group,
      {
        borderRadius: '50%',
        width: '35px',
        height: '35px'
      },
      '35px'
    );
    return renderAvatarUserGroup();
  };

  useEffect(() => {
    if (userProfile?.id) {
      dispatch(fetchFriendsContactAction(userProfile?.id));
    }
  }, [userProfile]);

  useEffect(() => {
    if (messageDeleteRoom?.length > 0) {
      dispatch(getDetailGroupAction(infoRoom?._id));
    }
  }, [messageDeleteRoom]);

  useEffect(() => {
    setInfoRoom(infoRoomAfterAddUserToGroup);
    dispatch(dispatchDefaulRoomstAction());
  }, [infoRoomAfterAddUserToGroup]);

  const showModal = () => {
    setVisible(true);
    setUserData(userProfile);
  };

  const cancelModal = () => {
    setVisible(false);
    setUserData(userProfile);
  };
  const onCancelPassword = () => {
    setVisiblePassword(false);
  };

  const handleDeleteRoom = idRoom => {
    dispatch(deleteRoomAction(idRoom));
  };

  const menu = id => (
    <Menu>
      <Menu.Item key="1">
        <Popconfirm
          placement="right"
          title="Bạn muốn xóa Cuộc trò chuyện này?"
          onConfirm={() => handleDeleteRoom(id)}
          okText="Yes"
          cancelText="No"
        >
          Xóa cuộc trò chuyện
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const handleClickRoom = async value => {
    setLoading(true);
    setInfoRoom(value);
    if (!value.group) {
      setStatusRoom(false);
      setLoading(false);
    } else {
      setStatusRoom(true);
      setTimeout(setLoading(false), 3000);
    }
  };

  const renderRooms = () => {
    return listGroup?.map((item, key) => {
      return (
        <>
          <TabPanel key={key}>
            <MessageRoom id={item.id} />
          </TabPanel>
        </>
      );
    });
  };

  const renderDropdownThreeDots = room => {
    return (
      <Dropdown overlay={() => menu(room._id)} trigger={['click']}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          <span className="right">
            <EllipsisOutlined />
          </span>
        </a>
      </Dropdown>
    );
  };

  //
  const renderTabSingleChat = room => {
    return room?.users.map(user => {
      if (user.id != userProfile.id) {
        return (
          <div
            key={user.id}
            className="tab_room"
            onClick={() => setClickPeopleIcon('unClickPeopleIcon')}
          >
            <div
              style={{
                width: '74px',
                display: 'inline-block'
              }}
            >
              {user?.avatar === null || user?.avatar === '' ? (
                <Avatar
                  size={64}
                  className="avatar-chat"
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {user?.name}
                </Avatar>
              ) : (
                <img
                  style={{
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    marginRight: '11px'
                  }}
                  src={user?.avatar}
                  alt="avatar"
                />
              )}
            </div>
            <div
              className="content-tab-chat"
              style={{ display: 'inline-block' }}
            >
              <p className="group__name">{user?.name}</p>
            </div>
            {renderDropdownThreeDots(room)}
          </div>
        );
      }
    });
  };

  const renderTabNameGroupRoom = room => {
    return (
      <div className="tab_room">
        <div style={{ display: 'inline-block' }}>
          <div className="avatar-group-vip-pro">
            {RenderAvatarUserGroup(room)}
          </div>
        </div>
        <div
          className="content-tab-chat_group"
          style={{ display: 'inline-block' }}
        >
          <p className="group__name_group">{room.name}</p>
        </div>
        {renderDropdownThreeDots(room)}
      </div>
    );
  };

  const renderContactRooms = () => {
    return listFriendContact?.map((item, key) => {
      return (
        <>
          <TabPanel key={key}>
            <MessageRoom id={item.id} />
          </TabPanel>
        </>
      );
    });
  };
  // Hiển thị các group và single group
  const renderNameListRoom = useCallback(() => {
    return listGroup?.map((room, key) => {
      return (
        <>
          <Tab onClick={() => handleClickRoom(room)}>
            <div className="message_tab_chat" key={key}>
              <div className="list_user_room">
                <div className="info_user_room">
                  {room.group
                    ? renderTabNameGroupRoom(room)
                    : renderTabSingleChat(room)}
                </div>
              </div>
            </div>
          </Tab>
        </>
      );
    });
  }, [listGroup]);

  // Hiển thị ra các tab với các icon tương ứng
  const renderTabsIcon = () => {
    return (
      <>
        <Tab style={{ padding: '24.5%' }}>
          <i className="fa fa-comment" style={{ fontSize: '20px' }}></i>
        </Tab>
        <Tab
          style={{ padding: '24.5%', paddingLeft: '29%' }}
          onClick={() => setClickPeopleIcon('unClickPeopleIcon')}
        >
          <i className="fa fa-address-book" style={{ fontSize: '20px' }}></i>
        </Tab>
        <div className="sign-out">
          <Button
            onClick={() => {
              dispatch(accountLogout(push));
            }}
          >
            <i className="fa fa-sign-out-alt"></i>
          </Button>
        </div>
      </>
    );
  };

  // Đây là submenu khi người dùng click vào avatar sẽ hiển thị ra
  const renderSubMenuWhenClickIconAvatar = useCallback(() => {
    return (
      <>
        <SubMenu
          className="Submenu"
          title={
            userProfile?.avatar == null ? (
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <Avatar
                  size={56}
                  style={{
                    backgroundColor: '#4287f5'
                  }}
                >
                  {userProfile?.name}
                </Avatar>
                <div className="icon-online"></div>
              </div>
            ) : (
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <img
                  src={userProfile?.avatar}
                  className="img_avatar"
                  data-reactid="23"
                  alt="null"
                />

                <div className="icon-online"></div>
              </div>
            )
          }
        >
          <MenuItemGroup className="styleMenuItem">
            <EditOutlined className="styleIcon" />
            <a target="_blank" onClick={showModal} style={{ color: 'black' }}>
              Cập nhật thông tin
            </a>
          </MenuItemGroup>
          <MenuItemGroup className="styleMenuItem">
            <KeyOutlined className="styleIcon" />
            <a
              target="_blank"
              onClick={() => setVisiblePassword(true)}
              style={{ color: 'black' }}
            >
              Đổi mật khẩu
            </a>
          </MenuItemGroup>
          <MenuItemGroup className="submenu__delete">
            <a
              target="_blank"
              style={{ color: 'red' }}
              onClick={() => {
                dispatch(accountLogout(push));
              }}
            >
              Đăng Xuất
            </a>
          </MenuItemGroup>
        </SubMenu>
      </>
    );
  }, [userProfile]);

  //Đây là tab để render ra bên cây màu xanh nè!
  const renderTabList = () => {
    return (
      <TabList className={c`tabs__tablist`}>
        <div className="tablist__content">
          <Menu className="menuUser" triggerSubMenuAction="click">
            {renderSubMenuWhenClickIconAvatar()}
          </Menu>
          {renderTabsIcon()}
        </div>
      </TabList>
    );
  };
  const renderFriend = () => {
    return listFriendContact?.map((friend, key) => {
      return (
        <Tab key={key} onClick={() => handleClickRoom(friend)}>
          <Directory elm={friend} totalFriend={totalFriend} />
        </Tab>
      );
    });
  };
  // Đây là tabpanel của các tab trong tab danh bạ điện thoại
  const renderTabPanelItemInIconPhoneBook = () => {
    return (
      <>
        <TabPanel>
          <FriendList />
        </TabPanel>
        <TabPanel>
          <PhoneBook />
        </TabPanel>
        <TabPanel>
          <GroupList />
        </TabPanel>
        {renderContactRooms()}
      </>
    );
  };

  // Đây là tab của icon danh bạ điện thoại
  const renderTabPanelInPhoneBook = () => {
    return (
      <TabPanel>
        <Tabs forceRenderTabPanel>
          <TabList className={c`tabs__tablist`}>
            <SearchComponent />
            <div className="scrollCustom">
              <Tab className="tab">
                <img
                  src="https://zalo-chat-static.zadn.vn/v1/NewFr@2x.png"
                  alt="imgAddF"
                />
                <span>Danh Sách Kết Bạn</span>
              </Tab>

              <Tab className="tab">
                <i className="fa fa-address-book"></i>
                <span>Danh Bạ Bạn Bè</span>
              </Tab>
              <Tab className="tab">
                <img
                  src="https://zalo-chat-static.zadn.vn/v1/group@2x.png"
                  alt="imgAddF"
                />
                <span>Danh Sách Nhóm</span>
              </Tab>
              <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} />
              <p
                style={{
                  marginTop: '15px',
                  textAlign: 'center',
                  color: '#1890ff',
                  fontWeight: 'bold'
                }}
              >
                Bạn bè ({totalFriend})
              </p>
              {renderFriend()}
            </div>
          </TabList>
          {renderTabPanelItemInIconPhoneBook()}
        </Tabs>
      </TabPanel>
    );
  };

  const renderTabPanelItemInIconChat = () => {
    return (
      <>
        <TabPanel>
          <HomePage />
        </TabPanel>
        {renderRooms()}
      </>
    );
  };
  const renderSelectedTab = index => {
    setSendMessage(false);
    setTabIndex(index);
  };
  // Đây là tab của icon chat
  const renderTabpanelInChatting = useCallback(() => {
    return (
      <TabPanel>
        <Tabs
          forceRenderTabPanel
          selectedIndex={sendMessage ? 1 : tabIndex}
          onSelect={index => renderSelectedTab(index)}
        >
          <TabList className={c`tabs__tablist`}>
            <SearchComponent />
            <Menu
              style={{ border: 'none' }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
            ></Menu>
            <div className="scrollCustom">
              <Tab style={{ display: 'none' }}></Tab>
              {renderNameListRoom()}
            </div>
          </TabList>
          {renderTabPanelItemInIconChat()}
        </Tabs>
      </TabPanel>
    );
  }, [renderNameListRoom, renderRooms]);

  const renderTabPanel = () => {
    return (
      <>
        {renderTabpanelInChatting()}
        {renderTabPanelInPhoneBook()}
      </>
    );
  };

  const renderTabsTree = () => {
    return (
      <>
        <secion className={`${prefix} ${clickPeopleIcon} ${clickSideBarIcon}`}>
          <Tabs
            forceRenderTabPanel
            defaultIndex={0}
            className={c`tabs`}
            selectedTabClassName="is-selected"
          >
            {renderTabList()}
            {renderTabPanel()}
          </Tabs>
          <ManagePeopleInGroup />
          <InfoConversation />
          {visible && (
            <Update
              cancelAvatar={cancelModal}
              visible={visible}
              userProfile={userData}
              setVisible={setVisible}
              setUserProfile={setUserData}
            />
          )}
          {visiblePassword && (
            <ChangePasswordUser
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              cancelPassword={onCancelPassword}
            />
          )}
        </secion>
      </>
    );
  };
  return <>{renderTabsTree()}</>;
};

export default SideBarTab;
