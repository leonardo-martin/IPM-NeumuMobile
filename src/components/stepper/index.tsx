import React, { FC, useState, ReactElement, useEffect } from 'react'
import { Icon, IconElement, useStyleSheet } from '@ui-kitten/components'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, ScrollView, Platform } from 'react-native'
import { stepperStyle } from './style'

interface StepperProps {
    active: number
    content: ReactElement[]
    onNext: () => void
    onBack: () => void
    onFinish: () => void
    wrapperStyle?: ViewStyle
    stepStyle?: ViewStyle
    stepTextStyle?: TextStyle
    buttonStyle?: ViewStyle
    buttonDoneStyle?: ViewStyle
    buttonTextStyle?: TextStyle
    showButton?: boolean
    iconButton?: boolean
    nextButtonText?: string
    prevButtonText?: string
    finishButtonText?: string
    isAllowSubmit?: boolean
}

const search = (keyName: number, myArray: number[]): boolean => {
    return myArray.some((val) => val === keyName)
}

const Stepper: FC<StepperProps> = ({
    active,
    content,
    onBack,
    onNext,
    onFinish,
    stepStyle,
    stepTextStyle,
    buttonStyle,
    buttonDoneStyle,
    buttonTextStyle,
    showButton,
    iconButton,
    nextButtonText,
    prevButtonText,
    finishButtonText,
    isAllowSubmit
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

    const PrevIcon = (): IconElement => {
        return (
            <Icon style={styles.icon}
                name={Platform.OS === 'ios' ? 'chevron-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'}
                size={20} pack='ionicons' />
        )
    }

    const NextIcon = (): IconElement => {
        return (
            <Icon style={styles.icon}
                name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'}
                size={20} pack='ionicons' />
        )
    }

    const DoneIcon = (): IconElement => {
        return (
            <Icon style={styles.icon}
                name={'checkmark-done'} size={20} pack='ionicons' />
        )
    }

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
                                        backgroundColor: 'grey',
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                {content[active]}
                {showButton && (
                    <View
                        style={[styles.contentIndicator, {
                            justifyContent: (active === 0) ? 'flex-end' : 'space-between',
                        }]}
                    >
                        {active !== 0 && (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    buttonStyle
                                ]}
                                onPress={onBack}
                            >
                                {iconButton ?
                                    PrevIcon() :
                                    <Text style={[styles.label, buttonTextStyle]}>{prevButtonText}</Text>
                                }
                            </TouchableOpacity>
                        )}
                        {content.length - 1 !== active && (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    buttonStyle
                                ]}
                                onPress={onNext}
                            >
                                {iconButton ?
                                    NextIcon() :
                                    <Text style={[styles.label, buttonTextStyle]}>{nextButtonText}</Text>
                                }
                            </TouchableOpacity>
                        )}
                        {content.length - 1 === active && (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    buttonDoneStyle,
                                    {
                                        opacity: isAllowSubmit ? 1 : .5
                                    }
                                ]}
                                disabled={!isAllowSubmit}
                                onPress={isAllowSubmit ? onFinish : undefined}
                            >
                                {iconButton ?
                                    DoneIcon() :
                                    <Text style={[styles.label, buttonTextStyle]}>{finishButtonText}</Text>
                                }
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
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
    ],
    showButton: true,
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    finishButtonText: 'Finish'
}
export default Stepper