import React, { FC } from 'react'
import {
    useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {
    LayoutProps,
    Layout,
} from '@ui-kitten/components'

type Inset = 'top' | 'bottom'

export interface SafeAreaLayoutProps extends LayoutProps {
    insets?: Inset
    children?: React.ReactNode
}

export const SafeAreaLayout: FC<SafeAreaLayoutProps> = ({
    insets,
    ...props
}) => {
    const insetsConfig = useSafeAreaInsets()

    return (
        <Layout
            {...props}
            style={[
                props.style,
                {
                    paddingTop: insets === 'top' ? insetsConfig.top : 0,
                    paddingBottom: insets === 'bottom' ? insetsConfig.bottom : 0,
                },
            ]}
        />
    )
}
