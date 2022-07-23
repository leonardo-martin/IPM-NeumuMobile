import { SafeAreaLayout } from '@components/safeAreaLayout'
import { JSONObject } from '@models/Common'
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { Avatar, Text, useStyleSheet } from '@ui-kitten/components'
import { MedicalDoctorDisplay } from '@models/Medical'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ImageStyle, ListRenderItemInfo, Pressable, StyleProp, View } from 'react-native'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { searchResultStyle } from './search-result.style'

const SPACING = 15
const AVATAR_SIZE = 50
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

const ScheduleSearchResultScreen: FC = (): ReactElement => {

    const [data, setData] = useState<MedicalDoctorDisplay[]>([])
    const navigation = useNavigation()
    const routes = useRoute()
    const params = routes.params as JSONObject
    const styles = useStyleSheet(searchResultStyle)
    const scrollY = useRef(new Animated.Value(0)).current
    const isFocused = useIsFocused()

    useFocusEffect(
        useCallback(() => {
            setData(params?.data as MedicalDoctorDisplay[])
        }, [params])
    )

    useEffect(() => {
        if (!isFocused) setData([])
    }, [isFocused])

    const renderItem = (info: ListRenderItemInfo<MedicalDoctorDisplay>) => {
        const inputRange = [-1, 0, ITEM_SIZE * info.index, ITEM_SIZE * (info.index + 2)]

        const opacityInputRange = [-1, 0, ITEM_SIZE * info.index, ITEM_SIZE * (info.index + .5)]

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
        })

        const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0]
        })

        return (
            <Pressable onPress={() => onSelectMedicalItem(info.item)}>
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={[styles.item, styles.shadow, {
                        transform: [{ scale: scale }],
                        opacity,
                        backgroundColor: info.index % 2 === 0 ? styles.background1.backgroundColor : styles.background2.backgroundColor
                    }]}>
                    <View style={{
                        flexDirection: 'column'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row-reverse',
                            paddingBottom: 5,
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.itemAddress}>
                                {info.item.city ?? ''}{" - "}
                                {info.item.state ?? ''}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Avatar
                                source={require('../../../../assets/commons/doctor.png')}
                                style={styles.avatar as StyleProp<ImageStyle>}
                            />
                            <View style={styles.viewItem}>
                                <View style={styles.inlineText}>
                                    <Text style={styles.itemTitle}>{info.item.name}</Text>
                                    <Text style={styles.itemCRM}>N° {info.item.crm}</Text>
                                </View>
                                <Text style={styles.itemDescription}>{info.item.specialty ?? ''}</Text>
                            </View>

                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        )
    }


    const onSelectMedicalItem = (item: MedicalDoctorDisplay) => {
        navigation.navigate('PresentialSchedule' as never, { ...item } as never)
    }

    return (
        <>
            <SafeAreaLayout style={styles.safeArea}>
                <View style={{ padding: SPACING + 5 }}>
                    <Text category='label'>Estes são os médicos disponíveis:</Text>
                    <Text category='c1'>Preencha o seu perfil para liberar mais indicações.</Text>
                </View>
                <Animated.FlatList
                    scrollEventThrottle={5}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerList}
                    style={styles.list}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.medicalDoctorId}`}
                    extraData={params}
                />
            </SafeAreaLayout>
        </>
    )
}

export default ScheduleSearchResultScreen

