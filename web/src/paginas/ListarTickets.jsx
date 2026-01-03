import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiFileText,
  FiTag,
  FiMessageSquare,
  FiInfo,
  FiUser,
  FiBriefcase,
  FiTool,
  FiMail,
  FiPhone,
  FiGlobe
} from 'react-icons/fi';
import { 
  FiCheckSquare,
  FiSquare
} from 'react-icons/fi';

// Cores da marca
const BRAND_GREEN = '#106a37';
const BRAND_GREEN_LIGHT = '#2e8b57';

// Dados mock de tickets (15 tickets para paginação)
const initialTicketsData = [
  { 
    id: 'T-1021', 
    type: 'Assistência', 
    department: 'Departamento de IT', 
    requester: 'Elton Matsinhe', 
    province: 'Maputo Cidade', 
    problem: 'VPN não conecta', 
    status: 'Activo', 
    createdAt: '2025-12-14T09:10:00Z', 
    description: 'Problema de conexão VPN para acesso remoto aos servidores da empresa. O colaborador não consegue aceder aos recursos internos desde às 08:30.', 
    observation: 'Precisa ser resolvido antes das 14h para reunião importante com clientes internacionais.',
    assignedTo: null,
    closedAt: null,
    email: 'elton.matsinhe@imperialinsurance-mz.com',
    phone: '+258 841 644 096',
    priority: 'Alta',
    category: 'Rede'
  },
  { 
    id: 'T-1020', 
    type: 'Requisição', 
    department: 'Comercial', 
    requester: 'Clara Uamusse', 
    province: 'Sofala', 
    problem: 'Requisição de portátil', 
    status: 'Alocados', 
    createdAt: '2025-12-13T15:35:00Z', 
    description: 'Solicitação de laptop novo modelo Dell Latitude 5540 para viagens de trabalho. Especificações: i7, 16GB RAM, SSD 512GB, tela Full HD.', 
    observation: 'Modelo leve para viagens frequentes. Necessário até final do mês.',
    assignedTo: 'Antonio Zimila',
    assignedAt: '2025-12-13T16:20:00Z',
    closedAt: null,
    email: 'clara.uamusse@imperialinsurance-mz.com',
    phone: '+258 842 123 456',
    priority: 'Média',
    category: 'Hardware'
  },
  { 
    id: 'T-1019', 
    type: 'Assistência', 
    department: 'Sinistro', 
    requester: 'Rafael Mabjaia', 
    province: 'Nampula', 
    problem: 'Erro no ERP', 
    status: 'Fechado', 
    createdAt: '2025-12-12T11:50:00Z', 
    description: 'Erro no sistema ERP ao processar sinistros - mensagem "Erro de conexão com base de dados" aparece quando tenta gerar relatórios semanais.', 
    observation: 'Corrigido com patch de atualização. Backup realizado antes da intervenção.',
    assignedTo: 'Octavio Manhiça',
    assignedAt: '2025-12-12T12:30:00Z',
    closedAt: '2025-12-12T15:45:00Z',
    email: 'rafael.mabjaia@imperialinsurance-mz.com',
    phone: '+258 843 789 012',
    priority: 'Alta',
    category: 'Software'
  },
  { 
    id: 'T-1018', 
    type: 'Assistência', 
    department: 'RH', 
    requester: 'Sílvia Macuácua', 
    province: 'Maputo Cidade', 
    problem: 'Email bloqueado', 
    status: 'Activo', 
    createdAt: '2025-12-12T09:30:00Z', 
    description: 'Conta de email corporativo bloqueada por suspeita de atividade de phishing. Sistema de segurança detectou envio massivo de emails não autorizados.', 
    observation: 'Urgente - precisa acessar email para reunião às 10h com diretoria. Já verificada autenticidade do usuário.',
    assignedTo: null,
    closedAt: null,
    email: 'silvia.macuacua@imperialinsurance-mz.com',
    phone: '+258 844 345 678',
    priority: 'Crítica',
    category: 'Segurança'
  },
  { 
    id: 'T-1017', 
    type: 'Requisição', 
    department: 'Contabilidade', 
    requester: 'Maria João', 
    province: 'Gaza', 
    problem: 'Software contabilístico', 
    status: 'Fechado', 
    createdAt: '2025-12-11T14:20:00Z', 
    description: 'Atualização de software contabilístico para versão 2026. Necessária instalação e migração de dados dos últimos 5 anos.', 
    observation: 'Concluído com sucesso. Backup verificado e treinamento realizado com a equipa.',
    assignedTo: 'Edna Mavie',
    assignedAt: '2025-12-11T14:45:00Z',
    closedAt: '2025-12-11T17:30:00Z',
    email: 'maria.joao@imperialinsurance-mz.com',
    phone: '+258 845 901 234',
    priority: 'Média',
    category: 'Software'
  },
  { 
    id: 'T-1016', 
    type: 'Assistência', 
    department: 'Risco e Conformidade', 
    requester: 'Jorge Tembe', 
    province: 'Maputo Província', 
    problem: 'Acesso ao sistema', 
    status: 'Alocados', 
    createdAt: '2025-12-10T11:15:00Z', 
    description: 'Problema de acesso ao sistema de compliance para geração de relatórios trimestrais. Credenciais não funcionam após alteração de senha.', 
    observation: 'Atribuído à equipa de segurança para verificação de permissões.',
    assignedTo: 'Cremildo Dava',
    assignedAt: '2025-12-10T11:45:00Z',
    closedAt: null,
    email: 'jorge.tembe@imperialinsurance-mz.com',
    phone: '+258 846 567 890',
    priority: 'Alta',
    category: 'Segurança'
  },
  { 
    id: 'T-1015', 
    type: 'Requisição', 
    department: 'Subscrição', 
    requester: 'Paulo Sitoi', 
    province: 'Inhambane', 
    problem: 'Equipamento novo', 
    status: 'Activo', 
    createdAt: '2025-12-09T14:45:00Z', 
    description: 'Solicitação de equipamento de escritório: 2 monitores 24", teclado e mouse sem fio, e cadeira ergonómica para nova contratação.', 
    observation: 'Orçamento aprovado pelo departamento financeiro.',
    assignedTo: null,
    closedAt: null,
    email: 'paulo.sitoi@imperialinsurance-mz.com',
    phone: '+258 847 123 789',
    priority: 'Baixa',
    category: 'Hardware'
  },
  { 
    id: 'T-1014', 
    type: 'Assistência', 
    department: 'Crédit Control', 
    requester: 'Luísa Cuambe', 
    province: 'Sofala', 
    problem: 'Problema de impressora', 
    status: 'Fechado', 
    createdAt: '2025-12-08T10:20:00Z', 
    description: 'Impressora HP LaserJet não responde na rede do departamento. Apresenta erro de conexão constante.', 
    observation: 'Substituída por novo equipamento. Impressora antiga enviada para manutenção.',
    assignedTo: 'Elton Matsinhe',
    assignedAt: '2025-12-08T11:10:00Z',
    closedAt: '2025-12-08T16:30:00Z',
    email: 'luisa.cuambe@imperialinsurance-mz.com',
    phone: '+258 848 456 123',
    priority: 'Média',
    category: 'Hardware'
  },
  { 
    id: 'T-1013', 
    type: 'Assistência', 
    department: 'Júridico', 
    requester: 'Tatiana Cumbe', 
    province: 'Maputo Cidade', 
    problem: 'Acesso à base de dados', 
    status: 'Alocados', 
    createdAt: '2025-12-07T16:30:00Z', 
    description: 'Restrições de acesso à base de dados legal. Permissões insuficientes para consultar processos recentes.', 
    observation: 'Em análise pela equipa de segurança. Necessária aprovação do diretor jurídico.',
    assignedTo: 'Octavio Manhiça',
    assignedAt: '2025-12-08T09:15:00Z',
    closedAt: null,
    email: 'tatiana.cumbe@imperialinsurance-mz.com',
    phone: '+258 849 789 456',
    priority: 'Alta',
    category: 'Segurança'
  },
  { 
    id: 'T-1012', 
    type: 'Requisição', 
    department: 'Comercial', 
    requester: 'Bento Dique', 
    province: 'Manica', 
    problem: 'Software CRM', 
    status: 'Activo', 
    createdAt: '2025-12-06T09:15:00Z', 
    description: 'Licenciamento de software CRM adicional para nova equipa comercial. 5 novas licenças necessárias.', 
    observation: 'Aguardando aprovação financeira. Orçamento enviado para análise.',
    assignedTo: null,
    closedAt: null,
    email: 'bento.dique@imperialinsurance-mz.com',
    phone: '+258 850 123 456',
    priority: 'Média',
    category: 'Software'
  },
  { 
    id: 'T-1011', 
    type: 'Assistência', 
    department: 'RH', 
    requester: 'Nuno Quive', 
    province: 'Tete', 
    problem: 'Problema de rede', 
    status: 'Fechado', 
    createdAt: '2025-12-05T11:45:00Z', 
    description: 'Falha de rede no departamento de RH. Switch da sala apresenta luz vermelha e ninguém tem acesso à internet.', 
    observation: 'Resolvido - cabo de rede substituído. Testes de conexão realizados com sucesso.',
    assignedTo: 'Antonio Zimila',
    assignedAt: '2025-12-05T12:30:00Z',
    closedAt: '2025-12-05T15:20:00Z',
    email: 'nuno.quive@imperialinsurance-mz.com',
    phone: '+258 851 654 321',
    priority: 'Alta',
    category: 'Rede'
  },
  { 
    id: 'T-1010', 
    type: 'Assistência', 
    department: 'Departamento de IT', 
    requester: 'Antonio Zimila', 
    province: 'Zambézia', 
    problem: 'VPN não conecta', 
    status: 'Alocados', 
    createdAt: '2025-12-04T14:20:00Z', 
    description: 'Configuração de VPN para novo colaborador remoto. Sistema não aceita as credenciais fornecidas.', 
    observation: 'Em progresso. Contactado fornecedor de VPN para suporte técnico.',
    assignedTo: 'Edna Mavie',
    assignedAt: '2025-12-04T15:00:00Z',
    closedAt: null,
    email: 'antonio.zimila@imperialinsurance-mz.com',
    phone: '+258 852 987 654',
    priority: 'Média',
    category: 'Rede'
  },
  { 
    id: 'T-1009', 
    type: 'Requisição', 
    department: 'Contabilidade', 
    requester: 'Gerson Langa', 
    province: 'Nampula', 
    problem: 'Scanner documental', 
    status: 'Fechado', 
    createdAt: '2025-12-03T10:30:00Z', 
    description: 'Solicitação de scanner de alta resolução para digitalização de documentos fiscais. Scanner atual apresenta baixa qualidade.', 
    observation: 'Entregue e instalado. Treinamento realizado com equipa de contabilidade.',
    assignedTo: 'Cremildo Dava',
    assignedAt: '2025-12-03T11:15:00Z',
    closedAt: '2025-12-03T16:45:00Z',
    email: 'gerson.langa@imperialinsurance-mz.com',
    phone: '+258 853 321 987',
    priority: 'Baixa',
    category: 'Hardware'
  },
  { 
    id: 'T-1008', 
    type: 'Assistência', 
    department: 'Sinistro', 
    requester: 'Jéssica Uamusse', 
    province: 'Cabo Delgado', 
    problem: 'Erro no ERP', 
    status: 'Activo', 
    createdAt: '2025-12-02T13:15:00Z', 
    description: 'Erro ao gerar relatórios de sinistros no módulo de análise. Sistema apresenta mensagem de "Memória insuficiente".', 
    observation: 'Prioridade alta. Relatórios necessários para reunião com seguradora.',
    assignedTo: null,
    closedAt: null,
    email: 'jessica.uamusse@imperialinsurance-mz.com',
    phone: '+258 854 654 987',
    priority: 'Alta',
    category: 'Software'
  },
  { 
    id: 'T-1007', 
    type: 'Requisição', 
    department: 'Subscrição', 
    requester: 'Ângela Lázaro', 
    province: 'Niassa', 
    problem: 'Monitor adicional', 
    status: 'Alocados', 
    createdAt: '2025-12-01T08:45:00Z', 
    description: 'Solicitação de segundo monitor 27" para trabalho com múltiplas planilhas simultaneamente. Monitor atual é de 21".', 
    observation: 'Em processo de aquisição. Orçamento aprovado pelo gestor do departamento.',
    assignedTo: 'Elton Matsinhe',
    assignedAt: '2025-12-01T10:20:00Z',
    closedAt: null,
    email: 'angela.lazaro@imperialinsurance-mz.com',
    phone: '+258 855 789 123',
    priority: 'Baixa',
    category: 'Hardware'
  },
];

const ListarTickets = () => {
  const [tickets, setTickets] = useState(initialTicketsData);
  const [busca, setBusca] = useState('');
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [filtroProvincia, setFiltroProvincia] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [campoBusca, setCampoBusca] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('dataRecente');
  const [selecionados, setSelecionados] = useState([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  
  // Referências para animações
  const rowRefs = useRef([]);
  const modalRef = useRef();

  // Departamentos disponíveis
  const departamentos = [
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

  // Províncias de Moçambique
  const provincias = [
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

  // Tipos de ticket
  const tiposTicket = ['Assistência', 'Requisição'];

  // Função de formatação de data
  const formatDate = (dateString) => {
    if (!dateString) return { data: '--/--/----', hora: '--:--', completo: 'Não definida' };
    
    const date = new Date(dateString);
    return {
      data: date.toLocaleDateString('pt-MZ', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      hora: date.toLocaleTimeString('pt-MZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      completo: `${date.toLocaleDateString('pt-MZ')} às ${date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}`
    };
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Activo': return 'bg-red-100 text-red-800';
      case 'Alocados': return 'bg-amber-100 text-amber-800';
      case 'Fechado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Activo': return <FiAlertCircle className="inline mr-1" />;
      case 'Alocados': return <FiClock className="inline mr-1" />;
      case 'Fechado': return <FiCheckCircle className="inline mr-1" />;
      default: return <FiClock className="inline mr-1" />;
    }
  };

  // Função para obter cor da prioridade
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Crítica': return 'bg-red-600 text-white';
      case 'Alta': return 'bg-orange-500 text-white';
      case 'Média': return 'bg-yellow-500 text-white';
      case 'Baixa': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Função de filtragem
  const ticketsFiltrados = tickets
    .filter((ticket) => {
      // Filtro por busca
      if (busca) {
        const termoBusca = busca.toLowerCase();
        switch(campoBusca) {
          case 'id':
            return ticket.id.toLowerCase().includes(termoBusca);
          case 'solicitante':
            return ticket.requester.toLowerCase().includes(termoBusca);
          case 'problema':
            return ticket.problem.toLowerCase().includes(termoBusca);
          case 'descricao':
            return ticket.description.toLowerCase().includes(termoBusca);
          case 'todos':
          default:
            return (
              ticket.id.toLowerCase().includes(termoBusca) ||
              ticket.requester.toLowerCase().includes(termoBusca) ||
              ticket.problem.toLowerCase().includes(termoBusca) ||
              ticket.description.toLowerCase().includes(termoBusca) ||
              ticket.department.toLowerCase().includes(termoBusca) ||
              ticket.province.toLowerCase().includes(termoBusca)
            );
        }
      }
      return true;
    })
    .filter((ticket) => {
      // Filtro por status
      if (filtroStatus !== 'todos') {
        return ticket.status === filtroStatus;
      }
      return true;
    })
    .filter((ticket) => {
      // Filtro por departamento
      if (filtroDepartamento !== 'todos') {
        return ticket.department === filtroDepartamento;
      }
      return true;
    })
    .filter((ticket) => {
      // Filtro por província
      if (filtroProvincia !== 'todos') {
        return ticket.province === filtroProvincia;
      }
      return true;
    })
    .filter((ticket) => {
      // Filtro por tipo
      if (filtroTipo !== 'todos') {
        return ticket.type === filtroTipo;
      }
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      if (ordenacao === 'dataRecente') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (ordenacao === 'dataAntiga') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (ordenacao === 'id') {
        return b.id.localeCompare(a.id);
      }
      if (ordenacao === 'status') {
        return a.status.localeCompare(b.status);
      }
      if (ordenacao === 'departamento') {
        return a.department.localeCompare(b.department);
      }
      return 0;
    });

  // Paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const ticketsPaginados = ticketsFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(ticketsFiltrados.length / itensPorPagina);

  // Estatísticas
  const estatisticas = {
    total: ticketsFiltrados.length,
    ativos: ticketsFiltrados.filter(t => t.status === 'Activo').length,
    alocados: ticketsFiltrados.filter(t => t.status === 'Alocados').length,
    fechados: ticketsFiltrados.filter(t => t.status === 'Fechado').length,
  };

  // Efeitos de animação para linhas da tabela
  useEffect(() => {
    const observers = [];
    
    rowRefs.current.forEach(row => {
      if (!row) return;
      
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
      
      observer.observe(row);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [ticketsPaginados]);

  // Fechar modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarDetalhes(false);
      }
    };

    if (mostrarDetalhes) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarDetalhes]);

  // Selecionar/desselecionar todos
  const handleSelecionarTodos = () => {
    if (selecionarTodos) {
      setSelecionados([]);
    } else {
      setSelecionados(ticketsPaginados.map(t => t.id));
    }
    setSelecionarTodos(!selecionarTodos);
  };

  const handleSelecionarTicket = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(ticketId => ticketId !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  const handleVerDetalhes = (ticket) => {
    setTicketSelecionado(ticket);
    setMostrarDetalhes(true);
  };

  const handleExcluirTicket = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ticket?')) {
      setTickets(tickets.filter(ticket => ticket.id !== id));
      setSelecionados(selecionados.filter(ticketId => ticketId !== id));
    }
  };

  const handleExcluirSelecionados = () => {
    if (selecionados.length === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir ${selecionados.length} ticket(s) selecionado(s)?`)) {
      setTickets(tickets.filter(ticket => !selecionados.includes(ticket.id)));
      setSelecionados([]);
      setSelecionarTodos(false);
    }
  };

  const mudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroStatus('todos');
    setFiltroDepartamento('todos');
    setFiltroProvincia('todos');
    setFiltroTipo('todos');
    setOrdenacao('dataRecente');
    setCampoBusca('todos');
    setPaginaAtual(1);
    setSelecionados([]);
    setSelecionarTodos(false);
  };

  const exportarDados = () => {
    const dadosCSV = ticketsFiltrados.map(ticket => ({
      'ID': ticket.id,
      'Status': ticket.status,
      'Tipo': ticket.type,
      'Departamento': ticket.department,
      'Solicitante': ticket.requester,
      'Província': ticket.province,
      'Problema': ticket.problem,
      'Descrição': ticket.description,
      'Observação': ticket.observation || '',
      'Data Criação': formatDate(ticket.createdAt).completo
    }));

    const csv = [
      Object.keys(dadosCSV[0] || {}).join(','),
      ...dadosCSV.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Listar Tickets
            </h1>
            <p className="text-gray-600">
              Gerencie todos os tickets do sistema de suporte técnico
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportarDados}
              className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium border border-gray-200 group"
            >
              <FiDownload className="group-hover:scale-110 transition-transform" />
              Exportar
            </button>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium border border-gray-200 group"
            >
              <FiFilter className="group-hover:scale-110 transition-transform" />
              Filtros
            </button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total de Tickets', value: estatisticas.total, icon: <FiFileText />, color: 'bg-blue-50 text-blue-700' },
            { label: 'Activos', value: estatisticas.ativos, icon: <FiAlertCircle />, color: 'bg-red-50 text-red-700' },
            { label: 'Alocados', value: estatisticas.alocados, icon: <FiClock />, color: 'bg-amber-50 text-amber-700' },
            { label: 'Fechados', value: estatisticas.fechados, icon: <FiCheckCircle />, color: 'bg-green-50 text-green-700' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros Avançados */}
      {mostrarFiltros && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slide-down">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiFilter className="text-[#106a37]" />
              Filtros Avançados
            </h3>
            <div className="flex gap-2">
              <button
                onClick={limparFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm hover:scale-105 active:scale-95"
              >
                Limpar Todos
              </button>
              <button
                onClick={() => setMostrarFiltros(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Campo de Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiSearch />
                Buscar em
              </label>
              <select
                value={campoBusca}
                onChange={(e) => {
                  setCampoBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="todos">Todos os campos</option>
                <option value="id">ID do Ticket</option>
                <option value="solicitante">Nome do Solicitante</option>
                <option value="problema">Problema</option>
                <option value="descricao">Descrição</option>
              </select>
            </div>
            
            {/* Filtro Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiTag />
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => {
                  setFiltroStatus(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="todos">Todos os status</option>
                <option value="Activo">Activo</option>
                <option value="Alocados">Alocados</option>
                <option value="Fechado">Fechado</option>
              </select>
            </div>
            
            {/* Filtro Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiUsers />
                Departamento
              </label>
              <select
                value={filtroDepartamento}
                onChange={(e) => {
                  setFiltroDepartamento(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="todos">Todos departamentos</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiCalendar />
                Ordenar por
              </label>
              <select
                value={ordenacao}
                onChange={(e) => {
                  setOrdenacao(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="dataRecente">Mais recentes primeiro</option>
                <option value="dataAntiga">Mais antigos primeiro</option>
                <option value="id">ID do Ticket</option>
                <option value="status">Status</option>
                <option value="departamento">Departamento</option>
              </select>
            </div>
          </div>
          
          {/* Filtros Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Filtro Província */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiMapPin />
                Província
              </label>
              <select
                value={filtroProvincia}
                onChange={(e) => {
                  setFiltroProvincia(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="todos">Todas províncias</option>
                {provincias.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiFileText />
                Tipo de Ticket
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              >
                <option value="todos">Todos os tipos</option>
                {tiposTicket.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Busca e Ações */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Buscar ${campoBusca === 'todos' ? 'tickets...' : campoBusca === 'id' ? 'por ID do ticket...' : campoBusca === 'solicitante' ? 'por nome do solicitante...' : campoBusca === 'problema' ? 'por problema...' : 'por descrição...'}`}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all hover:border-gray-400"
              />
              {busca && (
                <button
                  onClick={() => setBusca('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {selecionados.length > 0 && (
              <button
                onClick={handleExcluirSelecionados}
                className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium border border-red-200 hover:scale-105 active:scale-95"
              >
                <FiTrash2 />
                Excluir ({selecionados.length})
              </button>
            )}
          </div>
        </div>
        
        {/* Filtros Ativos */}
        <div className="flex flex-wrap gap-2 mt-4">
          {busca && (
            <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
              Busca: "{busca}"
              <button onClick={() => setBusca('')} className="ml-1 hover:text-[#0d5a2c] hover:scale-125 transition-transform">
                <FiX size={14} />
              </button>
            </span>
          )}
          {filtroStatus !== 'todos' && (
            <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
              Status: {filtroStatus}
              <button onClick={() => setFiltroStatus('todos')} className="ml-1 hover:text-[#0d5a2c] hover:scale-125 transition-transform">
                <FiX size={14} />
              </button>
            </span>
          )}
          {filtroDepartamento !== 'todos' && (
            <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
              Departamento: {filtroDepartamento}
              <button onClick={() => setFiltroDepartamento('todos')} className="ml-1 hover:text-[#0d5a2c] hover:scale-125 transition-transform">
                <FiX size={14} />
              </button>
            </span>
          )}
          {filtroProvincia !== 'todos' && (
            <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
              Província: {filtroProvincia}
              <button onClick={() => setFiltroProvincia('todos')} className="ml-1 hover:text-[#0d5a2c] hover:scale-125 transition-transform">
                <FiX size={14} />
              </button>
            </span>
          )}
          {filtroTipo !== 'todos' && (
            <span className="bg-[#106a37]/10 text-[#106a37] px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
              Tipo: {filtroTipo}
              <button onClick={() => setFiltroTipo('todos')} className="ml-1 hover:text-[#0d5a2c] hover:scale-125 transition-transform">
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Tabela de Tickets */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-16">
                  <button
                    onClick={handleSelecionarTodos}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    {selecionarTodos ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-32">
                  <div className="flex items-center gap-2">
                    <FiTag />
                    ID
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-32">
                  <div className="flex items-center gap-2">
                    <FiTag />
                    Status
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <FiFileText />
                    Problema
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-48">
                  <div className="flex items-center gap-2">
                    <FiUsers />
                    Departamento
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-40">
                  <div className="flex items-center gap-2">
                    <FiUsers />
                    Solicitante
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-32">
                  <div className="flex items-center gap-2">
                    <FiMapPin />
                    Província
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-48">
                  <div className="flex items-center gap-2">
                    <FiCalendar />
                    Data Criação
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 w-32">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ticketsPaginados.length > 0 ? (
                ticketsPaginados.map((ticket, index) => (
                  <tr 
                    key={ticket.id} 
                    ref={el => rowRefs.current[index] = el}
                    className={`hover:bg-gray-50 transition-all duration-200 group opacity-0 ${selecionados.includes(ticket.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleSelecionarTicket(ticket.id)}
                        className="flex items-center hover:opacity-80 transition-opacity"
                      >
                        {selecionados.includes(ticket.id) ? 
                          <FiCheckSquare size={18} className="text-[#106a37]" /> : 
                          <FiSquare size={18} className="text-gray-400" />
                        }
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-[#106a37] transition-colors">
                          {ticket.problem}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.type === 'Assistência' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {ticket.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {ticket.department}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700 font-medium">{ticket.requester}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-gray-400" size={14} />
                        <p className="text-gray-700 font-medium">{ticket.province}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-700 font-medium">
                          {formatDate(ticket.createdAt).data}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(ticket.createdAt).hora}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerDetalhes(ticket)}
                          className="p-2 text-[#106a37] hover:bg-[#106a37]/10 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Ver Detalhes"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleExcluirTicket(ticket.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Excluir"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiFileText className="text-4xl mb-3 text-gray-300" />
                      <p className="text-lg font-medium">Nenhum ticket encontrado</p>
                      <p className="text-sm mt-1">
                        {busca || filtroStatus !== 'todos' || filtroDepartamento !== 'todos' ? 
                          'Tente ajustar os filtros de busca' : 
                          'Não há tickets registados no sistema'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {ticketsFiltrados.length > itensPorPagina && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{indexPrimeiroItem + 1}</span> a{' '}
                <span className="font-semibold">{Math.min(indexUltimoItem, ticketsFiltrados.length)}</span> de{' '}
                <span className="font-semibold">{ticketsFiltrados.length}</span> tickets
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className={`p-2 rounded-lg transition-all ${paginaAtual === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-[#106a37] hover:scale-110 active:scale-95'}`}
                >
                  <FiChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let paginaNumero;
                  if (totalPaginas <= 5) {
                    paginaNumero = i + 1;
                  } else if (paginaAtual <= 3) {
                    paginaNumero = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    paginaNumero = totalPaginas - 4 + i;
                  } else {
                    paginaNumero = paginaAtual - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => mudarPagina(paginaNumero)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${
                        paginaNumero === paginaAtual
                          ? 'bg-[#106a37] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#106a37]'
                      }`}
                    >
                      {paginaNumero}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                  className={`p-2 rounded-lg transition-all ${paginaAtual === totalPaginas ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-[#106a37] hover:scale-110 active:scale-95'}`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {mostrarDetalhes && ticketSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
          >
            {/* Cabeçalho do Modal */}
            <div className="bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Detalhes do Ticket</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-mono text-lg bg-white/20 px-3 py-1 rounded">
                      {ticketSelecionado.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticketSelecionado.status === 'Activo' ? 'bg-red-200 text-red-800' :
                      ticketSelecionado.status === 'Alocados' ? 'bg-amber-200 text-amber-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {ticketSelecionado.status}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      ticketSelecionado.type === 'Assistência' ? 'bg-blue-200 text-blue-800' : 
                      'bg-purple-200 text-purple-800'
                    }`}>
                      {ticketSelecionado.type}
                    </span>
                    {ticketSelecionado.priority && (
                      <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(ticketSelecionado.priority)}`}>
                        Prioridade: {ticketSelecionado.priority}
                      </span>
                    )}
                    {ticketSelecionado.category && (
                      <span className="text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-800">
                        {ticketSelecionado.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setMostrarDetalhes(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all hover:scale-110"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {/* Informações do Ticket */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiInfo className="text-[#106a37]" />
                    Informações do Ticket
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Problema</p>
                        <p className="text-lg font-medium text-gray-800">{ticketSelecionado.problem}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Descrição Detalhada</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-line">{ticketSelecionado.description}</p>
                        </div>
                      </div>
                      
                      {ticketSelecionado.observation && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Observações</p>
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <p className="text-amber-800 whitespace-pre-line">{ticketSelecionado.observation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tipo</p>
                          <p className="font-medium text-gray-800">{ticketSelecionado.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Categoria</p>
                          <p className="font-medium text-gray-800">{ticketSelecionado.category || 'Não definida'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Prioridade</p>
                          <p className="font-medium text-gray-800">{ticketSelecionado.priority || 'Não definida'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Departamento</p>
                          <p className="font-medium text-gray-800">{ticketSelecionado.department}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Província</p>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400" />
                          <p className="font-medium text-gray-800">{ticketSelecionado.province}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações do Solicitante */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="text-[#106a37]" />
                    Informações do Solicitante
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser className="text-gray-500" />
                        <p className="text-sm text-gray-500">Nome</p>
                      </div>
                      <p className="font-medium text-gray-800">{ticketSelecionado.requester}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBriefcase className="text-gray-500" />
                        <p className="text-sm text-gray-500">Departamento</p>
                      </div>
                      <p className="font-medium text-gray-800">{ticketSelecionado.department}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMail className="text-gray-500" />
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                      <p className="font-medium text-gray-800">{ticketSelecionado.email || 'Não informado'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiPhone className="text-gray-500" />
                        <p className="text-sm text-gray-500">Telefone</p>
                      </div>
                      <p className="font-medium text-gray-800">{ticketSelecionado.phone || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Histórico do Ticket */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiClock className="text-[#106a37]" />
                    Histórico do Ticket
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Ticket Criado</p>
                        <p className="text-sm text-gray-500">{formatDate(ticketSelecionado.createdAt).completo}</p>
                      </div>
                    </div>
                    
                    {ticketSelecionado.assignedTo && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Alocado para Técnico</p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">{ticketSelecionado.assignedTo}</span>
                            {ticketSelecionado.assignedAt && (
                              <> - {formatDate(ticketSelecionado.assignedAt).completo}</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {ticketSelecionado.closedAt && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Ticket Fechado</p>
                          <p className="text-sm text-gray-500">{formatDate(ticketSelecionado.closedAt).completo}</p>
                          {ticketSelecionado.createdAt && ticketSelecionado.closedAt && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              Tempo total de resolução: {Math.ceil((new Date(ticketSelecionado.closedAt) - new Date(ticketSelecionado.createdAt)) / (1000 * 60 * 60 * 24))} dias
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações de Suporte (Apenas visualização) */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiTool className="text-[#106a37]" />
                    Gestão do Ticket (via Mobile)
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      <strong>Nota:</strong> A gestão ativa deste ticket (alocação, fechamento, atualizações) 
                      é realizada exclusivamente através da aplicação móvel. Esta interface web serve apenas 
                      para visualização e consulta dos detalhes do ticket.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal - Apenas botão de fechar */}
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setMostrarDetalhes(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium hover:scale-105 active:scale-95"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animações */}
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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-fade-in-row {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ListarTickets;