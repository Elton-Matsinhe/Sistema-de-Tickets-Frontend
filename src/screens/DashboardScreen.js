import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Easing,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchTickets,
  fetchFormData,
  createTicketApi,
  alocarTicketApi,
  fecharTicketApi,
  deleteTicketApi,
} from '../services/api.js';
import {
  mapApiTicketToMobile,
  buildDepartmentsMap,
  tiposNomesPorCategoria,
} from '../utils/ticketMap.js';
import EmitirTicketScreen from './EmitirTicketScreen';
import ListarTicketsScreen from './ListarTicketsScreen';
import RelatoriosScreen from './RelatoriosScreen';
import LimparCacheScreen from './LimparCacheScreen';

const { width, height } = Dimensions.get('window');
const BRAND_GREEN = '#106a37';
const BRAND_GREEN_LIGHT = '#2e8b57';
const BRAND_GREEN_GLOW = 'rgba(16, 106, 55, 0.25)';
const DASHBOARD_BG = '#0b0d11';
const CARD_BG = '#111720';
const TEXT_MAIN = '#f6f7fb';
const TEXT_SECONDARY = '#c8d1dc';
const TEXT_LIGHT = '#9aa6b5';
const BORDER_COLOR = '#1f2733';
const CARD_SHADOW = 'rgba(0, 0, 0, 0.35)';

// Cores para os cards
const CARD_COLORS = {
  emitir: '#106a37',
  listar: '#22c55e',
  relatorios: '#0ea5e9',
  limpar: '#f97316',
};

// Fundos suaves para cada vista, harmonizados com as cores dos textos
const VIEW_BACKGROUND_COLORS = {
  home: DASHBOARD_BG,
  emitir: '#0e1218',
  listar: '#0f131a',
  relatorios: '#0d1117',
  limpar: '#0d0f13',
};

export const provinces = [
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
  'Niassa',
];

export const departments = {
  'Risco e Conformidade': [
    'Lara Muate',
    'Jorge Tembe',
    'Marta Nhantumbo',
    'Celso Mafuiane',
    'Rute Sitoe',
  ],
  Sinistro: [
    'Rafael Mabjaia',
    'Jéssica Uamusse',
    'Sandro Nhantumbo',
    'Tânia Tamele',
    'Beto Sumbana',
  ],
  'Credit Control': [
    'Luísa Cuambe',
    'Armando Mboa',
    'Gerson Langa',
    'Anabela Machava',
    'Nelson Zitha',
  ],
  Subscricao: [
    'Ângela Lázaro',
    'Paulo Sitoi',
    'Dina Nhacuongue',
    'Carlos Muianga',
    'Isabel Chongo',
  ],
  RH: [
    'Sílvia Macuácua',
    'Nuno Quive',
    'Sara Mondlane',
    'Ivandro Banze',
    'Helena Cossa',
  ],
  Comercial: [
    'Clara Uamusse',
    'Bento Dique',
    'Helio Bambo',
    'Vera Zavale',
    'Guilherme Massingue',
  ],
  IT: [
    'Edna Mavie',
    'Elton Matsinhe',
    'Antonio Zimila',
    'Octavio Manhiça',
    'Cremildo Dava',
  ],
  Juridico: [
    'Tatiana Cumbe',
    'Ivo Nhacale',
    'Claudio Bila',
    'Palmira Zibia',
    'Romeu Sitoe',
  ],
};

export const assistenciaIssues = [
  'Sem acesso à rede',
  'Email bloqueado',
  'Laptop lento',
  'Erro no ERP',
  'VPN não conecta',
  'Impressora sem resposta',
];

const initialTicketsData = [
  {
    id: 'T-1021',
    type: 'Assistência',
    department: 'IT',
    requester: 'Elton Matsinhe',
    province: 'Maputo Cidade',
    problem: 'VPN não conecta',
    status: 'Activo',
    createdAt: '2025-12-14T09:10:00Z',
    observation: 'Precisa antes das 14h',
  },
  {
    id: 'T-1020',
    type: 'Requisição',
    department: 'Comercial',
    requester: 'Clara Uamusse',
    province: 'Sofala',
    problem: 'Requisição de portátil',
    status: 'Em andamento',
    createdAt: '2025-12-13T15:35:00Z',
    observation: 'Modelo leve para viagens',
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
    observation: 'Corrigido com patch',
  },
];

export const colleagues = ['Edna Mavie', 'Antonio Zimila', 'Octavio Manhiça', 'Elton Matsinhe'];

const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const formatDateTime = (date) =>
  new Intl.DateTimeFormat('pt-MZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);

// ============================================
// Componente ChatBot Simples (Sem dependências externas)
// ============================================
const SimpleChatBot = ({ user, onNavigate, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  // Mensagens iniciais
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        text: `👋 Olá ${user?.name || 'Colega'}! Eu sou o **DE-IT-CHATBOT**, seu assistente virtual do Departamento de TI da Imperial Insurance.`,
        sender: 'bot',
        time: new Date(),
      },
      {
        id: 2,
        text: 'Como posso ajudá-lo hoje? Escolha uma opção abaixo:',
        sender: 'bot',
        time: new Date(),
      },
    ];
    setMessages(initialMessages);
  }, []);

  // Opções do chatbot
  const botOptions = [
    { id: 'emitir', icon: '📋', text: 'Emitir Ticket', desc: 'Abrir novo pedido' },
    { id: 'listar', icon: '📊', text: 'Listar Tickets', desc: 'Ver e gerir tickets' },
    { id: 'relatorios', icon: '📈', text: 'Relatórios', desc: 'Ver estatísticas' },
    { id: 'limpar', icon: '🧹', text: 'Limpar Cache', desc: 'Limpar dados' },
    { id: 'ajuda', icon: '❓', text: 'Ajuda', desc: 'Como usar o sistema' },
    { id: 'contato', icon: '📞', text: 'Contato TI', desc: 'Falar com suporte' },
  ];

  // Respostas para cada opção
  const getBotResponse = (optionId) => {
    const responses = {
      emitir: {
        text: "Para **Emitir um Ticket**, vá para o menu principal e selecione 'Emitir Ticket' ou clique abaixo:",
        action: () => onNavigate('emitir')
      },
      listar: {
        text: "Para **Listar Tickets**, você pode visualizar, filtrar e gerenciar todos os tickets. Clique abaixo para acessar:",
        action: () => onNavigate('listar')
      },
      relatorios: {
        text: "Os **Relatórios** mostram estatísticas sobre tickets ativos, em andamento e concluídos. Acesse gráficos detalhados:",
        action: () => onNavigate('relatorios')
      },
      limpar: {
        text: "**Limpar Cache** restaura os dados para o estado inicial. Útil para resolver problemas de exibição. Acesse:",
        action: () => onNavigate('limpar')
      },
      ajuda: {
        text: "**Como usar o sistema:**\n1. Emitir Ticket: Abra novos pedidos\n2. Listar Tickets: Gerencie pedidos existentes\n3. Relatórios: Veja estatísticas\n4. Limpar Cache: Restaure dados\n\nPrecisa de mais ajuda?"
      },
      contato: {
        text: "**Contato do Departamento de TI:**\n📧 Email: suporte.ti@imperialinsurance-mz.com\n📱 Telefone: +258 841644096\n⏰ Horário: 08h00 - 17h00 (Seg-Sex)"
      }
    };

    return responses[optionId] || {
      text: "Posso ajudar com:\n• Emissão de tickets\n• Consulta de tickets\n• Relatórios estatísticos\n• Limpeza de cache\n• Dúvidas gerais"
    };
  };

  const handleOptionPress = (option) => {
    // Adiciona mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: option.text,
      sender: 'user',
      time: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Resposta do bot
    setTimeout(() => {
      const response = getBotResponse(option.id);
      const botMessage = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        time: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Executa ação se houver
      if (response.action) {
        setTimeout(() => {
          response.action();
          onClose();
        }, 500);
      }
    }, 300);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Resposta automática do bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Entendi sua mensagem! Para melhor atendimento, escolha uma das opções abaixo:",
        sender: 'bot',
        time: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.chatbotContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header do Chatbot */}
      <View style={styles.chatbotHeader}>
        <View style={styles.chatbotHeaderContent}>
          <View style={styles.chatbotLogo}>
            <Ionicons name="chatbubble" size={24} color={BRAND_GREEN} />
          </View>
          <View style={styles.chatbotTitleContainer}>
            <Text style={styles.chatbotTitle}>DE-IT-CHATBOT</Text>
            <Text style={styles.chatbotSubtitle}>Assistente Virtual • Departamento TI</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.chatbotCloseBtn}>
            <Ionicons name="close" size={24} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Área de Mensagens */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === 'user' ? styles.userMessageText : styles.botMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.messageTime}>
              {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
        
        {/* Opções do Bot */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Escolha uma opção:</Text>
          <View style={styles.optionsGrid}>
            {botOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionText}>{option.text}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Input para mensagens */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={TEXT_LIGHT}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={22} 
            color={inputText.trim() ? BRAND_GREEN : TEXT_LIGHT} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ============================================
// DashboardScreen Principal
// ============================================
export default function DashboardScreen({ session, onLogout }) {
  const token = session?.token;
  const user = session?.usuario
    ? { name: session.usuario.nome, email: session.usuario.email }
    : { name: 'Visitante', email: '' };

  const [profileOpen, setProfileOpen] = useState(false);
  const [view, setView] = useState('home');
  const [ticketStep, setTicketStep] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [apiForm, setApiForm] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [deptMapForForm, setDeptMapForForm] = useState(null);
  const [provinceListDyn, setProvinceListDyn] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [now, setNow] = useState(new Date());
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(new Animated.Value(1));

  // Animações principais
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const headerSlide = useRef(new Animated.Value(-50)).current;
  const footerSlide = useRef(new Animated.Value(50)).current;
  
  // Animações dos cards
  const cardAnimations = useRef(
    Array.from({ length: 4 }).map(() => ({
      scale: new Animated.Value(0.9),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
      rotation: new Animated.Value(0),
    }))
  ).current;
  
  // Animações dos ícones dos cards
  const iconAnimations = useRef(
    Array.from({ length: 4 }).map(() => ({
      scale: new Animated.Value(0.8),
      pulse: new Animated.Value(0),
    }))
  ).current;
  
  // Efeitos de fundo do dashboard
  const bgFloat = useRef(new Animated.Value(0)).current;
  const bgParticles = useRef(
    Array.from({ length: 8 }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height * 0.6),
      opacity: new Animated.Value(0.05 + Math.random() * 0.05),
      scale: new Animated.Value(0.3 + Math.random() * 0.7),
    }))
  ).current;

  const [ticketForm, setTicketForm] = useState({
    type: 'Assistência',
    department: '',
    requester: '',
    requesterSearch: '',
    problem: '',
    description: '',
    province: '',
    observation: '',
  });

  const loadRemoteData = async () => {
    if (!token) return;
    setTicketsLoading(true);
    try {
      const [lista, form] = await Promise.all([
        fetchTickets(token),
        fetchFormData(token),
      ]);
      setApiForm(form);
      setTickets(Array.isArray(lista) ? lista.map(mapApiTicketToMobile) : []);
      if (form?.solicitantes?.length) {
        setDeptMapForForm(buildDepartmentsMap(form.solicitantes));
      }
      if (form?.provincias?.length) {
        setProvinceListDyn(form.provincias.map((p) => p.nome));
      }
    } catch (e) {
      Alert.alert('API', e.message || 'Não foi possível carregar os dados.');
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    loadRemoteData();
  }, [token]);

  const departmentsForEmit = deptMapForForm || departments;
  const provincesForEmit = provinceListDyn || provinces;

  const problemOptionsAssist = useMemo(
    () => tiposNomesPorCategoria(apiForm?.tipos_problema, 'assistencia'),
    [apiForm]
  );
  const problemOptionsReq = useMemo(
    () => tiposNomesPorCategoria(apiForm?.tipos_problema, 'requisicao'),
    [apiForm]
  );
  const problemOptionsForEmit =
    ticketForm.type === 'Assistência' ? problemOptionsAssist : problemOptionsReq;

  // Animação de pulsação do botão do chatbot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    
    // Animações de entrada
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerSlide, {
        toValue: 0,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Animação de flutuação do fundo
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgFloat, {
            toValue: 1,
            duration: 15000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bgFloat, {
            toValue: 0,
            duration: 15000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Animações dos cards com delays e efeitos diferentes
    cardAnimations.forEach((card, index) => {
      Animated.sequence([
        Animated.delay(index * 120),
        Animated.parallel([
          Animated.spring(card.scale, {
            toValue: 1,
            tension: 120,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(card.opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(card.translateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(card.rotation, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      
      // Animação dos ícones (pulso)
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200 + 800),
          Animated.timing(iconAnimations[index].pulse, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(iconAnimations[index].pulse, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animação de entrada do ícone
      Animated.spring(iconAnimations[index].scale, {
        toValue: 1,
        tension: 150,
        friction: 12,
        delay: index * 120 + 300,
        useNativeDriver: true,
      }).start();
    });

    return () => clearInterval(interval);
  }, []);

  const handleCardPress = (viewName) => {
    const cardIndex = ['emitir', 'listar', 'relatorios', 'limpar'].indexOf(viewName);
    if (cardIndex >= 0) {
      // Animação de press mais elaborada
      Animated.parallel([
        Animated.sequence([
          Animated.spring(cardAnimations[cardIndex].scale, {
            toValue: 0.95,
            useNativeDriver: true,
          }),
          Animated.spring(cardAnimations[cardIndex].scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(iconAnimations[cardIndex].scale, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnimations[cardIndex].scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
    setTimeout(() => setView(viewName), 200);
  };

  const handleChatbotNavigate = (viewName) => {
    setView(viewName);
    // O chatbot será fechado pela função onClose
  };

  const requesterOptions = useMemo(() => {
    if (!ticketForm.department) return [];
    return departments[ticketForm.department] || [];
  }, [ticketForm.department]);

  const filteredRequesters = useMemo(() => {
    const query = ticketForm.requesterSearch.trim().toLowerCase();
    if (!query) return requesterOptions;
    return requesterOptions.filter((name) => name.toLowerCase().includes(query));
  }, [requesterOptions, ticketForm.requesterSearch]);

  const filteredTickets = useMemo(() => {
    if (filter === 'Todos') return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [filter, tickets]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const pageTickets = filteredTickets.slice((page - 1) * pageSize, page * pageSize);

  const summary = useMemo(() => {
    const total = tickets.length;
    const activos = tickets.filter((t) => t.status === 'Activo').length;
    const andamento = tickets.filter((t) => t.status === 'Em andamento').length;
    const fechados = tickets.filter((t) => t.status === 'Fechado').length;
    const alocados = tickets.filter((t) => t.status === 'Alocado').length;
    return { total, activos, andamento, fechados, alocados };
  }, [tickets]);

  const availableAssignees = useMemo(() => {
    const current = user?.name;
    const fromApi = apiForm?.tecnicos?.map((t) => t.nome) || [];
    const base = fromApi.length ? fromApi : colleagues;
    return base.filter((c) => c && c !== current);
  }, [user, apiForm]);

  const resetForm = () =>
    setTicketForm({
      type: 'Assistência',
      department: '',
      requester: '',
      requesterSearch: '',
      problem: '',
      description: '',
      province: '',
      observation: '',
    });

  const handleCreateTicket = async () => {
    if (!token || !apiForm) {
      Alert.alert('Atenção', 'Aguarde o carregamento dos dados do formulário.');
      return;
    }
    if (!ticketForm.department || !ticketForm.requester) return;

    const cat = ticketForm.type === 'Assistência' ? 'assistencia' : 'requisicao';
    if (cat === 'assistencia' && !ticketForm.problem) return;
    const reqOpts = tiposNomesPorCategoria(apiForm.tipos_problema, 'requisicao');
    if (cat === 'requisicao') {
      if (reqOpts.length) {
        if (!ticketForm.problem) return;
      } else if (!ticketForm.description?.trim()) return;
    }

    const solicitante = apiForm.solicitantes.find(
      (s) =>
        s.nome === ticketForm.requester &&
        s.Departamento?.nome === ticketForm.department
    );
    if (!solicitante) {
      Alert.alert(
        'Erro',
        'Solicitante não encontrado. Escolha um departamento e nome existentes na base.'
      );
      return;
    }

    let tipoProblema = null;
    if (cat === 'assistencia') {
      tipoProblema = apiForm.tipos_problema.find(
        (t) => t.nome === ticketForm.problem && t.categoria === 'assistencia'
      );
    } else if (reqOpts.length) {
      tipoProblema = apiForm.tipos_problema.find(
        (t) => t.nome === ticketForm.problem && t.categoria === 'requisicao'
      );
    } else {
      tipoProblema = apiForm.tipos_problema.find((t) => t.categoria === 'requisicao');
    }
    if (!tipoProblema) {
      Alert.alert('Erro', 'Tipo de problema / requisição não encontrado no servidor.');
      return;
    }

    let descPersonalizada = null;
    if (cat === 'requisicao' && !reqOpts.length) {
      descPersonalizada = ticketForm.description?.trim() || null;
    } else if (tipoProblema.requer_descricao) {
      descPersonalizada =
        ticketForm.description?.trim() ||
        ticketForm.observation?.trim() ||
        '—';
    }

    try {
      const res = await createTicketApi(token, {
        tipo: cat,
        solicitante_id: solicitante.id,
        tipo_problema_id: tipoProblema.id,
        descricao_problema_personalizada: descPersonalizada,
        observacao: ticketForm.observation?.trim() || undefined,
        prioridade: 'media',
      });
      const novo = mapApiTicketToMobile(res.ticket);
      setTickets((prev) => [novo, ...prev]);
      setSelectedTicket(novo);
      setTicketStep(1);
      resetForm();
      setFilter('Todos');
      setPage(1);
      setView('listar');
    } catch (e) {
      Alert.alert('Erro ao criar ticket', e.message);
    }
  };

  const handleAssign = async () => {
    if (!selectedTicket || !assignTo || !token || !apiForm) return;
    const tec = apiForm.tecnicos.find((x) => x.nome === assignTo);
    if (!tec) {
      Alert.alert('Erro', 'Técnico não encontrado.');
      return;
    }
    try {
      await alocarTicketApi(token, selectedTicket.apiId, tec.id);
      setTickets((prev) =>
        prev.map((t) =>
          t.apiId === selectedTicket.apiId
            ? { ...t, assignedTo: assignTo, status: 'Alocado' }
            : t
        )
      );
      setSelectedTicket((prev) =>
        prev && prev.apiId === selectedTicket.apiId
          ? { ...prev, assignedTo: assignTo, status: 'Alocado' }
          : prev
      );
      setAssignTo('');
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleCloseTicket = async (apiId) => {
    if (!token) return;
    try {
      await fecharTicketApi(token, apiId);
      setTickets((prev) =>
        prev.map((t) =>
          t.apiId === apiId
            ? { ...t, status: 'Fechado', closedAt: new Date().toISOString() }
            : t
        )
      );
      if (selectedTicket?.apiId === apiId) {
        setSelectedTicket((prev) =>
          prev ? { ...prev, status: 'Fechado', closedAt: new Date().toISOString() } : prev
        );
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleDeleteTicket = async (apiId) => {
    if (!token) return;
    try {
      await deleteTicketApi(token, apiId);
      setTickets((prev) => prev.filter((t) => t.apiId !== apiId));
      if (selectedTicket?.apiId === apiId) setSelectedTicket(null);
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleClearCache = () => {
    setSelectedTicket(null);
    setFilter('Todos');
    setPage(1);
    loadRemoteData();
  };

  const renderBadge = (status) => {
    const map = {
      Activo: '#22c55e',
      'Em andamento': '#f97316',
      Fechado: '#9ca3af',
      Alocado: '#3b82f6',
    };
    return (
      <View style={[styles.badge, { backgroundColor: map[status] || '#9ca3af' }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    );
  };

  // Interpolações
  const bgFloatY = bgFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const currentBackground = VIEW_BACKGROUND_COLORS[view] || DASHBOARD_BG;

  return (
    <View style={[styles.container, { backgroundColor: currentBackground }]}>
      <StatusBar style="light" backgroundColor={currentBackground} />
      
      {/* Background com efeitos dinâmicos */}
      <Animated.View 
        style={[
          styles.background,
          {
            transform: [
              { translateY: bgFloatY },
              {
                scale: bgFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })
              }
            ]
          }
        ]}
      >
        {/* Linhas decorativas animadas */}
        <Animated.View style={[
          styles.decorativeLine1,
          {
            transform: [{
              translateX: bgFloat.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 30],
              })
            }]
          }
        ]} />
        
        <Animated.View style={[
          styles.decorativeLine2,
          {
            transform: [{
              translateX: bgFloat.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -30],
              })
            }]
          }
        ]} />
        
        {/* Gradiente sutil */}
        <View style={styles.gradientOverlay} />
      </Animated.View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header simplificado */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeIn,
              transform: [{ translateY: headerSlide }]
            }
          ]}
        >
          <View style={styles.brand}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logoImg} 
                resizeMode="contain" 
              />
              <View style={styles.logoGlow} />
            </View>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>Gestão de Tickets</Text>
              <Text style={styles.brandSubtitle}>
                {getGreeting(now)}, <Text style={styles.userName}>{user?.name || 'Visitante'}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setProfileOpen((v) => !v)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-circle" size={40} color={BRAND_GREEN} />
            </TouchableOpacity>

            {profileOpen && (
              <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                  <Ionicons name="create-outline" size={18} color={TEXT_SECONDARY} />
                  <Text style={styles.menuItemText}>Editar Perfil</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={onLogout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                  <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Sair</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Separador decorativo */}
        <Animated.View 
          style={[
            styles.separator,
            {
              opacity: fadeIn,
              transform: [{
                scaleX: fadeIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }]
            }
          ]}
        />

        {/* Cards principais */}
        {view === 'home' && (
          <Animated.View 
            style={[
              styles.cardsSection,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }]
              }
            ]}
          >
            {/* Título centralizado com ícone */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="grid-outline" size={22} color={BRAND_GREEN} />
                <Text style={styles.sectionTitle}>Menu</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Selecione uma opção para continuar</Text>
            </View>
            
            {/* Lista de cards em coluna, ocupando toda a largura */}
            <View style={styles.cardsGrid}>
              {[
                { key: 'emitir', icon: 'add-circle', title: 'Emitir Ticket', desc: 'Abrir novo pedido de suporte' },
                { key: 'listar', icon: 'list', title: 'Listar Tickets', desc: 'Visualizar e gerir tickets' },
                { key: 'relatorios', icon: 'analytics', title: 'Relatórios', desc: 'Ver estatísticas e métricas' },
                { key: 'limpar', icon: 'refresh', title: 'Clean Cache', desc: 'Limpar dados temporários' },
              ].map((card, index) => {
                const cardRotation = cardAnimations[index].rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-5deg', '0deg'],
                });
                
                const iconScale = iconAnimations[index].scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                });
                
                const iconPulse = iconAnimations[index].pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                });

                const isActive = view === card.key;
                
                return (
                  <Animated.View
                    key={card.key}
                    style={[
                      styles.cardWrapper,
                      {
                        opacity: cardAnimations[index].opacity,
                        transform: [
                          { scale: cardAnimations[index].scale },
                          { translateY: cardAnimations[index].translateY },
                          { rotate: cardRotation },
                        ]
                      }
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.card,
                        { borderLeftWidth: 4, borderLeftColor: CARD_COLORS[card.key] },
                        isActive && styles.cardActive,
                      ]}
                      onPress={() => handleCardPress(card.key)}
                      activeOpacity={0.9}
                    >
                      <Animated.View 
                        style={[
                          styles.cardIconContainer,
                          { 
                            backgroundColor: `${CARD_COLORS[card.key]}15`,
                            transform: [
                              { scale: Animated.multiply(iconScale, iconPulse) }
                            ]
                          }
                        ]}
                      >
                        <Ionicons name={card.icon} size={34} color={CARD_COLORS[card.key]} />
                      </Animated.View>
                      <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
                      <Text style={styles.cardDescription}>{card.desc}</Text>
                      <View style={styles.cardArrow}>
                        <Ionicons name="arrow-forward-circle" size={22} color={CARD_COLORS[card.key]} />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Conteúdo das telas */}
        <Animated.View 
          style={[
            styles.contentSection,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          {view === 'emitir' && (
            <EmitirTicketScreen
              ticketForm={ticketForm}
              setTicketForm={setTicketForm}
              ticketStep={ticketStep}
              setTicketStep={setTicketStep}
              filteredRequesters={filteredRequesters}
              assistenciaIssues={assistenciaIssues}
              problemOptions={problemOptionsForEmit}
              provinces={provincesForEmit}
              departments={departmentsForEmit}
              onSubmit={handleCreateTicket}
              onBack={() => setView('home')}
            />
          )}

          {view === 'listar' && (
            <ListarTicketsScreen
              tickets={tickets}
              filter={filter}
              setFilter={setFilter}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              pageTickets={pageTickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              availableAssignees={availableAssignees}
              assignTo={assignTo}
              setAssignTo={setAssignTo}
              onAssign={handleAssign}
              onCloseTicket={handleCloseTicket}
              onDeleteTicket={handleDeleteTicket}
              renderBadge={renderBadge}
              formatDateTime={formatDateTime}
              onBack={() => setView('home')}
            />
          )}

          {view === 'relatorios' && (
            <RelatoriosScreen 
              summary={summary} 
              onBack={() => setView('home')} 
            />
          )}

          {view === 'limpar' && (
            <LimparCacheScreen 
              onClear={handleClearCache} 
              onBack={() => setView('home')} 
            />
          )}
        </Animated.View>

        {/* Separador antes do footer */}
        <View style={styles.footerSeparator} />

        {/* Footer premium */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeIn,
              transform: [{ translateY: footerSlide }]
            }
          ]}
        >
          <View style={styles.footerContent}>
            <View style={styles.footerHeader}>
              <Ionicons name="shield-checkmark" size={24} color={BRAND_GREEN} />
              <Text style={styles.footerBrand}>Imperial Insurance</Text>
            </View>
            
            <View style={styles.footerGrid}>
              <View style={styles.footerColumn}>
                <View style={styles.footerRow}>
                  <Ionicons name="location-outline" size={16} color={TEXT_SECONDARY} />
                  <Text style={styles.footerText}>
                    Av. Kenneth Kaunda, N°806 (Sede){'\n'}
                    Maputo - Moçambique
                  </Text>
                </View>
              </View>
              
              <View style={styles.footerColumn}>
                <View style={styles.footerRow}>
                  <Ionicons name="call-outline" size={16} color={TEXT_SECONDARY} />
                  <Text style={styles.footerText}>
                    +258 841644096{'\n'}
                    info@imperialinsurance-mz.com
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.footerBottom}>
              <Text style={styles.footerCopyright}>
                © 2024 Imperial Insurance • Todos direitos reservados
              </Text>
              <View style={styles.footerDev}>
                <Ionicons name="code-slash-outline" size={14} color={TEXT_LIGHT} />
                <Text style={styles.footerDevText}>Desenvolvido pelo Departamento de TI</Text>
              </View>
              <Text style={styles.footerTime}>
                <Ionicons name="time-outline" size={12} color={TEXT_LIGHT} />
                {' '}Atualizado: {formatDateTime(now)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Botão do Chatbot flutuante */}
      <Animated.View 
        style={[
          styles.chatbotButtonContainer,
          {
            transform: [{ scale: buttonPulse }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => setChatbotVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.chatbotButtonInner}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#ffffff" />
            <View style={styles.chatbotNotification}>
              <Text style={styles.chatbotNotificationText}>!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal do Chatbot */}
      <Modal
        visible={chatbotVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatbotVisible(false)}
      >
        <View style={styles.chatbotModalOverlay}>
          <SimpleChatBot 
            user={user} 
            onNavigate={handleChatbotNavigate}
            onClose={() => setChatbotVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DASHBOARD_BG,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorativeLine1: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(16, 106, 55, 0.12)',
    transform: [{ skewY: '5deg' }],
  },
  decorativeLine2: {
    position: 'absolute',
    bottom: '35%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(16, 106, 55, 0.12)',
    transform: [{ skewY: '-5deg' }],
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 14, 0.65)',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 4,
    zIndex: 50,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  logoContainer: {
    position: 'relative',
  },
  logoImg: {
    width: 56,
    height: 56,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: BRAND_GREEN_GLOW,
    top: -5,
    left: -5,
    zIndex: 1,
  },
  brandText: {
    flex: 1,
    gap: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '400',
  },
  userName: {
    fontWeight: '600',
    color: BRAND_GREEN,
  },
  profileContainer: {
    position: 'relative',
    zIndex: 100,
  },
  profileButton: {
    padding: 4,
  },
  profileMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    fontWeight: '400',
  },
  menuDivider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 4,
  },
  separator: {
    height: 2,
    backgroundColor: 'rgba(16, 106, 55, 0.1)',
    marginBottom: 40,
    borderRadius: 1,
  },
  cardsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_MAIN,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  cardsGrid: {
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
    flexShrink: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 16,
    minHeight: 160,
    position: 'relative',
    shadowColor: CARD_SHADOW,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    width: '100%',
  },
  cardActive: {
    borderColor: BRAND_GREEN_LIGHT,
    backgroundColor: 'rgba(16, 106, 55, 0.04)',
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 106, 55, 0.08)',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    flex: 1,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  contentSection: {
    minHeight: 160,
    marginBottom: 12,
  },
  footerSeparator: {
    height: 2,
    backgroundColor: 'rgba(16, 106, 55, 0.16)',
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 1,
  },
  footer: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 24,
    shadowColor: CARD_SHADOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  footerContent: {
    gap: 24,
  },
  footerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: 0.5,
  },
  footerGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  footerColumn: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  footerText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    flex: 1,
  },
  footerBottom: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    gap: 12,
  },
  footerCopyright: {
    fontSize: 13,
    color: TEXT_LIGHT,
    textAlign: 'center',
    fontWeight: '500',
  },
  footerDev: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerDevText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontStyle: 'italic',
  },
  footerTime: {
    fontSize: 11,
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },

  // Estilos do Chatbot
  chatbotButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  chatbotButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BRAND_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  chatbotButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatbotNotification: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatbotNotificationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatbotModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  chatbotContainer: {
    height: height * 0.7,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  chatbotHeader: {
    backgroundColor: 'rgba(16, 106, 55, 0.9)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 31, 23, 0.3)',
  },
  chatbotHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatbotLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(11, 31, 23, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatbotTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chatbotTitle: {
    color: '#0b1f17',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chatbotSubtitle: {
    color: 'rgba(11, 31, 23, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  chatbotCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(11, 31, 23, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: BRAND_GREEN,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 106, 55, 0.2)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#0b1f17',
    fontWeight: '500',
  },
  botMessageText: {
    color: TEXT_MAIN,
  },
  messageTime: {
    fontSize: 10,
    color: TEXT_LIGHT,
    marginTop: 4,
    textAlign: 'right',
  },
  optionsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    width: '48%',
    backgroundColor: 'rgba(16, 106, 55, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 106, 55, 0.3)',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_GREEN,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 11,
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: CARD_BG,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: TEXT_MAIN,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 106, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});