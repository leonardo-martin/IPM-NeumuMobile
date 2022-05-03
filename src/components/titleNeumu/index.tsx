import React, { FC, ReactElement } from 'react'
import { Text, useStyleSheet } from '@ui-kitten/components'
import { LiteralUnion } from '@ui-kitten/components/devsupport'
import { View } from 'react-native'
import { titleStyle } from './style'

type TitleProps = {
    category: LiteralUnion<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 's1' | 's2' | 'p1' | 'p2' | 'c1' | 'c2' | 'label'>
}

const TitleNeumu: FC<TitleProps> = ({ category }): ReactElement => {

    const styles = useStyleSheet(titleStyle)

    return (
        <View style={titleStyle.box}>
            <Text category={category} style={styles.titleSecondary}>Tele</Text>
            <Text category={category} style={styles.titlePrimary}>NeuMu</Text>
        </View>
    )
}

export default TitleNeumu
