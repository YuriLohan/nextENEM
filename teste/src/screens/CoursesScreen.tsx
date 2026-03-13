import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Courses'>;
};

const COURSE_ICONS: Record<string, string> = {
  medicina: '🩺',
  direito: '⚖️',
  computacao: '💻',
  outros: '🎯',
};

const COURSE_COLORS: Record<string, string> = {
  medicina: '#E53935',
  direito: '#43A047',
  computacao: '#1E88E5',
  outros: '#FB8C00',
};

interface Course {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export default function CoursesScreen({ navigation }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api.get('/courses')
      .then(({ data }) => setCourses(data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os cursos.'))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (!selected) {
      Alert.alert('Atenção', 'Selecione um foco de estudo.');
      return;
    }
    setConfirming(true);
    try {
      await api.post(`/courses/${selected}/select`);
      navigation.replace('Home');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar sua escolha.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>NE</Text>
        </View>
        <Text style={styles.brand}>NextENEM</Text>
      </View>

      <Text style={styles.title}>Selecione seu foco de estudo</Text>

      <View style={styles.grid}>
        {courses.map((course) => {
          const isSelected = selected === course.id;
          const color = COURSE_COLORS[course.slug] ?? '#1976D2';
          const icon = COURSE_ICONS[course.slug] ?? '📖';
          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.card, isSelected && { borderColor: color, borderWidth: 2 }]}
              onPress={() => setSelected(course.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.courseName}>{course.name}</Text>
              {isSelected && (
                <View style={[styles.badge, { backgroundColor: color }]}>
                  <Text style={styles.badgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.btnConfirm, !selected && styles.btnDisabled]}
        onPress={handleConfirm}
        disabled={!selected || confirming}
      >
        {confirming
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Confirmar</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  logo: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  brand: { fontSize: 20, fontWeight: '800', color: '#1565C0' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', marginBottom: 32 },
  card: { width: '47%', backgroundColor: '#F3F7FB', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', elevation: 2 },
  icon: { fontSize: 40, marginBottom: 10 },
  courseName: { fontSize: 15, fontWeight: '700', color: '#111827', textAlign: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  btnConfirm: { backgroundColor: '#1976D2', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4DE' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});