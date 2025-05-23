import { View, Text, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Styles } from '../assets/Styles/Styles';
import { useContext, useEffect, useState } from 'react';
import { AuthProcess } from '../assets/Contexts/AuthProcess';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../assets/Styles/Screens/Home';
import Login from './Login';

const Stack = createNativeStackNavigator()

export default function HomeLogin() {
    const { IsLogged,setIsLogged,initialPage,setInitialPage,usuario,verificarLogin,inAcitivity,lerDadosUser, v_pass, iconePass, verificaEstado, email, setEmail, senha, setSenha, login } = useContext<any>(AuthProcess);
    function LoginScreen() {
    }

    useEffect(() => {
        verificarLogin();
    }, []);

    if (inAcitivity) {
        return (
            <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator size={80} color={'blue'} />
                <Text style={[Styles.secondTitle,{textAlign:'center'}]}>{'Carregando\n\nAguarde...'}</Text>
            </View>
        );
    } else {

        try {
            return (
                <Stack.Navigator initialRouteName={IsLogged !== undefined && IsLogged !== null && IsLogged !== true ? 'Home': 'Login'}>
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                </Stack.Navigator>
            )
        } catch (error) {
            console.log(error);
        }
    }
}