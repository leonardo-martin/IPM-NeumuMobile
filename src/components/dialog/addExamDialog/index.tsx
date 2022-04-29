import AttachmentBoxComponent from '@components/attachmentBox'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ExamDto, ExamImage } from '@models/Exam'
import { useFocusEffect } from '@react-navigation/native'
import { uploadUserFile } from '@services/document.service'
import { uploadExam } from '@services/exam.service'
import { Button, Card, Datepicker, Icon, IconProps, Input, Modal, PopoverPlacements, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform, View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { RootState } from 'store'
import { modalStyle } from './style'

interface AddExamDialogProps {
    ref: ForwardedRef<Modal>
    onRefresh: Dispatch<React.SetStateAction<ExamDto & ExamImage | undefined>>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    exam?: ExamDto
}

const AddExamDialog: FC<AddExamDialogProps> = forwardRef<Modal, React.PropsWithChildren<AddExamDialogProps>>(({
    onVisible, visible, ...props }, ref): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const { localeDateService } = useDatepickerService()
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<ExamDto & ExamImage>({
        defaultValues: props.exam
    })

    const styles = useStyleSheet(modalStyle)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()

    useFocusEffect(
        useCallback(() => {
            if (visible) {
                setFileResponse(undefined)
                form.reset({
                    ...props.exam,
                    examDate: typeof props.exam?.examDate === 'string' ? localeDateService.parse(props.exam?.examDate, _DATE_FROM_ISO_8601) : localeDateService.today(),
                    examResultDate: typeof props.exam?.examResultDate === 'string' ? localeDateService.parse(props.exam?.examResultDate, _DATE_FROM_ISO_8601) : localeDateService.today()
                })
                form.register('examImage', {
                    required: {
                        value: true,
                        message: 'Necessário documentação'
                    },
                    value: undefined
                })
            }
        }, [visible])
    )

    useEffect(() => {
        if (fileResponse) {
            form.setValue('examImage', fileResponse[0])
            form.clearErrors('examImage')
        } else {
            form.setValue('examImage', undefined)
        }
    }, [fileResponse])

    useFocusEffect(
        useCallback(() => {
            setFileResponse(undefined)
        }, [])
    )

    const handleVisibleModal = () => {
        setIsLoading(false)
        setIsError(false)
        setErrorMessage('')
        onVisible(!visible)
    }

    const submitForm = async (data: ExamDto & ExamImage) => {
        setIsLoading(!isLoading)

        try {
            const formData = new FormData()
            const file = data.examImage as DocumentPickerResponse
            formData.append('fileFormat', file.name)
            formData.append('file', {
                uri: Platform.OS === 'android'
                    ? file.uri
                    : file.uri.replace('file://', ''),
                name: file.name,
                type: file.type
            })
            formData.append('entityId', 1)
            formData.append('entityType', 'entityType')
            formData.append('documentType', 'user-exam-file')

            let response = null
            try {
                response = await uploadUserFile(formData)
            } catch (e) {
                setErrorMessage('Erro ao enviar o documento. Tente novamente mais tarde.')
                setIsError(true)
            }

            if (response && response?.status === 201 || response?.status === 200 && response?.data) {
                const item: ExamDto & ExamImage = {
                    ...data,
                    patientId: ids?.patientId as number,
                    documentId: response.data.id
                }
                await uploadExam(item)
                props.onRefresh(item)
                handleVisibleModal()
            }

        } catch (error) {
            setErrorMessage('Erro ao cadastrar exame. Tente novamente mais tarde.')
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

    const CalendarIcon = (props: IconProps) => (
        <Icon {...props} name='calendar-outline' pack='eva' />
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
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Datepicker
                                size='small'
                                label='Data do Exame *'
                                date={value}
                                onSelect={onChange}
                                accessoryRight={CalendarIcon}
                                onBlur={onBlur}
                                ref={ref}
                                testID={name}
                                style={styles.input}
                                dateService={localeDateService}
                                max={localeDateService.today()}
                                placement={PopoverPlacements.BOTTOM}
                                min={new Date(1900, 0, 0)}
                                backdropStyle={styles.backdropDatepicker}
                                boundingMonth={false}
                                onPress={() => Keyboard.dismiss()}
                            />
                        )}
                        name='examDate'
                    />
                    {form.formState.errors.examDate?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.examDate?.message}</Text>}
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Datepicker
                                size='small'
                                label='Resultado do Exame *'
                                date={value}
                                onSelect={onChange}
                                accessoryRight={CalendarIcon}
                                onBlur={onBlur}
                                ref={ref}
                                testID={name}
                                style={styles.input}
                                dateService={localeDateService}
                                max={localeDateService.today()}
                                placement={PopoverPlacements.BOTTOM}
                                min={new Date(1900, 0, 0)}
                                backdropStyle={styles.backdropDatepicker}
                                boundingMonth={false}
                                onPress={() => Keyboard.dismiss()}
                            />
                        )}
                        name='examResultDate'
                    />
                    {form.formState.errors.examResultDate?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.examResultDate?.message}</Text>}
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
                                label="Descrição *"
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                returnKeyType="done"
                                underlineColorAndroid="transparent"
                                multiline
                                textStyle={{ minHeight: 90, textAlignVertical: 'top' }}
                                onPressIn={clearError}
                                scrollEnabled
                                blurOnSubmit={true}
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
                    {form.formState.errors.examImage && <Text category='s2' style={styles?.text}>{form.formState.errors.examImage?.message}</Text>}

                </View>

                {isError && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text status='danger' category='s1' style={[styles.text, { textAlign: 'center' }]}>{errorMessage}</Text>
                    </View>
                )}
                <View style={styles.viewCardBtn}>
                    <Button status='danger'
                        style={styles.button}
                        onPress={isLoading ? undefined : handleVisibleModal}>
                        Cancelar
                    </Button>
                    <Button status='success'
                        style={styles.button}
                        onPress={form.handleSubmit(submitForm)}
                        disabled={isLoading}
                        accessoryLeft={isLoading ? LoadingIndicator : undefined}>
                        {isLoading ? '' : 'Salvar'}
                    </Button>
                </View>
            </Card>
        </Modal>
    )
})

export default AddExamDialog