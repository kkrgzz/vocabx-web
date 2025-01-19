// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/settings/profile',
      icon: icons.UserOutlined,
      breadcrumbs: true
    }
  ]
};

export default pages;
