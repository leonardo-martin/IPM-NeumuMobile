import { configLoggerType, defLvlType, logger } from "react-native-logs";
import { consoleTransport } from 'react-native-logs/dist/transports/consoleTransport';

const defaultConfig: configLoggerType = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    transportOptions: {
        colors: {
            info: "blueBright",
            warn: "yellowBright",
            error: "redBright",
        },
    },
    transport: consoleTransport,
    dateFormat: "iso",
};

export class LogService {

    private log

    constructor() {
        this.log = logger.createLogger(defaultConfig);
        if (__DEV__)
            this.log.setSeverity('debug');
    }

    loga = (message: any, logMode: defLvlType = "debug") => {

        switch (logMode) {
            case "debug":
                this.log.debug(message);
                break
            case "info":
                this.log.info(message);
                break
            case "warn":
                this.log.warn(message);
                break
            case "error":
                this.log.error(message);
                break
            default:
                break
        }

    }
}