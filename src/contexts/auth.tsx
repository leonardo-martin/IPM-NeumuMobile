import React, { FC, createContext, useState, useEffect, useContext } from 'react'
import { TokenModel } from '../models/TokenModel'
import { SignInData } from '../models/User'
import { signInRequest } from '../services/auth'
import jwt_decode from 'jwt-decode'
import AsyncStorage from '@react-native-community/async-storage'
import { api } from '../services/api'

interface AuthContextType {
    isAuthenticated: boolean
    currentUser: TokenModel | null
    signIn: (data: SignInData) => Promise<void | any>
    signOut: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider: FC = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<TokenModel | null>(null)
    const isAuthenticated = !!currentUser

    useEffect(() => {
        const loadStorageData = async () => {
            const storagedUser = await AsyncStorage.getItem('@RNAuth:user')
            const storagedToken = await AsyncStorage.getItem('@RNAuth:token')

            if (storagedUser && storagedToken) {
                setCurrentUser(JSON.parse(storagedUser))
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`
            }
        }

        loadStorageData()
    },[])

    const signIn = async (data: SignInData) => {
        try {
            const response = await signInRequest(data)
            if (response?.status === 201) {
                const { accessToken } = response.data
                const user = jwt_decode(accessToken) as TokenModel
                setCurrentUser(user)
                api.defaults.headers.Authorization = `Bearer ${accessToken}`
                await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(user))
                await AsyncStorage.setItem('@RNAuth:token', accessToken)
            }
        } catch (error) {
            return error
        }
    }

    const signOut = async () => {
        await AsyncStorage.clear()
        setCurrentUser(null)
    }

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }