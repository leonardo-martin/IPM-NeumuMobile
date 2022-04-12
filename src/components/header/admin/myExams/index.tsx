import React, { Dispatch, FC, ReactElement, useState } from 'react'
import { Layout, Modal, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { BackIcon, PlusIcon } from '@components/header/icons'
import { Exam, ExamImage } from '@models/Exam'
import RegisterModal from './add'
import { headerStyle } from '../style'
import { useModal } from '@hooks/useModal'

interface HeaderMyExamsProps {
    onRefresh: Dispatch<React.SetStateAction<Exam & ExamImage | undefined>>
}

const HeaderMyExams: FC<HeaderMyExamsProps> = ({ onRefresh }): ReactElement => {

    const { ref } = useModal<Modal>()
    const styles = useStyleSheet(headerStyle)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const { goBack } = useNavigation<any>()

    const handleVisibleModal = () => {
        setVisibleModal(!visibleModal)
    }

    const renderLeftIcon = () => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={goBack}
        />
    )

    const renderRightIcon = () => (
        <TopNavigationAction
            icon={PlusIcon}
            onPress={handleVisibleModal}
        />
    )

    return (
        <Layout level="1" style={styles.layout}>
            <TopNavigation
                alignment="center"
                title={evaProps => <Text {...evaProps}>Meus Exames</Text>}
                accessoryLeft={renderLeftIcon}
                accessoryRight={renderRightIcon}
            />
            <RegisterModal ref={ref} onRefresh={onRefresh} onVisible={setVisibleModal} visible={visibleModal}/>
        </Layout>
    )
}

export default HeaderMyExams