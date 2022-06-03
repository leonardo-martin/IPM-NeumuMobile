import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { pendingApprovalMappingProgramStyle } from './pending-approval.style'

const PendingApprovalMappingProgram: FC = (): ReactElement => {

    const styles = useStyleSheet(pendingApprovalMappingProgramStyle)

    return (
        <>
            <View style={styles.container}>
                <View style={styles.view}>
                    <Text category='label' style={styles.text}>Solicitação enviada ao responsável.</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>Para finalizar o cadastro no <Text
                        status='primary' style={[styles.text, styles.bold]}>Programa de Mapeamento Genético</Text>, solicite que o responsável acesse sua caixa de e-mail, procure pelo e-mail
                        <Text appearance='hint' style={[styles.text, styles.bold, { fontStyle: 'italic' }]}>{" "}Programa Genético Abrafeu - Inscrição de menor{" "}</Text>
                        e clique no botão
                        <Text status='success' style={[styles.text, styles.bold]}>{" "}CONFIRMAR PERMISSÃO</Text>.</Text>
                </View>
            </View>
        </>
    )
}

export default PendingApprovalMappingProgram