import { API_IBGE_GOV, API_POSTAL_CODE_SEARCH } from "@constants/uri"
import { AddressIBGEDto, City, Country, UF } from "@models/Places"

interface PlacesOpt {
    orderBy: string
}

const placesOptions: PlacesOpt = {
    orderBy: 'nome'
}

export const getCountries = async (options: PlacesOpt = placesOptions): Promise<Country[]> => {
    const params = new URLSearchParams()
    params.append('orderBy', options.orderBy)

    return await fetch(`${API_IBGE_GOV}/localidades/paises?` + params, {
        method: 'GET'
    }).then(async (response) => await response.json())
}

export const getStates = async (options: PlacesOpt = placesOptions): Promise<UF[]> => {
    const params = new URLSearchParams()
    params.append('orderBy', options.orderBy)

    return await fetch(`${API_IBGE_GOV}/localidades/estados?` + params, {
        method: 'GET'
    }).then(async (response) => await response.json())
}

export const getCities = async (state: string | undefined, options: PlacesOpt = placesOptions): Promise<City[]> => {
    if (state === undefined)
        throw 'State not defined'

    const params = new URLSearchParams()
    params.append('orderBy', options.orderBy)

    return await fetch(`${API_IBGE_GOV}/localidades/estados/${state}/municipios?` + params, {
        method: 'GET'
    }).then(async (response) => await response.json())
}

export const getAddressByPostalCode = async (postalCode: string): Promise<AddressIBGEDto> => {
    return await fetch(`${API_POSTAL_CODE_SEARCH.replace('$POSTAL_CODE', postalCode)}`, {
        method: 'GET'
    }).then(async (response) =>
        response && response.status === 200 ?
            await response.json() : null
    )
}