import React, { useState } from 'react';
import { FiHelpCircle, FiBook, FiMessageCircle, FiVideo, FiExternalLink, FiUser, FiLock, FiSettings, FiFileText, FiClock, FiUsers, FiFilter } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import logoEmpresa from '../assets/logo.png';

const Ajuda = () => {
  const [showDocMessage, setShowDocMessage] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Perguntas e respostas do FAQ específicas para Gestão de Tickets
  const faqItems = [
    {
      pergunta: "Como criar um novo ticket?",
      resposta: "Vá para a seção 'Tickets' > 'Novo Ticket', preencha os campos obrigatórios (título, descrição, categoria, prioridade) e clique em 'Criar Ticket'."
    },
    {
      pergunta: "Como alterar o status de um ticket?",
      resposta: "Na visualização do ticket, use o menu suspenso de status para atualizar para: Activo, Alocado, Em Progresso, Pendente ou Fechado."
    },
    {
      pergunta: "Como atribuir um ticket a um técnico?",
      resposta: "Ao visualizar o ticket, clique em 'Atribuir' e selecione o técnico responsável. Você também pode usar a ação em massa na lista de tickets."
    },
    {
      pergunta: "Como adicionar um comentário a um ticket?",
      resposta: "Na página do ticket, vá para a seção 'Comentários', digite sua mensagem e clique em 'Adicionar Comentário'. Você pode anexar arquivos se necessário."
    },
    {
      pergunta: "Como filtrar tickets por status ou prioridade?",
      resposta: "Use os filtros na parte superior da lista de tickets. Você pode filtrar por status, prioridade, técnico, departamento ou data."
    },
    {
      pergunta: "Como gerar relatórios de tickets?",
      resposta: "Acesse 'Relatórios' > selecione o período desejado > escolha o tipo de relatório (completo, estatísticas ou tickets) > clique em 'Exportar' em PDF ou Excel."
    },
    {
      pergunta: "Como configurar notificações de tickets?",
      resposta: "Vá para 'Configurações' > 'Notificações' e selecione quais notificações deseja receber: novos tickets, atualizações, tickets atribuídos, etc."
    },
    {
      pergunta: "Como reabrir um ticket fechado?",
      resposta: "Na lista de tickets fechados, selecione o ticket desejado > clique em 'Reabrir Ticket' > o status será alterado para 'Activo' automaticamente."
    },
    {
      pergunta: "Como usar o painel de métricas (dashboard)?",
      resposta: "O dashboard mostra estatísticas em tempo real: tickets por status, tempo médio de resolução, técnicos mais ocupados, departamentos com mais tickets, etc."
    },
    {
      pergunta: "Como configurar categorias e subcategorias de tickets?",
      resposta: "Apenas administradores podem acessar 'Configurações' > 'Categorias' para adicionar, editar ou remover categorias e subcategorias de problemas."
    },
    {
      pergunta: "Como exportar a lista de tickets?",
      resposta: "Na página de tickets, use os filtros para selecionar os tickets desejados > clique em 'Exportar' > escolha entre Excel (XLSX) ou CSV."
    },
    {
      pergunta: "Como acompanhar o SLA (Service Level Agreement)?",
      resposta: "Cada ticket mostra o tempo restante para resolução baseado no SLA configurado. Relatórios específicos de SLA estão disponíveis na seção 'Relatórios'."
    },
    {
      pergunta: "Como criar templates de resposta para tickets comuns?",
      resposta: "Vá para 'Configurações' > 'Templates' > crie templates com respostas padrão para problemas frequentes, economizando tempo na resolução."
    },
    {
      pergunta: "Como funciona o sistema de prioridades?",
      resposta: "Tickets podem ter 4 níveis de prioridade: Crítica (resolução em 2h), Alta (4h), Média (8h), Baixa (24h). O SLA varia conforme a prioridade."
    },
    {
      pergunta: "Como reportar um problema técnico no sistema?",
      resposta: "Use o botão 'Reportar Problema' no menu inferior ou entre em contato direto com o departamento de IT via WhatsApp: +258 841644096"
    }
  ];

  const handleDocumentacaoClick = () => {
    setShowDocMessage(true);
    setTimeout(() => setShowDocMessage(false), 3000);
  };

  const handleSuporteClick = () => {
    const mensagemPadrao = encodeURIComponent("Olá! Preciso de ajuda com o Sistema de Gestão de Tickets da Imperial Insurance.");
    const numeroWhatsApp = "841644096";
    window.open(`https://wa.me/258${numeroWhatsApp}?text=${mensagemPadrao}`, '_blank');
  };

  const handleTutoriaisClick = () => {
    window.open('https://www.youtube.com/results?search_query=sistema+gestão+tickets+tutorial', '_blank');
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <link rel="icon" href={logoEmpresa} />
        <title>Ajuda e Suporte | Sistema de Gestão de Tickets</title>
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#106a37]">
            Ajuda e Suporte
          </h1>
          <p className="text-gray-600">
            Central de ajuda para o Sistema de Gestão de Tickets da Imperial Insurance
          </p>
        </div>

        {/* Mensagem temporária para documentação */}
        {showDocMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-blue-700">
                  A documentação completa do sistema está disponível apenas para administradores. Entre em contato com o departamento de IT.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Documentação Técnica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiBook className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Documentação Técnica</h3>
                <p className="text-sm text-gray-600">Manuais e guias oficiais</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Guias completos sobre todas as funcionalidades do sistema de gestão de tickets.
            </p>
            <button 
              onClick={handleDocumentacaoClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium flex items-center gap-2"
            >
              Acessar Documentação
              <FiExternalLink />
            </button>
          </div>

          {/* Suporte Técnico WhatsApp */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiMessageCircle className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Suporte Técnico</h3>
                <p className="text-sm text-gray-600">Departamento de IT</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Problemas técnicos? Entre em contato direto com nossa equipe de IT.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="text-gray-400" />
                <span className="text-gray-600">Horário: Seg-Sex, 8h-18h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUsers className="text-gray-400" />
                <span className="text-gray-600">Equipe especializada</span>
              </div>
            </div>
            <button 
              onClick={handleSuporteClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium flex items-center gap-2 w-full justify-center"
            >
              <FiMessageCircle />
              WhatsApp do Suporte
            </button>
          </div>

          {/* Tutoriais em Vídeo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiVideo className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Tutoriais em Vídeo</h3>
                <p className="text-sm text-gray-600">Passo a passo visual</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Aprenda a usar o sistema com tutoriais práticos em vídeo.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="text-gray-400" />
                <span className="text-gray-600">Para todos os usuários</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiSettings className="text-gray-400" />
                <span className="text-gray-600">Funcionalidades avançadas</span>
              </div>
            </div>
            <button 
              onClick={handleTutoriaisClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium flex items-center gap-2 w-full justify-center"
            >
              <FiVideo />
              Ver Tutoriais no YouTube
            </button>
          </div>

          {/* Guia Rápido */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-orange-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Guia Rápido</h3>
                <p className="text-sm text-gray-600">Fluxo de trabalho básico</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</div>
                <span className="text-gray-700">Crie um ticket descrevendo o problema</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">2</div>
                <span className="text-gray-700">Atribua ao técnico responsável</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">3</div>
                <span className="text-gray-700">Acompanhe o progresso e status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">4</div>
                <span className="text-gray-700">Feche o ticket após resolução</span>
              </div>
            </div>
          </div>

          {/* Configurações do Sistema */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FiSettings className="text-cyan-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Configurações</h3>
                <p className="text-sm text-gray-600">Personalize sua experiência</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Notificações por e-mail</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Ativo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Tema escuro</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Inativo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Idioma</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Português</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Fuso horário</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GMT+2</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiHelpCircle className="text-red-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">FAQ</h3>
                <p className="text-sm text-gray-600">Perguntas frequentes sobre tickets</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Respostas para as dúvidas mais comuns sobre gestão de tickets.
            </p>
            <button 
              onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium flex items-center gap-2 w-full justify-center"
            >
              <FiHelpCircle />
              {faqOpen !== null ? 'Fechar FAQ' : 'Abrir FAQ Completo'}
            </button>
          </div>
        </div>

        {/* Seção FAQ Expandida */}
        {faqOpen !== null && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Perguntas Frequentes - Sistema de Gestão de Tickets</h3>
              <button
                onClick={() => setFaqOpen(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {faqItems.slice(0, Math.ceil(faqItems.length / 2)).map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left flex justify-between items-start py-2 hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <FiHelpCircle className="text-gray-400 mt-1 flex-shrink-0" />
                        <span className="font-medium text-gray-800 text-left">{item.pergunta}</span>
                      </div>
                      <span className={`text-gray-400 transform transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {faqOpen === index && (
                      <div className="mt-2 pl-9 text-gray-600 animate-fade-in">
                        <p>{item.resposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {faqItems.slice(Math.ceil(faqItems.length / 2)).map((item, index) => {
                  const actualIndex = index + Math.ceil(faqItems.length / 2);
                  return (
                    <div key={actualIndex} className="border-b pb-4 last:border-b-0">
                      <button
                        onClick={() => toggleFaq(actualIndex)}
                        className="w-full text-left flex justify-between items-start py-2 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <FiHelpCircle className="text-gray-400 mt-1 flex-shrink-0" />
                          <span className="font-medium text-gray-800 text-left">{item.pergunta}</span>
                        </div>
                        <span className={`text-gray-400 transform transition-transform ${faqOpen === actualIndex ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {faqOpen === actualIndex && (
                        <div className="mt-2 pl-9 text-gray-600 animate-fade-in">
                          <p>{item.resposta}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiMessageCircle className="text-blue-500" />
                <div>
                  <p className="text-blue-700">
                    <strong>Ainda com dúvidas?</strong> Entre em contato com nosso suporte técnico via WhatsApp ou envie um e-mail para <a href="mailto:elton.matsinhe@imperialinsurance-mz.com" className="underline">elton.matsinhe@imperialinsurance-mz.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ajuda;