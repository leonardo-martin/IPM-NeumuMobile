import { _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { Notes } from '@models/Notes'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { postDiaryEntry } from '@services/patient.service'
import { Button, Card, Icon, Input, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { modalStyle } from './style'

interface AddPatientDiaryPointDialogProps {
    ref: ForwardedRef<Modal>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
}

const AddPatientDiaryPointDialog: FC<AddPatientDiaryPointDialogProps> = forwardRef<Modal, React.PropsWithChildren<AddPatientDiaryPointDialogProps>>(({ onVisible, visible, ...props }, ref): ReactElement => {

    const route = useRoute()
    const navigation = useNavigation<any>()
    const combinedRef = useCombinedRefs(ref, ref)
    const form = useForm<Notes>()
    const styles = useStyleSheet(modalStyle)
    const { localeDateService } = useDatepickerService()

    useFocusEffect(
        useCallback(() => {
            if (visible) {
                form.reset({})
                const name = `TeleNeumu - ${localeDateService.format(localeDateService.today(), _DEFAULT_FORMAT_DATE)}`
                form.setValue('title', name)
            }
        }, [visible])
    )

    const handleVisibleModal = () => {
        onVisible(!visible)
    }

    const submitForm = async (data: Notes) => {
        await postDiaryEntry({
            patientId: 87,
            date: localeDateService.today(),
            data: {
                ...data
            }
        })
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
                    <Text status='basic' category='label'>Criar Nota</Text>
                    {route.name === 'MyNotes' ?
                        <TouchableOpacity onPress={handleVisibleModal}>
                            <Icon name='close-outline' size={20} style={styles.icon} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => goTo('MyNotes')}>
                            <Text status='primary' category='c1'>Meu Diário</Text>
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
                            onSubmitEditing={() => form.setFocus('description')}
                        />
                    )}
                    name='title'
                    defaultValue=''
                />
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
                    name='description'
                    defaultValue=''
                />
                <View style={styles.viewCardBtn}>
                    <Button status='danger'
                        onPress={handleVisibleModal}
                        style={styles.button}>
                        Cancelar
                    </Button>
                    <Button status='success'
                        onPress={form.handleSubmit(submitForm)}
                        style={styles.button}>
                        Criar
                    </Button>
                </View>
            </Card>
        </Modal>
    )
})

export default AddPatientDiaryPointDialog