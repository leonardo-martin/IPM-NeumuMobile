import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientDiaryEntryDto } from '@models/Patient'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { postDiaryEntry } from '@services/patient.service'
import { Button, Card, Icon, Input, Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { modalStyle } from './style'

interface AddPatientDiaryEntryDialogProps {
    ref: ForwardedRef<Modal>
    onRefresh: Dispatch<React.SetStateAction<PatientDiaryEntryDto | undefined>> | (() => void)
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    patientDiaryEntry?: PatientDiaryEntryDto
}

const AddPatientDiaryEntryDialog: FC<AddPatientDiaryEntryDialogProps> = forwardRef<Modal, React.PropsWithChildren<AddPatientDiaryEntryDialogProps>>(({
    onVisible, visible, ...props }, ref): ReactElement => {

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
                patientId: 87,
            }
            const response = await postDiaryEntry(obj)
            if (response.status === 201 || response.status === 200) {
                props.onRefresh(response.data)
                handleVisibleModal()
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
                <View style={styles.headerModal}>
                    <Text status='basic' category='label'>Criar Nota</Text>
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
                {form.formState.errors.data?.title && <Text category='s1' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.data?.title?.message}</Text>}

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
                            returnKeyType="send"
                            underlineColorAndroid="transparent"
                        />
                    )}
                    name='data.description'
                    defaultValue=''
                />
                {form.formState.errors.data?.description && <Text category='s1' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.data?.description?.message}</Text>}

                {isError && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text status='danger' category='s1' style={[styles.text, { textAlign: 'center' }]}>{errorMessage}</Text>
                    </View>
                )}
                <View style={styles.viewCardBtn}>
                    <Button status='danger'
                        onPress={isLoading ? undefined : handleVisibleModal}
                        style={styles.button}>
                        Cancelar
                    </Button>
                    <Button status='success'
                        onPress={form.handleSubmit(submitForm)}
                        style={styles.button}
                        accessoryLeft={isLoading ? LoadingIndicator : undefined}>
                        {isLoading ? '' : 'Salvar'}
                    </Button>
                </View>
            </Card>
        </Modal>
    )
})

export default AddPatientDiaryEntryDialog