import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Styles } from '../Styles';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Promotter from '../../../screens/Promotter';
import CadastroProduto from '../../../screens/CadastroProduto';
import EntradaEstoque from '../../../screens/EntradaEstoque';
import RetiradaProduto from '../../../screens/RetiradaProduto';
import EstoqueAtual from '../../../screens/EstoqueAtual';
import LerCodigo from '../../../screens/LerCodigo';
import { AuthProcess } from '../../Contexts/AuthProcess';
import HeaderUser from '../../Components/HeaderUser';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import Dashboard from '../../../screens/Dashboard';
const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

const Drawer = createDrawerNavigator();

export default function Home({ route }: any) {
    const { logoutApp, usuario, lerDadosUser, inAcitivity, IsLogged, setIsLogged,resetCache} = useContext<any>(AuthProcess);
    const [visible, setVisible] = useState<boolean>(false);
    const translateX = useSharedValue(MENU_WIDTH);

    useEffect(() => {
        verificarLogin();
    }, []);

    async function verificarLogin() {
        const verificado = await lerDadosUser();
        if (verificado.status === 0 && verificado.retorno === null) {
            setVisible(false);
            setIsLogged(false);
            setTimeout(() => {
                setVisible(true);
            }, 1000);
        } else {
            setVisible(false);
            setIsLogged(true);
            setTimeout(() => {
                setVisible(true);
            }, 1000);
        }
    }

    const showMenu = () => {
        setVisible(true);
        translateX.value = withTiming(0, { duration: 300 });
    };

    const hideMenu = () => {
        translateX.value = withTiming(MENU_WIDTH, { duration: 300 }, (finished) => {
            if (finished) runOnJS(setVisible)(false);
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));
    try {
        if (inAcitivity) {
            return (
                <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator size={80} color={'blue'} />
                </View>
            );
        } else {
            if (!IsLogged) {
                console.log('true se estiver logado, false se não estiver logado=>', IsLogged)
            } else {
                return (
                    <>
                        <Drawer.Navigator
                            initialRouteName="Dashboard"
                            screenOptions={{
                                drawerType: 'slide', // animação suave
                                headerShown: true,
                            }}
                        >
                            <Drawer.Screen name="Dashboard" component={Dashboard} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={usuario.apelido} />
                                    )
                                },
                                title: 'Métricas',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5, { marginRight: 10 }]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='cog' size={20} color={'black'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='trending-up' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="CadastroProduto" component={CadastroProduto} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={usuario.apelido} />
                                    )
                                },
                                title: 'Cadastro de Produto',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5, { marginRight: 10 }]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='cog' size={20} color={'black'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='archive-plus' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="EntradaEstoque" component={EntradaEstoque} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={route.name} />
                                    )
                                },
                                title: 'Entrada no Estoque',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='logout' size={20} color={'red'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='download-multiple' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="RetiradaProduto" component={RetiradaProduto} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={route.name} />
                                    )
                                },
                                title: 'Retirada do Estoque',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='logout' size={20} color={'red'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='upload-multiple' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="EstoqueAtual" component={EstoqueAtual} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={route.name} />
                                    )
                                },
                                title: 'Estoque atual',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='logout' size={20} color={'red'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='list-status' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="LerCodigo" component={LerCodigo} options={{
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={route.name} />
                                    )
                                },
                                title: 'Leitor de código de barras',
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='logout' size={20} color={'red'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='barcode-scan' size={25} color={'#000'} />
                                    )
                                }
                            }} />
                            <Drawer.Screen name="sobrePromotter" component={Promotter} options={{
                                title: 'Sobre o promotter',
                                headerTitle: () => {
                                    return (
                                        <HeaderUser title={route.name} />
                                    )
                                },
                                headerRight: () => {
                                    return (
                                        <TouchableOpacity style={[Styles.mr_5]}
                                            onPress={() => {
                                                showMenu()
                                            }}
                                        >
                                            <MaterialCommunityIcons name='logout' size={20} color={'red'} />
                                        </TouchableOpacity>
                                    )
                                },
                                drawerIcon: () => {
                                    return (
                                        <MaterialCommunityIcons name='cellphone-information' size={25} color={'#FFF'} />
                                    )
                                },
                                drawerItemStyle: { backgroundColor: '#0d6efd' },
                                drawerLabelStyle: { color: '#FFF' }
                            }} />
                        </Drawer.Navigator>
                        {visible && (
                            <TouchableOpacity style={styles.overlay} onPress={() => { hideMenu() }} activeOpacity={1} />
                        )}
                        <Animated.View style={[styles.menu, animatedStyle, { padding: 0 }]}>
                            <TouchableOpacity onPress={() => { hideMenu() }} style={[Styles.em_linha_horizontal, { alignItems: 'center', paddingRight: 10, paddingTop: 21, backgroundColor: '#B0E0E6', marginTop: 0, borderRadius: 20, paddingLeft: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'space-between' }]}>
                                <Text style={[{ fontSize: 20 }]}>{'Olá! ' + usuario.apelido}</Text>
                                <MaterialCommunityIcons name='close-box' size={25} color={'#000000'} style={[styles.close, { marginTop: 10 }]} />
                            </TouchableOpacity>
                            <View style={[Styles.em_linha_vertical, { justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, height: '90%' }]}>
                                <Text style={styles.menuItem}>Perfil</Text>
                                <Text style={styles.menuItem}>Configurações</Text>
                                <TouchableOpacity onPress={() => { logoutApp() }} style={[Styles.em_linha_horizontal, Styles.btn, Styles.danger, { alignItems: 'center', justifyContent: 'space-between', position: 'absolute', bottom: 0, marginBottom: 10, top: 'auto', left: '2.5%', right: '2.5%', width: '95%', paddingVertical: 5 }]}>
                                    <Text style={[Styles.text_danger, styles.menuItem, { width: '95%', paddingHorizontal: 0, textAlign: 'left' }]}>Sair</Text>
                                    <MaterialCommunityIcons name='logout' size={25} color={'#FFF'} style={[Styles.text_danger, {}]} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </>
                );
            }
        }
    } catch (error) {
        return(
            <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[Styles.secondTitle, { textAlign: 'center' }]}>Erro ao carregar a tela</Text>
                <TouchableOpacity onPress={() => { resetCache() }} style={[Styles.btn, Styles.primary, { marginVertical: 20 }]}>
                    <Text style={[Styles.text_primary, { fontSize: 20, textAlign: 'center' }]}>Limpar cache do app</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    button: { padding: 15, backgroundColor: '#007bff', borderRadius: 5 },
    buttonText: { color: '#fff', fontSize: 16 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    menu: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: '#fff',
        padding: 20,
        elevation: 5,
        zIndex: 100,
    },
    close: {
        marginBottom: 20,
        textAlign: 'right',
        color: '#007bff',
    },
    menuItem: {
        fontSize: 18,
        textAlign: 'left',
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
});