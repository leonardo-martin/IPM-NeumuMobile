import { ErrorMessage } from "@hookform/error-message"
import { Text, useStyleSheet } from "@ui-kitten/components"
import React, { FC, ReactElement } from "react"
import { FieldErrors } from "react-hook-form"
import { StyleSheet } from "react-native"

interface CustomErrorMessageProps {
    name: string
    errors: FieldErrors<any>
    customMessage?: string
}

const CustomErrorMessage: FC<CustomErrorMessageProps> = ({ ...props }): ReactElement => {
    const styles = useStyleSheet(errorStyle)
    return (
        <ErrorMessage
            errors={props.errors}
            name={props.name}
            render={({ message }) => <Text style={styles.text}>{props.customMessage ?? message}</Text>}
        />
    )
}

export default CustomErrorMessage

const errorStyle = StyleSheet.create({
    text: {
        color: 'color-danger-600',
        fontFamily: "System",
        fontSize: 10,
        fontWeight: "800",
        paddingBottom: 5,
        textTransform: 'uppercase'
    },
})