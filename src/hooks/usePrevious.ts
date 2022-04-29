import { useNavigationState } from "@react-navigation/native"
import { useEffect, useRef } from "react"

export const usePrevious = (value: any) => {
    const ref = useRef()

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref.current
}

export const usePreviousRouteName = () => {
    return useNavigationState(state =>
        state.routes[state.index - 1]?.name
            ? state.routes[state.index - 1].name
            : null
    )
}