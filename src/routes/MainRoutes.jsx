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

// Word pages
const NewWordPage = Loadable(lazy(() => import('pages/vocabulary/new-word')));
const EditWordPage = Loadable(lazy(() => import('pages/vocabulary/list-and-edit-word')));
const ListWordPage = Loadable(lazy(() => import('pages/vocabulary/list-words')));

// Sentence pages
const NewSentencePage = Loadable(lazy(() => import('pages/sentence/new-sentence')));

// Settings pages
const Preferences = Loadable(lazy(() => import('pages/settings/preferences')));

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
        {
          path: 'edit',
          element: <EditWordPage />
        },
        {
          path: 'list',
          element: <ListWordPage />
        }
      ]
    },
    {
      path: 'sentence',
      children: [
        {
          path: 'new',
          element: <NewSentencePage />
        }
      ]
    },
    {
      path: 'settings',
      children: [
        {
          path: 'preferences',
          element: <Preferences />
        }
      ]
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
