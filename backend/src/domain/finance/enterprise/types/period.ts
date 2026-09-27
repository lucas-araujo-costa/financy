/** Um mês do calendário. `month` vai de 1 (janeiro) a 12 (dezembro). */
export interface Period {
  month: number
  year: number
}

/**
 * Intervalo [start, end) do mês em UTC. A data da transação é um dia do
 * calendário, guardado como meia-noite UTC.
 */
export function getPeriodRange({ month, year }: Period) {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  }
}
