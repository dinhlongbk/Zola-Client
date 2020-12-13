/* eslint-disable react-hooks/exhaustive-deps */
// React Libary
import React, { useState, useCallback, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import { EditOutlined, EllipsisOutlined, KeyOutlined } from '@ant-design/icons';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { accountLogout } from 'actions/accountAction';

// NextJS
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

//Component
const HomePage = dynamic(() => import('components/HomePage'));
const MessageRoom = dynamic(() => import('components/Chat/MessageRoom'));
// const Directory = dynamic(() => import('components/Directory'));
const FriendList = dynamic(() => import('components/Directory/FriendList'));
const PhoneBook = dynamic(() => import('components/Directory/PhoneBook'));
const SearchComponent = dynamic(() => import('components/Search'));
const Update = dynamic(() => import('components/Account/Update'));
const GroupList = dynamic(() => import('components/Directory/GroupList'));
const MessageRoomSingle = dynamic(() =>
  import('components/Chat/MessageRoomSingle')
);

const ChangePasswordUser = dynamic(() =>
  import('components/Account/ChangePassword')
);

// Common
import { classPrefixor } from 'utils/classPrefixor';
import useFetchAllGroup from 'components/common/hook/useFetchAllGroup';
import Avatar from 'react-avatar';
import useRenderAvatar from 'components/common/hook/useRenderAvatar';
import {
  dispatchDefaultAction,
  fetchFriendsContactAction
} from 'actions/friendAction';
import { findUserByIdAction } from 'actions/userAction';
// import MessageRoomSingle from 'components/Chat/MessageRoom/MessageRoomSingle';

const prefix = 'sidebar-tab';
const c = classPrefixor(prefix);
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SideBarTab = () => {
  // react hook
  const [infoRoom, setInfoRoom] = useState({});
  const [statusRoom, setStatusRoom] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // redux hook
  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.userData);
  useEffect(() => {
    if (userProfile?.id) {
      dispatch(fetchFriendsContactAction(userProfile?.id));
    }
  }, [userProfile]);
  const { listFriendContact, messageDeletePhoneContact } = useSelector(
    state => state.FriendReducer
  );
  // custom hook
  const { listGroup } = useFetchAllGroup();
  let totalFriend = listFriendContact?.length;
  //
  useEffect(() => {
    if (messageDeletePhoneContact?.length > 0) {
      toast.success(`${messageDeletePhoneContact}`, {
        position: 'top-right',
        autoClose: 2000
      });
      dispatch(fetchFriendsContactAction(userProfile.id));
    }
    dispatch(dispatchDefaultAction());
  }, [messageDeletePhoneContact]);

  const handleDeleteFriend = userIDWantDelete => {
    if (userProfile.id) {
      dispatch(deleteFriendContactAction(userProfile.id, userIDWantDelete));
      totalFriend -= 1;
    }
  };
  const getUserById = id => {
    dispatch(findUserByIdAction(id)).then(res => {
      setUserData(res.data);
      setVisible(true);
    });
  };
  //Menu
  const menu = id => (
    <Menu>
      <Menu.Item key="0" onClick={() => getUserById(id)}>
        Xem Thông Tin
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <Popconfirm
          placement="right"
          title="Bạn muốn hủy kết bạn với người này?"
          onConfirm={() => handleDeleteFriend(id)}
          okText="Yes"
          cancelText="No"
        >
          Xóa Bạn
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  //
  // nextjs hook
  const { push } = useRouter();

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

  const renderRooms = () => {
    return listGroup?.map((_, key) => {
      return (
        <>
          <TabPanel key={key}>
            <MessageRoom
              infoRoom={infoRoom}
              statusRoom={statusRoom}
              loading={loading}
            />
          </TabPanel>
        </>
      );
    });
  };
  const renderRoomsContact = () => {
    return listFriendContact?.map((v, key) => {
      return (
        <>
          <TabPanel key={key}>
            <MessageRoomSingle userSingle={v} listRoom={listGroup} />
          </TabPanel>
        </>
      );
    });
  };
  const handleClickRoom = value => {
    setLoading(true);
    setInfoRoom(value);
    if (!value.group) {
      setStatusRoom(false);
      setLoading(false);
    } else {
      setStatusRoom(true);
      setLoading(false);
    }
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
                  {room.group ? (
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
                    </div>
                  ) : (
                    <div className="tab_room">
                      <div style={{ width: '74px', display: 'inline-block' }}>
                        {room?.users[1]?.avatar === null ||
                        room?.users[1]?.avatar === '' ? (
                          <Avatar
                            size="64px"
                            className="avatar-chat"
                            name={room?.users[1]?.name}
                          />
                        ) : (
                          <img
                            style={{
                              borderRadius: '50%',
                              width: '64px',
                              height: '64px',
                              marginRight: '11px'
                            }}
                            src={room?.users[1]?.avatar}
                            alt="avatar"
                          />
                        )}
                      </div>
                      <div
                        className="content-tab-chat"
                        style={{ display: 'inline-block' }}
                      >
                        <p className="group__name">{room?.users[1]?.name}</p>
                      </div>
                    </div>
                  )}
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
        <Tab style={{ padding: '24.5%', paddingLeft: '29%' }}>
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
            <div className="avatar" style={{ cursor: 'pointer' }}>
              <img
                src={userProfile?.avatar}
                className="img_avatar"
                data-reactid="23"
              />

              <div className="icon-online"></div>
            </div>
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
        {renderRoomsContact()}
      </>
    );
  };
  const renderListFriend = useCallback(() => {
    return listFriendContact?.map((elm, key) => {
      return (
        <>
          <Tab className="userContact" key={key}>
            <div className="left">
              {elm.avatar === null || elm.avatar === '' ? (
                <Avatar
                  className="avatar-contact"
                  name={elm.name}
                  size="64px"
                  round={true}
                />
              ) : (
                <img
                  src={elm.avatar}
                  alt="avatar"
                  style={{
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    marginRight: '11px'
                  }}
                />
              )}
              <span>{elm.name}</span>
            </div>
            <Dropdown overlay={() => menu(elm.id)} trigger={['click']}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                <span className="right">
                  <EllipsisOutlined />
                </span>
              </a>
            </Dropdown>
          </Tab>
        </>
      );
    });
  });
  // Đây là tab của icon danh bạ điện thoại
  const renderTabPanelInPhoneBook = () => {
    return (
      <TabPanel>
        <Tabs forceRenderTabPanel>
          <TabList className={c`tab__tablist`}>
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
                <i
                  className="fa fa-address-book"
                  style={{
                    marginLeft: '10px',
                    color: 'blue',
                    fontSize: '50px',
                    marginRight: '10px'
                  }}
                >
                  {' '}
                </i>
                <span>Danh Bạ Bạn Bè</span>
              </Tab>
              <Tab className="tab">
                <img
                  src="https://zalo-chat-static.zadn.vn/v1/group@2x.png"
                  alt="imgAddF"
                />
                <span>Danh Sách Nhóm</span>
              </Tab>
              <p>Bạn bè ({totalFriend})</p>
              {renderListFriend()}
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

  // Đây là tab của icon chat
  const renderTabpanelInChatting = useCallback(() => {
    return (
      <TabPanel>
        <Tabs forceRenderTabPanel>
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
        <secion className={prefix}>
          <Tabs
            forceRenderTabPanel
            defaultIndex={0}
            className={c`tabs`}
            selectedTabClassName="is-selected"
          >
            {renderTabList()}
            {renderTabPanel()}
          </Tabs>
          <Update
            cancelAvatar={cancelModal}
            visible={visible}
            userProfile={userData}
            setVisible={setVisible}
            setUserProfile={setUserData}
          />
          <ChangePasswordUser
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            cancelPassword={onCancelPassword}
          />
        </secion>
      </>
    );
  };
  return <>{renderTabsTree()}</>;
};

export default SideBarTab;
