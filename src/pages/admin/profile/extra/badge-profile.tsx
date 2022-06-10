import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { extraProfileStyle } from './style'

interface BadgeProps {
    title: string
}

const BadgeProfile: FC<BadgeProps> = ({ ...props }): ReactElement => {

    const styles = useStyleSheet(extraProfileStyle)

    return (
        <>
            <View style={styles.containerBadge}>
                <View style={[styles.badge, styles.shadow, styles.primary]}>
                    <Text style={styles.textBadge}>{props.title}</Text>
                </View>
            </View>
        </>
    )
}

export default BadgeProfile