import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { Avatar, AvatarProps, ButtonElement } from '@ui-kitten/components'
import { editProfileStyle } from './style'

export interface ProfileAvatarProps extends AvatarProps {
  editButton: () => ButtonElement
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ style, editButton, ...restProps }): ReactElement => {

  return (
    <View style={style}>
      <Avatar
        {...restProps}
        style={[style, editProfileStyle.avatar]}
      />
      {editButton()}
    </View>
  )
}

export default ProfileAvatar

