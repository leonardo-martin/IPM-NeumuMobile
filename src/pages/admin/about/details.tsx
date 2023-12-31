import { SafeAreaLayout } from '@components/safeAreaLayout'
import { JSONContent } from '@models/Common'
import { DiseaseDataDto, DiseaseDto } from '@models/Disease'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { getDiseaseDataById } from '@services/disease.service'
import { Icon, IconElement, IconProps, Layout, Spinner, Text, TopNavigation, TopNavigationAction, useStyleSheet, useTheme } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Linking, Platform, RefreshControl, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import Toast from 'react-native-toast-message'
import { detailsAboutStyle } from './details.style'

const DetailsAboutScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(detailsAboutStyle)
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [diseaseData, setDiseaseData] = useState<DiseaseDataDto>()
    const [diseaseDataParsed, setDiseaseDataParsed] = useState<JSONContent>()
    const route = useRoute()
    const navigation = useNavigation<any>()

    const loadData = async (id: number) => {
        const response = await getDiseaseDataById(id)
        if (response.status === 200) {
            setDiseaseData(response.data)
        }
        setIsLoading(false)
    }

    const openLink = (url: any) => {
        try {
            Linking.openURL(url).catch(() => {
                Toast.show({
                    type: 'info',
                    text2: 'Endereço não encontrado',
                })
            })
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao abrir link',
            })
        }
    }

    useEffect(() => {
        try {
            if (diseaseData)
                setDiseaseDataParsed(JSON.parse(JSON.parse(diseaseData.payload)) as JSONContent)
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao exibir texto',
            })

        }
    }, [diseaseData])

    useEffect(() => {
        if (isLoading && route.params) {
            try {
                loadData((route.params as DiseaseDto).id)
            } catch (error) {
                Toast.show({
                    type: 'danger',
                    text2: 'Nenhum ID fornecido',
                })
            }
        }
    }, [route.params, isLoading])

    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) setIsLoading(true)
    }, [isFocused])

    const styleRichText = (marks?: {
        [key: string]: any;
        type: string;
        attrs?: Record<string, any> | undefined;
    }[] | undefined, attrs?: Record<string, any>): TextStyle => {
        return {
            textDecorationLine: marks?.find(e => e.type.includes('underline')) ? 'underline' : 'none',
            fontWeight: marks?.find(e => e.type.includes('bold')) ? 'bold' : 'normal',
            fontStyle: marks?.find(e => e.type.includes('italic')) ? 'italic' : 'normal',
            ...marks?.find(e => e.type.includes('link')) && {
                textDecorationLine: 'underline',
                color: theme['color-primary-default'],
                fontWeight: '600'
            },
            textAlign: attrs?.textAlign
        }
    }

    const alignRichText = (attrs?: Record<string, any> | undefined): ViewStyle => {
        return {
            flexDirection: 'row',
            justifyContent: attrs?.textAlign === 'center' ? 'center' :
                attrs?.textAlign === 'left' ? 'flex-start' :
                    attrs?.textAlign === 'right' ? 'flex-end' : undefined
        }
    }

    const renderParagraph = (item: JSONContent, type?: string) => (
        <Text>
            {item.content && item.content?.map((e, i) =>
                <Text
                    onPress={() => {
                        e.marks && e.marks.find(e => e.type.includes('link')) ? openLink(e.marks[0].attrs?.href) : undefined
                    }}
                    key={`${e}${i}`}
                    style={{
                        ...styleRichText(e.marks, item.attrs),
                        ...type === 'blockquote' && {
                            fontStyle: 'italic'
                        }
                    }}>
                    {e.text}
                </Text>
            )}
        </Text>
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadData((route.params as DiseaseDto).id)
        setRefreshing(false)
    }, [])

    const BackIcon = (props: IconProps): IconElement => {
        const theme = useTheme()
        return (
            <Icon {...props} style={[props.style, {
                color: theme['color-basic-600']
            }]} name={Platform.OS === 'ios' ? 'chevron-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'} size={25} pack='ionicons' />
        )
    }

    const renderLeftIcon = () => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={navigation.goBack}
        />
    )

    return (
        <>
            <Layout level="1" style={styles.layout}>
                <TopNavigation
                    alignment="center"
                    title={route.params ? (route.params as DiseaseDto).cid : ''}
                    accessoryLeft={renderLeftIcon}
                />
            </Layout>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                {isLoading ?
                    <>
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Spinner status='primary' size='giant' />
                        </View>
                    </>
                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>
                        <View style={styles.container}>
                            {diseaseDataParsed && (
                                diseaseDataParsed.content && diseaseDataParsed.content?.length > 0 && (
                                    diseaseDataParsed.content.map((item, index) => (
                                        <View key={index}>
                                            {item.type === 'heading' ?
                                                (
                                                    <View style={[{ ...alignRichText(item.attrs) }, styles.heading]}>
                                                        {item.content?.map((e, i) =>
                                                            <Text
                                                                category={
                                                                    item.attrs?.level === 1 ? 'h3' :
                                                                        item.attrs?.level === 2 ? 'h4' : 'h5'
                                                                }
                                                                onPress={() => {
                                                                    e.marks && e.marks.find(e => e.type.includes('link')) ? openLink(e.marks[0].attrs?.href) : undefined
                                                                }}
                                                                key={`${e}${i}`}
                                                                style={styleRichText(e.marks, item.attrs)}
                                                            >{e.text}</Text>
                                                        )}
                                                    </View>
                                                ) : null}
                                            {item.type === 'paragraph' ?
                                                (
                                                    <View style={{
                                                        ...alignRichText(item.attrs),
                                                        paddingVertical: 5
                                                    }}>
                                                        {renderParagraph(item)}
                                                    </View>
                                                ) : null}

                                            {item.type === 'blockquote' ?
                                                (
                                                    <View style={styles.blockquote}>
                                                        <Text
                                                            style={{
                                                                ...styleRichText(item.marks),
                                                            }}>&ldquo;</Text>
                                                        {item.content && item.content?.map((e, i) =>
                                                            <View key={`${e}${i}`}>
                                                                {renderParagraph(e, item.type)}
                                                            </View>
                                                        )}
                                                        <Text
                                                            style={{
                                                                ...styleRichText(item.marks),
                                                            }}>&rdquo;</Text>
                                                    </View>
                                                ) : null}
                                        </View>
                                    ))
                                )
                            )}
                        </View>
                    </ScrollView>
                }
            </SafeAreaLayout>
        </>
    )
}

export default DetailsAboutScreen