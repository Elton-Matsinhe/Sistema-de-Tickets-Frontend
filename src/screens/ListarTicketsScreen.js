import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GREEN = '#106a37';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#f4f6f8';

// Cores para diferentes status
const STATUS_COLORS = {
  'Activo': '#dc2626', // Vermelho
  'Em andamento': '#f59e0b', // Amarelo/Laranja
  'Fechado': '#106a37', // Verde da marca
  'Alocado': '#3b82f6', // Azul
};

export default function ListarTicketsScreen({
  tickets,
  filter,
  setFilter,
  page,
  setPage,
  totalPages,
  pageTickets,
  selectedTicket,
  setSelectedTicket,
  availableAssignees,
  assignTo,
  setAssignTo,
  onAssign,
  onCloseTicket,
  onDeleteTicket,
  renderBadge,
  formatDateTime,
  onBack,
}) {
  // Função para obter cor do status
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || '#6b7280';
  };

  return (
    <View style={styles.container}>
      {/* Header com botão Voltar acima */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#cfd8dc" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.headerTitle}>Gestão de Tickets</Text>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
      >
        {['Todos', 'Activo', 'Em andamento', 'Fechado', 'Alocado'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterChip,
              filter === item && styles.filterChipActive,
              filter === item && { backgroundColor: getStatusColor(item) }
            ]}
            onPress={() => {
              setFilter(item);
              setPage(1);
            }}
          >
            <Ionicons 
              name={
                item === 'Todos' ? 'grid-outline' :
                item === 'Activo' ? 'alert-circle-outline' :
                item === 'Em andamento' ? 'time-outline' :
                item === 'Fechado' ? 'checkmark-circle-outline' :
                'person-outline'
              } 
              size={14} 
              color={filter === item ? '#0b1f17' : '#cfd8dc'} 
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Tickets (4 por página) */}
      <ScrollView style={styles.ticketsList}>
        {pageTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#6b7280" />
            <Text style={styles.emptyText}>Nenhum ticket encontrado</Text>
          </View>
        ) : (
          pageTickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              {/* Cabeçalho do Ticket */}
              <View style={styles.ticketHeader}>
                <View style={styles.ticketIdContainer}>
                  <Ionicons name="document-text-outline" size={16} color="#94a3b8" />
                  <Text style={styles.ticketId}>#{ticket.id}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(ticket.status) }
                ]}>
                  <Text style={styles.statusText}>{ticket.status}</Text>
                </View>
              </View>

              {/* Informações do Ticket */}
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketTitle}>{ticket.problem}</Text>
                
                <View style={styles.ticketMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="person-outline" size={12} color="#94a3b8" />
                    <Text style={styles.metaText}>{ticket.requester}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="business-outline" size={12} color="#94a3b8" />
                    <Text style={styles.metaText}>{ticket.department}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={12} color="#94a3b8" />
                    <Text style={styles.metaText}>{ticket.province}</Text>
                  </View>
                </View>

                {/* Datas */}
                <View style={styles.dateInfo}>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                    <Text style={styles.dateText}>
                      Criado: {formatDateTime(new Date(ticket.createdAt))}
                    </Text>
                  </View>
                  {ticket.closedAt && (
                    <View style={styles.dateRow}>
                      <Ionicons name="checkmark-circle-outline" size={12} color="#94a3b8" />
                      <Text style={styles.dateText}>
                        Fechado: {formatDateTime(new Date(ticket.closedAt))}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Ações do Ticket */}
              <View style={styles.ticketActions}>
                <TouchableOpacity 
                  onPress={() => setSelectedTicket(ticket)} 
                  style={styles.actionButton}
                >
                  <Ionicons name="eye-outline" size={16} color="#cfd8dc" />
                  <Text style={styles.actionText}>Detalhes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setSelectedTicket(ticket)}
                  style={styles.actionButton}
                >
                  <Ionicons name="people-outline" size={16} color="#cfd8dc" />
                  <Text style={styles.actionText}>Alocar</Text>
                </TouchableOpacity>
                
                {ticket.status !== 'Fechado' && (
                  <TouchableOpacity
                    onPress={() => onCloseTicket(ticket.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#cfd8dc" />
                    <Text style={styles.actionText}>Fechar</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={() => onDeleteTicket(ticket.id)}
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Paginação */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <View style={styles.paginationControls}>
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
            >
              <Ionicons name="chevron-back" size={20} color={page === 1 ? '#6b7280' : '#cfd8dc'} />
              <Text style={[styles.pageButtonText, page === 1 && styles.pageButtonTextDisabled]}>
                Anterior
              </Text>
            </TouchableOpacity>
            
            <View style={styles.pageNumbers}>
              <Text style={styles.pageInfo}>
                Página {page} de {totalPages}
              </Text>
              <Text style={styles.ticketCount}>4 tickets por página</Text>
            </View>
            
            <TouchableOpacity
              disabled={page === totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
            >
              <Text style={[styles.pageButtonText, page === totalPages && styles.pageButtonTextDisabled]}>
                Próxima
              </Text>
              <Ionicons name="chevron-forward" size={20} color={page === totalPages ? '#6b7280' : '#cfd8dc'} />
            </TouchableOpacity>
          </View>

          {/* Navegação por página (botões numéricos) */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.pageNavigation}
          >
            <View style={styles.pageNumberContainer}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <TouchableOpacity
                  key={pageNum}
                  style={[
                    styles.pageNumberButton,
                    page === pageNum && styles.pageNumberButtonActive
                  ]}
                  onPress={() => setPage(pageNum)}
                >
                  <Text style={[
                    styles.pageNumberText,
                    page === pageNum && styles.pageNumberTextActive
                  ]}>
                    {pageNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Modal de Detalhes + Alocação */}
      {selectedTicket && (
        <View style={styles.detailModal}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Detalhes do Ticket</Text>
              <Text style={styles.modalSubtitle}>ID: #{selectedTicket.id}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setSelectedTicket(null)} 
              style={styles.closeModalButton}
            >
              <Ionicons name="close-outline" size={24} color="#cfd8dc" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Informações Principais */}
            <View style={styles.detailSection}>
              <View style={[
                styles.detailStatus,
                { backgroundColor: getStatusColor(selectedTicket.status) }
              ]}>
                <Text style={styles.detailStatusText}>{selectedTicket.status}</Text>
              </View>
              
              <Text style={styles.detailLabel}>Título</Text>
              <Text style={styles.detailValue}>{selectedTicket.problem}</Text>
              
              <Text style={styles.detailLabel}>Descrição</Text>
              <Text style={styles.detailValue}>{selectedTicket.description || selectedTicket.problem}</Text>
              
              {selectedTicket.observation && (
                <>
                  <Text style={styles.detailLabel}>Observações</Text>
                  <Text style={styles.detailValue}>{selectedTicket.observation}</Text>
                </>
              )}
            </View>

            {/* Informações do Solicitante */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Informações do Solicitante</Text>
              
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Nome</Text>
                  <Text style={styles.detailValue}>{selectedTicket.requester}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Departamento</Text>
                  <Text style={styles.detailValue}>{selectedTicket.department}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Tipo</Text>
                  <Text style={styles.detailValue}>{selectedTicket.type}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Província</Text>
                  <Text style={styles.detailValue}>{selectedTicket.province}</Text>
                </View>
              </View>
            </View>

            {/* Histórico de Tempo */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Histórico de Tempo</Text>
              
              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Ticket Criado</Text>
                    <Text style={styles.timelineDate}>
                      {formatDateTime(new Date(selectedTicket.createdAt))}
                    </Text>
                  </View>
                </View>
                
                {selectedTicket.assignedAt && (
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Alocado para {selectedTicket.assignedTo}</Text>
                      <Text style={styles.timelineDate}>
                        {formatDateTime(new Date(selectedTicket.assignedAt))}
                      </Text>
                    </View>
                  </View>
                )}
                
                {selectedTicket.closedAt && (
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: BRAND_GREEN }]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Ticket Fechado</Text>
                      <Text style={styles.timelineDate}>
                        {formatDateTime(new Date(selectedTicket.closedAt))}
                      </Text>
                      {selectedTicket.createdAt && selectedTicket.closedAt && (
                        <Text style={styles.timelineDuration}>
                          Tempo total: {Math.ceil((new Date(selectedTicket.closedAt) - new Date(selectedTicket.createdAt)) / (1000 * 60 * 60 * 24))} dias
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Alocação */}
            {selectedTicket.status !== 'Fechado' && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Alocar Ticket</Text>
                
                {selectedTicket.assignedTo ? (
                  <View style={styles.currentAssignee}>
                    <Text style={styles.detailLabel}>Atualmente alocado para:</Text>
                    <View style={styles.assigneeBadge}>
                      <Ionicons name="person" size={14} color="#0b1f17" />
                      <Text style={styles.assigneeName}>{selectedTicket.assignedTo}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.detailLabel}>Este ticket ainda não foi alocado</Text>
                )}
                
                <Text style={[styles.detailLabel, { marginTop: 12 }]}>Alocar para:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.assigneeList}
                >
                  {availableAssignees.map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.assigneeChip,
                        assignTo === name && styles.assigneeChipActive,
                      ]}
                      onPress={() => setAssignTo(name)}
                    >
                      <Ionicons 
                        name="person-outline" 
                        size={16} 
                        color={assignTo === name ? '#0b1f17' : '#cfd8dc'} 
                      />
                      <Text
                        style={[
                          styles.assigneeText,
                          assignTo === name && styles.assigneeTextActive,
                        ]}
                      >
                        {name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TouchableOpacity 
                  style={[styles.primaryButton, !assignTo && styles.primaryButtonDisabled]} 
                  onPress={onAssign}
                  disabled={!assignTo}
                >
                  <Ionicons name="send-outline" size={18} color="#0b1f17" />
                  <Text style={styles.primaryButtonText}>
                    {selectedTicket.assignedTo ? 'Re-alocar' : 'Alocar'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  backText: {
    color: '#cfd8dc',
    fontSize: 12,
  },
  headerTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterText: {
    color: '#cfd8dc',
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  ticketsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6b7280',
    marginTop: 12,
    fontSize: 14,
  },
  ticketCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketId: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#0b1f17',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ticketInfo: {
    gap: 8,
  },
  ticketTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  ticketMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  dateInfo: {
    gap: 4,
    marginTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  ticketActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  deleteButton: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  actionText: {
    color: '#cfd8dc',
    fontSize: 12,
    fontWeight: '500',
  },
  pagination: {
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    color: '#cfd8dc',
    fontSize: 13,
    fontWeight: '500',
  },
  pageButtonTextDisabled: {
    color: '#6b7280',
  },
  pageNumbers: {
    alignItems: 'center',
  },
  pageInfo: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  ticketCount: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  pageNavigation: {
    marginTop: 8,
  },
  pageNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  pageNumberButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  pageNumberButtonActive: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  pageNumberText: {
    color: '#cfd8dc',
    fontSize: 14,
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  detailModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 20,
  },
  modalSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  closeModalButton: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalContent: {
    flex: 1,
  },
  detailSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  detailStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailStatusText: {
    color: '#0b1f17',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailSectionTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 20,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6b7280',
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  timelineDate: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  timelineDuration: {
    color: BRAND_GREEN,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  currentAssignee: {
    marginBottom: 12,
  },
  assigneeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  assigneeName: {
    color: '#0b1f17',
    fontWeight: '700',
    fontSize: 13,
  },
  assigneeList: {
    marginVertical: 12,
  },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
  },
  assigneeChipActive: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  assigneeText: {
    color: '#cfd8dc',
    fontSize: 13,
  },
  assigneeTextActive: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: BRAND_GREEN,
    marginTop: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#0b1f17',
    fontWeight: '700',
    fontSize: 14,
  },
});