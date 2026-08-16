# 🏆 Arena XP — Ranking & Performance

Aplicativo de ranking e gamificação da campanha BMW X1 2012.

## O que foi corrigido

- XP TOTAL calculado automaticamente: produção + disciplina + bônus.
- Promotor/Captação passou a pontuar produção com 1.400 XP por R$ 1.000 de VGV, seguindo a regra de Captador usada no regulamento/modelo anterior.
- Liner: 1.200 XP por R$ 1.000.
- Closer: 1.000 XP por R$ 1.000.
- Presença: 50.000 XP/dia.
- Pontualidade: 50.000 XP/dia.
- Falta: 0 XP de presença.
- Atraso: 0 XP de pontualidade.
- Duplicidades de participante são eliminadas pelo ID antes da soma.
- TOP 3, posição e distância para o próximo colocado recalculam automaticamente.
- Ranking mensal soma somente lançamentos administrativos comprovados por mês; a produção mensal não é inventada quando a base publicada está apenas consolidada.

## PWA

O projeto possui `manifest.json`, `sw.js` e `icon.svg`. No Chrome/Edge compatível aparecerá o botão **Instalar**. Em iPhone/iPad, use Compartilhar → Adicionar à Tela de Início.

## Base atual

- Período: 01/07/2026 até 09/08/2026.
- Contratos ATIVOS no painel atual: 109.
- VGV ativo atual: R$ 14.805.551,91.

## Forma inteligente de atualizar os dados

### Opção recomendada — GitHub + CSV + Actions

1. Exporte a planilha oficial para CSV.
2. Abra `data/base.csv` no GitHub.
3. Substitua o conteúdo pelo CSV novo.
4. O GitHub Actions executa `scripts/build_data.py` automaticamente.
5. O script gera `data.js` e faz o commit.
6. O GitHub Pages atualiza o aplicativo.

O CSV deve conter pelo menos estas colunas:

`Promotor de marketing, Valor vendido, Data de atendimento, Status do contrato, Liner, Closer, Qualificação`

### Opção rápida — pelo próprio aplicativo

Admin → **Atualização inteligente da base** → importar CSV/JSON → baixar `data.js` atualizado → substituir `data.js` no GitHub.

Essa opção é útil para teste. Para produção, prefira a rotina `data/base.csv` + GitHub Actions.

## Disciplina

Os lançamentos de presença, pontualidade e bônus desta versão ficam no `localStorage` do navegador. Portanto, se Raphael lançar uma falta no computador, os celulares da equipe não recebem essa informação automaticamente.

### Próxima evolução recomendada

Migrar `attendance` e `bonuses` para Supabase. Assim haverá uma única base online, painel administrativo centralizado, histórico de alterações e ranking em tempo real para todos os aparelhos.
