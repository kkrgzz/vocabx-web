// assets
import { HighlightOutlined, LoginOutlined, PlusCircleOutlined, ProfileOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  PlusCircleOutlined,
  HighlightOutlined,
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
      url: '/word/new',
      icon: icons.PlusCircleOutlined,
    },
    {
      id: 'edit-word',
      title: 'Edit Words',
      type: 'item',
      url: '/word/edit',
      icon: icons.HighlightOutlined,
    },
    {
      id: 'list-word',
      title: 'List Words',
      type: 'item',
      url: '/word/list',
      icon: icons.UnorderedListOutlined,
    },
  ]
};

export default vocabulary;
