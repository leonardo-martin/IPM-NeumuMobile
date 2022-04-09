import React, { createRef, FC, ReactElement, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import HeaderMyNotes from '@components/header/admin/myNotes'
import NewNoteModal from '@components/floatingButton/notesModal'
import { Modal } from '@ui-kitten/components'

const MyNotesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const ref = createRef<Modal>()
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    return (
        <>
            <HeaderMyNotes onVisible={setVisibleModal} visible={visibleModal} />
            <NewNoteModal
                ref={ref}
                onVisible={setVisibleModal}
                visible={visibleModal} />
        </>
    )
}

export default MyNotesScreen