/**
 * Utilitário para interpretar RRULE e gerar ocorrências de eventos recorrentes
 * Baseado na RFC 5545 e documentação do Google Calendar
 */

import { addDays, addWeeks, addMonths, format, startOfDay, isSameDay } from 'date-fns';

/**
 * Interpreta uma string RRULE e gera as datas de ocorrência
 * @param {string} rrule - String RRULE (ex: "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10")
 * @param {Date} startDate - Data inicial do evento
 * @param {Date} endDate - Data limite para gerar ocorrências (opcional)
 * @param {number} maxCount - Número máximo de ocorrências a gerar (padrão: 100)
 * @returns {Date[]} Array de datas onde o evento ocorre
 */
export function parseRRule(rrule, startDate, endDate = null, maxCount = 100) {
  if (!rrule || !startDate) return [];

  const rules = parseRRuleString(rrule);
  const occurrences = [];
  
  let currentDate = new Date(startDate);
  let count = 0;
  const maxIterations = rules.count || maxCount;
  const until = rules.until || endDate;

  // Para recorrências semanais com BYDAY, verificar se a data inicial está nos dias válidos
  if (rules.freq === 'WEEKLY' && rules.byDay && rules.byDay.length > 0) {
    const dayMap = {
      'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
    };
    const validDays = rules.byDay.map(day => dayMap[day]);
    const startDayOfWeek = startDate.getDay();
    
    // Se a data inicial não está nos dias válidos, encontrar o próximo dia válido
    if (!validDays.includes(startDayOfWeek)) {
      for (const targetDay of validDays.sort((a, b) => a - b)) {
        if (targetDay > startDayOfWeek) {
          currentDate = addDays(currentDate, targetDay - startDayOfWeek);
          break;
        }
      }
      // Se não encontrou na mesma semana, ir para a próxima
      if (currentDate.getTime() === startDate.getTime()) {
        const firstValidDay = validDays.sort((a, b) => a - b)[0];
        const daysToAdd = 7 - startDayOfWeek + firstValidDay;
        currentDate = addDays(currentDate, daysToAdd);
      }
    }
  }

  // Adicionar a primeira ocorrência válida
  occurrences.push(new Date(currentDate));
  count++;

  let iterations = 0;
  const maxSafeIterations = 1000; // Proteção contra loop infinito
  
  while (count < maxIterations && iterations < maxSafeIterations) {
    // Calcular próxima data baseada na frequência
    const nextDate = getNextOccurrence(currentDate, rules);
    
    // Verificar se a data avançou (proteção contra loop infinito)
    if (nextDate.getTime() <= currentDate.getTime()) {
      console.warn('RRULE parser: Data não avançou, interrompendo para evitar loop infinito');
      break;
    }
    
    currentDate = nextDate;
    iterations++;
    
    // Verificar se passou do limite de data
    if (until && currentDate > until) break;
    
    // Verificar se passou do limite de contagem
    if (rules.count && count >= rules.count) break;
    
    occurrences.push(new Date(currentDate));
    count++;
  }

  return occurrences;
}

/**
 * Interpreta string RRULE em objeto estruturado
 * @param {string} rrule - String RRULE
 * @returns {Object} Objeto com regras parseadas
 */
function parseRRuleString(rrule) {
  const rules = {};
  const parts = rrule.split(';');

  for (const part of parts) {
    const [key, value] = part.split('=');
    
    switch (key) {
      case 'FREQ':
        rules.freq = value; // DAILY, WEEKLY, MONTHLY, YEARLY
        break;
      case 'INTERVAL':
        rules.interval = parseInt(value) || 1;
        break;
      case 'COUNT':
        rules.count = parseInt(value);
        break;
      case 'UNTIL':
        rules.until = parseUntilDate(value);
        break;
      case 'BYDAY':
        rules.byDay = value.split(','); // ['MO', 'WE', 'FR']
        break;
      case 'BYMONTH':
        rules.byMonth = value.split(',').map(m => parseInt(m));
        break;
      case 'BYMONTHDAY':
        rules.byMonthDay = value.split(',').map(d => parseInt(d));
        break;
    }
  }

  return rules;
}

/**
 * Converte data UNTIL do formato RRULE para Date
 * @param {string} untilStr - Data no formato YYYYMMDDTHHMMSSZ
 * @returns {Date} Objeto Date
 */
function parseUntilDate(untilStr) {
  // Formato: 20110701T170000Z
  const year = parseInt(untilStr.substr(0, 4));
  const month = parseInt(untilStr.substr(4, 2)) - 1; // JavaScript months são 0-indexed
  const day = parseInt(untilStr.substr(6, 2));
  const hour = parseInt(untilStr.substr(9, 2)) || 0;
  const minute = parseInt(untilStr.substr(11, 2)) || 0;
  const second = parseInt(untilStr.substr(13, 2)) || 0;
  
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Calcula a próxima ocorrência baseada nas regras
 * @param {Date} currentDate - Data atual
 * @param {Object} rules - Regras parseadas do RRULE
 * @returns {Date} Próxima data de ocorrência
 */
function getNextOccurrence(currentDate, rules) {
  const interval = rules.interval || 1;
  
  switch (rules.freq) {
    case 'DAILY':
      return addDays(currentDate, interval);
      
    case 'WEEKLY':
      if (rules.byDay && rules.byDay.length > 0) {
        return getNextWeeklyByDay(currentDate, rules.byDay, interval);
      }
      return addWeeks(currentDate, interval);
      
    case 'MONTHLY':
      return addMonths(currentDate, interval);
      
    case 'YEARLY':
      return new Date(currentDate.getFullYear() + interval, currentDate.getMonth(), currentDate.getDate());
      
    default:
      return addDays(currentDate, 1);
  }
}

/**
 * Calcula próxima ocorrência semanal com dias específicos
 * @param {Date} currentDate - Data atual
 * @param {string[]} byDay - Array de dias da semana ['MO', 'TU', etc]
 * @param {number} interval - Intervalo de semanas
 * @returns {Date} Próxima data de ocorrência
 */
function getNextWeeklyByDay(currentDate, byDay, interval) {
  const dayMap = {
    'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
  };
  
  const targetDays = byDay.map(day => dayMap[day]).sort((a, b) => a - b);
  const currentDayOfWeek = currentDate.getDay();
  
  // Encontrar próximo dia válido na mesma semana
  for (const targetDay of targetDays) {
    if (targetDay > currentDayOfWeek) {
      const daysToAdd = targetDay - currentDayOfWeek;
      return addDays(currentDate, daysToAdd);
    }
  }
  
  // Se não há mais dias válidos na semana atual, ir para a próxima repetição
  // Ir para o primeiro dia válido da próxima semana válida
  const daysUntilNextWeek = 7 - currentDayOfWeek; // Dias até domingo da semana atual
  const daysIntoNextWeek = targetDays[0]; // Primeiro dia válido da próxima semana
  const totalDaysToAdd = daysUntilNextWeek + daysIntoNextWeek + ((interval - 1) * 7);
  
  return addDays(currentDate, totalDaysToAdd);
}

/**
 * Retorna o início da semana (segunda-feira)
 * @param {Date} date - Data de referência
 * @returns {Date} Início da semana
 */
function startOfWeek(date) {
  const newDate = new Date(date); // Criar nova instância para não modificar a original
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Ajustar domingo
  return new Date(newDate.setDate(diff));
}

/**
 * Gera descrição textual da regra RRULE
 * @param {string} rrule - String RRULE
 * @returns {string} Descrição em português
 */
export function getRRuleDescription(rrule) {
  if (!rrule) return '';
  
  const rules = parseRRuleString(rrule);
  const interval = rules.interval || 1;
  
  let description = '';
  
  switch (rules.freq) {
    case 'DAILY':
      description = interval === 1 ? 'Diariamente' : `A cada ${interval} dias`;
      break;
      
    case 'WEEKLY':
      if (interval === 1) {
        description = 'Semanalmente';
      } else {
        description = `A cada ${interval} semanas`;
      }
      
      if (rules.byDay && rules.byDay.length > 0) {
        const dayNames = {
          'MO': 'Segunda', 'TU': 'Terça', 'WE': 'Quarta', 
          'TH': 'Quinta', 'FR': 'Sexta', 'SA': 'Sábado', 'SU': 'Domingo'
        };
        const days = rules.byDay.map(day => dayNames[day] || day);
        description += ` (${days.join(', ')})`;
      }
      break;
      
    case 'MONTHLY':
      description = interval === 1 ? 'Mensalmente' : `A cada ${interval} meses`;
      break;
      
    case 'YEARLY':
      description = interval === 1 ? 'Anualmente' : `A cada ${interval} anos`;
      break;
  }
  
  // Adicionar informação sobre fim da recorrência
  if (rules.count) {
    description += `, ${rules.count} vezes`;
  } else if (rules.until) {
    description += ` até ${format(rules.until, 'dd/MM/yyyy')}`;
  }
  
  return description;
}

/**
 * Verifica se uma data específica é uma ocorrência do evento recorrente
 * @param {Date} date - Data a verificar
 * @param {Date} startDate - Data inicial do evento
 * @param {string} rrule - String RRULE
 * @returns {boolean} True se a data é uma ocorrência
 */
export function isOccurrenceDate(date, startDate, rrule) {
  if (!date || !startDate || !rrule) return false;
  
  const occurrences = parseRRule(rrule, startDate, date, 500); // Limite maior para verificar
  return occurrences.some(occurrence => isSameDay(occurrence, date));
}

/**
 * Gera ocorrências para um período específico (otimizado para visualização de calendário)
 * @param {Date} startDate - Data inicial do evento
 * @param {string} rrule - String RRULE
 * @param {Date} viewStart - Início do período a visualizar
 * @param {Date} viewEnd - Fim do período a visualizar
 * @returns {Date[]} Datas de ocorrência no período
 */
export function getOccurrencesInRange(startDate, rrule, viewStart, viewEnd) {
  if (!startDate || !rrule || !viewStart || !viewEnd) return [];
  
  // Gerar ocorrências suficientes para cobrir o período
  const maxOccurrences = Math.ceil((viewEnd - viewStart) / (1000 * 60 * 60 * 24)) + 100;
  const allOccurrences = parseRRule(rrule, startDate, viewEnd, maxOccurrences);
  
  // Filtrar apenas as que estão no range de visualização
  return allOccurrences.filter(date => date >= viewStart && date <= viewEnd);
}
