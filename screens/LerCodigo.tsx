import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { Styles } from '../assets/Styles/Styles';

export default function LerCodigo({ route, navigation }: any) {
    const [temPermissao, setTemPermissao] = useState('');
    const [scaneado, setScaneado] = useState<boolean>(false);
    const [dadosProduto, setDadosProduto] = useState(route.params !== undefined && route.params.IsEdit !== undefined ? route.params.dadosProduto : '');
    const [edit, setIsEdit] = useState<boolean>(route.params !== undefined && route.params.IsEdit !== undefined ? true : false);
    const [nome, setNome] = useState('');
    const [qtdPorCaixa, setQtdPorCaixa] = useState('');
    const [codigo, setCodigo] = useState(route.params !== undefined && route.params.IsEdit !== undefined ? dadosProduto.codigo_barras : '');
    const [qtdUni, setQtdUni] = useState('');
    const [qtdCaixas, setQtdCaixas] = useState('');
    const [qtdEstoque, setQtdEstoque] = useState('');
    console.log('verifica se há parametros=>',route.params)
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            console.log(status);
            setTemPermissao(status);
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: any) => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'CadastroProduto',
                    params: {
                        codigo_barras: data
                    }
                }
            ]
        });
        //navigation.navigate('CadastroProduto',{codigo_barras:data});
    };

    console.log(route.params)

    if (edit) {
        return (
            <View style={{ flex: 1 }}>
                <Text style={[{ marginHorizontal: '10%', marginTop: '10%', fontSize: 22, textAlign: 'center' }]}>Escaneie o código abaixo</Text>
                {
                    !scaneado ?
                        <View style={[{ height: '30%' }]}>
                            <View>
                                <View>
                                    <Text style={[{ marginHorizontal: '10%', marginBottom: 5, marginTop: 15 }]}>Aponte para o codigo de barras:</Text>
                                    <CameraView
                                        onBarcodeScanned={scaneado ? undefined : handleBarCodeScanned}
                                        style={{ height: '60%', marginHorizontal: '10%', marginBottom: '10%', borderRadius: 10 }}
                                    />
                                </View>
                            </View>
                        </View>
                        :
                        <TouchableOpacity onPress={() => setScaneado(false)}
                            style={[Styles.btn, Styles.primary, { marginHorizontal: '10%' }]}
                        >
                            {
                                scaneado ?
                                    <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Buscar por: "{codigo}"</Text>
                                    :
                                    <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Escanear novamente</Text>
                            }
                        </TouchableOpacity>
                }
                <View style={{ padding: 5 }}>
                    <View style={[{ borderWidth: 1, padding: 10, borderRadius: 5, backgroundColor: '#FFFFFF' }]}>
                        <Text>Código de Barras (manual):</Text>
                        <TextInput value={codigo} onChangeText={(text) => { setCodigo(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} onFocus={() => { navigation.navigate('LerCodigo') }} />
                        <Text>Nome do Produto:</Text>
                        <TextInput value={nome} onChangeText={(text) => { setNome(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />

                        <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                                <Text>Quantidade por Caixa:</Text>
                                <TextInput keyboardType="numeric" value={qtdUni} onChangeText={(text) => { setQtdUni(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                            </View>
                            <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                                <Text>Quantidade Caixa:</Text>
                                <TextInput keyboardType="numeric" value={qtdCaixas} onChangeText={(text) => { setQtdCaixas(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                            </View>
                        </View>

                        <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                                <Text>Quantidade em estoque:</Text>
                                <TextInput keyboardType="numeric" value={qtdEstoque} onChangeText={(text) => { setQtdEstoque(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                            </View>
                            <TouchableOpacity style={[Styles.btn, Styles.primary, { marginVertical: 20, width: '50%' }]} onPress={() => { handleCadastrar() }}>
                                <Text style={[Styles.text_primary, { fontSize: 20, textAlign: 'center' }]}>Atualizar Produto</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        /*<TouchableOpacity style={[Styles.btn, Styles.success]} onPress={() => navigation.navigate('EntradaEstoque')}>
                            <Text style={[Styles.text_success, { fontSize: 20, textAlign: 'center' }]}>Entrada de produtos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn, Styles.success]} onPress={() => navigation.navigate('RetiradaProduto')}>
                            <Text style={[Styles.text_success, { fontSize: 20, textAlign: 'center' }]}>Ir para Retirada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn, Styles.success]} onPress={() => navigation.navigate('EstoqueAtual')}>
                            <Text style={[Styles.text_success, { fontSize: 20, textAlign: 'center' }]}>Ver Estoque Atual</Text>
                        </TouchableOpacity>*/
                    }
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Text style={[{ marginHorizontal: '10%', marginTop: '10%', fontSize: 22, textAlign: 'center' }]}>Escaneie o código abaixo</Text>
                {
                    !scaneado ?
                        <View style={[{ height: '30%' }]}>
                            <View>
                                <View>
                                    <Text style={[{ marginHorizontal: '10%', marginBottom: 5, marginTop: 15 }]}>Aponte para o codigo de barras:</Text>
                                    <CameraView
                                        onBarcodeScanned={scaneado ? undefined : handleBarCodeScanned}
                                        style={{ height: '60%', marginHorizontal: '10%', marginBottom: '10%', borderRadius: 10 }}
                                    />
                                </View>
                            </View>
                        </View>
                        :
                        <TouchableOpacity onPress={() => setScaneado(false)}
                            style={[Styles.btn, Styles.primary, { marginHorizontal: '10%' }]}
                        >
                            {
                                scaneado ?
                                    <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Buscar por: "{codigo}"</Text>
                                    :
                                    <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Escanear novamente</Text>
                            }
                        </TouchableOpacity>
                }
            </View>
        );
    }
}