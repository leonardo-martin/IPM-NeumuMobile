import { SafeAreaLayout } from '@components/safeAreaLayout';
import { useAppSelector } from '@hooks/redux';
import { saveFileToDevice, userGetDocument, userGetDocumentFile } from '@services/document.service';
import { Button } from '@ui-kitten/components';
import { getDocumentType, getEntityType } from '@utils/entity';
import React, { FC, ReactElement } from 'react';
import { RootState } from 'store';

const AtosDevTestScreen: FC = (): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const download = async () => {

        if (ids) {
            const responseT = await userGetDocument({
                entityId: ids?.patientId,
                entityType: getEntityType('exam'),
                documentType: getDocumentType('exam'),
                documentId: 131
            })

            const response = await userGetDocumentFile(responseT.data[0].id)

            const ret = await saveFileToDevice(response.data.data, responseT.data[0].documentFormat)
            console.log("aqui", JSON.stringify(ret, null, 2))
        }

    }

    return (
        <>
            <SafeAreaLayout level='1' style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button onPress={download}>Download File</Button>
            </SafeAreaLayout>

        </>
    )
}

export default AtosDevTestScreen
