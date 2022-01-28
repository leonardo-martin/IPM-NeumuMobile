import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useAuth } from '@contexts/auth'
import AuthRoutes from '@routes/auth.routes'
import AppRoutes from '@routes/app.routes'
import OnboardingRoutes from '@routes/onboarding.routes'
import { AppStorage } from '@services/app-storage.service'
import { ONBOARDING } from '@constants/storage'

const Routes: FC = (): ReactElement => {
    const { isAuthenticated, loading } = useAuth()

    const [onboarded, setOnboarded] = useState(false)

    const checkOnboarding = async () => {
        try {
            const value = await AppStorage.getItem(ONBOARDING)
            if (value) setOnboarded(true)
        } catch (err) {
            setOnboarded(false)
        }
    }

    useEffect(() => {
        if (!isAuthenticated)
            checkOnboarding()
    }, [])


    if (loading) {
        return (
            <></>
        )
    }

    return !onboarded ? <OnboardingRoutes setOnboarded={setOnboarded} /> : isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}

export default Routes