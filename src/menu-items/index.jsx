// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import vocabulary from './vocabulary';
import sentence from './sentence';
import settings from './settings';
import quick_menu from './quick-menu';
import language from './language';
import tools from './tools';
import home from './home';
import others from './others';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  //items: [dashboard, pages, vocabulary, utilities, support]
  items: [home, language, tools, others, quick_menu, dashboard, vocabulary, sentence, settings]
};

export default menuItems;
