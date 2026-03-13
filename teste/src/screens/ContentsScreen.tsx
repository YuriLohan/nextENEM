import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Contents'>;
};

interface Subject {
  id: number;
  name: string;
  course_id: number;
  is_premium: boolean;
  progress: number;
  is_locked: boolean;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Matemática Básica': '#1976D2',
  'Geometria': '#7B1FA2',
  'Trigonometria': '#00796B',
  'Estatística': '#E64A19',
  'Português': '#E53935',
  'Redação': '#43A047',
  'Lógica': '#FB8C00',
  'Programação': '#1E88E5',
};

export default function ContentsScreen({ navigation }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // busca as matérias do curso 1 por padrão
    // em breve vai receber o course_id dinamicamente
    api.get('/courses/1/subjects')
      .then(({ data }) => setSubjects(data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar as matérias.'))
      .finally(() => setLoading(false));
  }, []);

  const renderSubject = ({ item }: { item: Subject }) => {
    const color = SUBJECT_COLORS[item.name] ?? '#1976D2';
    return (
      <TouchableOpacity
        style={[styles.card, item.is_locked && styles.locked]}
        onPress={() => {
          if (item.is_locked) {
            Alert.alert('Premium', 'Assine o NextENEM Pro para acessar.');
            return;
          }
         navigation.navigate('Questions', {
          subject_id: item.id,
          subject_name: item.name,
         });
        }}
        activeOpacity={0.8}
      >
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Text style={styles.iconText}>{item.is_locked ? '🔒' : '📐'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.subjectName, item.is_locked && styles.lockedText]}>
            {item.name}
          </Text>
          {!item.is_locked && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${item.progress}%` as any, backgroundColor: color }]} />
            </View>
          )}
        </View>
        {item.is_locked && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Pro</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>NE</Text>
        </View>
        <Text style={styles.title}>Conteúdos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeLink}>🏠</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator color="#1976D2" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={subjects}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderSubject}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F3F7FB' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: '#fff', elevation: 2 },
  logo: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: '#111827' },
  homeLink: { fontSize: 22 },
  list: { padding: 20, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2 },
  locked: { opacity: 0.5 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22 },
  subjectName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6 },
  lockedText: { color: '#9BA3AF' },
  progressTrack: { height: 5, backgroundColor: '#E3EAF2', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 99 },
  premiumBadge: { backgroundColor: '#FFF3CD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  premiumText: { fontSize: 11, fontWeight: '700', color: '#B8860B' },
});