import React, { FC, ReactElement } from 'react'
import { useAuth } from '@contexts/auth'
import AuthRoutes from '@routes/auth.routes'
import AppRoutes from '@routes/app.routes'

const Routes: FC = (): ReactElement => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <></>
        )
    }

    return isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}

export default Routes