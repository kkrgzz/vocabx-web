// assets
import { LoginOutlined, PlusCircleOutlined, ProfileOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  PlusCircleOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const vocabulary = {
  id: 'vocabulary',
  title: 'Vocabulary',
  type: 'group',
  url: '/vocabulary',
  children: [
    {
      id: 'new-word',
      title: 'New Word',
      type: 'item',
      url: '/new-word',
      icon: icons.PlusCircleOutlined,
    },
    {
      id: 'list-word',
      title: 'Word List',
      type: 'item',
      url: '/list-word',
      icon: icons.UnorderedListOutlined,
    },
  ]
};

export default vocabulary;
