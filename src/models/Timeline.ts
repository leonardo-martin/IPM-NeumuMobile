export class TimelineItem {
    [key: string]: TimelineTimeItem[]
} 

export class TimelineTimeItem {
    title!: string
    description!: string
}