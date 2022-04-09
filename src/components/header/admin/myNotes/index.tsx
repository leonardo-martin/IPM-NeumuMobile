import React, { Dispatch, FC, ReactElement } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { headerStyle } from '../style'
import { BackIcon, PlusIcon } from '@components/header/icons'

interface MyNotesProps {
  onVisible: Dispatch<React.SetStateAction<boolean>>
  visible: boolean
}

const HeaderMyNotes: FC<MyNotesProps> = ({ onVisible, visible }): ReactElement => {
  const { goBack, navigate } = useNavigation<any>()
  const styles = useStyleSheet(headerStyle)

  const renderLeftIcon = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={goBack}
    />
  )

  const renderRigthIcon = () => (
    <TopNavigationAction
      icon={PlusIcon}
      onPress={() => onVisible(!visible)}
    />
  )

  return (
    <Layout level="1" style={styles.layout}>
      <TopNavigation
        alignment="center"
        title={evaProps => <Text {...evaProps}>Meu Diário</Text>}
        accessoryLeft={renderLeftIcon}
        accessoryRight={renderRigthIcon}
      />
    </Layout>
  )
}

export default HeaderMyNotes
