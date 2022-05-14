import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

const ListEmptyComponent: FC<{ message?: string }> = ({ message = 'Nenhum resultado encontrado' }): ReactElement => {

    const styles = useStyleSheet(emptyStyle)

    return (
        <View style={styles.containerEmpty}>
            <Text style={styles.textEmpty}>{message}</Text>
        </View>
    )
}

export default ListEmptyComponent

export const emptyStyle = StyleSheet.create({
    containerEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textEmpty: {
        fontSize: 14,
        color: 'text-hint-color'
    }
})