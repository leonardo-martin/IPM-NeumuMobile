import React from 'react'
import { Icon, IconElement, IconProps } from '@ui-kitten/components'

export const CameraIcon = (props: IconProps): IconElement => (
    <Icon {...props} name='camera-outline'/>
)

export const FileIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='file-outline' pack='eva'/>
)

export const PinIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='pin-outline' pack='eva'/>
)

export const CornerDownRightIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='corner-down-right-outline' pack='eva'/>
)

export const PlusIcon = (props: IconProps): IconElement => (
  <Icon {...props} name='plus-outline' pack='eva'/>
)
