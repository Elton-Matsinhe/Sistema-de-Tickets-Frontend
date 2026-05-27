import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GREEN = '#106a37';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT = '#f4f6f8';

// Todas as 11 províncias de Angola
const ALL_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando-Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
];

export default function EmitirTicketScreen({
  ticketForm,
  setTicketForm,
  ticketStep,
  setTicketStep,
  filteredRequesters,
  assistenciaIssues,
  /** Nomes de tipos de problema vindos da API (substitui a lista estática quando preenchido). */
  problemOptions,
  provinces = ALL_PROVINCES, // Usa as províncias padrão se não forem passadas
  departments, // Agora deve incluir IT e Comercial
  onSubmit,
  onBack,
}) {
  const issuesList =
    Array.isArray(problemOptions) && problemOptions.length > 0
      ? problemOptions
      : assistenciaIssues;
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [requesterOpen, setRequesterOpen] = useState(false);
  const [problemOpen, setProblemOpen] = useState(false);
  const [provinceOpen, setProvinceOpen] = useState(false);
  
  // Estado para filtros
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');

  // Filtrar departamentos
  const filteredDepartments = Object.keys(departments || {}).filter(dep =>
    dep.toLowerCase().includes(departmentFilter.toLowerCase())
  );

  // Filtrar províncias
  const filteredProvinces = (provinces || ALL_PROVINCES).filter(prov =>
    prov.toLowerCase().includes(provinceFilter.toLowerCase())
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#cfd8dc" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Emitir Ticket</Text>
      </View>

      <View style={styles.stepRow}>
        {[1, 2].map((step) => (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                ticketStep === step && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  ticketStep === step && styles.stepTextActive,
                ]}
              >
                {step}
              </Text>
            </View>
            <Text style={styles.stepLabel}>
              {step === 1 ? 'Detalhes' : 'Confirmar'}
            </Text>
          </View>
        ))}
      </View>

      {ticketStep === 1 && (
        <ScrollView 
          style={{ paddingBottom: 16 }} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.optionRow}>
            {['Assistência', 'Requisição'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionChip,
                  ticketForm.type === type && styles.optionChipActive,
                ]}
                onPress={() => setTicketForm((p) => ({ ...p, type }))}
              >
                <Ionicons
                  name={type === 'Assistência' ? 'settings-outline' : 'cube-outline'}
                  size={16}
                  color={ticketForm.type === type ? '#0b1f17' : '#cfd8dc'}
                />
                <Text
                  style={[
                    styles.optionText,
                    ticketForm.type === type && styles.optionTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Departamento - menu suspenso com filtro e scroll */}
          <Text style={styles.label}>Departamento</Text>
          <View style={styles.dropdown}>
            <View style={styles.inputRow}>
              <Ionicons name="search-outline" size={18} color="#cfd8dc" />
              <TextInput
                placeholder="Filtrar departamentos"
                placeholderTextColor="#94a3b8"
                style={styles.textInput}
                value={departmentFilter}
                onChangeText={(text) => setDepartmentFilter(text)}
              />
            </View>
            <TouchableOpacity
              style={[styles.dropdownHeader, { marginTop: 6 }]}
              activeOpacity={0.8}
              onPress={() => setDepartmentOpen((open) => !open)}
            >
              <Text style={styles.dropdownHeaderText}>
                {ticketForm.department || 'Selecionar departamento'}
              </Text>
              <Ionicons
                name={departmentOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#cfd8dc"
              />
            </TouchableOpacity>
            {departmentOpen && (
              <View style={styles.dropdownListContainer}>
                <View style={styles.dropdownList}>
                  <ScrollView 
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {filteredDepartments.map((dep) => (
                      <TouchableOpacity
                        key={dep}
                        style={[
                          styles.dropdownItem,
                          ticketForm.department === dep && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setDepartmentOpen(false);
                          setDepartmentFilter('');
                          setTicketForm((p) => ({
                            ...p,
                            department: dep,
                            requester: '',
                            requesterSearch: '',
                          }));
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            ticketForm.department === dep && styles.dropdownItemTextActive,
                          ]}
                        >
                          {dep}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredDepartments.length === 0 && (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>
                          Nenhum departamento encontrado
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Nome solicitante - menu suspenso com filtro e scroll */}
          <Text style={styles.label}>Nome solicitante</Text>
          <View style={styles.dropdown}>
            <View style={styles.inputRow}>
              <Ionicons name="search-outline" size={18} color="#cfd8dc" />
              <TextInput
                placeholder="Filtrar nomes"
                placeholderTextColor="#94a3b8"
                style={styles.textInput}
                value={ticketForm.requesterSearch}
                onChangeText={(text) =>
                  setTicketForm((p) => ({ ...p, requesterSearch: text }))
                }
              />
            </View>
            <TouchableOpacity
              style={[styles.dropdownHeader, { marginTop: 6 }]}
              activeOpacity={0.8}
              onPress={() => setRequesterOpen((open) => !open)}
            >
              <Text style={styles.dropdownHeaderText}>
                {ticketForm.requester || 'Selecionar solicitante'}
              </Text>
              <Ionicons
                name={requesterOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#cfd8dc"
              />
            </TouchableOpacity>
            {requesterOpen && (
              <View style={styles.dropdownListContainer}>
                <View style={styles.dropdownList}>
                  <ScrollView 
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {filteredRequesters.map((name) => (
                      <TouchableOpacity
                        key={name}
                        style={[
                          styles.dropdownItem,
                          ticketForm.requester === name && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setRequesterOpen(false);
                          setTicketForm((p) => ({ ...p, requester: name }));
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            ticketForm.requester === name && styles.dropdownItemTextActive,
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredRequesters.length === 0 && (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>
                          Nenhum solicitante encontrado
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Problema / Requisição - menu suspenso com scroll ou textarea */}
          <Text style={styles.label}>
            {ticketForm.type === 'Assistência' ? 'Selecionar problema' : 'Descrever requisição'}
          </Text>
          {ticketForm.type === 'Assistência' || (ticketForm.type === 'Requisição' && issuesList.length > 0) ? (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownHeader}
                activeOpacity={0.8}
                onPress={() => setProblemOpen((open) => !open)}
              >
                <Text style={styles.dropdownHeaderText}>
                  {ticketForm.problem || (ticketForm.type === 'Assistência' ? 'Selecionar problema' : 'Selecionar tipo de requisição')}
                </Text>
                <Ionicons
                  name={problemOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#cfd8dc"
                />
              </TouchableOpacity>
              {problemOpen && (
                <View style={styles.dropdownListContainer}>
                  <View style={styles.dropdownList}>
                    <ScrollView 
                      style={{ width: '100%' }}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      {issuesList.map((issue) => (
                        <TouchableOpacity
                          key={issue}
                          style={[
                            styles.dropdownItem,
                            ticketForm.problem === issue && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setProblemOpen(false);
                            setTicketForm((p) => ({ ...p, problem: issue }));
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              ticketForm.problem === issue && styles.dropdownItemTextActive,
                            ]}
                          >
                            {issue}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.textArea}>
              <TextInput
                placeholder="Descreva o material solicitado..."
                placeholderTextColor="#94a3b8"
                style={styles.textAreaInput}
                multiline
                value={ticketForm.description}
                onChangeText={(text) => setTicketForm((p) => ({ ...p, description: text }))}
              />
            </View>
          )}

          {/* Província - menu suspenso com filtro e scroll */}
          <Text style={styles.label}>Província (opcional)</Text>
          <View style={styles.dropdown}>
            <View style={styles.inputRow}>
              <Ionicons name="search-outline" size={18} color="#cfd8dc" />
              <TextInput
                placeholder="Filtrar províncias"
                placeholderTextColor="#94a3b8"
                style={styles.textInput}
                value={provinceFilter}
                onChangeText={(text) => setProvinceFilter(text)}
              />
            </View>
            <TouchableOpacity
              style={[styles.dropdownHeader, { marginTop: 6 }]}
              activeOpacity={0.8}
              onPress={() => setProvinceOpen((open) => !open)}
            >
              <Text style={styles.dropdownHeaderText}>
                {ticketForm.province || 'Selecionar província'}
              </Text>
              <Ionicons
                name={provinceOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#cfd8dc"
              />
            </TouchableOpacity>
            {provinceOpen && (
              <View style={styles.dropdownListContainer}>
                <View style={[styles.dropdownList, { maxHeight: 260 }]}>
                  <ScrollView 
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {filteredProvinces.map((prov) => (
                      <TouchableOpacity
                        key={prov}
                        style={[
                          styles.dropdownItem,
                          ticketForm.province === prov && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setProvinceOpen(false);
                          setProvinceFilter('');
                          setTicketForm((p) => ({ ...p, province: prov }));
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            ticketForm.province === prov && styles.dropdownItemTextActive,
                          ]}
                        >
                          {prov}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredProvinces.length === 0 && (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>
                          Nenhuma província encontrada
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Observação mais visível */}
          <Text style={styles.label}>Observação (opcional)</Text>
          <View style={styles.textAreaLarge}>
            <TextInput
              placeholder="Notas adicionais sobre o ticket..."
              placeholderTextColor="#94a3b8"
              style={styles.textAreaInput}
              multiline
              value={ticketForm.observation}
              onChangeText={(text) => setTicketForm((p) => ({ ...p, observation: text }))}
            />
          </View>
        </ScrollView>
      )}

      {ticketStep === 2 && (
        <View style={{ gap: 8, paddingVertical: 12 }}>
          <Text style={styles.confirmText}>Revise os dados antes de abrir</Text>
          <Text style={styles.detailText}>Tipo: {ticketForm.type}</Text>
          <Text style={styles.detailText}>Departamento: {ticketForm.department || '—'}</Text>
          <Text style={styles.detailText}>Solicitante: {ticketForm.requester || '—'}</Text>
          <Text style={styles.detailText}>
            {ticketForm.type === 'Assistência'
              ? `Problema: ${ticketForm.problem || '—'}`
              : issuesList.length > 0
                ? `Requisição: ${ticketForm.problem || '—'}`
                : `Requisição: ${ticketForm.description || '—'}`}
          </Text>
          <Text style={styles.detailText}>Província: {ticketForm.province || '—'}</Text>
          <Text style={styles.detailText}>Observação: {ticketForm.observation || '—'}</Text>
        </View>
      )}

      <View style={styles.modalFooter}>
        {ticketStep > 1 ? (
          <TouchableOpacity
            style={[styles.secondaryButton, { marginRight: 8 }]}
            onPress={() => setTicketStep((s) => Math.max(1, s - 1))}
          >
            <Ionicons name="arrow-back" size={16} color="#cfd8dc" />
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {ticketStep === 1 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (
                ticketForm.type === 'Requisição' &&
                issuesList.length > 0 &&
                !ticketForm.problem
              ) {
                return;
              }
              setTicketStep(2);
            }}
          >
            <Ionicons name="arrow-forward" size={16} color="#0b1f17" />
            <Text style={styles.primaryButtonText}>Avançar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
            <Ionicons name="send-outline" size={16} color="#0b1f17" />
            <Text style={styles.primaryButtonText}>Abrir ticket</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 16,
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  stepCircleActive: {
    borderColor: BRAND_GREEN,
    backgroundColor: BRAND_GREEN,
  },
  stepText: {
    color: '#cfd8dc',
    fontWeight: '700',
  },
  stepTextActive: {
    color: '#0b1f17',
  },
  stepLabel: {
    color: '#cfd8dc',
    marginTop: 4,
    fontSize: 12,
  },
  label: {
    color: '#cfd8dc',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 6,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  optionChipActive: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  optionText: {
    color: '#cfd8dc',
  },
  optionTextActive: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  assigneeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  assigneeChipActive: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  assigneeText: {
    color: '#cfd8dc',
    fontSize: 12,
  },
  assigneeTextActive: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  textInput: {
    flex: 1,
    color: TEXT,
  },
  textArea: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginTop: 4,
  },
  textAreaLarge: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 6,
    minHeight: 140,
  },
  textAreaInput: {
    minHeight: 80,
    color: TEXT,
    padding: 10,
  },
  confirmText: {
    color: '#cfd8dc',
    marginBottom: 8,
  },
  detailText: {
    color: '#e2e8f0',
    marginBottom: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: BRAND_GREEN,
    shadowColor: BRAND_GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryButtonText: {
    color: '#0b1f17',
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  secondaryButtonText: {
    color: '#cfd8dc',
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownHeaderText: {
    color: TEXT,
    fontSize: 14,
  },
  dropdownListContainer: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: 'rgba(9,11,16,0.95)',
  },
  dropdownList: {
    maxHeight: 220,
    width: '100%',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(16,106,55,0.25)',
  },
  dropdownItemText: {
    color: '#cfd8dc',
    fontSize: 14,
  },
  dropdownItemTextActive: {
    color: TEXT,
    fontWeight: '700',
  },
  noResults: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
});