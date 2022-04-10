import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { View } from 'react-native'
import { Button, CalendarRange, Card, Modal, RangeCalendar, useStyleSheet } from '@ui-kitten/components'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { modalStyle } from './style'

interface FilterModalProps {
    ref: ForwardedRef<Modal>
    onVisible: Dispatch<React.SetStateAction<boolean>>
    visible: boolean
    handleRange: Dispatch<React.SetStateAction<CalendarRange<Date>>>
    range: CalendarRange<Date>
    onFilter: () => void
}

const FilterModal: FC<FilterModalProps> = forwardRef<Modal, React.PropsWithChildren<FilterModalProps>>(({ ...props }, ref): ReactElement => {

    const { localeDateService } = useDatepickerService()
    const combinedRef = useCombinedRefs(ref, ref)
    const styles = useStyleSheet(modalStyle)

    return (
        <Modal
            ref={combinedRef}
            style={styles.modal}
            visible={props.visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => props.onVisible(!props.visible)}>
            <Card disabled={true} style={styles.card} >
                <RangeCalendar
                    range={props.range}
                    onSelect={nextRange => props.handleRange(nextRange)}
                    max={localeDateService.today()}
                    min={new Date(1900, 0, 0)}
                    dateService={localeDateService}
                    style={{ borderWidth: 0 }}
                    boundingMonth={false}
                />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 15
                }}>
                    <Button
                        disabled={!props.range.startDate}
                        style={{ width: '50%' }}
                        onPress={props.onFilter}>APLICAR</Button>
                </View>
            </Card>
        </Modal>
    )
})

export default FilterModal