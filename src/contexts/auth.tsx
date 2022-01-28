import React, { FC, createContext, useState, useEffect, useContext } from 'react'
import { TokenModel } from '@models/TokenModel'
import { SignInData } from '@models/User'
import { signInRequest } from '@services/auth.service'
import jwt_decode from 'jwt-decode'
import { api } from '@services/api.service'
import { AppStorage } from '@services/app-storage.service'
import { THEME_KEY, TOKEN_KEY, USER_KEY } from '@constants/storage'

interface AuthContextType {
    isAuthenticated: boolean
    currentUser: TokenModel | null
    signIn: (data: SignInData) => Promise<void | any>
    signOut: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider: FC = ({ children }) => {

    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<TokenModel | null>(null)
    const isAuthenticated = !!currentUser

    useEffect(() => {
        const loadStorageData = async () => {
            const storagedUser = await AppStorage.getUserContext()
            const storagedToken = await AppStorage.getUserToken()

            if (storagedUser && storagedToken) {
                setCurrentUser(JSON.parse(storagedUser))                
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`
            }
            setLoading(false)
        }

        loadStorageData()
    }, [])

    const signIn = async (data: SignInData) => {
        try {
            const response = await signInRequest(data)
            if (response?.status === 201) {
                const { accessToken } = response.data
                const user = jwt_decode(accessToken) as TokenModel
                setCurrentUser(user)
                api.defaults.headers.Authorization = `Bearer ${accessToken}`
                AppStorage.setUserContext(user)
                AppStorage.setUserToken(accessToken)
            }
        } catch (error) {
            return error
        }
    }

    const signOut = async () => {
        await AppStorage.removeItem(THEME_KEY)
        await AppStorage.removeItem(TOKEN_KEY)
        await AppStorage.removeItem(USER_KEY)        
        setCurrentUser(null)
    }

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }