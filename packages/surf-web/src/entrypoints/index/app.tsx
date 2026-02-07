import { Spinner } from '@nextui-org/react'
import { RouterProvider } from 'react-router-dom'
import { useLoadFormLocal } from '~/atoms/hooks/use-load-form-local'
import { router } from './router'

function App() {
  const { isLoading } = useLoadFormLocal()

  if (isLoading)
    return <Spinner className='h-screen w-full' label='Loading...' />

  return <RouterProvider router={router} />
}

export default App
