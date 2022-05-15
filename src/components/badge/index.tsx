import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { badgeStyle } from './style'

interface BadgeProps {
    count?: number
    position?: "absolute" | "relative" | undefined
}

const Badge: FC<BadgeProps> = ({ count, position }): ReactElement => {

    const styles = useStyleSheet(badgeStyle)
    return (
        <View style={[styles.container, position === 'absolute' && {
            ...styles.containerAbsolute
        }]}>
            <Text style={styles.badgeText}>{count}</Text>
        </View>
    )
}

export default Badge

