import { ObjectSchema, Object } from "realm"

class CountrySchema extends Object {
     _id: number
     vc_country_name: string
     vc_un_code: string
     vc_country_code: string

    constructor(
        _id: number,
        vc_country_name: string,
        vc_un_code: string,
        vc_country_code: string
    ) {
        super(new Realm(), {})
        this._id = _id
        this.vc_country_name = vc_country_name
        this.vc_un_code = vc_un_code
        this.vc_country_code = vc_country_code
    }

    get uuid() {
        return this._id
    }

    get country() {
        return `${this.vc_country_name}`
    }

    get phoneCode() {
        return `${this.vc_un_code}`
    }

    get code() {
        return `${this.vc_country_code}`
    }

    static schema: ObjectSchema = {
        name: "prmt_01_country",
        primaryKey: "_id",
        properties: {
            _id: "int",
            vc_country_name: "string",
            vc_country_code: {
                type: "string",
                indexed: true
            },
            vc_un_code: "string"
        },

    }

}

export { CountrySchema }