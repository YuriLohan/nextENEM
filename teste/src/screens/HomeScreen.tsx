import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUserName(data.name.split(' ')[0]))
      .catch(() => navigation.replace('Login'));
  }, []);

  const handleLogout = () => {
    // TODO: limpar token
    navigation.replace('Courses');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoSmall}>
          <Text style={styles.logoText}>NE</Text>
        </View>
        <Text style={styles.greeting}>
          Olá, <Text style={styles.name}>{userName || '...'}</Text>
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Pronto para estudar?</Text>
        <Text style={styles.cardText}>
          Em breve você terá acesso a questões, conteúdos e muito mais.
        </Text>
        <TouchableOpacity
            style={styles.btnStudy}
            onPress={() => navigation.navigate('Contents')}
        >
        <Text style={styles.btnStudyText}>Ver Conteúdos →</Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F7FB', padding: 20, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 10 },
  logoSmall: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  greeting: { flex: 1, fontSize: 20, fontWeight: '600', color: '#111827' },
  name: { fontWeight: '800', color: '#1565C0' },
  logout: { fontSize: 13, color: '#E53935', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  btnStudy: { marginTop: 16, backgroundColor: '#1976D2', borderRadius: 10, padding: 12, alignItems: 'center' },
  btnStudyText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});