import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { CountrySchema } from '@schemas/CountryCode.schema'
import { Divider, Icon, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modalize, ModalizeProps } from 'react-native-modalize'

interface PartnerPickerProps extends ModalizeProps {
    ref?: ForwardedRef<Modalize>
    setValue?: React.Dispatch<React.SetStateAction<any>>
    data?: { label: string, value: string }[]
}

const PartnerPicker: FC<PartnerPickerProps> = forwardRef<Modalize, PartnerPickerProps>(({ ...props }, ref): ReactElement => {

    const { setValue, data } = props
    const combinedRef = useCombinedRefs(ref, ref)
    const styles = useStyleSheet(partnerPickerStyle)

    const selectItem = (item?: { label: string, value: string }) => {
        if (item && setValue) {
            setValue(item.value)
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
            <Text category='label' status='basic'>Selecione um dos parceiros do IPM:</Text>
            {data && data.map((item: { label: string, value: string }, i: number) => (
                <View key={i}>
                    <TouchableOpacity style={styles.content__row} onPress={() => selectItem(item)}>
                        <Text style={[styles.content__label, { fontSize: 14 }]}>{item.label}</Text>

                        <Icon style={styles._icon} name="duplicate-outline" pack='ionicons' size={20} />
                    </TouchableOpacity>
                    <Divider />
                </View>

            ))}
        </View>
    )

    return (
        <Modalize
            {...{ ...props, ref: combinedRef }}
            HeaderComponent={renderHeader}>
            {renderContent()}
        </Modalize>
    )
})

PartnerPicker.defaultProps = {
    snapPoint: 450,
    data: [
        {
            label: 'ABRAFEU', value: 'ABRAFEU'
        },
        {
            label: 'Instituto Pedro Molina', value: 'Instituto Pedro Molina'
        },
        {
            label: 'Outro(a)', value: 'Outro(a)'
        }
    ]
}

export default PartnerPicker

const partnerPickerStyle = StyleSheet.create({
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
    content__label: {
        fontSize: 14,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    _icon: {
        color: 'text-info-color'
    }
});