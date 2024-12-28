// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import vocabulary from './vocabulary';
import sentence from './sentence';
import settings from './settings';
import quick_menu from './quick-menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  //items: [dashboard, pages, vocabulary, utilities, support]
  items: [quick_menu, dashboard, vocabulary, sentence]
};

export default menuItems;
