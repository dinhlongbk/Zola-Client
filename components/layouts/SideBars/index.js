import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { accountLogout, isTokenExpired } from 'actions/accountAction';
import logo from 'assets/images/zola-logo.png';
import { Button, Col, Dropdown, Input, Menu, Row, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { classPrefixor } from 'utils/classPrefixor';
import Update from 'components/Account/Update';
import { useRouter } from 'next/router';
const prefix = 'side-bar';
const { Search } = Input;
const c = classPrefixor(prefix);
const Sidebar = () => {
  const { TabPane } = Tabs;
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { userProfile, isAuthenticated } = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const showModal = () => {
    setVisible(true);
  };
  const cancelModal = () => {
    setVisible(false);
    setUserData(userProfile);
  };
  useEffect(() => {
    if (userProfile) {
      setUserData(userProfile);
    }
  }, [userProfile]);
  const styleIcon = {
    marginRight: '8px',
    color: '#99a4b0'
  };
  const menuUser = {
    marginLeft: '30px',
    borderRadius: '2px',
    width: '270px',
    marginTop: '7px',
    fontSize: '14px'
  };
  const styleMenuItem = {
    padding: '10px 20px'
  };

  const menuList = (
    <Menu style={menuUser}>
      <Menu.Item
        icon={<EditOutlined style={styleIcon} />}
        style={styleMenuItem}
      >
        <a target="_blank" rel="noopener noreferrer" onClick={showModal}>
          Cập nhật thông tin
        </a>
      </Menu.Item>
      <Menu.Item
        icon={<SettingOutlined style={styleIcon} />}
        style={styleMenuItem}
      >
        <a target="_blank" rel="noopener noreferrer" onClick={showModal}>
          Cài đặt
        </a>
      </Menu.Item>
      <Menu.Item
        style={{ padding: '10px 20px', color: 'red', fontWeight: '500' }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'red' }}
          onClick={() => {
            dispatch(accountLogout(push));
          }}
        >
          Đăng Xuất
        </a>
      </Menu.Item>
    </Menu>
  );
  const messageList = (
    <Menu style={menuUser}>
      <Menu.Item style={styleMenuItem}>
        <a target="_blank" rel="noopener noreferrer" onClick={showModal}>
          Tin nhắn cá nhân{' '}
        </a>
      </Menu.Item>
      <Menu.Item style={styleMenuItem}>
        <a target="_blank" rel="noopener noreferrer" onClick={showModal}>
          Tin nhắn nhóm{' '}
        </a>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    if (!isAuthenticated) dispatch(isTokenExpired());
  }, [isAuthenticated, dispatch]);
  return (
    <div className={c`container`}>
      <div>
        <div className="left-section">
          <div
            style={{
              height: 'calc(13vh - 0px)'
            }}
            mode="inline"
          >
            <Dropdown overlay={menuList} placement="bottomRight">
              <div className="avatar" style={{ cursor: 'pointer' }}>
                <img
                  src={userProfile?.avatar ? userProfile?.avatar : 'avatar'}
                  className="img_avatar"
                  data-reactid="23"
                  alt="avatar"
                />
                <div className="icon-online"></div>
              </div>
            </Dropdown>
          </div>
          <Tabs
            style={{
              height: '78%'
            }}
            tabPosition="left"
          >
            <TabPane
              key="1"
              style={{
                paddingBottom: '50px',
                paddingTop: '20px'
              }}
              tab={<i className="fa fa-comment"></i>}
            >
              <div className="content-zola-message">
                <div className="header-content-zola-message">
                  <Dropdown overlay={messageList}>
                    <span className="message">
                      Tin nhắn <i className="fa fa-caret-down"></i>
                    </span>
                  </Dropdown>
                </div>
                <div className="main-content-zola-message">
                  <Menu style={{ width: '357px', height: 'auto' }}>
                    <Menu.Item style={{ width: '357px', height: 'auto' }}>
                      <Row className="message-view">
                        <Col span={6} className="avatar">
                          <img
                            src={
                              userProfile?.avatar
                                ? userProfile?.avatar
                                : 'avatar'
                            }
                            className="img_avatar"
                            data-reactid="23"
                            alt="avatar"
                          />
                        </Col>
                        <Col span={15}>
                          <h4 className="name-message-room">Quoc Duy</h4>
                          <p className="content-message-room">Anh iu em </p>
                        </Col>
                        <Col span={3}>
                          <span className="last-time-message-room">1h</span>
                          <p className="open-option-message-room">...</p>
                        </Col>
                      </Row>
                    </Menu.Item>
                  </Menu>{' '}
                </div>
              </div>
            </TabPane>
            <TabPane
              key="2"
              style={{ paddingBottom: '50px', paddingTop: '20px' }}
              tab={<i className="fa fa-address-book"></i>}
            ></TabPane>
            <TabPane
              key="3"
              style={{ paddingBottom: '50px', paddingTop: '20px' }}
              tab={
                <i
                  className="fa fa-user-friends"
                  style={{ marginRight: '15px' }}
                ></i>
              }
            ></TabPane>
          </Tabs>
          <div mode="inline">
            <div className="sign-out">
              <Button
                style={{
                  border: 'none',
                  background: 'transparent',
                  marginLeft: '10px',
                  fontSize: '20px',
                  color: 'white'
                }}
                onClick={() => {
                  dispatch(accountLogout(push));
                }}
              >
                <i className="fa fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="zola-section">
            <Row className="zola-header">
              <Col
                span={5}
                className="logo-header"
                style={{
                  display: 'inline-block'
                }}
              >
                <img src={logo} alt="hihi" />
              </Col>
              <Col
                span={8}
                style={{
                  display: 'inline-block',
                  marginTop: '26px',
                  fontWeight: '350',
                  fontSize: '14px',
                  color: '#000'
                }}
              >
                <span>- {userData ? userData.name : ''}</span>
              </Col>
            </Row>
            <Row className="zola-section-mid">
              <Col span={15} className="search-zola-message">
                <Search
                  placeholder="Nhập vào tin nhắn"
                  onSearch={value => console.log(value)}
                  enterButton
                />
              </Col>
              <Col span={6} className="icon-zola-message">
                <i
                  className="fa fa-user-plus"
                  style={{ marginRight: '20px' }}
                ></i>
                <i className="fa fa-plus"></i>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Update
        cancelAvatar={cancelModal}
        userProfile={userProfile}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};
export default Sidebar;
