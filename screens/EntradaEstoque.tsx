// screens/EntradaEstoque.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Styles } from '../assets/Styles/Styles';

export default function EntradaEstoque({ navigation }: any) {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState('');

    useEffect(() => {
        buscarEstoque();
    }, []);

    async function buscarEstoque() {
        const response = await axios({
            method: 'get',
            url: 'https://gsapp.com.br/app/src/promotter/promotter.php',
            params: {
                comando: 'buscarTodosProdutos',
            },
        })

        console.log(response);
        if (response.data[0].dados !== null) {
            console.log('sucesso=>', response.data[0].dados)
            setProdutos(response.data[0].dados);
        } else {
            console.log('Erro=>', response.data);
            Alert.alert('Erro', 'Produto não encontrado!');
        }
    }

    async function handleEntrada(s1: any, s2: any) {
        let cadastro = new FormData();

        cadastro.append('codigo_barras', s1);
        cadastro.append('qtd_entrada', s2);
        cadastro.append('comando', 'entradaProduto');

        const response = await axios.post('https://gsapp.com.br/app/src/promotter/promotter.php', cadastro, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response)
        if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 && response.data[0].codeMensagem === 0) {
            console.log('sucesso=>', response.data)
            Alert.alert('Atenção!!!', 'Entrada realizada com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'CadastroProduto'
                                }
                            ]
                        })
                    }
                }
            ]);
        } else {
            console.log('Erro=>', response.data);
            Alert.alert('Erro', 'Erro ao dar entrada no produto!');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={[Styles.fontMedium,{}]}>Selecionar produto para incluir:</Text>
            <View style={[{ borderWidth: 1, borderColor: '#999999',borderRadius:5}]}>
                <Picker selectedValue={produtoSelecionado} onValueChange={(text) => { setProdutoSelecionado(text) }} style={[{ borderWidth: 1, borderRadius: 5, borderColor: '#000' }]} mode='dialog'>
                    <Picker.Item
                        label="Selecione o produto..."
                        value={null}
                        style={[{}]}
                    />
                    {produtos.map(p => (
                        <Picker.Item key={p.codigo} label={p.descricao + ' (' + p.qtd_em_estoque + ' caixa(s)'} value={p.codigo_barras} />
                    ))}
                </Picker>
            </View>
            <Text style={[Styles.fontMedium,{}]}>Quantidade de Caixas:</Text>
            <TextInput keyboardType="numeric" value={quantidade} onChangeText={setQuantidade} style={{ borderWidth: 1, marginBottom: 10,borderColor:'#999999',borderRadius:5,fontSize:27}} />
            <Button title="Registrar Entrada" onPress={() => { handleEntrada(produtoSelecionado, quantidade) }} />
        </View>
    );
}