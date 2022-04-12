import React, { FC, ReactElement, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import HeaderMyNotes from '@components/header/admin/myNotes'
import NewNoteModal from 'components/modal/notesModal'
import { Card, Icon, IconProps, Input, List, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { SafeAreaLayout } from 'components/safeAreaLayout'
import { notesStyle } from './style'
import { ListRenderItemInfo, View, ViewProps } from 'react-native'
import { data } from '../data'
import { useModal } from '@hooks/useModal'

const MyNotesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { ref } = useModal<Modal>()
    const styles = useStyleSheet(notesStyle)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const SearchIcon = (props: IconProps) => (
        <Icon {...props} name='search' pack='ionicons' size={20} />
    )

    const CloseIcon = (props: IconProps) => (
        <Icon {...props} name='close-outline' pack='ionicons' size={20} onPress={() => setSearchQuery('')} />
    )

    const Footer = (props: ViewProps | undefined) => (
        <View {...props} style={[styles.footerCard]} >
            <Icon name='trash-outline' size={20} style={styles.icon} />
        </View>

    )

    const renderItem = (info: ListRenderItemInfo<any>) => (
        <View style={styles.viewCard}>
            <Card
                style={styles.card}
                footer={Footer}>
                <View style={{ flexDirection: 'column' }}>
                    <Text status='primary' category='label'>Titulo</Text>
                    <Text category='c1' appearance='hint' style={{ paddingVertical: 10 }}>{
                        info.item.description?.length > 100 ? `${info.item.description.substring(0, 98)}...` : info.item.description}</Text>
                </View>
            </Card>
        </View>
    )


    return (
        <>
            <HeaderMyNotes onVisible={setVisibleModal} visible={visibleModal} />
            <SafeAreaLayout style={styles.safeArea} level='1' >
                <Input
                    style={styles.input}
                    placeholder='Pesquisar'
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='default'
                    accessoryLeft={SearchIcon}
                    accessoryRight={searchQuery !== '' ? CloseIcon : undefined}
                />
                <View style={styles.viewList}>
                    <List
                        data={data}
                        renderItem={renderItem}
                        numColumns={2}
                        contentContainerStyle={styles.contentContainerList}
                        style={styles.listStyle}
                    />
                </View>
            </SafeAreaLayout>
            <NewNoteModal
                ref={ref}
                onVisible={setVisibleModal}
                visible={visibleModal} />
        </>
    )
}

export default MyNotesScreen