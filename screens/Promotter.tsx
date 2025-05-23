import { View,Text} from 'react-native';
import V from '../app.json';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Styles } from '../assets/Styles/Styles';

export default function Promotter() {
    return (
        <View style={[{flex:1,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center'}]}>
            <MaterialCommunityIcons name='cellphone-information' size={75} color={'#000'} style={[{marginBottom:25}]}/>
            <Text style={[Styles.secondTitle,{textAlign:'center',}]}>Versão: {V.expo.version}</Text>
            <Text style={[Styles.secondTitle,{textAlign:'center',fontSize:18}]}>{'TODOS OS DIREITOS RESERVADOS Á GS APP'}</Text>
            <Text style={[Styles.secondTitle,{textAlign:'center',fontSize:18}]}>{'Desenvolvido por:\n\nGUILHERME SANTOS'}</Text>
            <Text style={[Styles.secondTitle,{textAlign:'center',fontSize:18,marginTop:30}]}>{'Saiba mais em https://gsapp.com.br'}</Text>
        </View>
    );
}