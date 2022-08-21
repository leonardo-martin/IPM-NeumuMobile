import CustomErrorMessage from '@components/error'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { useAppSelector } from '@hooks/redux'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientDiaryEntryDto } from '@models/Patient'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { postDiaryEntry, updateDiaryEntry } from '@services/patient.service'
import { Button, Card, Icon, Input, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATETIME } from 'constants/date'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { modalStyle } from './style'

interface AddPatientDiaryEntryDialogProps {
    ref: ForwardedRef<Modal>
    onRefresh: Dispatch<React.SetStateAction<PatientDiaryEntryDto | undefined>> | (() => void)
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    patientDiaryEntry?: PatientDiaryEntryDto
    readonly?: boolean
}

const AddPatientDiaryEntryDialog: FC<AddPatientDiaryEntryDialogProps> = forwardRef<Modal, React.PropsWithChildren<AddPatientDiaryEntryDialogProps>>(({
    onVisible, visible, readonly = false, ...props }, ref): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const route = useRoute()
    const navigation = useNavigation<any>()
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<PatientDiaryEntryDto>({
        defaultValues: props.patientDiaryEntry
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const styles = useStyleSheet(modalStyle)
    const { localeDateService } = useDatepickerService()
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useFocusEffect(
        useCallback(() => {
            if (visible) {
                const title = `Nota - ${localeDateService.format(localeDateService.today(), 'DD/MM/YY')}`
                form.reset({
                    ...props.patientDiaryEntry,
                    date: props.patientDiaryEntry?.date ? new Date(props.patientDiaryEntry?.date as string) : localeDateService.today(),
                    data: {
                        title: props.patientDiaryEntry?.data.title ? props.patientDiaryEntry?.data.title : title,
                        ...props.patientDiaryEntry?.data
                    },
                    ...props.patientDiaryEntry?.updatedAt && {
                        updatedAt: new Date(props.patientDiaryEntry?.updatedAt)
                    }
                })
            }
        }, [visible])
    )

    const handleVisibleModal = () => {
        setErrorMessage('')
        setIsLoading(false)
        setIsError(false)
        onVisible(!visible)
    }

    const submitForm = async (data: PatientDiaryEntryDto) => {
        setIsLoading(!isLoading)
        try {

            const obj: PatientDiaryEntryDto = {
                ...data,
                patientId: ids?.patientId as number,
            }
            let response = null
            if (!props.patientDiaryEntry) {
                response = await postDiaryEntry(obj)
            } else {
                response = await updateDiaryEntry({
                    ...obj,
                    updatedAt: localeDateService.today()
                })
            }
            if (response.status === 201 || response.status === 200) {
                props.onRefresh(response.data)
                handleVisibleModal()
                if (props.patientDiaryEntry)
                    Toast.show({
                        type: 'success',
                        text2: 'Nota atualizada',
                    })
                else
                    Toast.show({
                        type: 'success',
                        text2: 'Nota adicionada',
                    })
            }

        } catch (error) {
            setErrorMessage('Erro ao criar uma nota. Tente novamente mais tarde.')
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const goTo = (routeName: string) => {
        navigation.navigate(routeName)
        handleVisibleModal()
    }

    return (
        <Modal
            {...{ ...props, ref: combinedRef }}
            style={styles.modal}
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={handleVisibleModal}>
            <Card disabled={true} >
                <View style={styles.headerModal}>
                    <View>
                        {props.patientDiaryEntry && props.patientDiaryEntry.updatedAt ? (
                            <Text status='basic' style={styles.textSubtitle}>{`Última atualização: ${localeDateService.format(localeDateService.parse(props.patientDiaryEntry.updatedAt as string, _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATETIME).replace('PM', '').replace('AM', '')}`}</Text>
                        ) : (
                            <Text status='basic' category='label'>{readonly ? 'Detalhes' : 'Criar Nota'}</Text>
                        )}
                    </View>
                    {route.name === 'PatientDiaryEntry' ?
                        <TouchableOpacity onPress={handleVisibleModal}>
                            <Icon name='close-outline' size={20} style={styles.icon} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => goTo('PatientDiaryEntry')}>
                            <Text status='primary' category='c1'>Ver Tudo {'>>'}</Text>
                        </TouchableOpacity>
                    }
                </View>

                {!readonly ? (
                    <>
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
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    size='large'
                                    label="Título *"
                                    style={styles.input}
                                    keyboardType='default'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    maxLength={40}
                                    ref={ref}
                                    returnKeyType="next"
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={() => form.setFocus('data.description')}
                                />
                            )}
                            name='data.title'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='data.title' errors={form.formState.errors} />
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
                                    multiline
                                    scrollEnabled
                                    textStyle={{ minHeight: 64, textAlignVertical: 'top' }}
                                    ref={ref}
                                    returnKeyType="done"
                                    underlineColorAndroid="transparent"
                                    blurOnSubmit={true}
                                />
                            )}
                            name='data.description'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='data.description' errors={form.formState.errors} />
                        {isError && (
                            <View style={{ paddingBottom: 10 }}>
                                <Text status='danger' category='s1' style={[styles.text, { textAlign: 'center' }]}>{errorMessage}</Text>
                            </View>
                        )}
                        <View style={styles.containerBtn}>
                            <Button status='danger'
                                onPress={isLoading ? undefined : handleVisibleModal}
                                style={styles.button}>
                                Cancelar
                            </Button>
                            <Button status='success'
                                onPress={form.handleSubmit(submitForm)}
                                style={styles.button}
                                accessoryLeft={isLoading ? () => <LoadingIndicatorComponent insideButton size='small' status='basic' /> : undefined}>
                                {isLoading ? '' : props.patientDiaryEntry ? 'Editar' : 'Salvar'}
                            </Button>
                        </View>
                    </>
                ) : <>
                    <View>
                        <Text style={styles.label}>Título</Text>
                        <Text style={styles.textValue}>{form.getValues('data.title')}</Text>
                        <Text style={styles.label}>Descrição</Text>
                        <Text style={styles.textValue}>{form.getValues('data.description')}</Text>
                    </View>
                </>}
            </Card>
        </Modal>
    )
})

export default AddPatientDiaryEntryDialog