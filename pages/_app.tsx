import '../styles/globals.css'
import type { AppProps } from 'next/app'

//Context
import { AuthContextProvider } from '../context/AuthContext'
import { UsersContextProvider } from '../context/UsersContext'
import { PropertiesContextProvider } from '../context/PropertiesContext'

//Routers
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import MasterRoute from '../components/auth/MasterRouter'

const noAuthRequired:string[] = ['/', '/login']
const masterAuthRequired:string[] = ['/users']


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
      <AuthContextProvider>
        <UsersContextProvider>
          <PropertiesContextProvider>
            {masterAuthRequired.includes(router.pathname) ? (
              <MasterRoute>
                <Component {...pageProps} />
              </MasterRoute>
            ) : !noAuthRequired.includes(router.pathname) ? (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            ) : (
              <Component {...pageProps} />
            )}
          </PropertiesContextProvider>
        </UsersContextProvider>
      </AuthContextProvider>
  )
}

export default MyApp
