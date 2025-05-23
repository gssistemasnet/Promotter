import { View, Text, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Styles } from '../assets/Styles/Styles';
import { useContext, useEffect, useState } from 'react';
import { AuthProcess } from '../assets/Contexts/AuthProcess';
import React from 'react';

export default function Login() {
    const { IsLogged, usuario, v_pass, iconePass, verificaEstado, email, setEmail, senha, setSenha, login } = useContext<any>(AuthProcess);
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardOpen(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
        });

        // Clean up
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#0d6efd' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* Fundo com camadas e ícone */}
                    <View style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, top: '36%',
                        borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#FAFAFA'
                    }} />
                    <MaterialCommunityIcons
                        name='account'
                        size={30}
                        style={{
                            position: 'absolute', bottom: 0, left: '45%', right: '45%', top: keyboardOpen ? '25%' : '37%',
                            color: keyboardOpen ? '#FFFFFF' : '#000000'
                        }}
                    />
                    <View style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, top: keyboardOpen ? '36%' : '42%',
                        borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: '#9ec5fe'
                    }} />

                    {/* Conteúdo */}
                    <Text style={[Styles.secondTitle, { textAlign: 'center', marginVertical: 75, color: '#FFFFFF' }]}>
                        Login PROMOTTER
                    </Text>

                    <View style={{ marginHorizontal: '10%', marginTop: 20 }}>
                        <Text style={[Styles.secondTitle, { color: '#FFFFFF', marginBottom: 5 }]}>E-mail:</Text>
                        <TextInput
                            placeholder='E-mail...'
                            style={[Styles.input, { textAlign: 'left', marginHorizontal: 0 }]}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={{ marginHorizontal: '10%', marginTop: 20 }}>
                        <Text style={[Styles.secondTitle, { color: '#FFFFFF', marginBottom: 5 }]}>Senha:</Text>
                        <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between' }]}>
                            <TextInput
                                secureTextEntry={v_pass}
                                placeholder='Senha...'
                                style={[Styles.input, { textAlign: 'left', width: '89%', marginHorizontal: 0 }]}
                                value={senha}
                                onChangeText={setSenha}
                            />
                            <TouchableOpacity
                                style={[Styles.btn, Styles.light, { width: '10%', paddingHorizontal: 6, borderWidth: 0 }]}
                                onPress={() => verificaEstado(v_pass)}
                            >
                                <MaterialCommunityIcons name={iconePass} size={20} style={[Styles.text_light]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', marginHorizontal: '10%', marginTop: 0 }]}>
                        <TouchableOpacity style={[Styles.em_linha_horizontal, Styles.btn, Styles.light]}>
                            <MaterialCommunityIcons name={'numeric'} size={20} style={[Styles.text_light, Styles.mr_5]} />
                            <Text style={[Styles.text_light]}>Entrar com código</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.em_linha_horizontal, Styles.btn, Styles.primary]}
                            onPress={() => {
                                login();
                            }}
                        >
                            <Text style={[Styles.text_primary, Styles.mr_5]}>Login</Text>
                            <MaterialCommunityIcons name={'login'} size={20} style={[Styles.text_primary]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', marginHorizontal: '10%', marginTop: 0 }]}>
                        <View style={[{ width: '45%', height: 1, backgroundColor: '#000' }]} />
                        <Text style={[{}]}>OU</Text>
                        <View style={[{ width: '45%', height: 1, backgroundColor: '#000' }]} />
                    </View>
                    <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', marginHorizontal: '10%', marginTop: 0 }]}>
                        <TouchableOpacity style={[Styles.em_linha_horizontal, Styles.btn, Styles.success, { width: '100%' }]}>
                            <MaterialCommunityIcons name={'google'} size={20} style={[Styles.text_success, Styles.mr_5]} />
                            <Text style={[Styles.text_success]}>Entrar com Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}