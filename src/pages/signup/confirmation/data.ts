import { FlatData } from "@models/FlatData"
import { FLATICON_URI } from "@constants/uri"

export const flatList: FlatData[] = [
    {
        "key": "1",
        "title": "Cadastro concluído com sucesso !!!",
        "description": "Obrigado pela confiança.",
        "image": require('../../../assets/confirmation/check.png')
    },
    {
        "key": "2",
        "title": "Confirmação de E-mail",
        "description": "Você irá receber um email dentro de alguns instantes para ativar sua conta.",
        "image": require('../../../assets/confirmation/sendEmail.png')
    },
    {
        "key": "3",
        "title": "Comece a utilizar!",
        "description": "Ao confirmar sua conta, você terá acesso à todas funcionalidades do app.",
        "image": require('../../../assets/confirmation/user-list-check.png')
    },
]
