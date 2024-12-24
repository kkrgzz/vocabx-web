// assets
import { HighlightOutlined, LoginOutlined, PlusCircleOutlined, ProfileOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  PlusCircleOutlined,
  HighlightOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const sentence = {
  id: 'sentence',
  title: 'Sentence',
  type: 'group',
  url: '/sentence',
  children: [
    {
      id: 'new-sentence',
      title: 'Sentences',
      type: 'item',
      url: '/sentence/new',
      icon: icons.PlusCircleOutlined,
    },
  ]
};

export default sentence;
