import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiMail, 
  FiCalendar, 
  FiMenu, 
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiFileText,
  FiUsers
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTickets } from '../../contextos/TicketsContext.jsx';

const Header = ({ onToggleMenu, isMenuOpen, user, onLogout }) => {
  const [horaAtual, setHoraAtual] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { tickets } = useTickets();

  const searchTickets = useMemo(
    () =>
      tickets.map((t) => ({
        id: t.id,
        tipo: t.type,
        departamento: t.department,
        solicitante: t.requester,
        provincia: t.province,
        problema: t.problem,
        status: t.status,
        data: t.createdAt,
      })),
    [tickets]
  );

  const departamentosBusca = useMemo(() => {
    const m = {};
    tickets.forEach((t) => {
      const d = t.department || '—';
      m[d] = (m[d] || 0) + 1;
    });
    return Object.entries(m).map(([nome, c]) => ({ nome, tickets: c }));
  }, [tickets]);

  const estatisticasBusca = useMemo(() => {
    const total = tickets.length;
    const activos = tickets.filter((t) => t.status === 'Activo').length;
    const fechados = tickets.filter((t) => t.status === 'Fechado').length;
    return { total, activos, fechados };
  }, [tickets]);

  // Gerar saudação baseada no horário (fuso de Maputo, UTC+2)
  const getSaudacao = () => {
    const agora = new Date();
    // Ajustar para fuso horário de Maputo (UTC+2)
    const horaMaputo = new Date(agora.getTime() + (2 * 60 * 60 * 1000));
    const hora = horaMaputo.getUTCHours();
    
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Formatar hora atual
  const formatarHora = () => {
    const agora = new Date();
    // Ajustar para fuso horário de Maputo (UTC+2)
    const horaMaputo = new Date(agora.getTime() + (2 * 60 * 60 * 1000));
    
    return horaMaputo.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  // Atualizar hora e saudação
  useEffect(() => {
    const atualizarHora = () => {
      const horaFormatada = formatarHora();
      setHoraAtual(horaFormatada);
    };

    atualizarHora();
    const interval = setInterval(atualizarHora, 60000);

    // Carregar notificações relacionadas a tickets
    const carregarNotificacoes = () => {
      const notifs = [
        {
          id: 1,
          tipo: 'alerta',
          titulo: 'Novo Ticket Criado',
          mensagem: 'Ticket T-1021 criado por Elton Matsinhe - Problema: VPN não conecta',
          tempo: 'Há 5 minutos',
          lida: false,
          icon: FiFileText,
          ticketId: 'T-1021',
          prioridade: 'alta'
        },
        {
          id: 2,
          tipo: 'info',
          titulo: 'Ticket Atribuído',
          mensagem: 'Ticket T-1020 atribuído ao técnico responsável',
          tempo: 'Há 2 horas',
          lida: false,
          icon: FiUsers,
          ticketId: 'T-1020',
          prioridade: 'media'
        },
        {
          id: 3,
          tipo: 'sucesso',
          titulo: 'Ticket Resolvido',
          mensagem: 'Ticket T-1019 marcado como fechado por Rafael Mabjaia',
          tempo: 'Ontem',
          lida: true,
          icon: FiCheckCircle,
          ticketId: 'T-1019',
          prioridade: 'baixa'
        },
        {
          id: 4,
          tipo: 'alerta',
          titulo: 'Ticket Expirado',
          mensagem: 'Ticket T-1018 excedeu o tempo de resposta - Status: Activo há 48h',
          tempo: '2 dias atrás',
          lida: true,
          icon: FiAlertTriangle,
          ticketId: 'T-1018',
          prioridade: 'critica'
        },
        {
          id: 5,
          tipo: 'info',
          titulo: 'Relatório Gerado',
          mensagem: 'Relatório de tickets do mês de Dezembro disponível para download',
          tempo: 'Há 3 dias',
          lida: true,
          icon: FiDownload,
          ticketId: null,
          prioridade: null
        },
        {
          id: 6,
          tipo: 'info',
          titulo: 'SLA Atingido',
          mensagem: 'Taxa de resolução dentro do SLA este mês: 92%',
          tempo: 'Há 4 dias',
          lida: true,
          icon: FiTrendingUp,
          ticketId: null,
          prioridade: null
        }
      ];
      setNotificacoes(notifs);
    };

    carregarNotificacoes();

    return () => clearInterval(interval);
  }, []);

  // Fechar menus quando clicar fora
  useEffect(() => {
    const fecharMenus = (e) => {
      if (!e.target.closest('.notificacoes-menu') && !e.target.closest('.notificacoes-btn')) {
        setMostrarNotificacoes(false);
      }
      if (!e.target.closest('.usuario-menu') && !e.target.closest('.usuario-btn')) {
        setMostrarMenuUsuario(false);
      }
      if (!e.target.closest('.busca-menu') && !e.target.closest('.busca-input')) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('click', fecharMenus);
    return () => document.removeEventListener('click', fecharMenus);
  }, []);

  // Função de busca dinâmica em tickets
  const handleBusca = (e) => {
    const valor = e.target.value;
    setBusca(valor);
    
    if (valor.trim() === '') {
      setResultadosBusca([]);
      setMostrarResultados(false);
      return;
    }
    
    // Buscar em tickets, departamentos e problemas
    const resultados = [];
    
    // Buscar em tickets por ID
    searchTickets.forEach(ticket => {
      if (ticket.id.toLowerCase().includes(valor.toLowerCase()) ||
          ticket.solicitante.toLowerCase().includes(valor.toLowerCase()) ||
          ticket.problema.toLowerCase().includes(valor.toLowerCase()) ||
          ticket.departamento.toLowerCase().includes(valor.toLowerCase()) ||
          ticket.provincia.toLowerCase().includes(valor.toLowerCase()) ||
          ticket.status.toLowerCase().includes(valor.toLowerCase())) {
        
        resultados.push({
          tipo: 'ticket',
          id: ticket.id,
          titulo: `Ticket ${ticket.id}`,
          descricao: `${ticket.tipo} - ${ticket.problema}`,
          detalhes: `Solicitante: ${ticket.solicitante} | Status: ${ticket.status}`,
          icon: FiFileText,
          cor: ticket.status === 'Activo' ? 'red' : (ticket.status === 'Alocados' || ticket.status === 'Em andamento') ? 'orange' : 'green'
        });
      }
    });
    
    // Buscar em departamentos
    departamentosBusca.forEach(dept => {
      if (dept.nome.toLowerCase().includes(valor.toLowerCase())) {
        resultados.push({
          tipo: 'departamento',
          id: dept.nome,
          titulo: `Departamento ${dept.nome}`,
          descricao: `${dept.tickets} tickets ativos`,
          detalhes: 'Visualizar tickets do departamento',
          icon: FiUsers,
          cor: 'blue'
        });
      }
    });
    
    // Buscar estatísticas
    if (valor.toLowerCase().includes('estatística') || 
        valor.toLowerCase().includes('ticket') || 
        valor.toLowerCase().includes('total')) {
      resultados.push({
        tipo: 'estatistica',
        id: 'estatisticas',
        titulo: 'Estatísticas Gerais',
        descricao: `${estatisticasBusca.total} tickets total`,
        detalhes: `${estatisticasBusca.activos} activos, ${estatisticasBusca.fechados} fechados`,
        icon: FiTrendingUp,
        cor: 'purple'
      });
    }
    
    setResultadosBusca(resultados);
    setMostrarResultados(resultados.length > 0);
  };

  // Executar busca com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && busca.trim()) {
      if (resultadosBusca.length > 0) {
        // Navegar para o primeiro resultado
        const primeiroResultado = resultadosBusca[0];
        if (primeiroResultado.tipo === 'ticket') {
          navigate(`/listar?busca=${encodeURIComponent(busca)}&ticket=${primeiroResultado.id}`);
        } else if (primeiroResultado.tipo === 'departamento') {
          navigate(`/listar?departamento=${encodeURIComponent(primeiroResultado.id)}`);
        } else {
          navigate(`/relatorios`);
        }
      } else {
        navigate(`/listar?busca=${encodeURIComponent(busca)}`);
      }
      setMostrarResultados(false);
    }
  };

  // Limpar busca
  const limparBusca = () => {
    setBusca('');
    setResultadosBusca([]);
    setMostrarResultados(false);
  };

  // Marcar notificação como lida
  const marcarComoLida = (id) => {
    setNotificacoes(notificacoes.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map(notif => ({ ...notif, lida: true })));
  };

  // Excluir notificação
  const excluirNotificacao = (id) => {
    setNotificacoes(notificacoes.filter(notif => notif.id !== id));
  };

  // Excluir todas as notificações
  const excluirTodasNotificacoes = () => {
    if (window.confirm('Tem certeza que deseja excluir todas as notificações?')) {
      setNotificacoes([]);
      setMostrarNotificacoes(false);
    }
  };

  // Navegar para ticket a partir da notificação
  const verTicket = (ticketId) => {
    if (ticketId) {
      navigate(`/listar?ticket=${ticketId}`);
      setMostrarNotificacoes(false);
    }
  };

  // Contar notificações não lidas
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  // Logout
  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      onLogout?.();
      navigate('/login', { replace: true });
    }
  };

  // Toggle menu lateral
  const toggleMenu = () => {
    if (onToggleMenu) {
      onToggleMenu();
    }
  };

  // Função para determinar a cor baseada no tipo
  const getCorPorTipo = (tipo) => {
    switch(tipo) {
      case 'sucesso':
        return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' };
      case 'alerta':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' };
      case 'info':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500' };
    }
  };

  // Formatar tempo de notificação
  const formatarTempoNotificacao = (tempoTexto) => {
    return tempoTexto;
  };

  // Cor por prioridade do ticket
  const getCorPorPrioridade = (prioridade) => {
    switch(prioridade) {
      case 'critica':
        return 'bg-red-100 text-red-600 border-red-500';
      case 'alta':
        return 'bg-orange-100 text-orange-600 border-orange-500';
      case 'media':
        return 'bg-yellow-100 text-yellow-600 border-yellow-500';
      case 'baixa':
        return 'bg-blue-100 text-blue-600 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-500';
    }
  };

  // Navegar para resultado da busca
  const handleResultadoClick = (resultado) => {
    if (resultado.tipo === 'ticket') {
      navigate(`/listar?ticket=${resultado.id}`);
    } else if (resultado.tipo === 'departamento') {
      navigate(`/listar?departamento=${resultado.id}`);
    } else {
      navigate('/relatorios');
    }
    setBusca('');
    setMostrarResultados(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Botão de Menu e Saudação */}
        <div className="flex items-center gap-4">
          {/* Botão para abrir/fechar menu lateral (mobile) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
            aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5 text-gray-600" />
            ) : (
              <FiMenu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Botão para ocultar/mostrar menu em desktop */}
          <button
            onClick={toggleMenu}
            className="hidden lg:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMenuOpen ? "Ocultar Menu" : "Mostrar Menu"}
            aria-label={isMenuOpen ? "Ocultar Menu" : "Mostrar Menu"}
          >
            {isMenuOpen ? (
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-sm text-gray-600 hidden xl:inline">
              {isMenuOpen ? 'Ocultar Menu' : 'Mostrar Menu'}
            </span>
          </button>

          {/* Saudação e Hora */}
          <div className="text-left">
            <p className="text-lg font-semibold text-gray-800">
              {getSaudacao()},{' '}
              <span className="text-[#106a37]">{user?.nome || 'Utilizador'}</span>
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="text-[#106a37] font-medium">{horaAtual}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Fuso Horário de Maputo</span>
            </p>
          </div>
        </div>

        {/* Busca Dinâmica para Tickets */}
        <div className="flex-1 max-w-md hidden md:block mx-4 lg:mx-8">
          <div className="relative busca-menu">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busca}
              onChange={handleBusca}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (busca.trim() && resultadosBusca.length > 0) {
                  setMostrarResultados(true);
                }
              }}
              placeholder="Buscar tickets, departamentos, problemas..."
              className="busca-input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
              aria-label="Buscar tickets e departamentos"
            />
            {busca && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown de resultados da busca */}
            {mostrarResultados && resultadosBusca.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-sm">Resultados da Busca</h3>
                    <span className="text-xs text-gray-500">{resultadosBusca.length} resultado(s)</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {resultadosBusca.map((resultado, index) => {
                    const Icon = resultado.icon;
                    const corClass = resultado.cor === 'red' ? 'text-red-600 bg-red-50' :
                                     resultado.cor === 'green' ? 'text-green-600 bg-green-50' :
                                     resultado.cor === 'orange' ? 'text-orange-600 bg-orange-50' :
                                     resultado.cor === 'blue' ? 'text-blue-600 bg-blue-50' : 
                                     'text-purple-600 bg-purple-50';
                    
                    return (
                      <button
                        key={`${resultado.id}-${index}`}
                        onClick={() => handleResultadoClick(resultado)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                      >
                        <div className={`p-2 rounded-lg ${corClass} flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800 truncate">{resultado.titulo}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${corClass}`}>
                              {resultado.tipo === 'ticket' ? 'Ticket' : 
                               resultado.tipo === 'departamento' ? 'Departamento' : 'Estatística'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{resultado.descricao}</p>
                          <p className="text-xs text-gray-500 mt-1">{resultado.detalhes}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      navigate(`/listar?busca=${encodeURIComponent(busca)}`);
                      setMostrarResultados(false);
                    }}
                    className="w-full text-center text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium py-2 hover:bg-[#106a37]/5 rounded-lg transition-colors"
                  >
                    Ver todos os resultados
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Busca Mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => navigate('/listar')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Buscar tickets"
              aria-label="Buscar tickets"
            >
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Notificações de Tickets */}
          <div className="relative">
            <button 
              onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
              className="notificacoes-btn relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Notificações de Tickets"
              aria-label="Notificações de Tickets"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {notificacoesNaoLidas > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificacoesNaoLidas}
                  </span>
                </>
              )}
            </button>

            {/* Dropdown de Notificações */}
            {mostrarNotificacoes && (
              <div className="notificacoes-menu absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-lg">Notificações de Tickets</h3>
                    <div className="flex items-center gap-2">
                      {notificacoesNaoLidas > 0 && (
                        <button
                          onClick={marcarTodasComoLidas}
                          className="text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium px-2 py-1 hover:bg-[#106a37]/5 rounded transition-colors"
                        >
                          Marcar todas
                        </button>
                      )}
                      {notificacoes.length > 0 && (
                        <button
                          onClick={excluirTodasNotificacoes}
                          className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                        >
                          Limpar
                        </button>
                      )}
                      <button
                        onClick={() => setMostrarNotificacoes(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Fechar notificações"
                        aria-label="Fechar notificações"
                      >
                        <FiX className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {notificacoes.length} notificaçõe(s) • {notificacoesNaoLidas} não lida(s)
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notificacoes.map((notif) => {
                        const Icon = notif.icon;
                        const cor = getCorPorTipo(notif.tipo);
                        
                        return (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 ${notif.lida ? 'border-transparent opacity-75' : cor.border}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${cor.bg} ${cor.text} flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-medium text-gray-800 truncate">{notif.titulo}</p>
                                  <div className="flex items-center gap-2">
                                    {notif.prioridade && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCorPorPrioridade(notif.prioridade)}`}>
                                        {notif.prioridade === 'critica' ? 'Crítica' :
                                         notif.prioridade === 'alta' ? 'Alta' :
                                         notif.prioridade === 'media' ? 'Média' : 'Baixa'}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {formatarTempoNotificacao(notif.tempo)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.mensagem}</p>
                                <div className="flex gap-2 mt-2">
                                  {notif.ticketId && (
                                    <button
                                      onClick={() => verTicket(notif.ticketId)}
                                      className="text-xs text-[#106a37] hover:text-[#0d5a2c] font-medium px-2 py-1 hover:bg-[#106a37]/5 rounded transition-colors"
                                    >
                                      Ver Ticket
                                    </button>
                                  )}
                                  {!notif.lida && (
                                    <button
                                      onClick={() => marcarComoLida(notif.id)}
                                      className="text-xs text-gray-600 hover:text-gray-700 font-medium px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      Marcar lida
                                    </button>
                                  )}
                                  <button
                                    onClick={() => excluirNotificacao(notif.id)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Nenhuma notificação</p>
                      <p className="text-sm text-gray-400 mt-1">As notificações de tickets aparecerão aqui</p>
                    </div>
                  )}
                </div>

                {notificacoes.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => {
                        navigate('/relatorios');
                        setMostrarNotificacoes(false);
                      }}
                      className="w-full text-center text-sm text-[#106a37] hover:text-[#0d5a2c] font-medium py-2 hover:bg-[#106a37]/5 rounded-lg transition-colors"
                    >
                      Ver relatório de atividades
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="relative">
            <div 
              onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
              className="usuario-btn flex items-center gap-3 cursor-pointer"
              aria-label="Menu do usuário"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
                  {user?.nome || 'Conta'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">
                  {user?.email || ''}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#106a37] to-[#0d5a2c] flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow shadow-md hover:shadow-xl">
                <FiUser className="w-5 h-5" />
              </div>
            </div>

            {/* Dropdown do Usuário */}
            {mostrarMenuUsuario && (
              <div className="usuario-menu absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user?.nome || 'Conta'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => setMostrarMenuUsuario(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Fechar menu"
                    aria-label="Fechar menu"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/perfil');
                      setMostrarMenuUsuario(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#106a37]/10 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-[#106a37]" />
                    </div>
                    <div>
                      <p className="font-medium">Meu Perfil</p>
                      <p className="text-xs text-gray-500">Editar informações</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/configuracoes');
                      setMostrarMenuUsuario(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#106a37]/10 flex items-center justify-center">
                      <FiSettings className="w-4 h-4 text-[#106a37]" />
                    </div>
                    <div>
                      <p className="font-medium">Configurações</p>
                      <p className="text-xs text-gray-500">Ajustes do sistema</p>
                    </div>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="px-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FiLogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sair</p>
                      <p className="text-xs text-red-500">Encerrar sessão</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Busca Mobile (Full Width quando ativa) */}
      {busca && (
        <div className="md:hidden px-4 pb-4 animate-slide-down busca-menu">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={busca}
              onChange={handleBusca}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (busca.trim() && resultadosBusca.length > 0) {
                  setMostrarResultados(true);
                }
              }}
              placeholder="Digite para buscar tickets..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106a37] focus:border-transparent transition-all"
            />
            <button
              onClick={limparBusca}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpar busca"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          
          {/* Resultados da busca mobile */}
          {mostrarResultados && resultadosBusca.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              <div className="px-3 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Resultados da Busca</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {resultadosBusca.slice(0, 3).map((resultado, index) => (
                  <button
                    key={`mobile-${resultado.id}-${index}`}
                    onClick={() => handleResultadoClick(resultado)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <div className={`p-1.5 rounded ${resultado.cor === 'red' ? 'bg-red-100 text-red-600' :
                                                   resultado.cor === 'green' ? 'bg-green-100 text-green-600' :
                                                   resultado.cor === 'orange' ? 'bg-orange-100 text-orange-600' :
                                                   resultado.cor === 'blue' ? 'bg-blue-100 text-blue-600' : 
                                                   'bg-purple-100 text-purple-600'}`}>
                      <resultado.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{resultado.titulo}</p>
                      <p className="text-xs text-gray-600 truncate">{resultado.descricao}</p>
                    </div>
                  </button>
                ))}
              </div>
              {resultadosBusca.length > 3 && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      navigate(`/listar?busca=${encodeURIComponent(busca)}`);
                      setMostrarResultados(false);
                    }}
                    className="w-full text-center text-xs text-[#106a37] hover:text-[#0d5a2c] font-medium py-1.5"
                  >
                    Ver todos os {resultadosBusca.length} resultados
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;