import AttachmentBoxComponent from '@components/attachmentBox'
import CustomErrorMessage from '@components/error'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { DocumentDto, FileDto } from '@models/Document'
import { ExamDto } from '@models/Exam'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { doctorGetDocumentData, doctorGetDocumentFile, requestPermission, saveFileToDevice, uploadUserFile, userDelete, userGetDocument } from '@services/document.service'
import { updateExam, uploadExam } from '@services/exam.service'
import { Button, Datepicker, Icon, IconProps, IndexPath, Input, PopoverPlacements, Select, SelectItem, Text, useStyleSheet } from '@ui-kitten/components'
import { TYPES_DOCUMENTS } from '@utils/constants'
import { getDocumentType, getEntityType } from '@utils/entity'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Keyboard, Platform, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { AppInfoService } from 'services/app-info.service'
import { RootState } from 'store'
import { createDocStyle } from './create-document.style'

interface PatientDocumentParams {
    editable?: boolean
    readonly?: boolean
    owningUserId?: number
    isNew?: boolean
}

const CalendarIcon = (props: IconProps) => (
    <Icon {...props} name='calendar-outline' pack='eva' />
)

const CreatePatientDocumentScreen: FC = (): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const [params, setParams] = useState<{ exam?: ExamDto, props: PatientDocumentParams } | undefined>(undefined)
    const form = useForm<ExamDto>()
    const styles = useStyleSheet(createDocStyle)
    const route = useRoute()
    const navigation = useNavigation()
    const { localeDateService } = useDatepickerService()
    const [documentDto, setDocumentDto] = useState<DocumentDto>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingDocument, setIsLoadingDocument] = useState<boolean>(false)
    const [selectedType, setSelectedType] = useState<IndexPath | IndexPath[]>()
    const [file, setFile] = useState<FileDto[] | undefined>()
    const [fileName, setFileName] = useState<string | undefined>()

    const submitForm = useCallback(async (data: ExamDto) => {
        setIsLoading(!isLoading)

        try {
            let response = null
            if ((!params?.exam?.id || (params.exam.id && fileName !== documentDto?.documentFormat)) && file) {
                const formData = new FormData()
                formData.append('fileFormat', file[0].fileName)
                formData.append('file', {
                    uri: Platform.OS === 'android'
                        ? file[0].uri
                        : file[0].uri.replace('file://', ''),
                    name: file[0].fileName,
                    type: file[0].type
                })
                formData.append('entityId', ids?.patientId.toString())
                formData.append('entityType', getEntityType('exam'))
                formData.append('documentType', getDocumentType('exam'))

                try {
                    response = await uploadUserFile(formData)
                } catch (e) {
                    Toast.show({
                        type: 'danger',
                        text2: 'Erro ao enviar o documento.',
                    })
                    return
                }
            } else {
                if (fileName !== documentDto?.documentFormat) {
                    Toast.show({
                        type: 'info',
                        text2: 'Documento não anexado',
                    })
                    return
                }

            }

            if ((response && response.status === 201 || response?.status === 200 && response?.data) || (params && !response)) {
                const item: ExamDto = {
                    ...data,
                    documentId: response?.data?.id ?? data.documentId,
                    patientId: ids?.patientId as number,
                }
                if (params?.exam?.id) {
                    const res = await updateExam({ ...item, examResultDate: new Date() })
                    if (!documentDto && params?.exam?.documentId && res.status === 201) {
                        const docOldId = params.exam.documentId
                        await userDelete(docOldId)
                    }
                    Toast.show({
                        type: 'success',
                        text2: 'Documento atualizado',
                    })
                } else {
                    await uploadExam({
                        ...item,
                        examResultDate: new Date()
                    })
                    Toast.show({
                        type: 'success',
                        text2: 'Documento adicionado',
                    })
                }
                setSelectedType(undefined)
                setDocumentDto(undefined)
                setFileName(undefined)
                setFile(undefined)
                navigation.goBack()

            }

        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao cadastrar documento.',
            })
        } finally {
            setIsLoading(false)
        }
    }, [params, fileName, ids, file])

    const loadFile = useCallback(async () => {
        try {
            if (params && params.exam?.id) {
                if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
                    const response = await userGetDocument({
                        entityId: params.exam?.patientId,
                        entityType: getEntityType('exam'),
                        documentType: getDocumentType('exam'),
                        documentId: params.exam?.documentId?.toString()
                    })
                    if (response.status === 201) {
                        setDocumentDto(response.data[0] ?? undefined)
                    } else setDocumentDto(undefined)

                } else if (sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor)) {
                    const response = await doctorGetDocumentData({
                        owningUserId: params.props?.owningUserId,
                        entityId: params.exam?.patientId,
                        entityType: getEntityType('exam'),
                        documentType: getDocumentType('exam'),
                        documentId: params.exam?.documentId?.toString()
                    })
                    if (response.status === 201) {
                        setDocumentDto(response.data[0] ?? undefined)
                    } else setDocumentDto(undefined)
                }
            }
            setIsLoadingDocument(false)
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao baixar documento.',
            })
        }
    }, [params])

    useFocusEffect(
        useCallback(() => {
            const param = route.params as { exam?: ExamDto, props: PatientDocumentParams }
            setParams(param)
            return () => {
                form.reset({ data: { examDescription: "" }, examDate: "", examType: "" })
                setParams(undefined)
                setSelectedType(undefined)
                setDocumentDto(undefined)
                setFileName(undefined)
                setFile(undefined)
            }
        }, [route.params])
    )

    useEffect(() => {
        if (params?.exam?.id && (params?.props?.editable || params?.props?.readonly)) {
            setIsLoadingDocument(true)
            form.reset({
                ...params.exam as ExamDto,
                examDate: typeof params.exam?.examDate === 'string' ? localeDateService.parse(params.exam?.examDate, _DATE_FROM_ISO_8601) : localeDateService.today(),
                examResultDate: typeof params.exam?.examResultDate === 'string' ? localeDateService.parse(params.exam?.examResultDate, _DATE_FROM_ISO_8601) : localeDateService.today()
            })
            loadFile()
            if (params?.props?.editable) {
                setSelectedType(new IndexPath(TYPES_DOCUMENTS.indexOf(params.exam.examType)))
            }
        } else {
            setIsLoadingDocument(false)
        }

    }, [params, loadFile])

    useEffect(() => {
        if (selectedType)
            form.setValue('examType', TYPES_DOCUMENTS[Number(selectedType) - 1])
        else form.resetField('examType')
    }, [selectedType])

    useEffect(() => {
        if (documentDto)
            setFileName(documentDto.documentFormat)
    }, [documentDto])


    const download = async () => {
        try {
            const version = AppInfoService.getSystemVersion().split('.')
            let bOk = await requestPermission(Number(version[0] ?? 0) ?? 0)

            if (bOk) {
                Alert.alert(
                    'Deseja efetuar o download do arquivo?',
                    'O arquivo será baixando em background e avisaremos quando estiver concluído',
                    [
                        {
                            text: 'Sim',
                            style: 'default',
                            onPress: () => downloadFile()
                        },
                        {
                            text: 'Não',
                            style: 'cancel'
                        }
                    ]
                )
            }
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao solicitar permissão',
            })
        }
    }

    const downloadFile = useCallback(async () => {
        try {
            if (params?.exam?.patientId && documentDto?.id) {
                const response = await doctorGetDocumentFile(params?.exam?.patientId.toString(), documentDto?.id)
                if (response.status === 200) {
                    const ret = await saveFileToDevice(response.data.data, documentDto.documentFormat)
                    if (ret.recorded)
                        Alert.alert(
                            'Baixar arquivo',
                            'Arquivo baixado concluído com sucesso.',
                            [
                                {
                                    text: 'OK',
                                    style: 'default'
                                }
                            ]
                        )
                    else
                        Toast.show({
                            type: 'warning',
                            text2: 'Não foi possível baixar o arquivo',
                        })
                } else {
                    Toast.show({
                        type: 'danger',
                        text2: 'Ocorreu um erro ao baixar o arquivo',
                    })
                }
            }
        } catch (error) {
            console.error(error)
            Toast.show({
                type: 'danger',
                text2: 'Erro ao baixar o arquivo. Entre em contato com o administrador',
            })
        }

    }, [params, documentDto])

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                {isLoadingDocument ? (
                    <LoadingIndicatorComponent />
                ) : (
                    <View style={styles.container}>
                        {params?.props?.readonly ? (
                            <>
                                <View>
                                    <Text style={styles.label}>Data</Text>
                                    <Text style={styles.textValue}>{form.getValues('examDate') && localeDateService.format(form.getValues('examDate') as Date, _DEFAULT_FORMAT_DATE)}</Text>
                                    <Text style={styles.label}>Tipo de Documento</Text>
                                    <Text style={styles.textValue}>{form.getValues('examType')}</Text>
                                    <Text style={styles.label}>Descrição</Text>
                                    <Text style={styles.textValue}>{form.getValues('data.examDescription')}</Text>
                                    <Text style={styles.label}>Documento</Text>
                                    <TouchableOpacity
                                        style={styles.buttonDownload}
                                        onPress={download}
                                    >
                                        <View style={styles.containerDownloadButton}>
                                            <Icon name='cloud-download-outline' style={styles.iconControl} size={20} pack='ionicons' />
                                            <Text style={[styles.text, styles.textControl]} category='s1'>Baixar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
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
                                            placeholder='DD/MM/AAAA'
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
                                            placeholder='Clique AQUI para selecionar o Tipo de Documento'
                                            testID={name}
                                            onBlur={onBlur}
                                            ref={ref}
                                            selectedIndex={selectedType}
                                            onSelect={setSelectedType}
                                            value={value}
                                        >
                                            {TYPES_DOCUMENTS.map(item => (
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
                                            onChangeText={onChange}
                                            value={value}
                                            ref={ref}
                                            returnKeyType="done"
                                            underlineColorAndroid="transparent"
                                            multiline
                                            textStyle={{ minHeight: 90, textAlignVertical: 'top' }}
                                            scrollEnabled
                                            blurOnSubmit={true}
                                            placeholder='Digite suas observações sobre o item acima'
                                        />
                                    )}
                                    name='data.examDescription'
                                    defaultValue=''
                                />
                                <CustomErrorMessage name='data.examDescription' errors={form.formState.errors} />

                                <AttachmentBoxComponent
                                    setFile={setFile}
                                    fileName={fileName}
                                    documentId={params?.exam?.documentId}
                                    setFileName={setFileName}
                                    disabled={isLoading}
                                    isNew={params?.props?.isNew || false}
                                />
                                <CustomErrorMessage name='examImage' errors={form.formState.errors} />
                                <View style={styles.containerButton}>
                                    <Button status='success'
                                        style={styles.button}
                                        onPress={form.handleSubmit(submitForm)}
                                        disabled={isLoading}
                                        accessoryLeft={isLoading ? () => <LoadingIndicatorComponent insideButton size='small' status='basic' /> : undefined}>
                                        {isLoading ? '' : params?.props?.editable && params?.exam?.id ? 'Editar' : 'Salvar'}
                                    </Button>
                                </View>
                            </>
                        )}

                    </View>
                )}
            </SafeAreaLayout>
        </>
    )
}

export default CreatePatientDocumentScreen
