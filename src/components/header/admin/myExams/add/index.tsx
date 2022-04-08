import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Button, Card, Icon, Input, Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { Exam, ExamImage } from '@models/Exam'
import { modalStyle } from './style'
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'

interface RegisterModalProps {
    ref: ForwardedRef<Modal>
    onRefresh: Dispatch<React.SetStateAction<Exam & ExamImage | undefined>>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
}

const RegisterModal: FC<RegisterModalProps> = forwardRef<Modal, React.PropsWithChildren<RegisterModalProps>>(({ onRefresh, onVisible, visible }, ref): ReactElement => {

    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<Exam & ExamImage>()
    const styles = useStyleSheet(modalStyle)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()

    const handleVisibleModal = () => {
        form.reset({})
        setIsLoading(false)
        setIsError(false)
        setErrorMessage('')
        onVisible(!visible)
    }

    const submitForm = (data: Exam & ExamImage) => {
        setIsLoading(!isLoading)

        try {
            const obj: any = {
                ...data,
                examDate: new Date()
            }
            setTimeout(() => {
                onRefresh(obj)
                handleVisibleModal()
            }, 2000)
        } catch (error) {
            setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.')
            setIsError(true)
        } finally {
            if (isLoading) setIsLoading(false)
        }
    }

    const clearError = () => {
        if (isError) {
            setIsError(false)
            setErrorMessage('')
        }
    }

    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                allowMultiSelection: false,
            })
            setFileResponse(response)
            console.log(response)
        } catch (err) {
        
        }
    }, [])

    return (
        <Modal
            ref={combinedRef}
            style={styles.modal}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={handleVisibleModal}>
            <Card disabled={true} >
                <View style={styles.viewCard}>
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label={evaProps => <Text {...evaProps}>TIPO DE EXAME *</Text>}
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                maxLength={30}
                                returnKeyType="next"
                                onSubmitEditing={() => form.setFocus('examDescription')}
                                underlineColorAndroid="transparent"
                                onPressIn={clearError}
                            />
                        )}
                        name='examType'
                        defaultValue=''
                    />
                    {form.formState.errors.examType && <Text category='s1' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.examType?.message}</Text>}
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label={evaProps => <Text {...evaProps}>DESCRIÇÃO *</Text>}
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                returnKeyType="send"
                                underlineColorAndroid="transparent"
                                multiline={true}
                                textStyle={{ minHeight: 90 }}
                                onPressIn={clearError}
                            />
                        )}
                        name='examDescription'
                        defaultValue=''
                    />
                    {form.formState.errors.examDescription && <Text category='s1' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.examDescription?.message}</Text>}
                </View>

                <TouchableOpacity
                    style={styles.attachDoc}
                    onPress={handleDocumentSelection}
                >
                    {!fileResponse ?
                        <>
                            <Text style={styles.text} category='label' appearance='hint'>ANEXAR</Text>
                            <Icon name='attach-outline' style={styles.icon} size={20} pack='ionicons' />
                        </>
                        :
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.textFile} category='s1'>{fileResponse[0].name}</Text>
                            <TouchableOpacity onPress={() => setFileResponse(undefined)}>
                                <Icon name='close-outline' style={styles.iconRed} size={30} pack='ionicons' />
                            </TouchableOpacity>
                        </View>
                    }
                </TouchableOpacity>

                {isError && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text status='danger' category='s1' style={[styles.text, { textAlign: 'center' }]}>{errorMessage}</Text>
                    </View>
                )}
                <View style={styles.viewCardBtn}>
                    <Button status='danger'
                        style={styles.button}
                        onPress={handleVisibleModal}>
                        Cancelar
                    </Button>
                    <Button status='success'
                        style={styles.button}
                        onPress={form.handleSubmit(submitForm)}
                        disabled={isLoading}
                        accessoryLeft={isLoading ? LoadingIndicator : undefined}>
                        Salvar
                    </Button>
                </View>
            </Card>
        </Modal>
    )
})

export default RegisterModal