import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthProcess } from '../assets/Contexts/AuthProcess';
import { Styles } from '../assets/Styles/Styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SeparatorH from '../assets/Components/SeparatorHorisontal';
import ComponentIcon from '../assets/Components/ComponentIcon';
import React from 'react';

export default function Dashboard({ navigation }: any) {
    const { usuario, produtos, buscarEstoque, setInLoad, inLoad, contarProdutosSerados, contagemItens, contagemZerando, contagemMaiorQCinco } = useContext<any>(AuthProcess);
    console.log(usuario);

    useEffect(() => {
        buscarEstoque();
    }, [])
    try {
        if (inLoad) {
            return(
                <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size={80} color={'blue'} />
                    <Text style={[Styles.secondTitle, { textAlign: 'center' }]}>{'Carregando\n\nAguarde...'}</Text>
                </View>
            )
        } else {
            return (
                <>
                    {
                        produtos.length > 0 ?
                            <View style={{ flex: 1, padding: 0, paddingTop: 15, backgroundColor: '#FFFFFF', height: '100%' }}>
                                <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '2.5%' }]}>
                                    <Text style={[{ textAlign: 'center' }]}>Quantidade de produtos cadastrados</Text>
                                    <Text style={[{ textAlign: 'center' }]}>{produtos.length} Produto(s)</Text>
                                </View>
                                <SeparatorH wt={'95%'} hg={1} bc={'#999999'} mv={15} mi={'2.5%'} />
                                <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '2.5%' }]}>
                                    <Text style={[{ textAlign: 'center' }]}>Produtos serados</Text>
                                    <Text style={[{ textAlign: 'center' }]}>{contagemItens} Produto(s)</Text>
                                </View>
                                <SeparatorH wt={'95%'} hg={1} bc={'#999999'} mv={15} mi={'2.5%'} />
                                <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '2.5%' }]}>
                                    <Text style={[{ textAlign: 'center' }]}>Produtos quase acabando</Text>
                                    <Text style={[{ textAlign: 'center' }]}>{contagemZerando} Produto(s)</Text>
                                </View>
                                <SeparatorH wt={'95%'} hg={1} bc={'#999999'} mv={15} mi={'2.5%'} />
                                <View style={[Styles.em_linha_horizontal, { justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '2.5%' }]}>
                                    <Text style={[{ textAlign: 'center' }]}>Produtos com estoque largo</Text>
                                    <Text style={[{ textAlign: 'center' }]}>{contagemMaiorQCinco} Produto(s)</Text>
                                </View>
                                <SeparatorH wt={'95%'} hg={2} bc={'#999999'} mv={15} mi={'2.5%'} />
                                {
                                    inLoad ?

                                        <TouchableOpacity disabled style={[Styles.em_linha_horizontal, Styles.btn, Styles.dark, { width: '95%', marginVertical: 20, marginHorizontal: '2.5%' }]} onPress={() => { buscarEstoque() }}>
                                            <ActivityIndicator size={25} color={'#FFFFFF'} />
                                            <Text style={[Styles.text_dark, { fontSize: 20, textAlign: 'center' }]}>Atualizando métrica</Text>
                                        </TouchableOpacity>

                                        :

                                        <TouchableOpacity style={[Styles.em_linha_horizontal, Styles.btn, Styles.dark, { width: '95%', marginVertical: 20, marginHorizontal: '2.5%' }]} onPress={() => { buscarEstoque() }}>
                                            <MaterialCommunityIcons name='refresh' size={25} style={[Styles.text_dark]} />
                                            <Text style={[Styles.text_dark, { fontSize: 20, textAlign: 'center' }]}>Atualizar métrica</Text>
                                        </TouchableOpacity>
                                }
                                {
                                    inLoad ?

                                        <TouchableOpacity disabled style={[Styles.em_linha_horizontal, Styles.btn, Styles.primary, { width: '95%', marginVertical: 20, marginHorizontal: '2.5%' }]} onPress={() => { navigation.navigate('EstoqueAtual') }}>
                                            <Text style={[Styles.text_primary, { fontSize: 20, textAlign: 'center' }]}>Ver Estoque Atual</Text>
                                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.text_primary]} />
                                        </TouchableOpacity>

                                        :
                                        <TouchableOpacity style={[Styles.em_linha_horizontal, Styles.btn, Styles.primary, { width: '95%', marginVertical: 20, marginHorizontal: '2.5%' }]} onPress={() => { navigation.navigate('EstoqueAtual') }}>
                                            <Text style={[Styles.text_primary, { fontSize: 20, textAlign: 'center' }]}>Ver Estoque Atual</Text>
                                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.text_primary]} />
                                        </TouchableOpacity>
                                }
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ComponentIcon options={{ borderWidth: 1, borderColor: '#green', borderRadius: 100, padding: 15, elevation: 4, backgroundColor: '#000000', color: '#FFFFFF' }} iconName={'trending-up'} size={100} />
                                <SeparatorH wt={'95%'} hg={1} bc={'#999999'} mv={15} />
                                <Text style={[Styles.secondTitle, { textAlign: 'center' }]}>Métricas</Text>
                                <SeparatorH wt={'95%'} hg={1} bc={'#999999'} mv={15} />
                                <Text style={[{ textAlign: 'center' }]}>Bem-vindo "{usuario.apelido + '\n\nNenhuma métrica a ser mostrada por enquanto.'}"</Text>
                            </View>
                    }

                </>
            )
        }
    } catch (error: any) {

    }
}