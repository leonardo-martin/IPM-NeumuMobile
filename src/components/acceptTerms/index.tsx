import React, { FC, ReactElement } from 'react'
import { Linking, View } from 'react-native'
import { Text, useStyleSheet } from '@ui-kitten/components'
import { INSTITUTE_URI } from '@constants/uri'
import { acceptTermsStyle } from './style'

const TermsConditions: FC = (): ReactElement => {

    const openLink = (url: string) => Linking.openURL(url)
    const styles = useStyleSheet(acceptTermsStyle)

    return (
        <>
            <View style={{ paddingBottom: 20 }}>
                <Text category={'h5'} style={[styles.header, styles.textPrimary]}>Termos e Condições de Uso</Text>
                <Text style={[styles.header, { marginVertical: 0 }]}>Seja bem-vindo ao TeleNeumu.</Text>
                <Text style={[styles.header, { marginVertical: 0 }]}>Leia com atenção todos os termos abaixo.</Text>
            </View>
            <Text style={styles.textJustify}>Este documento, e todo o conteúdo do aplicativo é oferecido por{" "}
                <Text onPress={() => openLink(INSTITUTE_URI)} style={[styles.hiperlink, styles.textJustify, styles.textPrimary]}>Instituto Pedro Molina</Text>
                , neste termo representado apenas por “INSTITUTO”, que regulamenta todos os direitos e obrigações com todos que acessam o site, denominado neste termo como “USUÁRIO”, reguardado todos os direitos previstos na legislação, trazem as cláusulas abaixo como requisito para acesso e visita do mesmo.
                A permanência no aplicativo implica-se automaticamente na leitura e aceitação tácita do presente termos de uso a seguir. Este termo foi atualizado pela última vez em 17 de março de 2022.
            </Text>

            <Text style={styles.textItem}>{'\t'}1. DA FUNÇÃO TeleNeuMU</Text>
            <Text style={styles.textJustify}>Este aplicativo foi criado e desenvolvido com a função de auxiliar no tratamento de pacientes com doenças Neuro Musculares. O INSTITUTO busca através do aplicativo, desenvolvido por profissionais da área, auxiliar na identificação, informação e tratamento de pacientes com doenças neuro musculares.
                Nesta plataforma, poderá ser realizado  o cadastro, agendamento, conversas e manutenção do histórico médico.
                É de responsabilidade do usuário de usar todas as funcionalidades presentes no aplicativo com senso crítico, considerando que ao compartilhar suas informações com os profissionais de saúde, está de acordo que os mesmos possam visualizar essas informações.
            </Text>

            <Text style={styles.textItem}>{'\t'}2. DO ACEITE DOS TERMOS</Text>
            <Text style={styles.textJustify}>
                Este documento, chamado “Termos de Uso”, aplicáveis a todos os usuários do aplicativo.
                Este termo especifica e exige que todo usuário ao acessar o TeleNeuMu, leia e compreenda todas as cláusulas do mesmo, visto que ele estabelece entre o INSTITUTO e o USUÁRIO direitos e obrigações entre ambas as partes, aceitos expressamente pelo USUÁRIO a permanecer utilizando o aplicativo TeleNeuMu.
                Ao continuar acessando o TeleNeuMu, o USUÁRIO expressa que aceita e entende todas as cláusulas, assim como concorda integralmente com cada uma delas, sendo este aceite imprescindível para a permanência no mesmo. Caso o USUÁRIO discorde de alguma cláusula ou termo deste contrato, o mesmo deve imediatamente interromper sua navegação de todas as formas e meios.
                Este termo pode e irá ser atualizado periodicamente pelo INSTITUTO, que se resguarda no direito de alteração, sem qualquer tipo de aviso prévio e comunicação. É importante que o USUÁRIO confira sempre se houve movimentação e qual foi a última atualização do mesmo na opção "termo de uso" no menu principal.
            </Text>

            <Text style={styles.textItem}>{'\t'}3. DO GLOSSÁRIO</Text>
            <Text style={styles.textJustify}>Este termo pode conter algumas palavras específicas que podem não ser de conhecimento geral. Entre elas:
                USUÁRIO: Todo e qualquer usuário do aplicativo de qualquer forma e meio, que acesse através de computador, notebook, tablet, celular ou quaisquer outros meios, o TeleNeuMu.
                NAVEGAÇÃO: O ato de acessar o aplicativo de quaisquer formas ou por qualquer tipo de perfil.
                LOGIN: Dados de acesso do visitante ao realizar o cadastro junto ao INSTITUTO, dividido entre usuário e senha, que dá acesso a funções restritas do aplicativo.
                OFFLINE: Quando o site ou plataforma se encontra indisponível, não podendo ser acessado externamente por nenhum usuário.
                Em caso de dúvidas sobre qualquer palavra utilizada neste termo, o USUÁRIO deverá entrar em contato com o INSTITUTO através dos canais de comunicação encontrados no aplicativo.
            </Text>

            <Text style={styles.textItem}>{'\t'}4. DO ACESSO AO TELENEUMU</Text>
            <Text style={styles.textJustify}>
                O TeleNeuMu funciona normalmente 24 (vinte e quatro) horas por dia, porém podem ocorrer pequenas interrupções de forma temporária para ajustes, manutenção, mudança de servidores, falhas técnicas ou por ordem de força maior, que podem deixar o aplicativo indisponível por tempo limitado.
                O INSTITUTO não se responsabiliza por nenhuma perda de oportunidade ou prejuízos que esta indisponibilidade temporária possa gerar aos usuários.
                Em caso de manutenção que exigirem um tempo maior, sera avisado previamente aos usuários da necessidade e do tempo previsto em que o TeleNeuMu ficará offline.
                Será necessário realizar um cadastro junto a plataforma, onde o USUÁRIO deverá preencher um formulário com seus dados e informações, para ter acesso às funcionalidades do TeleNeuMu.
                Todos os dados estão protegidos conforme a Lei Geral de Proteção de Dados, e ao realizar o cadastro junto ao site, o USUÁRIO concorda integralmente com a coleta de dados conforme a Lei e com a Política de Privacidade do TELENEUMU.
                Todos os direitos são preservados, conforme a legislação brasileira, principalmente na Lei de Direitos Autorais (regulamentada na Lei nº 9.610/18), assim como no Código Civil brasileiro (regulamentada na Lei nº 10.406/02), ou quaisquer outras legislações aplicáveis.
                Todo o conteúdo do aplicativo é protegido por direitos autorais, e seu uso, cópia, transmissão, venda, cessão ou revenda, deve seguir a lei brasileira, tendo o INSTITUTO todos os seus direitos reservados, e não permitindo a cópia ou utilização de nenhuma forma e meio, sem autorização expressa e por escrita da mesma.
            </Text>

            <Text style={styles.textItem}>{'\t'}5. DAS OBRIGAÇÕES</Text>
            <Text style={styles.textJustify}>
                O USUÁRIO ao utilizar o TELENEUMU, concorda integralmente em:
                De nenhuma forma ou meio realizar qualquer tipo de ação que tente invadir, hacker, destruir ou prejudicar a estrutura do aplicativo, plataforma do INSTITUTO ou de seus parceiros comerciais. Incluindo-se, mas não se limitando, ao envio de vírus de computador, de ataques de DDOS, de acesso indevido por falhas da mesma ou quaisquer outras forma e meio.
                Da proibição em reproduzir qualquer conteúdo do aplicativo sem autorização expressa, podendo responder civil e criminalmente pelo mesmo.
                Com a Política de Privacidade TELENEUMU, assim como tratamos os dados referentes ao cadastro e histórico do USUÁRIO, podendo a qualquer momento e forma, requerer a exclusão dos mesmos, através de solicitação ao INSTITUTO.
            </Text>
        </>
    )
}

export default TermsConditions