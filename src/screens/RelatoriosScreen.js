import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GREEN = '#106a37';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#f4f6f8';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RelatoriosScreen({ summary, onBack }) {
  // Cores para diferentes status
  const statusColors = {
    activos: '#dc2626',
    andamento: '#f59e0b',
    fechados: BRAND_GREEN,
    alocados: '#3b82f6'
  };

  // Dados para os gráficos
  const statusData = [
    { label: 'Activos', value: summary.activos, color: '#dc2626' },
    { label: 'Em andamento', value: summary.andamento, color: '#f59e0b' },
    { label: 'Fechados', value: summary.fechados, color: BRAND_GREEN },
    { label: 'Alocados', value: summary.alocados || 0, color: '#3b82f6' }
  ];

  const maxValue = Math.max(...statusData.map(item => item.value));

  // Calcular porcentagens
  const total = summary.total || 1;
  const percentages = {
    activos: ((summary.activos / total) * 100).toFixed(1),
    andamento: ((summary.andamento / total) * 100).toFixed(1),
    fechados: ((summary.fechados / total) * 100).toFixed(1),
    alocados: (((summary.alocados || 0) / total) * 100).toFixed(1)
  };

  // Dados para o gráfico de linha (simulado)
  const monthlyData = [20, 45, 28, 80, 99, 43, 65];
  const maxMonthly = Math.max(...monthlyData);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={18} color="#cfd8dc" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Relatórios e Estatísticas</Text>
          <View style={styles.headerRight}>
            <Ionicons name="stats-chart" size={20} color={BRAND_GREEN} />
          </View>
        </View>

        {/* Cards de Métricas com Ícones */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(16, 106, 55, 0.1)' }]}>
              <Ionicons name="document-text" size={20} color={BRAND_GREEN} />
            </View>
            <Text style={styles.metricLabel}>Total Emitidos</Text>
            <Text style={styles.metricValue}>{summary.total}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
            </View>
            <Text style={styles.metricLabel}>Activos</Text>
            <Text style={styles.metricValue}>{summary.activos}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-down" size={12} color="#ef4444" />
              <Text style={styles.trendText}>-5%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Ionicons name="time" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.metricLabel}>Em Andamento</Text>
            <Text style={styles.metricValue}>{summary.andamento}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.trendText}>+8%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(16, 106, 55, 0.1)' }]}>
              <Ionicons name="checkmark-circle" size={20} color={BRAND_GREEN} />
            </View>
            <Text style={styles.metricLabel}>Fechados</Text>
            <Text style={styles.metricValue}>{summary.fechados}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.trendText}>+15%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Ionicons name="people" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.metricLabel}>Alocados</Text>
            <Text style={styles.metricValue}>{summary.alocados || 0}</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-up" size={12} color="#10b981" />
              <Text style={styles.trendText}>+20%</Text>
            </View>
          </View>
        </View>

        {/* Gráficos */}
        <View style={styles.chartsSection}>
          <Text style={styles.chartSectionTitle}>
            <Ionicons name="pie-chart" size={18} color={TEXT} /> Distribuição por Status
          </Text>
          
          {/* Gráfico de Pizza Simulado */}
          <View style={styles.chartCard}>
            <View style={styles.pieChartContainer}>
              <View style={styles.pieChart}>
                {statusData.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const angle = (percentage / 100) * 360;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.pieSlice,
                        {
                          backgroundColor: item.color,
                          transform: [
                            { rotate: `${index === 0 ? 0 : statusData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0)}deg` }
                          ],
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <View style={styles.pieLegend}>
                {statusData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>
                      {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.chartSectionTitle}>
            <Ionicons name="bar-chart" size={18} color={TEXT} /> Comparativo por Categoria
          </Text>
          
          {/* Gráfico de Barras Simulado */}
          <View style={styles.chartCard}>
            <View style={styles.barChartContainer}>
              {statusData.map((item, index) => {
                const barHeight = (item.value / maxValue) * 120;
                return (
                  <View key={index} style={styles.barChartItem}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                      <Text style={styles.barValue}>{item.value}</Text>
                    </View>
                    <Text style={styles.barLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.chartSectionTitle}>
            <Ionicons name="analytics" size={18} color={TEXT} /> Estatísticas Mensais
          </Text>
          
          {/* Gráfico de Linha Simulado */}
          <View style={styles.chartCard}>
            <View style={styles.lineChartContainer}>
              <View style={styles.lineChart}>
                {monthlyData.map((value, index) => {
                  const pointHeight = (value / maxMonthly) * 120;
                  return (
                    <View key={index} style={styles.lineChartPoint}>
                      <View
                        style={[
                          styles.linePoint,
                          {
                            bottom: pointHeight - 6,
                            backgroundColor: BRAND_GREEN,
                          },
                        ]}
                      />
                      {index < monthlyData.length - 1 && (
                        <View
                          style={[
                            styles.lineConnector,
                            {
                              height: 2,
                              left: 25,
                              bottom: pointHeight - 1,
                              width: 30,
                              backgroundColor: BRAND_GREEN,
                              opacity: 0.7,
                            },
                          ]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
              <View style={styles.lineChartLabels}>
                {months.map((month, index) => (
                  <Text key={index} style={styles.lineChartLabel}>{month}</Text>
                ))}
              </View>
              <View style={styles.lineChartValues}>
                {monthlyData.map((value, index) => (
                  <Text key={index} style={styles.lineChartValue}>{value}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Estatísticas Adicionais */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="speedometer" size={20} color="#10b981" />
              </View>
              <Text style={styles.statValue}>{percentages.fechados}%</Text>
              <Text style={styles.statLabel}>Taxa de Conclusão</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.statValue}>{percentages.andamento}%</Text>
              <Text style={styles.statLabel}>Em Processamento</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="timer" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.statValue}>3.2</Text>
              <Text style={styles.statLabel}>Dias Médios</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-up" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.statValue}>+24%</Text>
              <Text style={styles.statLabel}>Crescimento</Text>
            </View>
          </View>
        </View>

        {/* Resumo Geral */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            <Ionicons name="information-circle" size={18} color={TEXT} /> Resumo Geral
          </Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total de Tickets Processados:</Text>
              <Text style={styles.summaryValue}>{summary.total}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tickets Concluídos:</Text>
              <Text style={styles.summaryValue}>{summary.fechados}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tickets Pendentes:</Text>
              <Text style={styles.summaryValue}>{summary.activos + summary.andamento}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Eficiência do Sistema:</Text>
              <Text style={[styles.summaryValue, { color: BRAND_GREEN }]}>
                {percentages.fechados}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  headerRight: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 106, 55, 0.1)',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    color: '#cfd8dc',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  trendText: {
    color: '#cfd8dc',
    fontSize: 10,
    fontWeight: '600',
  },
  chartsSection: {
    marginBottom: 24,
  },
  chartSectionTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  // Estilos para o gráfico de pizza
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    transformOrigin: '50% 50%',
  },
  pieLegend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    color: '#cfd8dc',
    fontSize: 12,
    flex: 1,
  },
  legendValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '600',
  },
  // Estilos para o gráfico de barras
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 10,
  },
  barChartItem: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    marginBottom: 8,
    height: 130,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 30,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 4,
  },
  barValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '600',
  },
  barLabel: {
    color: '#cfd8dc',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  // Estilos para o gráfico de linha
  lineChartContainer: {
    height: 160,
    paddingHorizontal: 10,
  },
  lineChart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    marginBottom: 20,
  },
  lineChartPoint: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  linePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
  lineConnector: {
    position: 'absolute',
  },
  lineChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  lineChartLabel: {
    color: '#cfd8dc',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  lineChartValues: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  lineChartValue: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#cfd8dc',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
  },
  summaryTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryContent: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  summaryLabel: {
    color: '#cfd8dc',
    fontSize: 13,
    flex: 1,
  },
  summaryValue: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
});