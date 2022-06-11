import { JSONObject } from "@models/Common"


interface ListData {
    key: string
    title: JSONObject
    description: JSONObject
    image: string | any
}

// 0 - patient | 1 - specialist
export const flatList: ListData[] = [
    {
        "key": "1",
        "title": {
            0: "Cadastro concluído com sucesso !!!",
            1: "Cadastro concluído com sucesso !!!"
        },
        "description": {
            0: "Obrigado pela confiança.",
            1: "Obrigado pela confiança."
        },
        "image": require('../../../assets/confirmation/check.png')
    },
    {
        "key": "2",
        "title": {
            0: "Confirmação de E-mail",
            1: "Confirmação de E-mail"
        },
        "description": {
            0: "Você irá receber um email dentro de alguns instantes para ativar sua conta.",
            1: "Você irá receber um email dentro de alguns instantes para ativar sua conta.",
        },
        "image": require('../../../assets/confirmation/sendEmail.png')
    },
    {
        "key": "3",
        "title": {
            0: "Comece a utilizar!",
            1: "Falta pouco!"
        },
        "description": {
            0: "Ao confirmar sua conta, você terá acesso à todas funcionalidades do app.",
            1: "Ao validar sua conta, seu cadastro será encaminhado para aprovação da administração do aplicativo, para que tenha acesso a todas funcionalidades do app."
        },
        "image": require('../../../assets/confirmation/user-list-check.png')
    },
]
