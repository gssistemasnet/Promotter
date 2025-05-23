import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ComponentIcon({options,iconName,size}:any) {
    try {
        return(
            <MaterialCommunityIcons name={iconName} size={size} style={options}/>
        )
    } catch (error:any) {
        
    }
}