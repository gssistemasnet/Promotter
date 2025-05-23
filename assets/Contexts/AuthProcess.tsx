import React, { useMemo, useEffect, useState, useContext, useCallback, createContext, ReactNode, ReactElement, useRef } from 'react';
import { Alert, ToastAndroid, View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthProcess = createContext({});

type Produto = {
    codigo: string;
    codigo_barras: string;
    descricao: string;
    qtd_uni: number;
    qtd_em_estoque: number;
    // add other properties if needed
};

function AuthProcessProvider({ children }: any) {
    const navigation = useNavigation();
    //dados de login
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [IsLogged, setIsLogged] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<any | null>(null);
    const [v_pass, setV_pass] = useState<boolean>(true);
    const [iconePass, setIconePass] = useState<string>('eye');
    //gerenciamento de atividades
    const [inAcitivity, setInActivity] = useState(true);
    const [inLoad, setInLoad] = useState<boolean>(false);
    function verificaEstado(x: boolean) {
        if (x) {
            setV_pass(false);
            setIconePass('eye-off');
        } else {
            setV_pass(true);
            setIconePass('eye');
        }
    }
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [contagemItens, setContagemItens] = useState<number>(0);
    const [contagemZerando, setContagemZerando] = useState<number>(0);
    const [contagemMaiorQCinco, setContagemMaiorQCinco] = useState<number>(0);
    const [initialPage,setInitialPage] = useState('login');
    async function login() {
        let login = new FormData();

        login.append('email', email);
        login.append('senha', senha);
        login.append('comando', 'login');

        const response = await axios.post('https://gsapp.com.br/app/src/promotter/promotter.php', login, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 && response.data[0].codeMensagem === 0) {
            const retorno = await gravarUser(response.data[0].dadosUser);

            if (retorno.status === 0) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Home'
                        }
                    ]
                });
            } else {
                Alert.alert('Erro', 'Erro no login:\n\nMais detalhes: ' + retorno.mensagem)
            }
        } else {
            console.log('Erro=>', response.data);
            Alert.alert('Erro', 'Erro no login.\n\nMais detalhes: ' + response.data[0].statusMensagem);
        }
    }

    async function gravarUser(dados: any) {
        try {
            AsyncStorage.setItem('usuario', JSON.stringify(dados));
            return { status: 0, mensagem: 'sucesso', retorno: dados };
        } catch (error: any) {
            return { status: 1, mensagem: 'Erro', retorno: error.message };
        }
    }

    async function apagarUser() {
        try {
            AsyncStorage.removeItem('usuario');
            setInActivity(false);
            return { status: 0, mensagem: 'sucesso', retorno: null };
        } catch (error: any) {
            setInActivity(false);
            return { status: 1, mensagem: 'Erro', retorno: error.message };
        }
    }

    async function lerDadosUser() {
        try {
            let dadosUser = await AsyncStorage.getItem('usuario');
            let user = dadosUser !== null ? JSON.parse(dadosUser) : null;
            setUsuario(user);
            setInActivity(false);
            setIsLogged(true);
            return { status: 0, mensagem: 'sucesso', retorno: user };
        } catch (error: any) {
            setUsuario(null);
            setInActivity(false);
            setIsLogged(true);
            return { status: 1, mensagem: 'Erro', retorno: error.message };
        }
    }

    async function resetCache() {
        try {
            AsyncStorage.clear();
            Alert.alert('Sucesso', 'Cache limpo com sucesso!\n\nReinicie o app para aplicar as mudanças.', [
                {
                    text: 'OK',
                    onPress: () => {
                        setTimeout(() => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Login'
                                    }
                                ]
                            });
                        }, 2000);
                    }
                }
            ]);

        } catch (error: any) {
            console.log('Erro ao limpar cache: ', error.message);
            Alert.alert('Erro', 'Erro ao limpar cache: ' + error.message);

        }
    }

    function logoutApp() {
        Alert.alert('Sair?', 'Tem certeza que deseja sair do app?', [
            {
                text: 'Não'
            },
            {
                text: 'Sim',
                onPress: () => {
                    setUsuario(null);
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Login'
                            }
                        ]
                    });
                }
            }
        ])

    }

    async function buscarEstoque() {
        setInLoad(true);
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
            contarProdutosSerados();
            setTimeout(() => {
                setInLoad(false);
            }, 3000);

        } else {
            console.log('Erro=>', response.data);
            setProdutos([])
            setTimeout(() => {
                setInLoad(false);
            }, 3000);

            Alert.alert('Erro', 'Nenhum produto cadastrado no estoque!');
        }
    }

    function contarProdutosSerados() {
        let contagem = 0;
        let quaseZero = 0;
        let maiorQCinco = 0;
        produtos.map((item: any) => {
            if (item.qtd_em_estoque === 0) {
                contagem++;
            } else if (item.qtd_em_estoque < 5) {
                quaseZero++;
            } else if (item.qtd_em_estoque > 10) {
                maiorQCinco++;
            }
        })

        setContagemItens(contagem);
        setContagemZerando(quaseZero);
        setContagemMaiorQCinco(maiorQCinco);
    }

    async function verificarLogin() {
        const verificado = await lerDadosUser();

        if(verificado.status !== 0){
            setIsLogged(false);
            setInitialPage('Login');
        }else if(verificado.status === 0){
            setIsLogged(true);
            setInitialPage('Home');
        }
        console.log(initialPage);
    }
    return (
        <AuthProcess.Provider value={{
            //variaveis
            usuario, IsLogged, v_pass, iconePass, email, senha, inAcitivity, produtos, contagemItens,
            contagemZerando, contagemMaiorQCinco, inLoad,initialPage,
            //funções
            setIsLogged, setUsuario, setV_pass, setIconePass, verificaEstado, setEmail, setSenha,
            login, logoutApp, setContagemItens, setInLoad,resetCache,setInitialPage,
            setContagemZerando, setContagemMaiorQCinco, contarProdutosSerados,verificarLogin,
            gravarUser, apagarUser, lerDadosUser, setProdutos, buscarEstoque,
        }}>
            {children}
        </AuthProcess.Provider>
    )
}

export default AuthProcessProvider;