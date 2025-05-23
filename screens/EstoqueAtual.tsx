// screens/EstoqueAtual.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import axios from 'axios';
import { Styles } from '../assets/Styles/Styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthProcess } from '../assets/Contexts/AuthProcess';
const { width, height } = Dimensions.get('window');

type Produto = {
    codigo: string;
    codigo_barras: string;
    descricao: string;
    qtd_uni: number;
    qtd_em_estoque: number;
};

export default function EstoqueAtual({ navigation }: any) {
    const { produtos, setProdutos, buscarEstoque } = useContext<any>(AuthProcess);
    const [buscaTexto, setBuscaTexto] = useState('');

    useEffect(() => {
        buscarEstoque();
    }, []);

    const produtosFiltrados = produtos.filter((item: Produto) =>
        item.descricao.toLowerCase().includes(buscaTexto.toLowerCase())
    );

    async function excluirProduto(cdgItem: any) {
        const response = await axios({
            method: 'get',
            url: 'https://gsapp.com.br/app/src/promotter/promotter.php',
            params: {
                codigo_barras: cdgItem,
                comando: 'excluirProduto',
            },
        });

        if (response.data[0].status === 'OK' || response.data[0].statusCode === 200 || response.data[0].codeMensagem === 0) {
            buscarEstoque();
            Alert.alert('Sucesso', response.data[0].statusMensagem);
        } else {
            Alert.alert('Erro', 'Produto não encontrado!');
        }
    }

    const renderItem = ({ item }: any) => (
        <View style={{
            padding: 10,
            borderLeftWidth: 5,
            borderRadius: 5,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderLeftColor: item.qtd_em_estoque === 0 ? 'red' : 'green',
            backgroundColor: '#fafafa'
        }}>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Código: {item.codigo_barras}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Descrição: {item.descricao}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Qtd por Caixa: {item.qtd_uni} unidades</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Em estoque: {item.qtd_em_estoque} Caixa(s)</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Total de Unidades: {item.qtd_em_estoque * item.qtd_uni} Unidades</Text>

            <TouchableOpacity style={[Styles.btn, Styles.danger, Styles.em_linha_horizontal, Styles.flutuante, Styles.top_right, { top: 25, paddingHorizontal: 2, paddingVertical: 2 }]}
                onPress={() => {
                    Alert.alert('ATENÇÃO!!!', 'Tem certeza que deseja excluir o item:\n\n' + item.descricao + '?', [
                        { text: 'Não' },
                        {
                            text: 'Sim exclua',
                            onPress: () => {
                                excluirProduto(item.codigo_barras);
                            }
                        }
                    ]);
                }}>
                <MaterialCommunityIcons name='delete' size={25} style={Styles.text_danger} />
            </TouchableOpacity>

            <TouchableOpacity style={[Styles.btn, Styles.info, Styles.em_linha_horizontal, Styles.flutuante, Styles.top_right, { top: -10, paddingHorizontal: 2, paddingVertical: 2 }]}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'LerCodigo',
                                params: { IsEdit: true, dadosProduto: item }
                            }
                        ]
                    });
                }}>
                <MaterialCommunityIcons name='pencil' size={25} style={Styles.text_info} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 10 }}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }]}>
                <MaterialCommunityIcons name='magnify' size={25} style={[{zIndex:2/*,backgroundColor:'#cacaca'*/,marginLeft:5,color: '#999999', marginBottom: 10 }]} />
                <TextInput
                    placeholder="Buscar produto..."
                    value={buscaTexto}
                    onChangeText={setBuscaTexto}
                    style={{
                        borderWidth: 1,
                        borderColor: '#999',
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        marginBottom: 10,
                        height: 50,
                        backgroundColor: '#fafafa',
                        width:'100%',marginLeft:-35,zIndex:1,paddingLeft:35
                    }}
                    placeholderTextColor={'#999'}
                    autoFocus={false}
                    returnKeyType="done"
                />
            </View>
            <FlatList
                data={produtosFiltrados}
                keyExtractor={item => item.codigo}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#999', marginBottom: 10 }}>
                        <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '2.5%' }]}>
                            {
                                buscaTexto.trim() !== '' ?
                                    <>
                                        <MaterialCommunityIcons name={produtosFiltrados.length > 0 ? 'magnify' : 'emoticon-confused'} size={25} style={[{ color: produtosFiltrados.length > 0 ? '#000000' : 'red', marginRight: 5 }]} />
                                        <Text style={{ fontWeight: 'bold', paddingVertical: 5, color: produtosFiltrados.length > 0 ? '#000000' : 'red' }}>
                                            {
                                                buscaTexto.trim() !== ''
                                                    ? produtosFiltrados.length > 0 ? `Produtos encontrados (${produtosFiltrados.length})` : `Nenhum produto encontrado (${produtosFiltrados.length})`
                                                    : `Produtos cadastrados (${produtos.length})`
                                            }
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <MaterialCommunityIcons name='list-status' size={25} style={[{ color: '#000000', marginRight: 5 }]} />
                                        <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>
                                            {
                                                buscaTexto.trim() !== ''
                                                    ? produtosFiltrados.length > 0 ? `Produtos encontrados (${produtosFiltrados.length})` : `Nenhum produto encontrado (${produtosFiltrados.length})`
                                                    : `Produtos cadastrados (${produtos.length})`
                                            }
                                        </Text>
                                    </>
                            }

                        </View>
                        <TouchableOpacity onPress={buscarEstoque} style={[Styles.btn, Styles.secondary]}>
                            <Text style={[Styles.text_secondary, { textAlign: 'center' }]}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#000', width: '5%', marginHorizontal: '45%', marginVertical: 5 }} />
                )}
                ListEmptyComponent={() => (
                    <View style={[Styles.btn, Styles.danger, Styles.em_linha_vertical]}>
                        <MaterialCommunityIcons name='sleep' size={75} style={Styles.text_danger} />
                        <Text style={Styles.text_danger}>Nenhum produto cadastrado no estoque!</Text>
                        <TouchableOpacity style={[Styles.btn, Styles.success, Styles.em_linha_horizontal]}
                            onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'CadastroProduto' }]
                                });
                            }}>
                            <MaterialCommunityIcons name='archive-plus' size={25} style={Styles.text_success} />
                            <Text style={Styles.text_success}>Cadastrar um produto</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyboardShouldPersistTaps="always" // <- impede que o teclado feche ao tocar fora
                style={{ paddingBottom: 15, marginBottom: 20 }}
            />
        </View>
    );
}
/*import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { Styles } from '../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthProcess } from '../assets/Contexts/AuthProcess';
const { width, height, scale, fontScale } = Dimensions.get('window');

type Produto = {
    codigo: string;
    codigo_barras: string;
    descricao: string;
    qtd_uni: number;
    qtd_em_estoque: number;
    // add other properties if needed
};

export default function EstoqueAtual({ navigation }: any) {
    const {produtos, setProdutos,buscarEstoque} = useContext<any>(AuthProcess);
    const [busca,setBusca] = useState(produtos);
    useEffect(() => {
        buscarEstoque();
    }, []);

    async function excluirProduto(cdgItem:any){
        const response = await axios({
            method: 'get',
            url: 'https://gsapp.com.br/app/src/promotter/promotter.php',
            params: {
                codigo_barras:cdgItem,
                comando: 'excluirProduto',
            },
        })

        console.log(response);
        if (response.data[0].status === 'OK' || response.data[0].statusCode === 200 || response.data[0].codeMensagem === 0) {
            buscarEstoque();
            Alert.alert('Sucesso',response.data[0].statusMensagem);
        } else {
            console.log('Erro=>', response.data);
            Alert.alert('Erro', 'Produto não encontrado!');
        }
    }

    const renderItem = ({ item }: any) => (
        <View style={{ padding: 10, borderLeftWidth: 5, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: item.qtd_em_estoque === 0 ? 'red' : 'green', backgroundColor: '#fafafa' }}>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Código: {item.codigo_barras}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Descrição: {item.descricao}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Qtd por Caixa: {item.qtd_uni + ' unidades'}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Em estoque: {item.qtd_em_estoque + ' Caixa(s)'}</Text>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Total de Unidades: {item.qtd_em_estoque * item.qtd_uni + ' Unidades'}</Text>
            <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linha_horizontal,Styles.flutuante,Styles.top_right,{top:25,paddingHorizontal:2,paddingVertical:2}]}
                onPress={()=>{
                    Alert.alert('ATENÇÃO!!!','Tem certeza que deseja excluir o item:\n\n'+item.descricao+'?',[
                        {
                            text:'Não'
                        },
                        {
                            text:'Sim exclua',
                            onPress:()=>{
                                excluirProduto(item.codigo_barras);
                            }
                        }
                    ])
                    
                }}
            >
                <MaterialCommunityIcons name='delete' size={25} style={[Styles.text_danger]}/>
            </TouchableOpacity>
            <TouchableOpacity style={[Styles.btn,Styles.info,Styles.em_linha_horizontal,Styles.flutuante,Styles.top_right,{top:-10,paddingHorizontal:2,paddingVertical:2}]}
                onPress={()=>{
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'LerCodigo',
                                params:{IsEdit:true,dadosProduto:item}
                            }
                        ]
                    });
                }}
            >
                <MaterialCommunityIcons name='pencil' size={25} style={[Styles.text_info]}/>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 0, backgroundColor: '#FFFFFF', height: '100%' }}>
            <FlatList
                data={produtos}
                keyExtractor={item => item.codigo}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#999999', marginBottom: 10 }]}>
                        <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>Produtos cadastrados</Text>
                        <TouchableOpacity onPress={() => {
                            buscarEstoque()
                        }}
                            style={[Styles.btn, Styles.secondary]}
                        >
                            <Text style={[Styles.text_secondary, { textAlign: 'center' }]}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={[{ height: 1, backgroundColor: '#000000', width: '5%', marginHorizontal: '45%', marginVertical: 5 }]} />
                )}
                style={{ height: height, paddingBottom: 15, marginBottom: 20, paddingHorizontal: 5 }}
                ListEmptyComponent={()=>{
                    return(
                        <View style={[Styles.btn,Styles.danger,Styles.em_linha_vertical,{}]}>
                            <MaterialCommunityIcons name='sleep' size={75} style={[Styles.text_danger]}/>
                            <Text style={[Styles.text_danger]}>Nenhum produto cadastrado no estoque!</Text>
                            <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linha_horizontal]}
                                onPress={()=>{
                                    navigation.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: 'CadastroProduto'
                                            }
                                        ]
                                    });
                                }}
                            >
                                <MaterialCommunityIcons name='archive-plus' size={25} style={[Styles.text_success]}/>
                                <Text style={[Styles.text_success]}>Cadastrar um produto</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />
        </View>
    );
}*/