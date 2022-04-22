import AttachmentBoxComponent from '@components/attachmentBox'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { ExamDto, ExamImage } from '@models/Exam'
import { useFocusEffect } from '@react-navigation/native'
import { uploadUserFile } from '@services/document.service'
import { uploadExam } from '@services/exam.service'
import { Button, Card, Input, Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform, View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { modalStyle } from './style'

interface AddExamModalProps {
    ref: ForwardedRef<Modal>
    onRefresh: Dispatch<React.SetStateAction<ExamDto & ExamImage | undefined>>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
}

const AddExamModal: FC<AddExamModalProps> = forwardRef<Modal, React.PropsWithChildren<AddExamModalProps>>(({ onRefresh, onVisible, visible, ...props }, ref): ReactElement => {

    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<ExamDto & ExamImage>()
    const styles = useStyleSheet(modalStyle)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()

    useFocusEffect(
        useCallback(() => {
            form.reset()
            setFileResponse(undefined)
        }, [])
    )

    const handleVisibleModal = () => {
        form.reset({})
        setIsLoading(false)
        setIsError(false)
        setErrorMessage('')
        onVisible(!visible)
    }

    const submitForm = async (data: ExamDto & ExamImage) => {
        setIsLoading(!isLoading)

        try {
            if (fileResponse) {
                const formData = new FormData()
                formData.append('fileFormat', fileResponse[0].name)
                formData.append('file', {
                    uri: Platform.OS === 'android'
                        ? fileResponse[0].uri
                        : fileResponse[0].uri.replace('file://', ''),
                    name: fileResponse[0].name,
                    type: fileResponse[0].type
                })
                formData.append('entityId', 1)
                formData.append('entityType', 'entityType')
                formData.append('documentType', 'user-exam-file')

                const response = await uploadUserFile(formData)

                await uploadExam({
                    ...data,
                    patientId: 87,
                    documentId: response.data.id,
                    examDate: new Date(),
                    examResultDate: new Date(),
                })

                onRefresh({
                    ...data,
                    patientId: 87,
                    documentId: response.data.id,
                    examDate: new Date(),
                    examResultDate: new Date(),
                })
                handleVisibleModal()
            }
        } catch (error) {
            setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.')
            setIsError(true)
        } finally {
            setIsLoading(false)
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

    return (
        <Modal
            {...{ ...props, ref: combinedRef }}
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
                                onSubmitEditing={() => form.setFocus('data.examDescription')}
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
                                size='large'
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
                                multiline
                                textStyle={{ minHeight: 90, textAlignVertical: 'top' }}
                                onPressIn={clearError}
                                scrollEnabled
                            />
                        )}
                        name='data.examDescription'
                        defaultValue=''
                    />
                    {form.formState.errors.data?.examDescription && <Text category='s1' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.data?.examDescription?.message}</Text>}

                    <AttachmentBoxComponent
                        handleFile={setFileResponse}
                        file={fileResponse}
                        label='Anexar Documentação' />
                </View>

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

export default AddExamModal