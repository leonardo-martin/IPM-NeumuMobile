import { Text } from '@ui-kitten/components'
import React, {FC, ReactElement} from 'react'
import { View } from 'react-native'
import { titleStyle } from './style'

const TitleNeumu: FC = (): ReactElement => {
    return (
        <View style={titleStyle.box}>
            <Text style={[titleStyle.title, { color: '#626262' }]}>Tele</Text>
            <Text style={titleStyle.title} status='primary'>Neumu</Text>
        </View>
    )
}

export default TitleNeumu
