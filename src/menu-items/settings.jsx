// assets
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
// icons
const icons = {
  UserOutlined,
  QuestionCircleOutlined,
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
    },
    {
      id: 'turorial',
      title: 'Tutorial',
      type: 'item',
      url: '/settings/tutorial',
      breadcrumbs: true,
      icon: icons.QuestionCircleOutlined
  }
  ]
};

export default pages;
