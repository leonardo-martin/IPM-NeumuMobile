import EmptyComponent from '@components/empty'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { DiseaseDto } from '@models/Disease'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getDiseaseList } from '@services/disease.service'
import { Icon, IconProps, Input, List, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, RefreshControl, TouchableOpacity, View } from 'react-native'
import { aboutStyle } from './style'

const AboutScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(aboutStyle)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [diseaseList, setDiseaseList] = useState<DiseaseDto[]>([])
    const [diseaseListTmp, setDiseaseListTmp] = useState<DiseaseDto[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const navigation = useNavigation<any>()

    const SearchIcon = (props: IconProps) => (
        <Icon {...props} name='search' pack='ionicons' size={20} />
    )

    const CloseIcon = (props: IconProps) => (
        <Icon {...props} name='close-outline' pack='ionicons' size={20}
            onPress={() => setSearchQuery('')} />
    )

    const onChangeInputSearch = (value: string) => {
        if (value === '') setDiseaseList(diseaseListTmp)
        else
            setDiseaseList(diseaseListTmp.filter(e => e.name.toLowerCase().includes(value.toLowerCase())))
    }

    useEffect(() => {
        onChangeInputSearch(searchQuery)
    }, [searchQuery])

    const loadData = async () => {
        try {
            const response = await getDiseaseList()
            if (response.status === 200) {
                setDiseaseListTmp(response.data)
                setDiseaseList(response.data)
            }

        } catch (error) {

        }
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [])
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadData()
        setRefreshing(false)
    }, [])

    const renderItem = (info: ListRenderItemInfo<DiseaseDto>) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('DetailsAbout', {
                ...info.item
            })}
            style={[styles.item, styles.shadow]}>
            <View style={styles.container}>
                <View style={styles.containerText}>
                    <Text style={styles.textId}>{'#' + info.item.cid}</Text>
                    <Text category='label'>{info.item.name.length > 36 ? `${info.item.name.substring(0, 32)}...` : info.item.name}</Text>
                </View>
                <Text style={styles.itemTextMore}>saber mais</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
            <List
                style={styles.list}
                ListHeaderComponent={
                    <View style={styles.headerList}>
                        <Input
                            disabled={diseaseList.length === 0}
                            placeholder='Pesquisar'
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='default'
                            accessoryLeft={SearchIcon}
                            accessoryRight={searchQuery !== '' ? CloseIcon : undefined}
                        />
                    </View>
                }
                ListEmptyComponent={<EmptyComponent />}
                data={diseaseList}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.contentContainerList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaLayout>
    )
}

export default AboutScreen