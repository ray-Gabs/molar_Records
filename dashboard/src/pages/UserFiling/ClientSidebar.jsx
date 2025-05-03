import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,  // Icon for "Manage Staff"
} from '@ant-design/icons';

const { Sider } = Layout;

function ClientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');  // Get the user's role from session storage

  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); 
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    navigate('/login'); 
  };

  // Menu items based on role
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
      onClick: () => navigate('/ManageProfilePage'),
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: 'Manage Staff',
      onClick: () => navigate('/ManageStaff'),  // Add navigation to "Manage Staff" page
      // Only show if the role is "dentist"
      hidden: role !== 'dentist',
    },
    {
      key: '4',
      icon: <FileTextOutlined />,
      label: 'Records',
      onClick: () => navigate('/Records'),
      // Only show if the role is "staff" or "dentist"
      hidden: role !== 'staff' && role !== 'dentist',
    },
    {
      key: '5',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="dark">
          {items
            .filter(item => !item.hidden)  // Hide menu items based on role
            .map(item => (
              <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                {item.label}
              </Menu.Item>
            ))}
        </Menu>
      </Sider>
    </Layout>
  );
}

export default ClientDashboard;
