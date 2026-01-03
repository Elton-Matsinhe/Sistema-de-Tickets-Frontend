import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiTrendingUp, 
  FiActivity, 
  FiCheckCircle, 
  FiClock,
  FiAlertCircle,
  FiUsers,
  FiMapPin,
  FiBarChart2,
  FiPieChart,
  FiRefreshCw,
  FiInfo,
  FiCalendar
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Cores da marca (mantidas do mobile)
const BRAND_GREEN = '#106a37';
const BRAND_GREEN_LIGHT = '#2e8b57';
const DASHBOARD_BG = '#f9fafb';
const CARD_BG = '#ffffff';
const TEXT_MAIN = '#111827';
const TEXT_SECONDARY = '#6b7280';
const TEXT_LIGHT = '#9ca3af';

// Províncias de Moçambique
const provinces = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

// Departamentos
const departments = [
  'Departamento de IT',
  'Crédit Control',
  'Risco e Conformidade',
  'RH',
  'Contabilidade',
  'Comercial',
  'Júridico',
  'Subscrição',
  'Sinistro'
];

// Dados mock para demonstração (estes viriam da API/contexto)
const initialTicketsData = [
  { id: 'T-1021', type: 'Assistência', department: 'IT', requester: 'Elton Matsinhe', province: 'Maputo Cidade', problem: 'VPN não conecta', status: 'Activo', createdAt: '2025-12-14T09:10:00Z' },
  { id: 'T-1020', type: 'Requisição', department: 'Comercial', requester: 'Clara Uamusse', province: 'Sofala', problem: 'Requisição de portátil', status: 'Alocados', createdAt: '2025-12-13T15:35:00Z' },
  { id: 'T-1019', type: 'Assistência', department: 'Sinistro', requester: 'Rafael Mabjaia', province: 'Nampula', problem: 'Erro no ERP', status: 'Fechado', createdAt: '2025-12-12T11:50:00Z' },
  { id: 'T-1018', type: 'Assistência', department: 'RH', requester: 'Sílvia Macuácua', province: 'Maputo Cidade', problem: 'Email bloqueado', status: 'Activo', createdAt: '2025-12-12T09:30:00Z' },
  { id: 'T-1017', type: 'Requisição', department: 'Contabilidade', requester: 'Maria João', province: 'Gaza', problem: 'Software contabilístico', status: 'Fechado', createdAt: '2025-12-11T14:20:00Z' },
  { id: 'T-1016', type: 'Assistência', department: 'Risco e Conformidade', requester: 'Jorge Tembe', province: 'Maputo Província', problem: 'Acesso ao sistema', status: 'Alocados', createdAt: '2025-12-10T11:15:00Z' },
  { id: 'T-1015', type: 'Requisição', department: 'Subscrição', requester: 'Paulo Sitoi', province: 'Inhambane', problem: 'Equipamento novo', status: 'Activo', createdAt: '2025-12-09T14:45:00Z' },
  { id: 'T-1014', type: 'Assistência', department: 'Crédit Control', requester: 'Luísa Cuambe', province: 'Sofala', problem: 'Problema de impressora', status: 'Fechado', createdAt: '2025-12-08T10:20:00Z' },
];

const Dashboard = () => {
  const [tickets, setTickets] = useState(initialTicketsData);
  const [stats, setStats] = useState({});
  const [provinceData, setProvinceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [now, setNow] = useState(new Date());
  const [countdown, setCountdown] = useState('');
  
  // Referências para animações
  const cardRefs = useRef([]);
  const chartRefs = useRef([]);

  // Data da próxima atualização do sistema (09/01/2026 14:00)
  const nextUpdateDate = new Date('2026-01-09T14:00:00');

  // Cores para gráficos
  const CHART_COLORS = {
    active: '#22c55e',
    alocados: '#f97316',
    closed: '#9ca3af',
    provinces: [
      '#106a37', '#2e8b57', '#16a34a', '#4ade80', '#86efac',
      '#bbf7d0', '#dcfce7', '#f0fdf4', '#f0f9ff', '#e0f2fe', '#bae6fd'
    ]
  };

  // Calcular contagem regressiva
  useEffect(() => {
    const updateCountdown = () => {
      const currentTime = new Date();
      const timeDiff = nextUpdateDate.getTime() - currentTime.getTime();
      
      if (timeDiff <= 0) {
        setCountdown('Actualização em progresso...');
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    // Atualizar imediatamente
    updateCountdown();
    
    // Atualizar a cada segundo
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calcular estatísticas
  useEffect(() => {
    const total = tickets.length;
    const active = tickets.filter(t => t.status === 'Activo').length;
    const alocados = tickets.filter(t => t.status === 'Alocados').length;
    const closed = tickets.filter(t => t.status === 'Fechado').length;
    const growth = total - initialTicketsData.length;
    
    setStats({
      total,
      active,
      alocados,
      closed,
      growth,
      activity: Math.round((closed / total) * 100) || 0
    });

    // Dados por província
    const provinceCount = {};
    provinces.forEach(province => {
      provinceCount[province] = tickets.filter(t => t.province === province).length;
    });
    
    const provinceChartData = Object.entries(provinceCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setProvinceData(provinceChartData);

    // Dados por departamento
    const departmentCount = {};
    departments.forEach(dept => {
      departmentCount[dept] = tickets.filter(t => t.department === dept).length;
    });
    
    const departmentChartData = Object.entries(departmentCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setDepartmentData(departmentChartData);

    // Dados mensais
    const monthlyCount = {
      'Jan': 12, 'Fev': 18, 'Mar': 15, 'Abr': 22, 'Mai': 25,
      'Jun': 30, 'Jul': 28, 'Ago': 32, 'Set': 35, 'Out': 38,
      'Nov': 42, 'Dez': 45
    };
    
    const monthlyChartData = Object.entries(monthlyCount).map(([month, count]) => ({
      month,
      tickets: count,
      growth: Math.round(Math.random() * 20)
    }));
    
    setMonthlyData(monthlyChartData);

    setLoading(false);
  }, [tickets]);

  // Atualizar saudação baseada na hora
  useEffect(() => {
    const hour = now.getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, [now]);

  // Efeitos de entrada
  useEffect(() => {
    const observers = [];
    
    // Observer para cards
    cardRefs.current.forEach(card => {
      if (!card) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      
      observer.observe(card);
      observers.push(observer);
    });

    // Observer para gráficos
    chartRefs.current.forEach(chart => {
      if (!chart) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-scale-in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(chart);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulação de atualização de dados
    setTimeout(() => setLoading(false), 1000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dashboard de Tickets
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-600 flex items-center gap-2">
                <span>{greeting}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {now.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
              
              {/* Informação de próxima atualização */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm">
                <FiCalendar className="text-xs" />
                <span>Actualização: 09/01/2026 14:00</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>

        {/* Banner de boas-vindas e próxima atualização */}
        <div className="mt-4 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white rounded-xl p-4 md:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold mb-1">
                Bem-vindo(a) ao Sistema de Gestão de Suporte Técnico
              </h2>
              <p className="text-sm opacity-90">
                Acompanhe em tempo real todos os tickets, estatísticas e métricas do sistema
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="text-center md:text-right">
                <p className="text-sm opacity-90 mb-1">Próxima actualização do sistema agendada para:</p>
                <p className="font-bold text-lg">09/01/2026 14:00</p>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">Contagem regressiva:</span>
                <div className="px-3 py-1 bg-white/20 rounded-lg font-mono font-bold">
                  {countdown}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          {
            title: 'Total de Tickets',
            value: stats.total || 0,
            change: stats.growth > 0 ? `+${stats.growth}` : '0',
            icon: <FiActivity className="text-2xl" />,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            description: 'Total de tickets no sistema'
          },
          {
            title: 'Tickets Activos',
            value: stats.active || 0,
            change: 'Atenção imediata',
            icon: <FiAlertCircle className="text-2xl" />,
            color: 'from-red-500 to-orange-500',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            description: 'Tickets abertos e pendentes'
          },
          {
            title: 'Tickets Alocados',
            value: stats.alocados || 0,
            change: 'Em processamento',
            icon: <FiClock className="text-2xl" />,
            color: 'from-amber-500 to-yellow-500',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            description: 'Tickets atribuídos a técnicos'
          },
          {
            title: 'Tickets Fechados',
            value: stats.closed || 0,
            change: `${stats.activity}% concluído`,
            icon: <FiCheckCircle className="text-2xl" />,
            color: 'from-green-600 to-emerald-500',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'Tickets resolvidos e fechados'
          }
        ].map((card, index) => (
          <div
            key={index}
            ref={el => cardRefs.current[index] = el}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-gray-900 to-transparent" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <div className={card.iconColor}>
                    {card.icon}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {card.change}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs text-gray-400 mb-3">{card.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${card.color} transition-all duration-700`}
                  style={{ width: `${(card.value / (stats.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de barras - Tickets por mês */}
        <div 
          ref={el => chartRefs.current[0] = el}
          className="bg-white rounded-2xl shadow-lg p-6 opacity-0 transition-opacity duration-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tickets por Mês</h3>
              <p className="text-sm text-gray-500">Evolução mensal de tickets</p>
            </div>
            <FiBarChart2 className="text-gray-400 text-xl" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  name="Tickets"
                  stroke={BRAND_GREEN} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: BRAND_GREEN, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  name="Crescimento %"
                  stroke="#f97316" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de pizza - Status dos tickets */}
        <div 
          ref={el => chartRefs.current[1] = el}
          className="bg-white rounded-2xl shadow-lg p-6 opacity-0 transition-opacity duration-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Distribuição por Status</h3>
              <p className="text-sm text-gray-500">Estado actual dos tickets</p>
            </div>
            <FiPieChart className="text-gray-400 text-xl" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Activos', value: stats.active, color: CHART_COLORS.active },
                    { name: 'Alocados', value: stats.alocados, color: CHART_COLORS.alocados },
                    { name: 'Fechados', value: stats.closed, color: CHART_COLORS.closed }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[
                    { name: 'Activos', value: stats.active },
                    { name: 'Alocados', value: stats.alocados },
                    { name: 'Fechados', value: stats.closed }
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[CHART_COLORS.active, CHART_COLORS.alocados, CHART_COLORS.closed][index]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Províncias */}
        <div 
          ref={el => chartRefs.current[2] = el}
          className="bg-white rounded-2xl shadow-lg p-6 opacity-0 transition-opacity duration-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top 5 Províncias</h3>
              <p className="text-sm text-gray-500">Mais solicitações por província</p>
            </div>
            <FiMapPin className="text-gray-400 text-xl" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Tickets"
                  radius={[4, 4, 0, 0]}
                >
                  {provinceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.provinces[index]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Departamentos */}
        <div 
          ref={el => chartRefs.current[3] = el}
          className="bg-white rounded-2xl shadow-lg p-6 opacity-0 transition-opacity duration-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top 5 Departamentos</h3>
              <p className="text-sm text-gray-500">Departamentos com mais tickets</p>
            </div>
            <FiUsers className="text-gray-400 text-xl" />
          </div>
          
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <span className="text-sm font-bold text-gray-900">{dept.value} tickets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-[#106a37] to-[#2e8b57] transition-all duration-500 group-hover:scale-y-125"
                    style={{ 
                      width: `${(dept.value / Math.max(...departmentData.map(d => d.value))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Tickets Recentes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Tickets Recentes</h3>
            <p className="text-sm text-gray-500">Últimos tickets registados no sistema</p>
          </div>
          <Link
            to="/tickets"
            className="px-4 py-2 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
          >
            Ver Todos
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Província</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.slice(0, 5).map((ticket) => (
                <tr 
                  key={ticket.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {/* Navegar para detalhes do ticket */}}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-gray-900">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{ticket.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{ticket.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{ticket.province}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === 'Activo' 
                        ? 'bg-red-100 text-red-800' 
                        : ticket.status === 'Alocados' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informação sobre Como Usar o Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Como Usar o Sistema */}
        <div className="bg-gradient-to-br from-[#106a37] to-[#0d5a2c] rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiInfo className="text-2xl" />
            <h3 className="text-xl font-bold">Como Usar o Sistema</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 rounded-xl">
              <p className="font-semibold mb-2">1. Emitir Novo Ticket</p>
              <p className="text-sm opacity-90">
                Para abrir um novo pedido de suporte, vá para a opção "Emitir Ticket" no aplicativo Mobile.
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <p className="font-semibold mb-2">2. Acompanhar Tickets</p>
              <p className="text-sm opacity-90">
                Verifique o status dos seus tickets na seção "Listar Tickets" para acompanhar o progresso.
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <p className="font-semibold mb-2">3. Visualizar Relatórios</p>
              <p className="text-sm opacity-90">
                Acesse estatísticas detalhadas sobre tickets e desempenho na seção "Relatórios".
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <p className="font-semibold mb-2">4. Atribuição de Tickets</p>
              <p className="text-sm opacity-90">
                Tickets são automaticamente alocados à equipa técnica apropriada para cada tipo de problema.
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas de Desempenho */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas de Desempenho</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Tempo Médio de Resposta</span>
                <span className="font-semibold text-gray-900">2h 30min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Taxa de Satisfação</span>
                <span className="font-semibold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Tickets Resolvidos</span>
                <span className="font-semibold text-gray-900">{stats.closed || 0}/{stats.total || 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-purple-500" 
                  style={{ width: `${((stats.closed || 0) / (stats.total || 1)) * 100}%` }} 
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tickets por Tipo</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Assistência: 60%</p>
                  <p className="text-sm font-semibold text-gray-900">Requisição: 40%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar estilos CSS para animações */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
        
        /* Efeito de pulso para contagem regressiva */
        .countdown-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
        
        /* Efeito de pulso suave para cards */
        .group:hover .pulse-effect {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;