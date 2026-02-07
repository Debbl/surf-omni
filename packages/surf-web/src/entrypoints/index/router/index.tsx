import { createHashRouter } from 'react-router-dom'
import { isDev } from '~/constants'
import About from '../pages/about/index'
import Index from '../pages/index'
import ProfileIndex from '../pages/profile/index'
import ProfileName from '../pages/profile/name'
import Settings from '../pages/settings/index'
import ImportAndExport from '../pages/settings/pages/import-and-export'
import Test from '../pages/test'
import type { RouteObject } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
    children: [
      {
        index: true,
        element: <About />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'profile',
        element: <ProfileIndex />,
        children: [
          {
            path: ':name',
            element: <ProfileName />,
          },
        ],
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <ImportAndExport />,
          },
          {
            path: 'import-and-export',
            element: <ImportAndExport />,
          },
        ],
      },
    ],
  },
]

if (isDev) {
  routes.push({
    path: 'test',
    element: <Test />,
  })
}

export const router = createHashRouter(routes)
