import React, { useState, ReactElement, FC, ForwardedRef, forwardRef, useCallback } from 'react'
import { listCalendars } from '@services/calendar.service'
import { Calendar } from 'react-native-calendar-events'
import { Button, Card, Icon, Modal, Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import { localCalendarModalStyle } from './style'
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { Controller, useForm } from 'react-hook-form'
import { useFocusEffect } from '@react-navigation/native'

interface LocalCalendarModalProps {
    ref: ForwardedRef<Modal>
    isVisible: boolean
    closeModal: () => void
    openModal: () => void
    handleCalendarSelected: (calendar: Calendar) => void
    label?: string
    modalTestID?: string
}

const LocalCalendarModalComponent: FC<LocalCalendarModalProps> = forwardRef<Modal, React.PropsWithChildren<LocalCalendarModalProps>>(({ ...props }, ref): ReactElement => {

    const [error, setError] = useState(false)

    const [calendars, setCalendars] = useState<Calendar[]>([])
    const styles = useStyleSheet(localCalendarModalStyle)
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm()

    const loadCalendars = async () => {
        try {
            const calendarsTmp = await listCalendars()
            setCalendars(calendarsTmp)
            setError(false)
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    useFocusEffect(
        useCallback(() => {
            form.reset()
            if (props.isVisible)
                loadCalendars()
        }, [props.isVisible])
    )

    const submit = (data: any) => {
        const item = calendars.find((_, i) => i === data.calendarIndex)
        if (item)
            props.handleCalendarSelected(item)
    }

    return (
        <Modal
            {...{ ...props, ref: combinedRef }}
            style={styles.modal}
            visible={props.isVisible}
            backdropStyle={styles.backdrop}>
            <Card disabled>
                <View style={styles.headerModal}>
                    <Text status='basic' style={styles.text}>{props.label}</Text>
                    <TouchableOpacity onPress={props.closeModal}>
                        <Icon name={error ? 'refresh-outline' : 'close-outline'}
                            onPress={error ? loadCalendars : undefined}
                            size={20} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                {!error ? (
                    <>
                        <ScrollView>
                            <Controller
                                control={form.control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Selecione uma opção'
                                    },
                                }}
                                render={({ field: { onChange, value, name, ref } }) => (
                                    <RadioGroup
                                        ref={ref}
                                        testID={name}
                                        selectedIndex={value}
                                        onChange={onChange}>
                                        {calendars.map((calendar) =>
                                            <Radio disabled={!calendar.allowsModifications} key={calendar.id}
                                                testID={calendar.id}
                                                style={[styles.radio, {
                                                    display: !calendar.allowsModifications ? 'none' : undefined
                                                }]}>
                                                {evaProps => <Text
                                                    {...evaProps} style={[evaProps?.style, styles.radioText, {
                                                        color: calendar.color
                                                    }]}>{calendar.title}</Text>}
                                            </Radio>
                                        )}
                                    </RadioGroup>
                                )}
                                name='calendarIndex'
                                defaultValue=''
                            />
                        </ScrollView>
                        {form.formState.errors.calendar && <Text status='danger' category='c1' style={[{ paddingVertical: 10 }]}>{form.formState.errors.calendar?.message}</Text>}

                        <Button onPress={form.handleSubmit(submit)}>Salvar</Button>
                    </>
                ) : (
                    <Button status='basic' onPress={() => Linking.openSettings()}>Abrir configurações</Button>
                )}
            </Card>
        </Modal >
    )
})

LocalCalendarModalComponent.defaultProps = {
    isVisible: false,
    closeModal: () => { },
    handleCalendarSelected: () => { },
    label: 'Select a calendar',
    modalTestID: 'localCalendarModal',
}

export default LocalCalendarModalComponent
