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
  const role = sessionStorage.getItem('role'); 

  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); 
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    navigate('/login'); 
  };


  const items = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/'),
      hidden: role !== 'patient',
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
      label: 'Manage Dentist',
      onClick: () => navigate('/ManageDentist'), 
      hidden: role !== 'dentist',
    },
    {
      key: '4',
      icon: <TeamOutlined />,
      label: 'Manage Staff',
      onClick: () => navigate('/ManageStaff'), 
      hidden: role !== 'dentist',
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: 'Appointments',
      onClick: () => navigate('/ManageAppointment'),
      hidden: role !== 'staff' && role !== 'dentist',
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: 'Manage Records',
      onClick: () => navigate('/ManageRecord'),
      hidden: role !== 'staff' && role !== 'dentist',
    },
    {
      key: '6',
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
            .filter(item => !item.hidden) 
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
