import AttachmentBoxComponent from '@components/attachmentBox'
import CustomErrorMessage from '@components/error'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { DocumentDto } from '@models/Document'
import { ExamDto, ExamImage } from '@models/Exam'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect } from '@react-navigation/native'
import { doctorGetDocumentData, uploadUserFile, userDelete, userGetDocument } from '@services/document.service'
import { updateExam, uploadExam } from '@services/exam.service'
import { Button, Card, Datepicker, Icon, IconProps, IndexPath, Input, Modal, PopoverPlacements, Select, SelectItem, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { getDocumentType, getEntityType } from '@utils/entity'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform, View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { typesOfDocuments } from './data'
import { modalStyle } from './style'

interface AddExamDialogProps {
    ref: ForwardedRef<Modal>
    onRefresh?: Dispatch<React.SetStateAction<ExamDto & ExamImage | undefined>>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    exam?: ExamDto
    readonly?: boolean
    owningUserId?: number
}

const AddExamDialog: FC<AddExamDialogProps> = forwardRef<Modal, React.PropsWithChildren<AddExamDialogProps>>(({
    onVisible, visible, readonly = false, ...props }, ref): ReactElement => {

    const [selectedType, setSelectedType] = useState<IndexPath | IndexPath[]>()
    const { ids } = useAppSelector((state: RootState) => state.user)
    const { localeDateService } = useDatepickerService()
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<ExamDto & ExamImage>({
        defaultValues: props.exam,
    })

    const styles = useStyleSheet(modalStyle)
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [documentDto, setDocumentDto] = useState<DocumentDto>()
    const [loadingDocumentDto, setLoadingDocumentDto] = useState<boolean>(true)
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()
    const { sessionUser } = useAppSelector((state: RootState) => state.auth)

    const loadFile = async () => {
        try {
            if (props.exam) {
                // TODO - buscar o documento e fazer o download
                // por enquanto só vai exibir o nome do anexo...
                if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
                    const response = await userGetDocument({
                        entityId: props.exam.patientId,
                        entityType: getEntityType('exam'),
                        documentType: getDocumentType('exam'),
                        documentId: props.exam.documentId
                    })
                    if (response.status === 201) {
                        setDocumentDto(response.data[0] ?? undefined)
                    } else setDocumentDto(undefined)

                } else if (sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor)) {
                    const response = await doctorGetDocumentData({
                        owningUserId: props.owningUserId,
                        entityId: props.exam.patientId,
                        entityType: getEntityType('exam'),
                        documentType: getDocumentType('exam'),
                        documentId: props.exam.documentId
                    })
                    if (response.status === 201) {
                        setDocumentDto(response.data[0] ?? undefined)
                    } else setDocumentDto(undefined)
                }
            }
        } catch (error) {
            setErrorMessage('Erro ao buscar o documento. Tente novamente mais tarde.')
        }
        setLoadingDocumentDto(false)
    }

    useFocusEffect(
        useCallback(() => {
            if (visible) {
                setSelectedType(undefined)
                setFileResponse(undefined)
                form.reset({
                    ...props.exam,
                    examDate: typeof props.exam?.examDate === 'string' ? localeDateService.parse(props.exam?.examDate, _DATE_FROM_ISO_8601) : localeDateService.today(),
                    examResultDate: typeof props.exam?.examResultDate === 'string' ? localeDateService.parse(props.exam?.examResultDate, _DATE_FROM_ISO_8601) : localeDateService.today()
                })
                if (!props.exam) {
                    setLoadingDocumentDto(false)
                    form.register('examImage', {
                        required: {
                            value: true,
                            message: 'Necessário documentação'
                        },
                        value: undefined
                    })
                } else {
                    setLoadingDocumentDto(true)
                    const examType = form.getValues('examType')
                    if (examType) setSelectedType(new IndexPath(typesOfDocuments.indexOf(examType)))
                }
                loadFile()
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
        setDocumentDto(undefined)
        setIsLoading(false)
        setIsError(false)
        setErrorMessage('')
        onVisible(!visible)
    }

    const handleDocumentDto = () => {
        setDocumentDto(undefined)
        form.register('examImage', {
            required: {
                value: true,
                message: 'Necessário documentação'
            },
            value: undefined
        })
    }

    const submitForm = async (data: ExamDto & ExamImage) => {
        setIsLoading(!isLoading)

        try {
            let response = null
            if (!props.exam || (props.exam && !documentDto)) {
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
                formData.append('entityId', ids?.patientId.toString())
                formData.append('entityType', getEntityType('exam'))
                formData.append('documentType', getDocumentType('exam'))

                try {
                    response = await uploadUserFile(formData)
                } catch (e) {
                    setErrorMessage('Erro ao enviar o documento. Tente novamente mais tarde.')
                    setIsError(true)
                }
            }

            if ((response && response.status === 201 || response?.status === 200 && response?.data) || (props.exam && !response)) {
                const item: ExamDto & ExamImage = {
                    ...data,
                    documentId: response?.data?.id ?? data.documentId,
                    patientId: ids?.patientId as number,
                }
                if (props.exam) {
                    await updateExam(item)

                    if (!documentDto && props.exam) {
                        const docOldId = props.exam.documentId
                        await userDelete(docOldId)
                    }
                } else
                    await uploadExam(item)
                props.onRefresh ? props.onRefresh(item) : undefined
                handleVisibleModal()
                if (props.exam)
                    Toast.show({
                        type: 'success',
                        text2: 'Documento atualizado',
                    })
                else
                    Toast.show({
                        type: 'success',
                        text2: 'Documento adicionado',
                    })
            }

        } catch (error) {
            setErrorMessage('Erro ao cadastrar documento. Tente novamente mais tarde.')
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

    useEffect(() => {
        if (selectedType)
            form.setValue('examType', typesOfDocuments[Number(selectedType) - 1])
        else form.setValue('examType', '')
    }, [selectedType])

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
                    {readonly ? (
                        <>
                            {!documentDto ? (
                                <View style={styles.backdropSpinner}>
                                    <Spinner status='primary' size='small' />
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.label}>Data</Text>
                                    <Text style={styles.textValue}>{form.getValues('examDate') && localeDateService.format(form.getValues('examDate') as Date, _DEFAULT_FORMAT_DATE)}</Text>
                                    <Text style={styles.label}>Tipo de Documento</Text>
                                    <Text style={styles.textValue}>{form.getValues('examType')}</Text>
                                    <Text style={styles.label}>Descrição</Text>
                                    <Text style={styles.textValue}>{form.getValues('data.examDescription')}</Text>
                                    <Text style={styles.label}>Anexo</Text>
                                    <Text style={styles.textValue}>{documentDto?.documentFormat}</Text>
                                </View>
                            )}

                            {/* <View style={{ paddingVertical: 10 }}>
                                <TouchableOpacity disabled style={styles.downloadBtn}>
                                    <Icon name='cloud-download-outline' size={20} style={styles.downloadIcon} />
                                </TouchableOpacity>
                            </View> */}
                        </>
                    ) : (
                        <>
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
                                        disabled={readonly}
                                        size='small'
                                        label={'Data do Documento *'}
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
                            <CustomErrorMessage name='examDate' errors={form.formState.errors} />
                            <Controller
                                control={form.control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Campo obrigatório'
                                    }
                                }}
                                render={({ field: { onBlur, value, name, ref } }) => (
                                    <Select
                                        size='small'
                                        label="Tipo de Documento *"
                                        style={styles.input}
                                        placeholder='Selecione'
                                        testID={name}
                                        onBlur={onBlur}
                                        ref={ref}
                                        selectedIndex={selectedType}
                                        onSelect={setSelectedType}
                                        value={value}
                                    >
                                        {typesOfDocuments.map(item => (
                                            <SelectItem key={item} title={item} />
                                        ))}
                                    </Select>
                                )}
                                name='examType'
                                defaultValue=''
                            />
                            <CustomErrorMessage name='examType' errors={form.formState.errors} />
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
                                        onChangeText={!readonly ? onChange : undefined}
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
                            <CustomErrorMessage name='data.examDescription' errors={form.formState.errors} />

                            <AttachmentBoxComponent
                                handleFile={setFileResponse}
                                file={fileResponse}
                                documentDto={documentDto}
                                loading={loadingDocumentDto}
                                handleDocumentDto={handleDocumentDto}
                                label='Anexo *' />
                            <CustomErrorMessage name='examImage' errors={form.formState.errors} />
                        </>
                    )}
                </View>

                {isError && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text status='danger' category='s1' style={[styles.text, { textAlign: 'center' }]}>{errorMessage}</Text>
                    </View>
                )}
                {!readonly ? (
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
                            accessoryLeft={isLoading ? () => <LoadingIndicatorComponent insideButton size='small' status='basic' /> : undefined}>
                            {isLoading ? '' : props.exam ? 'Editar' : 'Salvar'}
                        </Button>
                    </View>
                ) : (
                    <Button status='info'
                        style={styles.button}
                        onPress={handleVisibleModal}>
                        Voltar
                    </Button>
                )}
            </Card>
        </Modal>
    )
})

export default AddExamDialog