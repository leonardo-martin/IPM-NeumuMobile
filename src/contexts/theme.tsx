import { ApplicationProvider } from '@ui-kitten/components'
import React, { FC, createContext, useState, useContext } from 'react'
import * as eva from '@eva-design/eva'
import { customTheme } from '../../custom-theme'

interface ThemeContextType {
    theme: 'dark' | 'light'
    toggleTheme: () => {}
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

const ThemeProvider: FC = ({ children }) => {

    const [theme, setTheme] = useState<'dark' | 'light'>('light')

    const toggleTheme = async () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
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