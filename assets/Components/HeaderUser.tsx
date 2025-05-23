import { useContext } from 'react';
import { View,Text} from 'react-native';
import { AuthProcess } from '../Contexts/AuthProcess';
import { Styles } from '../Styles/Styles';
import {MaterialCommunityIcons,Ionicons,Entypo} from '@expo/vector-icons';

export default function HeaderUser({title}:any) {
    const {usuario} = useContext<any>(AuthProcess);
    try {
        return(
            <View style={[Styles.em_linha_horizontal,Styles.avatar]}>
                <MaterialCommunityIcons name='account-circle' size={30} color={'#000000'} style={[Styles.mr_5]}/>
                <Text style={[{fontSize:20,fontWeight:'bold'}]}>{title}</Text>
            </View>
        )
    } catch (error) {
        
    }
}