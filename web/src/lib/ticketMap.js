const STATUS_TO_WEB = {
  aberto: 'Activo',
  em_andamento: 'Em andamento',
  fechado: 'Fechado',
  alocado: 'Alocados',
};

const TIPO_TO_WEB = {
  assistencia: 'Assistência',
  requisicao: 'Requisição',
};

const PRIORIDADE_TO_WEB = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Crítica',
};

export function mapApiTicketToWeb(t) {
  const problem =
    t.TipoProblema?.nome ||
    t.descricao_problema_personalizada ||
    '—';
  return {
    apiId: t.id,
    id: t.numero_ticket || String(t.id),
    type: TIPO_TO_WEB[t.tipo] || t.tipo,
    department: t.Departamento?.nome || '—',
    requester: t.Solicitante?.nome || '—',
    province: t.Provincia?.nome || '—',
    problem,
    status: STATUS_TO_WEB[t.status] || t.status,
    createdAt: t.criado_em,
    description: t.descricao_problema_personalizada || problem,
    observation: t.observacao || '',
    assignedTo: t.tecnico_atribuido?.nome || null,
    assignedAt: null,
    closedAt: t.fechado_em || null,
    email: t.Solicitante?.email || '',
    phone: '',
    priority: PRIORIDADE_TO_WEB[t.prioridade] || t.prioridade,
    category: t.TipoProblema?.categoria || '',
  };
}
