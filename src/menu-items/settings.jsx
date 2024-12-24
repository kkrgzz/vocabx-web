// assets
import { RadiusSettingOutlined } from '@ant-design/icons';

// icons
const icons = {
  RadiusSettingOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  children: [
    {
      id: 'preferences',
      title: 'Preferences',
      type: 'item',
      url: 'settings/preferences',
      icon: icons.RadiusSettingOutlined,
    },
  ]
};

export default pages;
