import CustomErrorMessage from '@components/error'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Card, Icon, IconProps, Modal, Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { modalStyle } from './style'

const options = [
    'Paciente',
    'Profissional de Saúde',
    // 'Especialista'
]

interface UserType {
    type?: number
}

interface SignUpOptDialogProps {
    ref: ForwardedRef<Modal>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    onActionButton: (index: number | undefined) => void
}

const SignUpOptDialog: FC<SignUpOptDialogProps> = forwardRef<Modal, React.PropsWithChildren<SignUpOptDialogProps>>(({ ...props }, ref): ReactElement => {

    const form = useForm<UserType>()
    const combinedRef = useCombinedRefs(ref, ref)
    const styles = useStyleSheet(modalStyle)

    const handleVisibleModal = () => {
        form.reset()
        props.onVisible(!props.visible)
    }

    useFocusEffect(
        useCallback(() => {
            if (!props.visible) form.reset()
            else Keyboard.dismiss()
        }, [props.visible])
    )

    const ArrowIcon = (props: IconProps) => (
        <Icon {...props} name='arrowhead-right-outline' pack='eva' />
    )

    const submit = (data: UserType) => {
        props.onActionButton(data?.type)
    }

    return (
        <Modal
            ref={combinedRef}
            style={styles.modal}
            visible={props.visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={handleVisibleModal}>
            <Card disabled style={styles.card}>
                <View style={styles.headerModal}>
                    <Text category='s1' style={styles.text}>QUERO ME CADASTRAR COMO</Text>
                    <TouchableOpacity onPress={handleVisibleModal}>
                        <Icon name='close-outline' size={20} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerRadioGroup}>
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Selecione uma opção'
                            }
                        }}
                        render={({ field: { name, ref, onChange, value } }) => (
                            <RadioGroup
                                testID={name}
                                ref={ref}
                                selectedIndex={value}
                                onChange={onChange}>
                                {options.map((_, index) => (
                                    <Radio
                                        key={index}
                                        style={styles.radio}>
                                        {evaProps => <Text
                                            {...evaProps}
                                            category='p1'>{_.toUpperCase()}</Text>}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                        name='type'
                    />
                    <CustomErrorMessage name='type' errors={form.formState.errors} />
                </View>
                <View style={styles.containerButton}>
                    <Button
                        onPress={form.handleSubmit(submit)}
                        accessoryRight={ArrowIcon}
                        status='primary'>PROSSEGUIR</Button>
                </View>
            </Card>
        </Modal>
    )
})

export default SignUpOptDialog