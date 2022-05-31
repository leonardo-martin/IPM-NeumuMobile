import CustomErrorMessage from '@components/error'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Card, Input, Modal, Spinner, useStyleSheet } from '@ui-kitten/components'
import { isEmailValid } from '@utils/mask'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { modalStyle } from './style'

interface RequestUnderageDialogProps {
    ref: ForwardedRef<Modal>
    callback: (success: boolean, data?: { responsibleEmail: string }) => void
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
}

const RequestUnderageDialog: FC<RequestUnderageDialogProps> = forwardRef<Modal, React.PropsWithChildren<RequestUnderageDialogProps>>(({
    onVisible, visible, ...props }, ref): ReactElement => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<{ responsibleEmail: string }>()
    const styles = useStyleSheet(modalStyle)

    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

    const submitForm = async (data: { responsibleEmail: string }) => {
        props.callback(true, data)
        onVisible(!visible)
    }

    const handleVisibleModal = () => {
        setIsLoading(false)
        props.callback(false)
        onVisible(!visible)
    }

    useFocusEffect(
        useCallback(() => {
            form.reset()
        }, [visible])
    )

    return (
        <Modal
            {...{ ...props, ref: combinedRef }}
            style={styles.modal}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={handleVisibleModal}
        >
            <Card disabled={true}>
                <View style={styles.viewCard}>
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            },
                            minLength: {
                                value: 5,
                                message: `Mín. 5 caracteres`
                            },
                            validate: (e) => e ? isEmailValid(e) : undefined
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label='E-mail do Responsável *'
                                style={styles.input}
                                keyboardType='email-address'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value ? value.replace(/[^0-9A-Za-z]*/, "").toLowerCase() : value}
                                underlineColorAndroid="transparent"
                                autoCapitalize='none'
                                maxLength={60}
                                ref={ref}
                                returnKeyType="done"
                                textContentType="emailAddress"
                                onSubmitEditing={form.handleSubmit(submitForm)}
                            />
                        )}
                        name='responsibleEmail'
                        defaultValue=''
                    />
                    {form.formState.errors.responsibleEmail?.type !== 'validate' && <CustomErrorMessage name='responsibleEmail' errors={form.formState.errors} />}
                    {form.formState.errors.responsibleEmail?.type === 'validate' && <CustomErrorMessage name='responsibleEmail' errors={form.formState.errors} customMessage='E-mail inválido' />}
                </View>

                <View style={styles.viewCardBtn}>
                    <Button status='danger'
                        style={styles.button}
                        onPress={isLoading ? undefined : handleVisibleModal}>
                        Cancelar
                    </Button>
                    <Button status='success'
                        style={styles.button}
                        onPress={form.handleSubmit(submitForm)}
                        accessoryLeft={isLoading ? LoadingIndicator : undefined}>
                        {isLoading ? '' : 'OK'}
                    </Button>
                </View>
            </Card>
        </Modal>
    )
})

export default RequestUnderageDialog