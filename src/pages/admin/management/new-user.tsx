import CustomErrorMessage from '@components/error'
import RegisterHeader from '@components/header/register'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ETypeOfDocument, UserDoctorData } from '@models/User'
import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { getSpecialties } from '@services/specialties.service'
import { createUser } from '@services/user.service'
import { setSpecialties } from '@store/ducks/common'
import { Datepicker, Icon, IconProps, IndexPath, Input, PopoverPlacements, Radio, RadioGroup, Select, SelectItem, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { extractFieldString, getGender, openMailTo } from '@utils/common'
import { formatCpf, formatPhone, formatRNM, isEmailValid, onlyNumbers } from '@utils/mask'
import { validatePasswd } from '@utils/validators'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, BackHandler, Keyboard, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { typeOfPersonalDocuments } from 'utils/constants'
import { managementStyle } from './new-user.style'

const NewUserScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(managementStyle)
    const form = useForm<UserDoctorData>()
    const [selectedTypeOfDocument, setSelectedTypeOfDocument] = useState<IndexPath | IndexPath[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingPostalCode, setIsLoadingPostalCode] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()
    const dateForOver = localeDateService.addYear(localeDateService.today(), -18)
    const [selectedSpecialty, setSelectedSpecialty] = useState<IndexPath | IndexPath[]>()
    const isFocused = useIsFocused()
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [secureTextEntryRepeat, setSecureTextEntryRepeat] = useState(true)
    const navigation = useNavigation<any>()
    const [bOtherDescription, setBOtherDescription] = useState(false)

    const emailConfirm = form.watch("email")
    const password = useRef<string | undefined>()
    password.current = form.watch("password", "")
    const typeOfDocument = form.watch("typeOfDocument")

    const dispatch = useAppDispatch()
    const { specialties } = useAppSelector((state: RootState) => state.common)

    const loadSpecialties = async () => {
        if (specialties.length === 0) {
            const res = await getSpecialties()
            dispatch(setSpecialties(res.data))
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadSpecialties()
        }, [])
    )
    useFocusEffect(
        useCallback(() => {
            form.reset()
            setSelectedIndex(-1)
            setSecureTextEntry(false)
            setIsLoading(false)
            setSelectedSpecialty(undefined)
            setIsLoadingPostalCode(false)
        }, [])
    )

    const hasUnsavedChanges = () => {
        Alert.alert(
            'Descartar alterações?',
            'Você tem alterações não salvas. Tem certeza que deseja sair dessa tela?',
            [
                { text: "Não", style: 'cancel', onPress: () => { } },
                {
                    text: 'Sim',
                    style: 'destructive',
                    onPress: () => navigation.goBack(),
                },
            ]
        )
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                hasUnsavedChanges()
                return true
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [])
    )

    useEffect(() => {
        if (selectedSpecialty) {
            const specialty = specialties[Number(selectedSpecialty) - 1]
            form.setValue('specialty.description', specialty.description)
            if (specialty && specialty.description.toLowerCase().includes('outro')) setBOtherDescription(true)
            else {
                form.setValue('specialty.others', '')
                setBOtherDescription(false)
            }
        } else {
            form.setValue('specialty.description', '')
            setBOtherDescription(false)
        }
    }, [selectedSpecialty])

    useEffect(() => {
        setSecureTextEntry(true)
    }, [isFocused])

    const handleGender = (index: number) => {
        setSelectedIndex(index)
        form.setValue('sex', getGender(index) as string)
        if (index !== -1) form.clearErrors('sex')
    }

    const CalendarIcon = (props: IconProps) => (
        <Icon {...props} name='calendar-outline' pack='eva' />
    )

    const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry)
    const toggleSecureEntryRepeat = () => setSecureTextEntryRepeat(!secureTextEntryRepeat)

    const renderIconRightPassword = (props: IconProps) => (
        <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={toggleSecureEntry} pack='eva' />
    )

    const renderIconRightRepeat = (props: IconProps) => (
        <Icon {...props} name={secureTextEntryRepeat ? 'eye-off' : 'eye'} onPress={toggleSecureEntryRepeat} pack='eva' />
    )

    const onSubmit = async (data: UserDoctorData) => {
        setIsLoading(!isLoading)

        var messageError = ''
        try {
            const newData = data as UserDoctorData

            newData.professionalTypeId = "1"
            if (newData.specialty) newData.specialty.professionalTypeId = "1"

            if (newData.specialty?.others && newData.specialty.others !== '') {
                newData.specialty.description = newData.specialty?.others
            } else {
                delete newData.specialty?.others
            }

            const response = await createUser(newData, 'doctor')
            if (response.status !== 201) {
                const message = response.data?.message
                if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
                    var field = extractFieldString(message)
                    messageError = field + ' já cadastrado'
                } else {
                    messageError = 'Ocorreu um erro. Tente novamente mais tarde.'
                }
            }
        } catch (error) {
            messageError = 'Ocorreu um erro inesperado. Entre em contato com o administrador'
        } finally {
            setIsLoading(false)
        }

        if (messageError !== '')
            Toast.show({
                type: 'danger',
                text2: messageError,
            })
        else {
            Toast.show({
                type: 'success',
                text2: 'Usuário cadastrado',
            })
            form.reset()
        }
    }

    useEffect(() => {
        if (selectedTypeOfDocument && typeOfPersonalDocuments) {
            const type = typeOfPersonalDocuments[Number(selectedTypeOfDocument) - 1]
            if (type && type.label !== form.getValues('typeOfDocument')) {
                form.setValue('cpf', undefined)
                form.setValue('rne', undefined)
                form.setValue('typeOfDocument', type.label)
            }
        }
    }, [selectedTypeOfDocument, typeOfPersonalDocuments])

    return (
        <>
            <RegisterHeader
                form={form}
                active={0}
                onBack={hasUnsavedChanges}
                onNext={() => null}
                onFinish={form.handleSubmit(onSubmit)}
                numberScreens={1}
            />
            <SafeAreaLayout style={styles.safeArea}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='interactive'
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid
                    contentContainerStyle={{ flexGrow: 1 }}>
                    {isLoadingPostalCode ?
                        <>
                            <View style={styles.backdropSpinner}>
                                <Spinner size='giant' />
                            </View>
                        </> : null}
                    <View style={styles.box}>
                        <Text category='label' style={{
                            textAlign: 'center', fontSize: 14
                        }}>Profissional de Saúde</Text>
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
                                    size='small'
                                    label="Nome Completo *"
                                    style={styles.input}
                                    keyboardType='default'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    ref={ref}
                                    maxLength={60}
                                    returnKeyType="next"
                                    onSubmitEditing={() => form.setFocus('cpf')}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="words"
                                    textContentType="name"
                                />
                            )}
                            name='name'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='name' errors={form.formState.errors} />
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
                                    label="Documento *"
                                    style={styles.input}
                                    placeholder='Selecione'
                                    testID={name}
                                    onBlur={onBlur}
                                    ref={ref}
                                    selectedIndex={selectedTypeOfDocument}
                                    onSelect={setSelectedTypeOfDocument}
                                    value={value}
                                >
                                    {typeOfPersonalDocuments && typeOfPersonalDocuments.map((item: any, index: number) => (
                                        <SelectItem key={item.value} title={item.label} />
                                    ))}
                                </Select>
                            )}
                            name='typeOfDocument'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='typeOfDocument' errors={form.formState.errors} />

                        {typeOfDocument === ETypeOfDocument.CPF && (
                            <>
                                <Controller
                                    control={form.control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Campo obrigatório'
                                        },
                                        minLength: {
                                            value: 14,
                                            message: `Mín. 14 caracteres`
                                        },
                                        validate: (e) => e ? validate(e) : undefined
                                    }}
                                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                        <Input
                                            size='small'
                                            label="CPF *"
                                            style={styles.input}
                                            keyboardType='number-pad'
                                            testID={name}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={formatCpf(value)}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize='none'
                                            maxLength={14}
                                            ref={ref}
                                            returnKeyType="next"
                                            onSubmitEditing={() => form.setFocus('dateOfBirth')}
                                        />
                                    )}
                                    name='cpf'
                                    defaultValue=''
                                />
                                {form.formState.errors.cpf?.type !== 'validate' && <CustomErrorMessage name='cpf' errors={form.formState.errors} />}
                                {form.formState.errors.cpf?.type === 'validate' && <CustomErrorMessage name='cpf' errors={form.formState.errors} customMessage='CPF inválido' />}
                            </>
                        )}

                        {typeOfDocument === ETypeOfDocument.RNM && (
                            <>
                                <Controller
                                    control={form.control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Campo obrigatório'
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                        <Input
                                            size='small'
                                            label="RNM *"
                                            style={styles.input}
                                            keyboardType='default'
                                            testID={name}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={formatRNM(value)}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize='characters'
                                            ref={ref}
                                            maxLength={40}
                                            returnKeyType="next"
                                            onSubmitEditing={() => form.setFocus('dateOfBirth')}
                                        />
                                    )}
                                    name='rne'
                                    defaultValue=''
                                />
                                <CustomErrorMessage name='rne' errors={form.formState.errors} />
                            </>
                        )} <Controller
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
                                    label='Data de Nascimento *'
                                    date={value ? value : dateForOver}
                                    onSelect={onChange}
                                    accessoryRight={CalendarIcon}
                                    onBlur={onBlur}
                                    ref={ref}
                                    testID={name}
                                    style={styles.input}
                                    dateService={localeDateService}
                                    max={dateForOver}
                                    placement={PopoverPlacements.BOTTOM}
                                    min={new Date(1900, 0, 0)}
                                    backdropStyle={styles.backdropDatepicker}
                                    boundingMonth={false}
                                    onPress={() => Keyboard.dismiss()}
                                    caption='* Necessário ser maior de 18 anos'
                                />
                            )}
                            name='dateOfBirth'
                        />
                        <CustomErrorMessage name='dateOfBirth' errors={form.formState.errors} />
                        <Text style={styles.labelBasic}>Gênero *</Text>
                        <Controller
                            control={form.control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Selecione uma opção'
                                }
                            }}
                            render={({ field: { name, ref } }) => (
                                <RadioGroup
                                    style={{ paddingBottom: 10 }}
                                    testID={name}
                                    ref={ref}
                                    selectedIndex={selectedIndex}
                                    onChange={handleGender}>
                                    <Radio
                                        status='basic'>
                                        {evaProps => <Text {...evaProps}>Masculino</Text>}
                                    </Radio>
                                    <Radio
                                        status='basic'>
                                        {evaProps => <Text {...evaProps}>Feminino</Text>}
                                    </Radio>
                                    <Radio
                                        status='basic'>
                                        {evaProps => <Text {...evaProps}>Prefiro não informar</Text>}
                                    </Radio>
                                </RadioGroup>
                            )}
                            name='sex'
                        />
                        <CustomErrorMessage name='sex' errors={form.formState.errors} />
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
                                    label='E-mail *'
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
                                    returnKeyType="next"
                                    onSubmitEditing={() => form.setFocus('emailConfirmation')}
                                    textContentType="emailAddress"
                                    caption={(evaProps) => (
                                        <>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text {...evaProps}>* Em caso de não recebimento, entre em{" "}</Text>
                                                <TouchableOpacity onPress={openMailTo}>
                                                    <Text {...evaProps} style={[evaProps?.style, styles.contactLink]}>contato</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                />
                            )}
                            name='email'
                            defaultValue=''
                        />
                        {form.formState.errors.email?.type !== 'validate' && <CustomErrorMessage name='email' errors={form.formState.errors} />}
                        {form.formState.errors.email?.type === 'validate' && <CustomErrorMessage name='email' errors={form.formState.errors} customMessage='E-mail inválido' />}
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
                                validate: {
                                    valid: (e) => e ? isEmailValid(e) : undefined,
                                    equal: (e) => e === emailConfirm
                                }
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    onFocus={() => (__DEV__) ? undefined : Clipboard.setString('')}
                                    onSelectionChange={() => (__DEV__) ? undefined : Clipboard.setString('')}
                                    size='small'
                                    label='Confirmar E-mail *'
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
                                    returnKeyType="next"
                                    onSubmitEditing={() => form.setFocus('password')}
                                    textContentType="emailAddress"
                                />
                            )}
                            name='emailConfirmation'
                            defaultValue=''
                        />
                        {form.formState.errors.emailConfirmation?.type !== 'valid' && form.formState.errors.emailConfirmation?.type !== 'equal' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} />}
                        {form.formState.errors.emailConfirmation?.type === 'valid' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} customMessage={'E-mail inválido'} />}
                        {form.formState.errors.emailConfirmation?.type === 'equal' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} customMessage={'E-mails não conferem'} />}
                        <Controller
                            control={form.control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Campo obrigatório'
                                },
                                minLength: {
                                    value: 8,
                                    message: `Mín. 8 caracteres`
                                },
                                validate: (value) => value ? validatePasswd(value) : undefined
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    size='small'
                                    label="Senha *"
                                    style={styles.input}
                                    keyboardType='default'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    maxLength={20}
                                    accessoryRight={renderIconRightPassword}
                                    secureTextEntry={secureTextEntry}
                                    returnKeyType="next"
                                    ref={ref}
                                    onSubmitEditing={() => form.setFocus('confirmPassword')}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    textContentType="password"
                                    caption={(evaProps) => (
                                        <>
                                            <Text {...evaProps}>* 8 caracteres no mínimo</Text>
                                            <Text {...evaProps}>* 1 Letra Maiúscula no mínimo</Text>
                                            <Text {...evaProps}>* 1 Número no mínimo</Text>
                                            <Text {...evaProps}>* 1 Símbolo no mínimo: {'$*&@#'}</Text>
                                        </>
                                    )}
                                />
                            )}
                            name='password'
                            defaultValue=''
                        />
                        {form.formState.errors.password?.type !== 'validate' && <CustomErrorMessage name='password' errors={form.formState.errors} />}
                        {form.formState.errors.password?.type === 'validate' && <CustomErrorMessage name='password' errors={form.formState.errors} customMessage='Senha inválida' />}
                        <Controller
                            control={form.control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Campo Obrigatório'
                                },
                                minLength: {
                                    value: 8,
                                    message: `Mín. 8 caracteres`
                                },
                                validate: {
                                    valid: (e) => e ? validatePasswd(e) : undefined,
                                    equal: (e) => e === password.current
                                }
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    onFocus={() => (__DEV__) ? undefined : Clipboard.setString('')}
                                    onSelectionChange={() => (__DEV__) ? undefined : Clipboard.setString('')}
                                    size='small'
                                    label="Confirmar Senha *"
                                    style={styles.input}
                                    keyboardType='default'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    maxLength={20}
                                    accessoryRight={renderIconRightRepeat}
                                    secureTextEntry={secureTextEntryRepeat}
                                    returnKeyType="send"
                                    ref={ref}
                                    onSubmitEditing={() => form.setFocus('crm')}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    textContentType="newPassword"
                                />
                            )}
                            name='confirmPassword'
                        />
                        {(form.formState.errors.confirmPassword?.type !== 'valid' && form.formState.errors.confirmPassword?.type !== 'equal') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} />}
                        {(form.formState.errors.confirmPassword?.type === 'valid') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} customMessage='Senha inválida' />}
                        {(form.formState.errors.confirmPassword?.type === 'equal') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} customMessage='Senhas não conferem' />}

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
                                    size='small'
                                    label="Número de Registro *"
                                    style={styles.input}
                                    keyboardType='number-pad'
                                    placeholder=''
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value ? onlyNumbers(value) : value}
                                    ref={ref}
                                    maxLength={6}
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={() => form.setFocus('specialty.description')}
                                />
                            )}
                            name='crm'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='crm' errors={form.formState.errors} />
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
                                    label="Especialidade *"
                                    style={styles.input}
                                    placeholder='Selecione'
                                    testID={name}
                                    onBlur={onBlur}
                                    ref={ref}
                                    selectedIndex={selectedSpecialty}
                                    onSelect={setSelectedSpecialty}
                                    value={value}
                                >
                                    {specialties.map((item, index) => (
                                        <SelectItem key={item.id} title={item.description} />
                                    ))}
                                </Select>
                            )}
                            name='specialty.description'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='specialty.description' errors={form.formState.errors} />

                        {bOtherDescription && (
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
                                            size='small'
                                            label="Outro(a) *"
                                            style={styles.input}
                                            keyboardType='default'
                                            testID={name}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            ref={ref}
                                            maxLength={60}
                                            returnKeyType="next"
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="words"
                                            caption={(evaProps) => (
                                                <>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text {...evaProps}>Obrigatório, em caso da especialidade selecionada for: {" "}</Text>
                                                        <Text {...evaProps} style={[evaProps?.style, { fontWeight: 'bold' }]}>{`${form.getValues('specialty.description')}`.toUpperCase()}</Text>
                                                    </View>
                                                </>
                                            )}
                                        />
                                    )}
                                    name='specialty.others'
                                    defaultValue=''
                                />
                                <CustomErrorMessage name='specialty.others' errors={form.formState.errors} />
                            </>
                        )}

                        <Controller
                            control={form.control}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Campo obrigatório'
                                },
                                minLength: {
                                    value: 13,
                                    message: `Mín. 13 caracteres`
                                },
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    size='small'
                                    label="Telefone 1 *"
                                    style={styles.input}
                                    keyboardType='number-pad'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={formatPhone(value)}
                                    maxLength={15}
                                    ref={ref}
                                    returnKeyType="next"
                                    onSubmitEditing={() => form.setFocus('phone2')}
                                    underlineColorAndroid="transparent"
                                    disabled={isLoadingPostalCode}
                                    textContentType="telephoneNumber"
                                />
                            )}
                            name='phone'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='phone' errors={form.formState.errors} />
                        <Controller
                            control={form.control}
                            rules={{
                                required: false,
                                minLength: {
                                    value: 13,
                                    message: `Mín. 13 caracteres`
                                },
                            }}
                            render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                <Input
                                    size='small'
                                    label="Telefone 2"
                                    style={[styles.input, { paddingBottom: 10 }]}
                                    keyboardType='number-pad'
                                    testID={name}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={formatPhone(value)}
                                    maxLength={15}
                                    ref={ref}
                                    returnKeyType="send"
                                    onSubmitEditing={form.handleSubmit(onSubmit)}
                                    underlineColorAndroid="transparent"
                                    disabled={isLoadingPostalCode}
                                    textContentType="telephoneNumber"
                                />
                            )}
                            name='phone2'
                            defaultValue=''
                        />
                        <CustomErrorMessage name='phone2' errors={form.formState.errors} />
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaLayout>
        </>
    )
}

export default NewUserScreen