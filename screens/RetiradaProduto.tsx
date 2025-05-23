// screens/RetiradaProduto.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { Styles } from '../assets/Styles/Styles';

export default function RetiradaProduto({ navigation }: any) {
  const [temPermissao, setTemPermissao] = useState('');
  const [produto, setProduto] = useState(null);
  const [scaneado, setScaneado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [qtdCaixa, setQtdCaixa] = useState('0');
  const inputRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log(status);
      setTemPermissao(status);
    })();
  }, []);

  async function retirarProduto(codigo_barras: any, qtd_retirada: any) {
    let retirada = new FormData();

    retirada.append('codigo_barras', codigo_barras);
    retirada.append('qtd_retirada', qtd_retirada);
    retirada.append('comando', 'retiradaProduto');

    const response = await axios.post('https://gsapp.com.br/app/src/promotter/promotter.php', retirada, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 && response.data[0].codeMensagem === 0) {
      console.log('sucesso=>', response.data)
      Alert.alert('Sucesso', 'Produto retirado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } else {
      console.log('Erro=>', response.data);
      Alert.alert('Erro', 'Produto não encontrado!');
    }
  }

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScaneado(true);
    setCodigo(data);

    const response = await axios({
      method: 'get',
      url: 'https://gsapp.com.br/app/src/promotter/promotter.php',
      params: {
        codigo_produto: data,
        comando: 'buscarProduto',
      },
    })

    //console.log(response);
    if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 && response.data[0].codeMensagem == 0) {
      console.log('sucesso=>', response.data)
      if (parseInt(response.data[0].dados.qtd_em_estoque) < parseInt(qtdCaixa)) {
        Alert.alert('ATENÇÃO!!!', 'Você está tentando retirar ' + qtdCaixa + ' caixa(s) do estoque, que contém apenas: ' + response.data[0].dados.qtd_em_estoque + ' caixa(s).\n\nPor favor digite um valor menor ou igual a "' + response.data[0].dados.qtd_em_estoque + '" para continuar.');
      } else {
        console.log(data, '-', parseInt(response.data[0].dados.qtd_em_estoque) - parseInt(qtdCaixa));
        setScaneado(true);
        Alert.alert('Atenção!!!', 'Deseja fazer a retirada do estoque para a área de venda do produto:\n\n' + response.data[0].dados.descricao + '?', [
          {
            text: 'não',
          },
          {
            text: 'Sim',
            onPress: () => {
              console.log(data, qtdCaixa)
              retirarProduto(data, parseInt(response.data[0].dados.qtd_em_estoque) - parseInt(qtdCaixa));
            }
          }
        ]);
      }
    } else {
      console.log('Erro=>', response.data);
      Alert.alert('Erro', 'Produto não encontrado!');
    }
  };

  if (temPermissao === null) return <Text>Solicitando permissão da câmera...</Text>;
  if (temPermissao === '') return <Text>Sem acesso à câmera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={[{ marginHorizontal: '10%', marginTop: '10%', fontSize: 22, textAlign: 'center' }]}>Escaneie o código abaixo</Text>
      {
        !scaneado ?
          <View style={[{ height: '30%' }]}>
            {
              qtdCaixa !== '0' ?
                <View>
                  <View>
                    <Text style={[Styles.fontMedium, { marginHorizontal: '10%', marginVertical: 5 }]}>Digite a quantidade da retirada:</Text>
                    <TextInput
                      ref={inputRef}
                      value={'' + qtdCaixa}
                      onChangeText={(text) => { setQtdCaixa(text) }}
                      style={[Styles.input]}
                      onFocus={() => {
                        // Selecionar todo o texto ao focar
                        if (inputRef.current) {
                          inputRef.current.setNativeProps({
                            selection: { start: 0, end: qtdCaixa.length }
                          });
                        }
                      }} />
                  </View>
                  <View>
                    <Text style={[{ marginHorizontal: '10%', marginBottom: 5, marginTop: 15 }]}>Aponte para o codiigo de barras:</Text>
                    <CameraView
                      onBarcodeScanned={scaneado ? undefined : handleBarCodeScanned}
                      style={{ height: '60%', marginHorizontal: '10%', marginBottom: '10%', borderRadius: 10 }}
                    />
                  </View>
                </View>
                :
                <View>
                  <Text style={[Styles.fontMedium, { marginHorizontal: '10%', marginVertical: 5 }]}>Digite a quantidade da retirada:</Text>
                  <TextInput value={'' + qtdCaixa} onChangeText={(qtd) => { setQtdCaixa(qtd) }} style={[Styles.input]} />
                </View>
            }

          </View>
          :
          <TouchableOpacity onPress={() => setScaneado(false)}
            style={[Styles.btn, Styles.primary, { marginHorizontal: '10%' }]}
          >
            {
              scaneado ?
                <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Buscar por {codigo}</Text>
                :
                <Text style={[Styles.text_primary, { textAlign: 'center' }]}>Escanear novamente</Text>
            }
          </TouchableOpacity>
      }
    </View>
  );
}