const STATUS_TO_UI = {
  aberto: 'Activo',
  em_andamento: 'Em andamento',
  fechado: 'Fechado',
  alocado: 'Alocado',
};

const TIPO_TO_UI = {
  assistencia: 'Assistência',
  requisicao: 'Requisição',
};

const PRIORIDADE_TO_UI = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Crítica',
};

export function mapApiTicketToMobile(t) {
  return {
    apiId: t.id,
    id: t.numero_ticket || String(t.id),
    type: TIPO_TO_UI[t.tipo] || t.tipo,
    department: t.Departamento?.nome || '—',
    requester: t.Solicitante?.nome || '—',
    province: t.Provincia?.nome || '—',
    problem:
      t.TipoProblema?.nome ||
      t.descricao_problema_personalizada ||
      '—',
    status: STATUS_TO_UI[t.status] || t.status,
    createdAt: t.criado_em,
    closedAt: t.fechado_em || null,
    observation: t.observacao || '',
    assignedTo: t.tecnico_atribuido?.nome || null,
    description: t.descricao_problema_personalizada || '',
    email: t.Solicitante?.email || '',
    priority: PRIORIDADE_TO_UI[t.prioridade] || t.prioridade,
    category: t.TipoProblema?.categoria || '',
  };
}

export function buildDepartmentsMap(solicitantes) {
  const m = {};
  if (!Array.isArray(solicitantes)) return m;
  for (const s of solicitantes) {
    const depName = s.Departamento?.nome || '—';
    if (!m[depName]) m[depName] = [];
    if (s.nome) m[depName].push(s.nome);
  }
  return m;
}

export function tiposNomesPorCategoria(tipos, categoria) {
  if (!Array.isArray(tipos)) return [];
  return tipos
    .filter((t) => t.categoria === categoria)
    .map((t) => t.nome)
    .filter(Boolean);
}
