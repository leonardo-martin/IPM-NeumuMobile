import { useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { stepperStyle } from './style'

interface StepperProps {
    active: number
    content: ReactElement[]
    stepStyle?: ViewStyle
    stepTextStyle?: TextStyle
}


const Stepper: FC<StepperProps> = ({
    active,
    content,
}): ReactElement => {

    const styles = useStyleSheet(stepperStyle)
    const [step, setStep] = useState<number[]>([0])
    const pushData = (val: number) => {
        setStep((prev) => [...prev, val])
    }

    const removeData = () => {
        setStep((prev) => {
            prev.pop()
            return [...prev]
        })
    }

    useEffect(() => {
        if (active > step[step.length - 1]) {
            pushData(active)
        } else if (active < step[step.length - 1] && step.length > 0) {
            removeData()
        }

    }, [active])

    return (
        <>
            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='interactive'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {content[active]}
            </KeyboardAwareScrollView>
        </>
    )
}

const DefaultContentComponent = (props: { title: string }) => {
    return (
        <View>
            <Text>{props.title}</Text>
        </View>
    )
}


Stepper.defaultProps = {
    content: [
        <DefaultContentComponent title="Component 1" />,
        <DefaultContentComponent title="Component 2" />
    ]
}
export default Stepper