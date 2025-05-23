// screens/CadastroProduto.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Styles } from '../assets/Styles/Styles';
import axios from 'axios';

export default function CadastroProduto({ route, navigation }: any) {
    const [dadosProd,setDadosProd] = useState(route.params !== undefined && route.params !== null ? route.params.dadosProduto : '');
    const [nome, setNome] = useState(dadosProd !== undefined && dadosProd !== null ? dadosProd : '');
    const [qtdPorCaixa, setQtdPorCaixa] = useState('');
    const [codigo, setCodigo] = useState(route.params !== undefined && route.params !== null ? route.params.codigo_barras : '');
    const [qtdUni, setQtdUni] = useState('');
    const [qtdCaixas, setQtdCaixas] = useState('');
    const [qtdEstoque, setQtdEstoque] = useState('');
    

    console.log('Dados enviados da edição=>',dadosProd);
    useEffect(() => {
    }, []);

    async function handleCadastrar() {
        console.log(codigo,nome,qtdUni,qtdCaixas,qtdEstoque)
        try {
            if(codigo === '' || nome === '' || qtdUni === '' || qtdCaixas === '' || qtdEstoque === ''){
                Alert.alert('Erro!','Verifique se todas as informações foram passadas corretamente!');
            }else{
                let cadastro = new FormData();

                cadastro.append('codigo_barras', codigo);
                cadastro.append('descricao', nome);
                cadastro.append('qtd_uni', qtdUni);
                cadastro.append('qtd_caixas', qtdCaixas);
                cadastro.append('qtd_em_estoque', qtdEstoque);
                cadastro.append('comando', 'cadastrarProduto');

                const response = await axios.post('https://gsapp.com.br/app/src/promotter/promotter.php', cadastro,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response)
                if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 && response.data[0].codeMensagem ===0) {
                    console.log('sucesso=>', response.data[0].dados)
                    Alert.alert('Atenção!!!', 'Produto: "' + nome + '" cadastrado com sucesso!',[
                        {
                            text:'OK',
                            onPress:()=>{
                                navigation.reset({
                                    index:0,
                                    routes:[
                                        {
                                            name:'CadastroProduto'
                                        }
                                    ]
                                })
                            }
                        }
                    ]);
                } else {
                    console.log('Erro=>', response.data);
                    Alert.alert('Erro', 'Produto não cadastrado.\n\nMais detalhes: '+response.data[0].statusMensagem);
                }
            }
        } catch (error) {
            console.log(error)
        }
        
    };

    return (
        <View style={{ padding: 5 }}>
            <View style={[{ borderWidth: 1, padding: 10, borderRadius: 5, backgroundColor: '#FFFFFF' }]}>
                <Text>Código de Barras (manual):</Text>
                <TextInput value={route.params !== undefined && route.params !== null ? route.params.codigo_barras : codigo} onChangeText={(text) => { setCodigo(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} onFocus={() => { navigation.navigate('LerCodigo') }} />
                <Text>Nome do Produto:</Text>
                <TextInput value={nome} onChangeText={(text) => { setNome(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />

                <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                        <Text>Quantidade por Caixa:</Text>
                        <TextInput keyboardType="numeric" value={qtdUni} onChangeText={(text) => { setQtdUni(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                    </View>
                    <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                        <Text>Quantidade Caixa:</Text>
                        <TextInput keyboardType="numeric"  value={qtdCaixas} onChangeText={(text) => { setQtdCaixas(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                    </View>
                </View>

                <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={[{ display: 'flex', flexDirection: 'column', width: '45%' }]}>
                        <Text>Quantidade em estoque:</Text>
                        <TextInput keyboardType="numeric" value={qtdEstoque} onChangeText={(text) => { setQtdEstoque(text) }} style={[Styles.input, { marginHorizontal: 0, borderWidth: 1, marginBottom: 10 }]} />
                    </View>
                    <TouchableOpacity style={[Styles.btn, Styles.primary, { marginVertical: 20, width: '50%' }]} onPress={()=>{handleCadastrar()}}>
                        <Text style={[Styles.text_primary, { fontSize: 20, textAlign: 'center' }]}>Cadastrar Produto</Text>
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
    );
}