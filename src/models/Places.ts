export class UF {
    id!: number
    sigla!: string
    nome!: string
    regiao!: Region
}

export class City {
    id!: number
    nome!: string
    microrregiao!: MicroRegion
    "regiao-imediata": ImmediateRegion
}

class Region {
    id!: number
    sigla!: string
    nome!: string
}

class MicroRegion {
    id!: number
    nome!: string
    mesorregiao!: MesoRegion
}

class MesoRegion {
    id!: number
    nome!: string
    UF!: UF
}


class ImmediateRegion {
    id!: number
    nome!: string
    "regiao-intermediaria": IntermediateRegion
}

class IntermediateRegion {
    id!: number
    nome!: string
    UF!: UF
}

class SubRegion {
    id!: {
        [key: string]: number
    }
    nome!: string
    regiao!: {
        id: {
            [key: string]: number
        },
        nome: string
    }
}

export class Country {
    id!: JSONObject
    nome!: string
    "regiao-intermediaria": {
        id: {
            [key: string]: number
        }
        nome: string
    } | null
    "sub-regiao": SubRegion
}

interface JSONObject {
    [key: string]: any
}