import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken, logoutUser} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
  hasPermission: (permission: string | string[]) => boolean
  hasRole: (role: string | string[]) => boolean
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
  hasPermission: () => false,
  hasRole: () => false,
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => useContext(AuthContext)

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error(err)
    } finally {
      saveAuth(undefined)
      setCurrentUser(undefined)
    }
  }

  const hasPermission = (permission: string | string[]): boolean => {
    const perms = currentUser?.permissions
    const userPermissions = Array.isArray(perms) ? perms : []
    
    if (Array.isArray(permission)) {
      return permission.some((p) => userPermissions.includes(p))
    }
    return userPermissions.includes(permission)
  }

  const hasRole = (role: string | string[]): boolean => {
    const rolesData = currentUser?.roles
    const userRoles = (Array.isArray(rolesData) ? rolesData : []).map((r: any) => 
        String(r).toLowerCase()
    )

    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r.toLowerCase()))
    }
    return userRoles.includes(role.toLowerCase())
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {setCurrentUser, logout} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const {data} = await getUserByToken()
          if (data) {
            setCurrentUser(data)
          }
        }
      } catch (error) {
        if (!didRequest.current) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    requestUser()

    return () => {
      didRequest.current = true
    }
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}