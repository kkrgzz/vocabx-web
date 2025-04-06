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
const TutorialPage = Loadable(lazy(() => import('pages/tutorial/tutorial')));

// Quick Menu Pages
const QuickWord = Loadable(lazy(() => import('pages/quick-menu/quick-word')));
const QuickWordList = Loadable(lazy(() => import('pages/quick-menu/quick-word-list')));

// Word pages V1
const OldNewWordPage = Loadable(lazy(() => import('pages/vocabulary/new-word')));
const OldEditWordPage = Loadable(lazy(() => import('pages/vocabulary/list-and-edit-word')));
const OldListWordPage = Loadable(lazy(() => import('pages/vocabulary/list-words')));

// Home Pages V2
const Home = Loadable(lazy(() => import('pages/home/index')));

// Word Pages V2
const NewWordPage = Loadable(lazy(() => import('pages/language/word/add-word/index')));
const NewWordListPage = Loadable(lazy(() => import('pages/language/word/list-word/index')));

// Sentence pages
const NewSentencePage = Loadable(lazy(() => import('pages/sentence/new-sentence')));

// Sentence Pages V2
const SentenceEditorPage = Loadable(lazy(() => import('pages/language/sentence/index')));

// Todo Pages
const ToDoDashboardPage = Loadable(lazy(() => import('pages/todo/index')));
const ToDoCategoriesPage = Loadable(lazy(() => import('pages/todo/todo-categories/index')));

// Mood Tracker Pages
const MoodTrackerPage = Loadable(lazy(() => import('pages/mood-tracker/index')));

// Timer Pages
const CountDownTimerPage = Loadable(lazy(() => import('pages/timer/count-down-timer/index')));

// Settings pages
const Preferences = Loadable(lazy(() => import('pages/settings/preferences')));

// Other Pages
const AttributionsPage = Loadable(lazy(() => import('pages/others/attributions')));
const AboutPage = Loadable(lazy(() => import('pages/others/about')));
const EncryptionPlayground = Loadable(lazy(() => import('pages/encryption/index')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <Home />
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
      path: 'home',
      element: <Home />,
    },
    {
      path: 'todo',
      children: [
        {
          path: 'dashboard',
          element: <ToDoDashboardPage />,
        },
        {
          path: 'categories',
          element: <ToDoCategoriesPage />,
        }
      ]
    },
    {
      path: 'mood-tracker',
      element: <MoodTrackerPage />,
    },
    {
      path: 'timer',
      children: [
        {
          path: 'count-down-timer',
          element: <CountDownTimerPage />,
        }
      ]
    },
    {
      path: 'home',
      children: [
        {
          path: 'default',
          element: <Home />
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
        },
        {
          path: 'tutorial',
          element: <TutorialPage />
        }
      ]
    },
    {
      path: 'encryption-playground',
      element: <EncryptionPlayground />
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
