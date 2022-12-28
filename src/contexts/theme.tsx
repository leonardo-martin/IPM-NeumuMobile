import { ApplicationProvider } from '@ui-kitten/components'
import React, { FC, createContext, useState, useContext, useEffect } from 'react'
import * as eva from '@eva-design/eva'
import { customTheme } from '../../custom-theme'
import { AppStorageService } from '@services/app-storage.service'
import { Theme } from '@models/Theme'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => {}
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

const ThemeProvider: FC<{
    children?: React.ReactNode
}> = ({ children }) => {

    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        (async () => {
            const themeStorage = await AppStorageService.getTheme()
            if (!themeStorage) AppStorageService.setTheme(theme)
            else setTheme(themeStorage)
        })()
    }, [])

    const toggleTheme = async () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(nextTheme)
        AppStorageService.setTheme(nextTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ApplicationProvider  {...eva} theme={{ ...eva[theme], ...customTheme }}>
                {children}
            </ApplicationProvider>
        </ThemeContext.Provider>
    )
}

const useTheme = () => {
    const context = useContext(ThemeContext)
    return context
}

export { ThemeProvider, useTheme }

export default ThemeContext