import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Questions'>;
  route: RouteProp<RootStackParamList, 'Questions'>;
};

interface QuestionOption {
  key: string;
  text: string;
}

interface Question {
  id: number;
  code: string;
  subject: string;
  difficulty: string;
  statement: string;
  options: QuestionOption[];
  hint?: string;
}

interface AnswerResult {
  is_correct: boolean;
  correct_key: string;
  explanation: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  'Fácil': '#43A047',
  'Médio': '#FB8C00',
  'Difícil': '#E53935',
};

export default function QuestionsScreen({ navigation, route }: Props) {
  const { subject_id, subject_name } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/questions', { params: { subject_id } })
      .then(({ data }) => setQuestions(data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar as questões.'))
      .finally(() => setLoading(false));
  }, [subject_id]);

  const current = questions[currentIndex];

  const handleSubmit = async () => {
    if (!selectedKey || !current) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/questions/${current.id}/answer`, {
        selected_key: selectedKey,
      });
      setResult(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      navigation.goBack();
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedKey(null);
    setResult(null);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nenhuma questão encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const diffColor = DIFFICULTY_COLORS[current.difficulty] ?? '#1976D2';

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subject_name}</Text>
        <Text style={styles.counter}>{currentIndex + 1}/{questions.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={[styles.difficulty, { color: diffColor }]}>{current.difficulty}</Text>
          <Text style={styles.code}>{current.code}</Text>
        </View>

        {/* Enunciado */}
        <Text style={styles.statement}>{current.statement}</Text>

        {/* Opções */}
        {current.options.map((opt) => {
          const isSelected = selectedKey === opt.key;
          const isCorrect = result?.correct_key === opt.key;
          const isWrong = result && isSelected && !result.is_correct;

          let bg = '#F3F7FB';
          let border = '#E3EAF2';
          if (result) {
            if (isCorrect) { bg = '#E8F5E9'; border = '#43A047'; }
            else if (isWrong) { bg = '#FFEBEE'; border = '#E53935'; }
          } else if (isSelected) {
            bg = '#E3F2FD'; border = '#1976D2';
          }

          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              onPress={() => !result && setSelectedKey(opt.key)}
              disabled={!!result}
              activeOpacity={0.8}
            >
              <View style={[styles.optKey, isSelected && styles.optKeySelected]}>
                <Text style={[styles.optKeyText, isSelected && { color: '#fff' }]}>
                  {opt.key}
                </Text>
              </View>
              <Text style={styles.optText}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Resultado */}
        {result && (
          <View style={[styles.resultBox, result.is_correct ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultIcon}>{result.is_correct ? '✅' : '❌'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultTitle}>
                {result.is_correct ? 'Resposta certa!' : 'Resposta errada'}
              </Text>
              <Text style={styles.resultExplanation}>{result.explanation}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {!result ? (
          <TouchableOpacity
            style={[styles.btnSubmit, !selectedKey && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!selectedKey || submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Enviar Resposta</Text>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
            <Text style={styles.btnText}>
              {currentIndex + 1 >= questions.length ? 'Finalizar ✓' : 'Próxima →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F3F7FB' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: '#6B7280' },
  backLink: { fontSize: 14, color: '#1976D2', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14, backgroundColor: '#fff', elevation: 2 },
  backBtn: { fontSize: 22, color: '#1976D2', marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#111827' },
  counter: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  container: { padding: 20, paddingBottom: 40 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  difficulty: { fontSize: 13, fontWeight: '700' },
  code: { fontSize: 12, color: '#9BA3AF' },
  statement: { fontSize: 15, color: '#111827', lineHeight: 24, marginBottom: 20, fontWeight: '500' },
  option: { borderRadius: 12, borderWidth: 1.5, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  optKey: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E3EAF2', alignItems: 'center', justifyContent: 'center' },
  optKeySelected: { backgroundColor: '#1976D2' },
  optKeyText: { fontWeight: '800', fontSize: 14, color: '#374151' },
  optText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 20 },
  resultBox: { borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 8, borderWidth: 1 },
  resultCorrect: { backgroundColor: '#E8F5E9', borderColor: '#43A047' },
  resultWrong: { backgroundColor: '#FFEBEE', borderColor: '#E53935' },
  resultIcon: { fontSize: 22 },
  resultTitle: { fontWeight: '800', fontSize: 14, color: '#111827', marginBottom: 4 },
  resultExplanation: { fontSize: 13, color: '#374151', lineHeight: 19 },
  footer: { backgroundColor: '#fff', padding: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#E8EDF2' },
  btnSubmit: { backgroundColor: '#1976D2', borderRadius: 10, padding: 15, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4DE' },
  btnNext: { backgroundColor: '#43A047', borderRadius: 10, padding: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});