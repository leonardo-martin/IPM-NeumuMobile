import { ONBOARDING } from '@constants/storage'
import { useAppSelector } from '@hooks/redux'
import { useFocusEffect } from '@react-navigation/native'
import AppRoutes from '@routes/app.routes'
import AuthRoutes from '@routes/auth.routes'
import OnboardingRoutes from '@routes/onboarding.routes'
import { AppStorage } from '@services/app-storage.service'
import { RootState } from '@store/index'
import React, { FC, ReactElement, useCallback, useState } from 'react'

const Routes: FC = (): ReactElement => {
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)

    const [onboarded, setOnboarded] = useState(false)
    const [loading, setIsLoading] = useState(true)

    const checkOnboarding = async () => {
        try {
            const value = await AppStorage.getItem(ONBOARDING)
            if (value) {
                setOnboarded(true)
            }
        } catch (err) {
            setOnboarded(false)
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (!isAuthenticated)
                checkOnboarding()
            else {
                setIsLoading(false)
            }
        }, [])
    )

    return loading ? <></> : !onboarded ? <OnboardingRoutes setOnboarded={setOnboarded} /> : isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}

export default Routes