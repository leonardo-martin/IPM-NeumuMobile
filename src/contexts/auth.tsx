import React, { createContext, FC, useContext, useState } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider: FC<{
    children?: React.ReactNode
}> = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }
