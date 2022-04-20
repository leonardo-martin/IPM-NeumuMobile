import React, { FC, useState, ReactElement, useEffect } from 'react'
import { useStyleSheet } from '@ui-kitten/components'
import { View, Text, ViewStyle, TextStyle, ScrollView } from 'react-native'
import { stepperStyle } from './style'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface StepperProps {
    active: number
    content: ReactElement[]
    stepStyle?: ViewStyle
    stepTextStyle?: TextStyle
}

const search = (keyName: number, myArray: number[]): boolean => {
    return myArray.some((val) => val === keyName)
}

const Stepper: FC<StepperProps> = ({
    active,
    content,
    stepStyle,
    stepTextStyle,
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
            <View style={styles.lineProgress}>
                {content.map((_, i) => {
                    return (
                        <React.Fragment key={i}>
                            {i !== 0 && (
                                <View
                                    style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: 'gray',
                                        opacity: 1,
                                        marginHorizontal: 10,
                                    }}
                                />
                            )}
                            <View
                                style={[
                                    styles.step,
                                    {
                                        opacity: search(i, step) ? 1 : 0.3,
                                    },
                                    stepStyle,
                                ]}
                            >
                                {search(i, step) ? (
                                    <Text
                                        style={[
                                            styles.label,
                                            stepTextStyle,
                                        ]}
                                    >
                                        &#10003;
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            styles.label,
                                            stepTextStyle,
                                        ]}
                                    >
                                        {i + 1}
                                    </Text>
                                )}
                            </View>
                        </React.Fragment>
                    )
                })}
            </View>
            <KeyboardAwareScrollView
                enableOnAndroid
                contentContainerStyle={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
                    {content[active]}
                </ScrollView>
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