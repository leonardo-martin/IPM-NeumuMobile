import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { JSONContent } from '@models/Common'
import { DiseaseDataDto, DiseaseDto } from '@models/Disease'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { getDiseaseDataById } from '@services/disease.service'
import { Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Linking, RefreshControl, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { detailsAboutStyle } from './details.style'

const DetailsAboutScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(detailsAboutStyle)
    const theme = useTheme()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [diseaseData, setDiseaseData] = useState<DiseaseDataDto>()
    const [diseaseDataParsed, setDiseaseDataParsed] = useState<JSONContent>()
    const route = useRoute()

    const loadData = async (id: number) => {
        const response = await getDiseaseDataById(id)
        if (response.status === 200) {
            setDiseaseData(response.data)
        }
    }

    const openLink = (url: any) => {
        try {
            Linking.openURL(url).catch(() => {
                toast.info({ message: 'Endereço não encontrado', duration: 3000 })
            })
        } catch (error) {
            toast.info({ message: 'Erro ao abrir link', duration: 3000 })
        }
    }

    useEffect(() => {
        try {
            if (diseaseData)
                setDiseaseDataParsed(JSON.parse(JSON.parse(diseaseData.payload)) as JSONContent)
        } catch (error) {
            toast.danger({ message: 'Erro ao exibir texto', duration: 3000 })
        }
    }, [diseaseData])

    useFocusEffect(
        useCallback(() => {
            try {
                loadData((route.params as DiseaseDto).id)
            } catch (error) {
                toast.danger({ message: 'Nenhum ID fornecido', duration: 3000 })
            }
        }, [route.params])
    )

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

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
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
        </SafeAreaLayout>
    )
}

export default DetailsAboutScreen