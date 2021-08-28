import { ParamListBase, RouteProp } from '@react-navigation/native'

export interface NavigationProps {
    route?: RouteProp<ParamListBase, keyof ParamListBase>
    navigation: any
}