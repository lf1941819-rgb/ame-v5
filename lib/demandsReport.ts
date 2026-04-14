import { Demand, Priority, DemandStatus } from '../types';

export const formatPriority = (priority: Priority): string => {
  switch (priority) {
    case 'baixa':
      return 'Baixa';
    case 'media':
      return 'Média';
    case 'alta':
      return 'Alta';
    default:
      return priority;
  }
};

export const formatStatus = (status: DemandStatus): string => {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'em_andamento':
      return 'Em andamento';
    case 'concluida':
      return 'Concluída';
    default:
      return status;
  }
};

export const buildDemandsReportMessage = (demands: Demand[]): string => {
  if (demands.length === 0) {
    return '🙏 *AME | Relatório de Demandas da Missão*\n\nNo momento não há demandas cadastradas para compartilhamento.';
  }

  const total = demands.length;
  const pendentes = demands.filter(d => d.status === 'pendente').length;
  const emAndamento = demands.filter(d => d.status === 'em_andamento').length;
  const concluidas = demands.filter(d => d.status === 'concluida').length;

  let message = '🙏 *AME | Relatório de Demandas da Missão*\n\n';
  message += `📋 *Total de demandas:* ${total}\n`;
  message += `🕓 *Pendentes:* ${pendentes}\n`;
  message += `🔄 *Em andamento:* ${emAndamento}\n`;
  message += `✅ *Concluídas:* ${concluidas}\n\n`;

  demands.forEach((demand, index) => {
    const date = new Date(demand.created_at).toLocaleDateString('pt-BR');
    message += `*${index + 1}. ${demand.person?.name || 'Pessoa desconhecida'}*\n`;
    message += `🧾 Necessidade: ${demand.description}\n`;
    message += `⚠️ Prioridade: ${formatPriority(demand.priority)}\n`;
    message += `📌 Status: ${formatStatus(demand.status)}\n`;
    message += `📍 Ponto: ${demand.point?.name || 'Não informado'}\n`;
    message += `📅 Data: ${date}\n\n`;
  });

  message += '🤝 Caso possa ajudar em alguma dessas demandas, entre em contato com a equipe da missão.';

  return message;
};

export const shareDemandsReport = async (demands: Demand[]): Promise<void> => {
  const message = buildDemandsReportMessage(demands);

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Relatório de Demandas da Missão - AME',
        text: message,
      });
    } catch (error) {
      // User cancelled or error, fallback to WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }
};