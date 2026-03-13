import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      console.log('Token:', data.access_token);
      Alert.alert('Sucesso', 'Conta criada!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.detail ?? 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>NE</Text>
        </View>
        <Text style={styles.appName}>NextENEM</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#9BA3AF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#9BA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9BA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Cadastrar</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#EBF3FB', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  appName: { fontSize: 24, fontWeight: '800', color: '#1565C0' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', elevation: 4 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  input: { backgroundColor: '#F3F7FB', borderRadius: 10, padding: 13, fontSize: 14, color: '#111827', marginBottom: 12, borderWidth: 1, borderColor: '#E3EAF2' },
  btnPrimary: { backgroundColor: '#1976D2', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', color: '#6B7280', fontSize: 13 },
  linkBold: { color: '#1976D2', fontWeight: '700' },
});