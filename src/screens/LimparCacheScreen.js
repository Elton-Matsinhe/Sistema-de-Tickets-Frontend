import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Animated,
  Alert,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BRAND_GREEN = '#106a37';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#f4f6f8';

export default function LimparCacheScreen({ onClear, onBack, cacheStats = {} }) {
  const [clearing, setClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Valores animados
  const pulseAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);
  
  // Dados de cache simulados (poderiam vir de props)
  const cacheData = {
    tickets: cacheStats.tickets || 124,
    imagens: cacheStats.imagens || 45,
    dados: cacheStats.dados || '12.5 MB',
    tempo: cacheStats.tempo || '7 dias',
    relatorios: cacheStats.relatorios || 8,
    usuarios: cacheStats.usuarios || 24
  };

  // Efeito de pulsação no botão principal
  useEffect(() => {
    if (!clearing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [clearing]);

  // Animação de entrada dos detalhes
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClearCache = () => {
    // Confirmação antes de limpar
    Alert.alert(
      'Confirmar Limpeza',
      'Tem certeza que deseja limpar todo o cache? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: startClearingProcess
        }
      ]
    );
  };

  const startClearingProcess = () => {
    Vibration.vibrate(100);
    setClearing(true);
    setProgress(0);

    // Animação de escala no botão
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulação do processo de limpeza
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setClearing(false);
            setProgress(0);
            onClear(); // Chama a função original
            Vibration.vibrate(200);
          }, 500);
          return 100;
        }
        return newProgress;
      });

      // Atualizar animação de progresso
      progressAnim.setValue(progress / 100);
    }, 200);
  };

  const getProgressColor = () => {
    if (progress < 33) return '#ef4444';
    if (progress < 66) return '#f59e0b';
    return BRAND_GREEN;
  };

  const getCacheSizeColor = (size) => {
    if (size.includes('MB') && parseFloat(size) > 10) return '#ef4444';
    if (size.includes('MB') && parseFloat(size) > 5) return '#f59e0b';
    return '#10b981';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View 
        style={[
          styles.section,
          { opacity: fadeAnim }
        ]}
      >
        {/* Header com gradiente */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.1)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#cfd8dc" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.sectionTitle}>Gerenciamento de Cache</Text>
              <Text style={styles.sectionSubtitle}>Otimização e limpeza de dados</Text>
            </View>
            <View style={[styles.headerRight, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Ionicons name="trash-bin" size={20} color="#ef4444" />
            </View>
          </View>
        </LinearGradient>

        {/* Estatísticas do Cache */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>
            <Ionicons name="analytics" size={18} color={TEXT} /> Estatísticas do Cache
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(16, 106, 55, 0.15)', 'rgba(16, 106, 55, 0.05)']}
                style={styles.statContent}
              >
                <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 106, 55, 0.2)' }]}>
                  <Ionicons name="document-text" size={20} color={BRAND_GREEN} />
                </View>
                <Text style={styles.statValue}>{cacheData.tickets}</Text>
                <Text style={styles.statLabel}>Tickets</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statContent}
              >
                <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                  <Ionicons name="image" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.statValue}>{cacheData.imagens}</Text>
                <Text style={styles.statLabel}>Imagens</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
                style={styles.statContent}
              >
                <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Ionicons name="time" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.statValue}>{cacheData.tempo}</Text>
                <Text style={styles.statLabel}>Acumulado</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
                style={styles.statContent}
              >
                <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                  <Ionicons name="server" size={20} color="#8b5cf6" />
                </View>
                <Text style={[styles.statValue, { color: getCacheSizeColor(cacheData.dados) }]}>
                  {cacheData.dados}
                </Text>
                <Text style={styles.statLabel}>Armazenamento</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Card de Informações */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
            style={styles.infoCardContent}
          >
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={22} color="#3b82f6" />
              <Text style={styles.infoTitle}>O que será limpo?</Text>
            </View>
            
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.infoText}>Lista completa de tickets</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.infoText}>Imagens e thumbnails em cache</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.infoText}>Dados de sessão temporários</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.infoText}>Preferências de filtros e ordenação</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.infoText}>Histórico de pesquisas</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setShowDetails(!showDetails)} 
              style={styles.detailsToggle}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails ? 'Mostrar menos' : 'Ver mais detalhes'}
              </Text>
              <Ionicons 
                name={showDetails ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color="#3b82f6" 
              />
            </TouchableOpacity>

            {showDetails && (
              <Animated.View style={styles.detailsContent}>
                <View style={styles.detailItem}>
                  <Ionicons name="document-text-outline" size={14} color="#94a3b8" />
                  <Text style={styles.detailText}>Relatórios em cache: {cacheData.relatorios}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={14} color="#94a3b8" />
                  <Text style={styles.detailText}>Dados de usuários: {cacheData.usuarios}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                  <Text style={styles.detailText}>Última limpeza: Há {cacheData.tempo}</Text>
                </View>
              </Animated.View>
            )}
          </LinearGradient>
        </View>

        {/* Progresso da Limpeza */}
        {clearing && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Limpando Cache...</Text>
            <Text style={styles.progressSubtitle}>Por favor, aguarde</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: getProgressColor(),
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>

            <View style={styles.progressSteps}>
              <View style={[styles.progressStep, progress >= 20 && styles.progressStepActive]}>
                <Ionicons 
                  name={progress >= 20 ? 'checkmark-circle' : 'time'} 
                  size={16} 
                  color={progress >= 20 ? BRAND_GREEN : '#6b7280'} 
                />
                <Text style={styles.progressStepText}>Preparando</Text>
              </View>
              <View style={[styles.progressStep, progress >= 50 && styles.progressStepActive]}>
                <Ionicons 
                  name={progress >= 50 ? 'checkmark-circle' : 'time'} 
                  size={16} 
                  color={progress >= 50 ? BRAND_GREEN : '#6b7280'} 
                />
                <Text style={styles.progressStepText}>Limpando</Text>
              </View>
              <View style={[styles.progressStep, progress >= 80 && styles.progressStepActive]}>
                <Ionicons 
                  name={progress >= 80 ? 'checkmark-circle' : 'time'} 
                  size={16} 
                  color={progress >= 80 ? BRAND_GREEN : '#6b7280'} 
                />
                <Text style={styles.progressStepText}>Finalizando</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botão Principal de Ação */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [
                { scale: clearing ? scaleAnim : pulseAnim },
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.primaryButton,
              clearing && styles.primaryButtonDisabled
            ]}
            onPress={handleClearCache}
            disabled={clearing}
          >
            <LinearGradient
              colors={clearing ? ['#6b7280', '#4b5563'] : ['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Ionicons 
                name={clearing ? 'sync' : 'trash-bin'} 
                size={22} 
                color={clearing ? '#9ca3af' : '#fef2f2'} 
              />
              <Text style={styles.primaryButtonText}>
                {clearing ? 'Limpando...' : 'Limpar Todo o Cache'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(16, 106, 55, 0.1)' }]}>
                <Ionicons name="refresh-circle" size={20} color={BRAND_GREEN} />
              </View>
              <Text style={styles.quickActionText}>Atualizar Dados</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Ionicons name="image" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.quickActionText}>Limpar Imagens</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Ionicons name="search" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.quickActionText}>Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Ionicons name="settings" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.quickActionText}>Configurações</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Avisos e Recomendações */}
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={20} color="#f59e0b" />
            <Text style={styles.warningTitle}>Importante</Text>
          </View>
          <Text style={styles.warningText}>
            • A limpeza do cache não afeta dados salvos no servidor{'\n'}
            • Recomenda-se fazer backup antes de limpar completamente{'\n'}
            • O aplicativo pode reiniciar após a limpeza{'\n'}
            • Algumas configurações podem ser resetadas
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    margin: 12,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    color: TEXT,
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  statsTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  infoCardContent: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  infoTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
  },
  infoList: {
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#cfd8dc',
    fontSize: 14,
    flex: 1,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginTop: 8,
  },
  detailsToggleText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  progressCard: {
    margin: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    alignItems: 'center',
  },
  progressTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  progressStep: {
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  progressStepActive: {
    opacity: 1,
  },
  progressStepText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  primaryButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  primaryButtonText: {
    color: '#fef2f2',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    color: '#cfd8dc',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  warningCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  warningTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
  },
  warningText: {
    color: '#cfd8dc',
    fontSize: 13,
    lineHeight: 20,
  },
});