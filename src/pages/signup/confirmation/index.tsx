import React, { createRef, FC, ReactElement, useCallback, useRef } from 'react'
import { StyleProp, BackHandler, View, Animated, ListRenderItemInfo, Dimensions, Image, StatusBar, StyleSheet, Pressable, TouchableOpacity, FlatList, Platform, ImageStyle } from 'react-native'
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native'
import { Icon, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { FlatData } from '@models/FlatData'
import { style } from './style'
import { flatList } from './data'

const { width, height } = Dimensions.get('screen')

const RegistrationConfirmation: FC = (): ReactElement => {

  const scrollX = useRef<Animated.Value>(new Animated.Value(0)).current
  const flatRef = createRef<FlatList>()
  const nextPage = (index: number) => flatRef.current?.scrollToIndex({ animated: true, index })

  const theme = useTheme()
  const bgs = [theme['color-primary-500'], theme['color-primary-700'], theme['color-primary-900']]

  const styles = useStyleSheet(style)
  const navigation = useNavigation<any>()

  const actions = CommonActions.reset({
    index: 0,
    routes: [
      { name: 'SignIn' },
    ],
  })

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.dispatch(actions)
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [])
  )

  const Backdrop = ({ scrollX }: any) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: bgs.map((_, i) => i * width),
      outputRange: bgs.map((bg) => bg)
    })
    return (
      <Animated.View style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor
        }
      ]} />
    )
  }

  const Square = ({ scrollX }: any) => {
    const YOLO: Animated.AnimatedModulo = Animated.modulo(
      Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width)
      ),
      1
    )
    const rotate: Animated.AnimatedInterpolation = YOLO.interpolate({
      inputRange: [0, .5, 1],
      outputRange: ['35deg', '0deg', '35deg']
    })

    const translateX: Animated.AnimatedInterpolation = YOLO.interpolate({
      inputRange: [0, .5, 1],
      outputRange: [0, -height, 0]
    })
    return (
      <Animated.View style={[styles.square, {
        transform: [
          {
            rotate
          },
          {
            translateX
          }]
      }]} />
    )
  }

  const Indicator = ({ scrollX }: any) => (
    <View style={styles.indicator}>
      {flatList.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
        const scale: Animated.AnimatedInterpolation = scrollX.interpolate({
          inputRange,
          outputRange: [.8, 1.4, .8],
          extrapolate: 'clamp'
        })
        const opacity: Animated.AnimatedInterpolation = scrollX.interpolate({
          inputRange,
          outputRange: [.6, .9, .8],
          extrapolate: 'clamp'
        })
        return (
          <Pressable key={`indicator-${i}`} onPress={() => nextPage(i)}>
            <Animated.View
              style={[styles.indicatorItem, {
                opacity,
                transform: [{ scale }]
              }]} />
          </Pressable>
        )
      })}
    </View>
  )

  const renderItem = (info: ListRenderItemInfo<FlatData>) => (
    <View style={styles.contentItem}>
      <View style={styles.item}>
        <Image source={{ uri: info.item.image }} style={styles.image as StyleProp<ImageStyle>} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{info.item.title}</Text>
        <Text style={styles.itemDescription}>{info.item.description}</Text>
        {info.index === (flatList.length - 1) ?
          <View style={styles.viewIcon}>
            <TouchableOpacity onPress={() => navigation.dispatch(actions)}>
              <Icon style={styles.icon} name="arrow-forward-circle-outline" pack='ionicons' size={50} />
            </TouchableOpacity>
          </View>
          : null}
      </View>
    </View >
  )

  return (
    <View style={styles.container}>
      <StatusBar hidden={Platform.OS === 'ios' ? true : false} backgroundColor='transparent' translucent />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />
      <Animated.FlatList
        ref={flatRef}
        data={flatList}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerFlatList}
      />

      <Indicator scrollX={scrollX} />
    </View>
  )
}

export default RegistrationConfirmation