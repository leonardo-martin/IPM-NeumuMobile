import { createRef, useRef } from 'react'
import { Modalize } from 'react-native-modalize'

export const useModalize = () => {
    const ref = createRef<Modalize>()
    return { ref, close: () => ref.current?.close(), open: () => ref.current?.open() }
}