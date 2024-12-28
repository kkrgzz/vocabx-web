// assets
import { HighlightOutlined, LoginOutlined, PlusCircleOutlined, ProfileOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  PlusCircleOutlined,
  HighlightOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const quick_menu = {
  id: 'quick-menu',
  title: 'Quick Menu',
  type: 'group',
  url: '/quick-menu',
  children: [
    {
      id: 'quick-word',
      title: 'Quick Word',
      type: 'item',
      url: '/quick-menu/new-word',
      icon: icons.PlusCircleOutlined,
    },
    {
      id: 'quick-word-list',
      title: 'Quick Word List',
      type: 'item',
      url: '/quick-menu/word-list',
      icon: icons.PlusCircleOutlined,
    },
  ]
};

export default quick_menu;
