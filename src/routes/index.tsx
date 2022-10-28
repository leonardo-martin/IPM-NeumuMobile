import { ONBOARDING, STORAGE } from '@constants/storage'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useFocusEffect } from '@react-navigation/native'
import AppRoutes from '@routes/app.routes'
import AuthRoutes from '@routes/auth.routes'
import OnboardingRoutes from '@routes/onboarding.routes'
import { AppInfoService } from '@services/app-info.service'
import { AppStorage } from '@services/app-storage.service'
import { authLogin, getVersionTest } from '@services/auth.service'
import { LogService } from '@services/log.service'
import { RootState } from '@store/index'
import { AxiosError } from 'axios'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Platform } from 'react-native'

const logService: LogService = new LogService()

const Routes: FC = (): ReactElement => {
    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)

    const [onboarded, setOnboarded] = useState(false)
    const [loading, setIsLoading] = useState(true)

    //! store test login
    const validationAppInStore = async () => {
        logService.loga('Login automático ativado')
        try {
            const response = await getVersionTest(AppInfoService.getVersion())
            logService.loga(JSON.stringify(response.data, null, 2))
            if (response.status === 201 && response.data.autoLogin) {
                const data = { ...response.data }
                await dispatch(authLogin({
                    username: data.username ?? '',
                    password: data.password ?? ''
                }, true))

                logService.loga('Login realizado com sucesso')
                await AppStorage.setItem(STORAGE.TESTE_USER, 'true')
                AppStorage.setItem(ONBOARDING, 'true').then(() => {
                    setOnboarded(true)
                    setIsLoading(false)
                })
            } else {
                logService.loga('Falha ao realizar login automático.')
                checkOnboarding()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                logService.loga('Falha ao realizar login automático' + JSON.stringify(error.response?.data, null, 2))
            }
            checkOnboarding()
        }

    }

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
            if (Platform.OS === 'android' && !isAuthenticated && !__DEV__) {
                validationAppInStore()
            } else {
                if (!isAuthenticated)
                    checkOnboarding()
                else {
                    setIsLoading(false)
                }
            }
        }, [])
    )

    return loading ? <></> : !onboarded ? <OnboardingRoutes setOnboarded={setOnboarded} /> : isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}

export default Routes