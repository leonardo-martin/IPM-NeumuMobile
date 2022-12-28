import { Spinner, SpinnerProps, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { loadingStyle } from './style'

interface LoadingIndicatorComponent extends SpinnerProps {
    insideButton?: boolean
}

const LoadingIndicatorComponent: FC<LoadingIndicatorComponent> = (props): ReactElement => {

    const styles = useStyleSheet(loadingStyle)

    return (
        <View style={!props.insideButton ? styles.container : undefined}>
            <Spinner {...props} />
        </View>
    )
}

LoadingIndicatorComponent.defaultProps = {
    size: 'giant',
    status: 'primary',
    insideButton: false
}

export default LoadingIndicatorComponent