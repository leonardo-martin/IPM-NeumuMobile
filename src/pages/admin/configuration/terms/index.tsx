import React, { FC, ReactElement } from 'react'
import TermsConditions from '@components/acceptTerms'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { ScrollView } from 'react-native-gesture-handler'
import { View } from 'react-native'

const Terms: FC = (): ReactElement => {

    return (
        <>
            <SafeAreaLayout level='1' style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 25, paddingTop: 0 }}>
                        <TermsConditions />
                    </View>
                </ScrollView>
            </SafeAreaLayout>
        </>
    )
}

export default Terms