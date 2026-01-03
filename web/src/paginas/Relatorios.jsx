import React, { useState, useEffect, useRef } from 'react';
import { 
  FiDownload, 
  FiCalendar,
  FiFilter,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import logo from "../assets/logo.png";

// Cores da marca
const BRAND_GREEN = '#106a37';

// Dados mock para demonstração
const ticketsData = [
  { id: 'T-1021', type: 'Assistência', department: 'IT', requester: 'Elton Matsinhe', province: 'Maputo Cidade', problem: 'VPN não conecta', status: 'Activo', createdAt: '2025-12-14T09:10:00Z' },
  { id: 'T-1020', type: 'Requisição', department: 'Comercial', requester: 'Clara Uamusse', province: 'Sofala', problem: 'Requisição de portátil', status: 'Alocados', createdAt: '2025-12-13T15:35:00Z' },
  { id: 'T-1019', type: 'Assistência', department: 'Sinistro', requester: 'Rafael Mabjaia', province: 'Nampula', problem: 'Erro no ERP', status: 'Fechado', createdAt: '2025-12-12T11:50:00Z' },
  { id: 'T-1018', type: 'Assistência', department: 'RH', requester: 'Sílvia Macuácua', province: 'Maputo Cidade', problem: 'Email bloqueado', status: 'Activo', createdAt: '2025-12-12T09:30:00Z' },
  { id: 'T-1017', type: 'Requisição', department: 'Contabilidade', requester: 'Maria João', province: 'Gaza', problem: 'Software contabilístico', status: 'Fechado', createdAt: '2025-12-11T14:20:00Z' },
  { id: 'T-1016', type: 'Assistência', department: 'Risco e Conformidade', requester: 'Jorge Tembe', province: 'Maputo Província', problem: 'Acesso ao sistema', status: 'Alocados', createdAt: '2025-12-10T11:15:00Z' },
  { id: 'T-1015', type: 'Requisição', department: 'Subscrição', requester: 'Paulo Sitoi', province: 'Inhambane', problem: 'Equipamento novo', status: 'Activo', createdAt: '2025-12-09T14:45:00Z' },
  { id: 'T-1014', type: 'Assistência', department: 'Crédit Control', requester: 'Luísa Cuambe', province: 'Sofala', problem: 'Problema de impressora', status: 'Fechado', createdAt: '2025-12-08T10:20:00Z' },
];

const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [formatoExportacao, setFormatoExportacao] = useState('pdf');
  const [carregando, setCarregando] = useState(false);
  const [estatisticas, setEstatisticas] = useState({});
  const [provinciaData, setProvinciaData] = useState([]);
  const [departamentoData, setDepartamentoData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Dados para gráfico de evolução mensal
  const generateMonthlyData = () => {
    return [
      { month: 'Jan', tickets: 12 },
      { month: 'Fev', tickets: 18 },
      { month: 'Mar', tickets: 15 },
      { month: 'Abr', tickets: 22 },
      { month: 'Mai', tickets: 25 },
      { month: 'Jun', tickets: 30 },
      { month: 'Jul', tickets: 28 },
      { month: 'Ago', tickets: 32 },
      { month: 'Set', tickets: 35 },
      { month: 'Out', tickets: 38 },
      { month: 'Nov', tickets: 42 },
      { month: 'Dez', tickets: 45 }
    ];
  };

  // Inicializar datas
  useEffect(() => {
    const hoje = new Date().toISOString().split('T')[0];
    const primeiroDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    setDataInicio(primeiroDiaMes);
    setDataFim(hoje);
    setMonthlyData(generateMonthlyData());
  }, []);

  // Calcular estatísticas
  useEffect(() => {
    const ticketsFiltrados = ticketsData.filter(ticket => {
      if (!dataInicio || !dataFim) return true;
      
      const dataTicket = new Date(ticket.createdAt).toISOString().split('T')[0];
      return dataTicket >= dataInicio && dataTicket <= dataFim;
    });

    const total = ticketsFiltrados.length;
    const active = ticketsFiltrados.filter(t => t.status === 'Activo').length;
    const alocados = ticketsFiltrados.filter(t => t.status === 'Alocados').length;
    const closed = ticketsFiltrados.filter(t => t.status === 'Fechado').length;
    const activity = Math.round((closed / total) * 100) || 0;

    setEstatisticas({
      total,
      active,
      alocados,
      closed,
      activity,
      tipoAssistencia: ticketsFiltrados.filter(t => t.type === 'Assistência').length,
      tipoRequisicao: ticketsFiltrados.filter(t => t.type === 'Requisição').length,
    });

    // Dados por província
    const provinces = [
      'Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala',
      'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'
    ];
    
    const provinciaCount = {};
    provinces.forEach(province => {
      provinciaCount[province] = ticketsFiltrados.filter(t => t.province === province).length;
    });
    
    const provinciaChartData = Object.entries(provinciaCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setProvinciaData(provinciaChartData);

    // Dados por departamento
    const departments = [
      'Departamento de IT', 'Crédit Control', 'Risco e Conformidade', 'RH',
      'Contabilidade', 'Comercial', 'Júridico', 'Subscrição', 'Sinistro'
    ];
    
    const departamentoCount = {};
    departments.forEach(dept => {
      departamentoCount[dept] = ticketsFiltrados.filter(t => t.department === dept).length;
    });
    
    const departamentoChartData = Object.entries(departamentoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setDepartamentoData(departamentoChartData);
  }, [dataInicio, dataFim]);

  // Formatador de data
  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para criar gráfico de barras em HTML (simulado)
  const createBarChartHTML = (data, title) => {
    const maxValue = Math.max(...data.map(d => d.tickets));
    
    return `
      <div style="margin-top: 10px;">
        <div style="display: flex; align-items: flex-end; height: 120px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
          ${data.slice(0, 6).map(item => `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; margin: 0 2px;">
              <div style="width: 20px; height: ${(item.tickets / maxValue) * 100}px; background: ${BRAND_GREEN}; border-radius: 3px 3px 0 0;"></div>
              <div style="font-size: 10px; margin-top: 5px; transform: rotate(-45deg); white-space: nowrap;">${item.month}</div>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #666;">
          ${data.slice(0, 6).map(item => `
            <div>${item.tickets}</div>
          `).join('')}
        </div>
      </div>
    `;
  };

  // Função para criar gráfico de pizza em HTML (simulado)
  const createPieChartHTML = (assistencia, requisicao) => {
    const total = assistencia + requisicao;
    const assistenciaPercent = Math.round((assistencia / total) * 100) || 0;
    const requisicaoPercent = Math.round((requisicao / total) * 100) || 0;
    
    return `
      <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 10px;">
        <div style="position: relative; width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(
          ${BRAND_GREEN} 0% ${assistenciaPercent}%,
          #2e8b57 ${assistenciaPercent}% 100%
        );"></div>
        <div style="font-size: 12px;">
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 12px; height: 12px; background: ${BRAND_GREEN}; margin-right: 8px;"></div>
            <div>Assistência: ${assistenciaPercent}%</div>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="width: 12px; height: 12px; background: #2e8b57; margin-right: 8px;"></div>
            <div>Requisição: ${requisicaoPercent}%</div>
          </div>
        </div>
      </div>
    `;
  };

  // Exportar para PDF com múltiplas páginas
  const exportarParaPDF = async () => {
    setCarregando(true);
    try {
      // Função para criar conteúdo da página 1
      const createPage1Content = () => {
        return `
          <div style="max-width: 210mm; margin: 0 auto; min-height: 250mm;">
            <!-- Cabeçalho com Logo -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid ${BRAND_GREEN};">
              <!-- Logo -->
              <div style="margin-bottom: 15px;">
                <img src="${logo}" alt="Imperial Insurance" style="height: 70px; margin: 0 auto;" />
              </div>
              
              <h1 style="font-size: 24px; font-weight: bold; color: ${BRAND_GREEN}; margin-bottom: 5px;">
                Imperial Insurance
              </h1>
              <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
                Sistema de Gestão de Tickets
              </p>
              
              <h2 style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 10px;">
                Relatório de Tickets
              </h2>
              
              <div style="display: flex; justify-content: center; gap: 20px; color: #666; font-size: 12px;">
                <div><strong>Período:</strong> ${dataInicio} até ${dataFim}</div>
                <div><strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-MZ')}</div>
              </div>
            </div>
            
            <!-- Estatísticas Gerais -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Estatísticas Gerais
              </h3>
              
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 15px;">
                <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total de Tickets</div>
                  <div style="font-size: 24px; font-weight: bold; color: #333;">${estatisticas.total || 0}</div>
                </div>
                
                <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tickets Activos</div>
                  <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${estatisticas.active || 0}</div>
                </div>
                
                <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tickets Alocados</div>
                  <div style="font-size: 24px; font-weight: bold; color: #d97706;">${estatisticas.alocados || 0}</div>
                </div>
                
                <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tickets Fechados</div>
                  <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${estatisticas.closed || 0}</div>
                </div>
              </div>
            </div>
            
            <!-- Tickets por Mês -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Tickets por Mês - Evolução Mensal
              </h3>
              
              <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                  Evolução do número de tickets ao longo do ano
                </div>
                ${createBarChartHTML(monthlyData, 'Últimos 6 Meses')}
              </div>
            </div>
            
            <!-- Top 5 Províncias -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Top 5 Províncias
              </h3>
              
              <div style="margin: 15px 0;">
                ${provinciaData.map((provincia, index) => `
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                      <span>${provincia.name}</span>
                      <span>${provincia.value} tickets</span>
                    </div>
                    <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                      <div style="height: 100%; width: ${(provincia.value / Math.max(...provinciaData.map(p => p.value), 1)) * 100}%; background: ${BRAND_GREEN}; border-radius: 3px;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Rodapé da Página 1 -->
            <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: #666; font-size: 10px; line-height: 1.4; border-top: 1px solid #e5e7eb; padding-top: 10px;">
              <p>Av. Kenneth Kaunda, N°806 (Sede) • Maputo - Moçambique</p>
              <p>+258 841644096 | info@imperialinsurance-mz.com • Criado pelo Departamento de IT</p>
              <p style="margin-top: 5px; color: #9ca3af;">Página 1 de 2 • ${new Date().getFullYear()} Todos direitos Reservados</p>
            </div>
          </div>
        `;
      };

      // Função para criar conteúdo da página 2
      const createPage2Content = () => {
        const ticketsFiltrados = ticketsData.filter(ticket => {
          if (!dataInicio || !dataFim) return true;
          const dataTicket = new Date(ticket.createdAt).toISOString().split('T')[0];
          return dataTicket >= dataInicio && dataTicket <= dataFim;
        });

        return `
          <div style="max-width: 210mm; margin: 0 auto; min-height: 250mm;">
            <!-- Cabeçalho da Página 2 -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid ${BRAND_GREEN};">
              <h1 style="font-size: 24px; font-weight: bold; color: ${BRAND_GREEN}; margin-bottom: 5px;">
                Imperial Insurance
              </h1>
              <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
                Sistema de Gestão de Tickets - Continuação
              </p>
            </div>
            
            <!-- Top 5 Departamentos -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Top 5 Departamentos
              </h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px 14px; text-align: left; border-bottom: 2px solid #e5e7eb;">Departamento</th>
                    <th style="padding: 12px 14px; text-align: left; border-bottom: 2px solid #e5e7eb;">Tickets</th>
                    <th style="padding: 12px 14px; text-align: left; border-bottom: 2px solid #e5e7eb;">Percentagem</th>
                  </tr>
                </thead>
                <tbody>
                  ${departamentoData.map((dept, index) => {
                    const percentage = Math.round((dept.value / (estatisticas.total || 1)) * 100);
                    return `
                      <tr style="${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                        <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6;">${dept.name}</td>
                        <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6;">${dept.value}</td>
                        <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6;">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px;">
                              <div style="height: 100%; width: ${percentage}%; background: ${BRAND_GREEN}; border-radius: 3px;"></div>
                            </div>
                            <span>${percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Tabela de Tickets -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Lista Completa de Tickets (${ticketsFiltrados.length})
              </h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 10px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">ID</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Tipo</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Departamento</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Província</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Status</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Data</th>
                  </tr>
                </thead>
                <tbody>
                  ${ticketsFiltrados.map((ticket, index) => `
                    <tr style="${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;"><strong>${ticket.id}</strong></td>
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;">${ticket.type}</td>
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;">${ticket.department}</td>
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;">${ticket.province}</td>
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;">
                        <span style="padding: 3px 8px; border-radius: 12px; font-size: 9px; font-weight: 600; display: inline-block; ${
                          ticket.status === 'Activo' ? 'background: #fef2f2; color: #dc2626;' :
                          ticket.status === 'Alocados' ? 'background: #fffbeb; color: #d97706;' :
                          'background: #f0fdf4; color: #16a34a;'
                        }">
                          ${ticket.status}
                        </span>
                      </td>
                      <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6;">${formatDate(ticket.createdAt)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Estatísticas de Desempenho -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Estatísticas de Desempenho
              </h3>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background: #1e40af; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">
                      🕒
                    </div>
                    <div style="font-size: 12px; color: #666;">Tempo Médio de Resposta</div>
                  </div>
                  <div style="font-size: 20px; font-weight: bold; color: #1e40af;">2h 30min</div>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background: #16a34a; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">
                      👍
                    </div>
                    <div style="font-size: 12px; color: #666;">Taxa de Satisfação</div>
                  </div>
                  <div style="font-size: 20px; font-weight: bold; color: #16a34a;">92%</div>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background: #7c3aed; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">
                      ✅
                    </div>
                    <div style="font-size: 12px; color: #666;">Tickets Resolvidos</div>
                  </div>
                  <div style="font-size: 20px; font-weight: bold; color: #7c3aed;">${estatisticas.closed || 0}/${estatisticas.total || 1}</div>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background: ${BRAND_GREEN}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">
                      📊
                    </div>
                    <div style="font-size: 12px; color: #666;">Taxa de Conclusão</div>
                  </div>
                  <div style="font-size: 20px; font-weight: bold; color: ${BRAND_GREEN};">${estatisticas.activity || 0}%</div>
                </div>
              </div>
              
              <!-- Tickets por Tipo -->
              <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 12px;">
                  Distribuição por Tipo de Ticket
                </h4>
                ${createPieChartHTML(estatisticas.tipoAssistencia || 5, estatisticas.tipoRequisicao || 3)}
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 12px; font-size: 12px;">
                  <div><strong>Assistência:</strong> ${Math.round(((estatisticas.tipoAssistencia || 0) / (estatisticas.total || 1)) * 100)}%</div>
                  <div><strong>Requisição:</strong> ${Math.round(((estatisticas.tipoRequisicao || 0) / (estatisticas.total || 1)) * 100)}%</div>
                </div>
              </div>
            </div>
            
            <!-- Resumo Executivo -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid ${BRAND_GREEN}; padding-left: 8px;">
                Resumo Executivo
              </h3>
              
              <div style="background: #f8fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0; font-size: 12px; line-height: 1.6;">
                <p style="margin-bottom: 10px;">
                  <strong>Período Analisado:</strong> ${dataInicio} a ${dataFim}
                </p>
                <p style="margin-bottom: 10px;">
                  <strong>Total de Tickets:</strong> ${estatisticas.total || 0} tickets registados no sistema
                </p>
                <p style="margin-bottom: 10px;">
                  <strong>Taxa de Conclusão:</strong> ${estatisticas.activity || 0}% dos tickets foram resolvidos
                </p>
                <p style="margin-bottom: 10px;">
                  <strong>Status Actual:</strong> ${estatisticas.active || 0} tickets activos, ${estatisticas.alocados || 0} em processamento
                </p>
                <p>
                  <strong>Desempenho:</strong> Tempo médio de resposta de 2h30min com taxa de satisfação de 92%
                </p>
              </div>
            </div>
            
            <!-- Rodapé da Página 2 -->
            <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: #666; font-size: 10px; line-height: 1.4; border-top: 1px solid #e5e7eb; padding-top: 10px;">
              <p>Av. Kenneth Kaunda, N°806 (Sede) • Maputo - Moçambique</p>
              <p>+258 841644096 | info@imperialinsurance-mz.com • Criado pelo Departamento de IT</p>
              <p style="margin-top: 5px; color: #9ca3af;">Página 2 de 2 • ${new Date().getFullYear()} Todos direitos Reservados</p>
              <p style="margin-top: 5px; font-size: 9px; color: #9ca3af;">
                Relatório gerado em ${new Date().toLocaleDateString('pt-MZ', { 
                  day: '2-digit',
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        `;
      };

      // Criar PDF com múltiplas páginas
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Página 1
      const tempDiv1 = document.createElement('div');
      tempDiv1.style.position = 'absolute';
      tempDiv1.style.left = '-9999px';
      tempDiv1.style.top = '0';
      tempDiv1.style.width = '800px';
      tempDiv1.style.padding = '20px';
      tempDiv1.style.backgroundColor = 'white';
      tempDiv1.style.fontFamily = 'Arial, sans-serif';
      tempDiv1.innerHTML = createPage1Content();
      
      document.body.appendChild(tempDiv1);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas1 = await html2canvas(tempDiv1, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210;
      const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
      pdf.addImage(canvas1.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight1);
      document.body.removeChild(tempDiv1);
      
      // Página 2
      pdf.addPage();
      
      const tempDiv2 = document.createElement('div');
      tempDiv2.style.position = 'absolute';
      tempDiv2.style.left = '-9999px';
      tempDiv2.style.top = '0';
      tempDiv2.style.width = '800px';
      tempDiv2.style.padding = '20px';
      tempDiv2.style.backgroundColor = 'white';
      tempDiv2.style.fontFamily = 'Arial, sans-serif';
      tempDiv2.innerHTML = createPage2Content();
      
      document.body.appendChild(tempDiv2);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas2 = await html2canvas(tempDiv2, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;
      pdf.addImage(canvas2.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight2);
      document.body.removeChild(tempDiv2);
      
      // Salvar PDF
      pdf.save(`relatorio_tickets_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar o relatório. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Exportar para Excel
  const exportarParaExcel = () => {
    setCarregando(true);
    try {
      const dadosExcel = [
        ['Imperial Insurance'],
        ['Sistema de Gestão de Tickets'],
        ['Relatório de Tickets'],
        [''],
        ['Período:', `${dataInicio} até ${dataFim}`],
        ['Gerado em:', new Date().toLocaleDateString('pt-MZ')],
        [''],
        ['ESTATÍSTICAS GERAIS'],
        ['Total de Tickets:', estatisticas.total],
        ['Tickets Activos:', estatisticas.active],
        ['Tickets Alocados:', estatisticas.alocados],
        ['Tickets Fechados:', estatisticas.closed],
        ['Taxa de Conclusão:', `${estatisticas.activity}%`],
        [''],
        ['ESTATÍSTICAS DE DESEMPENHO'],
        ['Tempo Médio de Resposta:', '2h 30min'],
        ['Taxa de Satisfação:', '92%'],
        ['Tickets Resolvidos:', `${estatisticas.closed || 0}/${estatisticas.total || 1}`],
        ['Tickets por Tipo - Assistência:', `${Math.round(((estatisticas.tipoAssistencia || 0) / (estatisticas.total || 1)) * 100)}%`],
        ['Tickets por Tipo - Requisição:', `${Math.round(((estatisticas.tipoRequisicao || 0) / (estatisticas.total || 1)) * 100)}%`],
        [''],
        ['TOP 5 PROVÍNCIAS'],
        ['Província', 'Tickets'],
        ...provinciaData.map(p => [p.name, p.value]),
        [''],
        ['TOP 5 DEPARTAMENTOS'],
        ['Departamento', 'Tickets'],
        ...departamentoData.map(d => [d.name, d.value]),
        [''],
        ['TICKETS POR MÊS'],
        ['Mês', 'Tickets'],
        ...monthlyData.map(m => [m.month, m.tickets]),
        [''],
        ['LISTA DE TICKETS'],
        ['ID', 'Tipo', 'Departamento', 'Solicitante', 'Província', 'Problema', 'Status', 'Data Criação']
      ];

      const ticketsFiltrados = ticketsData.filter(ticket => {
        if (!dataInicio || !dataFim) return true;
        const dataTicket = new Date(ticket.createdAt).toISOString().split('T')[0];
        return dataTicket >= dataInicio && dataTicket <= dataFim;
      });

      ticketsFiltrados.forEach(ticket => {
        dadosExcel.push([
          ticket.id,
          ticket.type,
          ticket.department,
          ticket.requester,
          ticket.province,
          ticket.problem,
          ticket.status,
          formatDate(ticket.createdAt)
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(dadosExcel);
      
      // Estilizar a planilha
      const wscols = [
        { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 15 },
        { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 20 }
      ];
      ws['!cols'] = wscols;
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
      XLSX.writeFile(wb, `relatorio_tickets_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar o relatório. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Handler para exportação
  const handleExportar = () => {
    switch (formatoExportacao) {
      case 'pdf':
        exportarParaPDF();
        break;
      case 'excel':
        exportarParaExcel();
        break;
      default:
        exportarParaPDF();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Relatórios
        </h1>
        <p className="text-gray-600">
          Gere relatórios detalhados do sistema de tickets
        </p>
      </div>

      {/* Controles de Relatório */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiCalendar className="text-[#106a37]" />
              Período
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
              />
              <span className="hidden md:flex items-center">até</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
              />
            </div>
          </div>

          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiFilter className="text-[#106a37]" />
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
            >
              <option value="completo">Relatório Completo</option>
              <option value="estatisticas">Apenas Estatísticas</option>
              <option value="tickets">Apenas Tickets</option>
            </select>
          </div>

          {/* Formato de Exportação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiDownload className="text-[#106a37]" />
              Formato de Exportação
            </label>
            <select
              value={formatoExportacao}
              onChange={(e) => setFormatoExportacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent"
            >
              <option value="pdf">PDF (Recomendado)</option>
              <option value="excel">Excel (XLSX)</option>
            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleExportar}
            disabled={carregando}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white rounded-lg hover:from-[#0d5a2c] hover:to-[#0a4a23] transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {carregando ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiDownload className="group-hover:scale-110 transition-transform" />
                Gerar Relatório
              </>
            )}
          </button>
        </div>

        {/* Informações do Período */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Período selecionado:</strong> {dataInicio} até {dataFim}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Tickets encontrados:</strong> {estatisticas.total || 0}
          </p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Tickets</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{estatisticas.total || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FiFileText className="text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{estatisticas.active || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <FiAlertCircle className="text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{estatisticas.activity || 0}%</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FiCheckCircle className="text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Departamentos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{departamentoData.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <FiUsers className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Nota:</strong> Clique em "Gerar Relatório" para criar um PDF profissional com 2 páginas contendo todas as informações estatísticas e a lista completa de tickets.
        </p>
      </div>
    </div>
  );
};

export default Relatorios;