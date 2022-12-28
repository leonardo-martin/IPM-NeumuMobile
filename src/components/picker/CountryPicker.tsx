import RealmContext from '@contexts/realm'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useFocusEffect } from '@react-navigation/native'
import { CountrySchema } from '@schemas/CountryCode.schema'
import { Divider, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ForwardedRef, forwardRef, ReactElement, useCallback, useEffect, useState } from 'react'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'
import Toast from 'react-native-toast-message'

interface CountryPickerProps extends ModalizeProps {
    ref?: ForwardedRef<Modalize>
    setValue?: React.Dispatch<React.SetStateAction<any>>
}

const CountryPicker: FC<CountryPickerProps> = forwardRef<Modalize, CountryPickerProps>(({ setValue, ...props }, ref): ReactElement => {

    const combinedRef = useCombinedRefs(ref, ref)
    const styles = useStyleSheet(countryPickerStyle)
    const [countryList, setCountryList] = useState<any[]>([])
    const { useRealm } = RealmContext
    const db = useRealm()

    const loadRepository = async () => {
        const res = db.objects('prmt_01_country').sorted('vc_country_name')
        setCountryList([...res])
    }

    useFocusEffect(
        useCallback(() => {
            loadRepository()
        }, [])
    )

    const selectItem = (item?: CountrySchema) => {
        if (item && setValue) {
            setValue(item.phoneCode)
        }
        setTimeout(() => {
            const ref = combinedRef.current as Modalize
            ref.close()
        }, 100)
    }

    const renderHeader = () => (
        <View style={styles.modal__header} />
    )

    const renderContent = () => (
        <View style={styles.content}>
            {countryList.map((item: CountrySchema) => (
                <View  key={item.uuid}>
                    <TouchableOpacity style={styles.content__row} onPress={() => selectItem(item)}>
                        <Text style={styles.content__name}>
                            {item.country}{" "}
                            <Text style={styles.content__code}>{`(${item.phoneCode})`}</Text>
                        </Text>
                        <Text style={[styles.content__name, { fontSize: 12 }]}>{item.code}</Text>
                    </TouchableOpacity>
                    <Divider />
                </View>

            ))}
        </View>
    )

    const verifyEmptyData = () => {
        Keyboard.dismiss()
        if (countryList.length === 0) {
            Toast.show({
                type: 'info',
                text2: 'Não foi possível localizar nenhum País',
            })
            const ref = combinedRef.current as Modalize
            ref.close()
        }
    }

    return (
        <Modalize
            {...{ ...props, ref: combinedRef }}
            onOpen={verifyEmptyData}
            HeaderComponent={renderHeader}>
            {renderContent()}
        </Modalize>
    )
})

CountryPicker.defaultProps = {
    snapPoint: 450
}

export default CountryPicker

const countryPickerStyle = StyleSheet.create({
    modal__header: {
        paddingVertical: 15,
        marginHorizontal: 15,
    },
    modal__headerText: {
        fontSize: 15,
        fontWeight: '200',
    },
    content: {
        paddingHorizontal: 15,
    },
    content__row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15
    },
    content__name: {
        fontSize: 14,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    content__code: {
        fontSize: 12,
        flexWrap: 'wrap',
        flexShrink: 1,
        fontWeight: '700'
    },
});