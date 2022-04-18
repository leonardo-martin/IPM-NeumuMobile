import { Modal } from '@ui-kitten/components'
import { createRef } from 'react'
import { Modalize } from 'react-native-modalize'

interface TModalResponse<T> {
    ref: React.RefObject<T>
}

export const useModal = <T extends Modalize | Modal>(): TModalResponse<T> => {
    const ref = createRef<T>()
    return {
        ref
    }
}