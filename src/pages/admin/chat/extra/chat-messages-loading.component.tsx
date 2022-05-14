import { Layout, Spinner, SpinnerProps, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { StyleSheet } from 'react-native'

export interface ChatMessageLoadingProps extends SpinnerProps {
    shouldShowIndicator?: boolean
    children?: React.ReactNode
}


const ChatMessageLoading: FC<ChatMessageLoadingProps> = ({ ...props }): ReactElement => {

    const styles = useStyleSheet(chatMessageLoadingStyle)

    return (
        <Layout style={styles.container} level='2'>
            <Spinner {...props} size='giant' />
        </Layout>
    )
}

export default ChatMessageLoading


const chatMessageLoadingStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});