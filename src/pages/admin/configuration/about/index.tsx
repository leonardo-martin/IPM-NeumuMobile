import { SafeAreaLayout } from '@components/safeAreaLayout'
import { AppInfoService } from '@services/app-info.service'
import { Button, Icon, IconProps, Text, useStyleSheet } from '@ui-kitten/components'
import { INSTITUTE_URI } from '@constants/uri'
import React, { FC, ReactElement } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import CheckForUpdatesComponent from './extra/check-for-updates.component'
import { infoAppStyle } from './style'

const _VERSION: string = AppInfoService.getVersion()

const InformationAppScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(infoAppStyle)

    const openLink = (path?: string) => {
        Linking.openURL(INSTITUTE_URI + (path ?? ''))
    }

    const renderIcon = (props: IconProps) => (
        <Icon {...props} style={styles.icon} name="wallet-outline" size={20} pack='ionicons' />
    )

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{ alignItems: 'center', flexDirection: 'column', paddingBottom: 15 }}>
                        <Text category="p1" style={styles.version}>{'Versão do Aplicativo'.toUpperCase()}</Text>
                        <Text category="label" style={styles.version}>{_VERSION}</Text>
                        <CheckForUpdatesComponent />
                    </View>

                    <Text style={styles.paragraph}>
                        {`\t`}O aplicativo TeleNeuMu é um produto do Instituto Pedro Molina (IPM) e foi desenvolvido desde 2021 e trazendo importante inovação no contato entre pacientes e familiares, médicos e profissionais da saúde.
                        Conectividade é a missão principal – ligação direta do paciente com médicos e profissionais da saúde, e proporcionar de forma simples e objetiva a descoberta de quantos somos, onde estamos, quem somos.
                        O IPM tem o objetivo de apoiar projetos de pesquisas, atendimentos e cuidados a todos os pacientes acometidos por doenças neuromusculares, além de procurar parceiros e apoiadores que acreditem no projeto.
                    </Text>
                    <Text style={styles.title}>Parceiros do IPM</Text>
                    <Text style={styles.textItem}>SIDNM - Setor de Investigação em Doenças Neuromusculares</Text>
                    <Text style={styles.paragraph}>{`\t`}SIDNM - Criado em 1976 pelo Departamento de Neurologia e Neurocirurgia da Escola Paulista de Medicina com o objetivo de contribuir com: Assistência para pacientes (consulta, orientação multidisciplinar, cuidados integrativos, exames), Educação (cursos), Pesquisas (Epidemiologia, qualidade de vida, novas terapias).</Text>
                    <Text style={styles.paragraph}>{`\t`}Dr. Acary S. B. Oliveira, médico neurologista na renomada UNIFESP, com toda sua competência, humanidade e respeito pela prática médica, acolheu o IPM que se tornou um dos parceiros do SIDNM, criado em 1976 pelo Departamento de Neurologia e Neurocirurgia da Escola Paulista de Medicina.</Text>
                    <Text style={styles.paragraph}>A parceria com o IPM busca:</Text>

                    <Text style={styles.ordered}>{'\u2022\t'} Apoio no imóvel onde ocorre o atendimento de pacientes.</Text>
                    <Text style={styles.ordered}>{'\u2022\t'} Doação de cestas básicas para pacientes e familiares atendidos no SIDNM.</Text>
                    <Text style={styles.ordered}>{'\u2022\t'} Disponibilizar o TeleNeuMu conectando pacientes e médicos para melhor atendimento.</Text>
                    <Text style={styles.ordered}>{'\u2022\t'} Expansão de uso do aplicativo para outras especialidades em parceria com a SPDM (Associação Paulista para o Desenvolvimento da Medicina) e Unifesp (Universidade Federal de São Paulo).</Text>

                    <Text style={styles.textItem}>ABRAFEU - Associação Brasileira de Facio-Escápulo-Umeral</Text>
                    <Text style={styles.paragraph}>{`\t`}A Abrafeu tem o objetivo de prestar assistência a pessoas com uma condição genética chamada <Text style={[styles.paragraph, { fontWeight: '600' }]}>Distrofia Muscular Facio Escápulo Umeral - DFEU</Text> e suas famílias. DFEU - trata-se de uma distrofia neuromuscular rara.</Text>
                    <Text style={styles.paragraph}>A parceria com o IPM busca:</Text>

                    <Text style={styles.ordered}>{'\u2022\t'} Conectar o paciente, através do TeleNeuMu, com o projeto de testes de DNA de acordo com normas e regras estabelecidas e administradas pela própria Abrafeu, que contará com um banco de dados de pacientes para se candidatar e credenciar o Brasil a trazer um “clinical trial” (teste clínico) para futuro tratamento genético.</Text>
                    <Text style={styles.regards}>Obrigado</Text>
                    <Text style={styles.app}>TeleNeuMu</Text>

                    <View style={styles.moreView}>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            onPress={() => openLink()} >
                            <Text style={styles.moreText}>Saiba mais</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>

                    <View style={{ paddingVertical: 25 }}>
                        <Button
                            style={{
                                borderRadius: 50
                            }}
                            size='giant'
                            onPress={() => openLink('/colaborador')}
                            appearance='filled'
                            status='success'
                            accessoryRight={renderIcon}>{'Quero Contribuir'.toUpperCase()}</Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaLayout>
    )
}

export default InformationAppScreen