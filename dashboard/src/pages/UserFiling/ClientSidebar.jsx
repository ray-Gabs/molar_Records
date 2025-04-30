import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

function ClientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/login"); // Redirect to login
  };

  const items = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/Profile'),
    },
    {
      key: '3',
      icon: <FileTextOutlined />,
      label: 'Records',
      onClick: () => navigate('/Records'),
    },
    {
      key: '4',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout, // Logout on click
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="dark" items={items} />
      </Sider>
    </Layout>
  );
}

export default ClientDashboard;
