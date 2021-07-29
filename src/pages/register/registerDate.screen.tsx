import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { HeaderComponent } from '../../components/header/header.component';
import { registerStyle } from './register.style';


interface RegisterScreenProps {
    navigation: any;
}

export const RegisterEmailScreen = (props: RegisterScreenProps) => {

  return(
    <SafeAreaView style={registerStyle.content}> 
      
    <HeaderComponent
                title="Registro"
                navigation={props.navigation}
                hasBackButton={true} />
   <View style={registerStyle.content}>
   <View style={registerStyle.view}>
                 </View>
   </View>
</SafeAreaView>
  );
}

export default RegisterEmailScreen;