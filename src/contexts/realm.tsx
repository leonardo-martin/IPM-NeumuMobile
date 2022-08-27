import { DATABASE } from "@constants/storage";
import { createRealmContext } from "@realm/react";
import { CountrySchema } from "@schemas/CountryCode.schema";
import { Platform } from "react-native";
import RNFS from 'react-native-fs';
import { Configuration } from "realm";

const config: Configuration = {
    schema: [CountrySchema],
    path: Platform.OS === 'ios'
        ? RNFS.MainBundlePath + `/${DATABASE.DB_NAME}`
        : `${DATABASE.DB_NAME}`,
    readOnly: true
}

const RealmContext = createRealmContext(config);

export default RealmContext
