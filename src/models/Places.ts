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
