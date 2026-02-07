import { createHashRouter } from 'react-router-dom'
import { isDev } from '~/constants'
import About from '../pages/about/Index'
import Index from '../pages/Index'
import ProfileIndex from '../pages/profile/Index'
import ProfileName from '../pages/profile/Name'
import Settings from '../pages/settings/Index'
import ImportAndExport from '../pages/settings/pages/ImportAndExport'
import Test from '../pages/Test'
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
