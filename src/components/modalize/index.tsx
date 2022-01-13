import React, { FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { View } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useStyleSheet } from '@ui-kitten/components'
import { LiteralUnion } from '@ui-kitten/components/devsupport'
import { modalizeStyle } from './style'

interface ModalProps extends ModalizeProps {
    ref?: ForwardedRef<Modalize>
    level?: LiteralUnion<"2" | "1" | "3" | "4", string> | undefined
}

const ModalizeFixed: FC<ModalProps> = forwardRef<Modalize, React.PropsWithChildren<ModalProps>>(({ level, children, ...props }, ref): ReactElement => {

    const styles = useStyleSheet(modalizeStyle)

    return (

        <Modalize ref={ref} {...props}>
            <SafeAreaLayout level={level} style={styles.safeArea}>
                <View style={styles.content}>
                    {children}
                </View>
            </SafeAreaLayout>
        </Modalize>
    )
})

ModalizeFixed.defaultProps = {
    level: '2',
}

export default ModalizeFixed