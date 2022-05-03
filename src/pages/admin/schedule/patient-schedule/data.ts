interface Data {
    id: number
    title: Date
    disabled: boolean
}

export const options: Data[] = [
    {
        id: 1,
        title: new Date(2022, 0, 1, 8, 45),
        disabled: false
    },
    {
        id: 2,
        title: new Date(2022, 0, 1, 13, 15),
        disabled: false
    },
    {
        id: 3,
        title: new Date(2022, 0, 1, 15, 55),
        disabled: false
    },
    {
        id: 4,
        title: new Date(2022, 0, 1, 16, 55),
        disabled: false
    },
    {
        id: 5,
        title: new Date(2022, 0, 1, 17, 15),
        disabled: true
    }
]