import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// User Pages
const ProfilePage = Loadable(lazy(() => import('pages/user/profile')));

// Quick Menu Pages
const QuickWord = Loadable(lazy(() => import('pages/quick-menu/quick-word')));
const QuickWordList = Loadable(lazy(() => import('pages/quick-menu/quick-word-list')));

// Word pages V1
const OldNewWordPage = Loadable(lazy(() => import('pages/vocabulary/new-word')));
const OldEditWordPage = Loadable(lazy(() => import('pages/vocabulary/list-and-edit-word')));
const OldListWordPage = Loadable(lazy(() => import('pages/vocabulary/list-words')));

// Word Pages V2
const NewWordPage = Loadable(lazy(() => import('pages/language/word/add-word/index')));
const NewWordListPage = Loadable(lazy(() => import('pages/language/word/list-word/index')));

// Sentence pages
const NewSentencePage = Loadable(lazy(() => import('pages/sentence/new-sentence')));

// Sentence Pages V2
const SentenceEditorPage = Loadable(lazy(() => import('pages/language/sentence/index')));

// Settings pages
const Preferences = Loadable(lazy(() => import('pages/settings/preferences')));

// Other Pages
const AttributionsPage = Loadable(lazy(() => import('pages/others/attributions')));
const AboutPage = Loadable(lazy(() => import('pages/others/about')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'quick-menu',
      children: [
        {
          path: 'new-word',
          element: <QuickWord />
        },
        {
          path: 'word-list',
          element: <QuickWordList />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'word',
      children: [
        {
          path: 'new',
          element: <NewWordPage />
        },
        // {
        //   path: 'edit',
        //   element: <EditWordPage />
        // },
        {
          path: 'list',
          element: <NewWordListPage />
        },
        {
          path: 'old-new',
          element: <OldNewWordPage />
        },
        {
          path: 'old-edit',
          element: <OldEditWordPage />
        },
        {
          path: 'old-list',
          element: <OldListWordPage />
        },
      ]
    },
    {
      path: 'sentence',
      children: [
        {
          path: 'new',
          element: <NewSentencePage />
        },
        {
          path: 'editor',
          element: <SentenceEditorPage />
        }
      ]
    },
    {
      path: 'settings',
      children: [
        {
          path: 'preferences',
          element: <Preferences />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        }
      ]
    },
    {
      path: 'attributions',
      element: <AttributionsPage />
    },
    {
      path: 'about',
      element: <AboutPage />
    },
    {
      path: '/*',
      element: <>404</>
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
