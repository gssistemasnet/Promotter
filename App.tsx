import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroProduto from './screens/CadastroProduto';
import EntradaEstoque from './screens/EntradaEstoque';
import RetiradaProduto from './screens/RetiradaProduto';
import EstoqueAtual from './screens/EstoqueAtual';
import LerCodigo from './screens/LerCodigo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Promotter from './screens/Promotter';
import AuthProcessProvider from './assets/Contexts/AuthProcess';
import { View,Text, TextInput, TouchableOpacity} from 'react-native';
import { Styles } from './assets/Styles/Styles';
import HomeLogin from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProcessProvider>
        <HomeLogin/>
      </AuthProcessProvider>
    </NavigationContainer>
  );
}