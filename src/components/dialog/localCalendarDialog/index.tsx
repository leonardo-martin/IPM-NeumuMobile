import CustomErrorMessage from '@components/error'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useFocusEffect } from '@react-navigation/native'
import { listCalendars } from '@services/calendar.service'
import { Button, Card, Icon, Modal, Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import { localCalendarModalStyle } from './style'

interface LocalCalendarDialogProps {
    ref: ForwardedRef<Modal>
    isVisible: boolean
    closeModal: () => void
    openModal: () => void
    handleCalendarSelected: (calendar: Calendar) => void
    label?: string
    modalTestID?: string
}

const LocalCalendarDialog: FC<LocalCalendarDialogProps> = forwardRef<Modal, React.PropsWithChildren<LocalCalendarDialogProps>>(({ ...props }, ref): ReactElement => {

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
                                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                    <RadioGroup
                                        ref={ref}
                                        testID={name}
                                        selectedIndex={value}
                                        onChange={onChange}>
                                        {calendars.map((calendar) =>
                                            <Radio disabled={!calendar.allowsModifications} key={calendar.id}
                                                testID={calendar.id}
                                                onBlur={onBlur}
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
                        <CustomErrorMessage name='calendar' errors={form.formState.errors} />
                        <Button onPress={form.handleSubmit(submit)}>Salvar</Button>
                    </>
                ) : (
                    <Button status='basic' onPress={() => Linking.openSettings()}>Abrir configurações</Button>
                )}
            </Card>
        </Modal >
    )
})

LocalCalendarDialog.defaultProps = {
    isVisible: false,
    closeModal: () => { },
    handleCalendarSelected: () => { },
    label: 'Select a calendar',
    modalTestID: 'localCalendarModal',
}

export default LocalCalendarDialog
