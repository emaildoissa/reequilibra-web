export const DIFICULDADE_FINANCEIRA: Record<string, string> = {
  "1": "Tenho muitas dívida e não sei por onde começar",
  "2": "Consignados/descontos em folha pesando muito",
  "3": "Cartão de crédito muito alto",
  "4": "Usando cheque especial para sobreviver",
  "5": "Tenho parcelas atrasadas",
  "6": "Pago tudo, mas não sobra dinheiro",
  "7": "Quero apenas me organizar melhor"
};

export const RENDA_COMPROMETIDA: Record<string, string> = {
  "1": "Menos de 20%",
  "2": "Entre 20% e 30%",
  "3": "Entre 30% e 50%",
  "4": "Mais de 50%",
  "5": "Não sei calcular"
};

export const CONTAS_BASICAS: Record<string, string> = {
  "1": "Sim, mas com dificuldade",
  "2": "Não, já estou atrasando",
  "3": "Pago usando cartão/limite/empréstimo",
  "4": "Sim, pago normalmente"
};

export const TIPO_DIVIDA: Record<string, string> = {
  "1": "Consignado",
  "2": "Cartão de crédito",
  "3": "Cheque especial",
  "4": "Empréstimo pessoal",
  "5": "Financiamento",
  "6": "Dívida com lojas/empresas",
  "7": "Várias dívidas ao mesmo tempo",
  "8": "Não sei exatamente"
};

export const FONTE_RENDA: Record<string, string> = {
  "1": "Servidor público",
  "2": "Aposentado ou pensionista",
  "3": "CLT",
  "4": "Autônomo",
  "5": "Empresário",
  "6": "Sem renda no momento"
};

export const ATRASO_NEGATIVACAO: Record<string, string> = {
  "1": "Sim, tenho dívida atrasada",
  "2": "Sim, estou recebendo cobranças",
  "3": "Sim, estou negativado",
  "4": "Sim, existe ação judicial",
  "5": "Não",
  "6": "Não sei"
};

export const DOCUMENTOS: Record<string, string> = {
  "1": "Sim, tenho boa parte",
  "2": "Tenho alguns",
  "3": "Não tenho agora, mas consigo buscar",
  "4": "Não sei onde encontrar"
};

export const INTENCAO: Record<string, string> = {
  "1": "Sim, quero fazer o diagnóstico",
  "2": "Quero entender melhor como funciona",
  "3": "Agora não",
  "4": "Só queria uma orientação rápida"
};

export const CLASSIFICACAO: Record<string, string> = {
  "QUENTE": "Potencial quente",
  "MORNO": "Morno",
  "FRIO": "Frio"
};

export function getLabel(value: string, map: Record<string, string>): string {
  if (!value) return "Não informado";
  return map[value] || value;
}