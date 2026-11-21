# desafio_teste_domino

Casos de teste para o desafio **Dominó** da disciplina Projeto, Implementação e
Teste de Software — 2026.

**Colaborador:** Gabriel de Oliveira Gnoatto — RA 23298801-2 (individual).

## 1. Especificação do desafio

O enunciado em `desafios.md` diz apenas:

> **Dominó**
> - casos de teste para testar uma partida para 02 jogadores;
> - casos de teste em Javascript para testar Javascript;

**Ele não define variante, peças, turnos nem critérios de vitória.** As regras
abaixo são, portanto, **premissas explícitas** adotadas para tornar os casos
verificáveis. Foram confirmadas antes da escrita e estão registradas aqui e no
`.docx` para que o professor possa ajustá-las se usar outra variante.

### 1.1 Variante e equipamento

- **Double-six:** 28 peças, do `[0,0]` ao `[6,6]`, incluindo as sete duplas.
- 2 jogadores; **7 peças** por jogador e **14 peças no monte**.
- **Jogador 0 começa**, fixo nos dados de teste — não há sorteio nem
  aleatoriedade em nenhum caso.

### 1.2 Estado recebido

```js
{
  maos: [ [[0,1],[2,2],...], [[3,4],[5,5],...] ], // mãos dos jogadores 0 e 1
  monte: [ [6,6],[1,3],... ],                      // peças disponíveis à esquerda
  mesa:  [ [2,4],[4,0],... ] | [],                 // fileira jogada; vazia no início
  jogador: 0 | 1,                                  // jogador da vez
  vencedor: 0 | 1 | null,                          // preenchido no fim
  evento: 'jogada' | 'passou' | 'fim' | 'erro'      // presente ao encadear turnos
}
```

- As pontas da mesa são `mesa[0][0]` (esquerda) e `mesa[mesa.length - 1][1]`
  (direita). Com a mesa vazia, qualquer peça pode ser a primeira.
- Cada peça é um par `[a, b]` de números inteiros de `0` a `6`. `[a,b]` e `[b,a]`
  são a **mesma peça**: a orientação é escolhida no momento do encaixe.
- Duplas `[x,x]` são armazenadas na mesa como `[x,x]`. Quando a dupla encaixa
  numa ponta `x`, ela é considerada **colocada na perpendicular**: a ponta
  atingida continua `x` e o retorno inclui `orientacao: 'perpendicular'`. Na
  primeira peça (mesa vazia) e nas peças comuns, `orientacao` é `'linear'`. A
  peça continua plana; a orientação é um metadado do retorno (CT-06, CT-50, CT-51).

### 1.3 Regras de turno

1. **Escolha da peça:** percorre-se a mão do jogador da vez da primeira à última
   peça. A primeira que encaixa é jogada.
2. **Ordem de tentativa** para cada peça (premissa de determinismo):
   1. ponta direita sem inverter (`peca[0] === pontaDir`);
   2. ponta direita invertendo (`peca[1] === pontaDir`);
   3. ponta esquerda sem inverter (`peca[1] === pontaEsq`);
   4. ponta esquerda invertendo (`peca[0] === pontaEsq`).
   A peça é sempre armazenada na mesa na orientação em que foi encaixada.
3. **Compra:** se nenhuma peça da mão encaixa e o monte não está vazio, o jogador
   compra **exatamente a primeira peça do monte** (`monte[0]`). Se ela encaixar,
   é jogada no mesmo turno; se não encaixar, a vez passa.
4. **Passagem:** se nenhuma peça encaixa e o monte está vazio, a vez passa ao
   outro jogador.
5. **Vitória:** ao esgotar a mão, o jogador vence e a partida termina.
6. **Bloqueio:** se o jogador da vez não tem jogada, o monte está vazio e o outro
   jogador também não tem jogada, a partida termina. Vence quem tiver a **menor
   soma de pontos** nas peças restantes; empate na soma = empate.
7. A função **não altera** o estado recebido.
8. **Fim de partida:** após `evento: 'fim'`, a função não processa outro turno;
   devolve `{ evento: 'erro', motivo: 'partida encerrada', ... }` sem alterar
   nada (CT-47).
9. **Mão vazia:** uma mão vazia no início do turno é estado inválido — a
   partida já deveria ter terminado por vitória (CT-49).

**Vitória com peça comprada é impossível** sob estas regras: a compra acrescenta
uma peça à mão e a jogada remove uma, de modo que a mão só esvazia se já estivesse
vazia antes da compra. O CT-30 fixa esse comportamento (evento `jogada`, não `fim`).

### 1.4 Contrato JavaScript

```js
const { jogarDomino } = require('./src/domino');
```

`jogarDomino(estado)` processa **um turno** e devolve um novo objeto:

| Campo | Tipo | Significado |
|---|---|---|
| `maos` | array[2] | mãos após o turno (cópias novas) |
| `monte` | array | monte após o turno |
| `mesa` | array | mesa após o turno |
| `jogador` | 0 \| 1 | jogador da vez seguinte |
| `evento` | `'jogada'` \| `'passou'` \| `'fim'` \| `'erro'` | o que aconteceu |
| `peca` | `[a,b]` \| `null` | peça jogada, se houver |
| `vencedor` | 0 \| 1 \| `null` | vencedor, somente em `fim` |
| `motivo` | string | `'jogada'`, `'sem joga'`, `'vitoria'`, `'bloqueio'` ou um dos motivos de erro de 1.6 |
| `comprou` | boolean | se houve compra do monte neste turno |
| `orientacao` | `'linear'` \| `'perpendicular'` \| `null` | como a peça foi encaixada; dupla na perpendicular |

Em `evento: 'fim'`, o campo `jogador` permanece com o índice de quem causou o
fim (não avança), pois a partida terminou.

Um **estado inválido** (campos ausentes, tipos errados, peça fora de `0..6`,
`jogador` diferente de `0`/`1`, `vencedor` fora de `0`/`1`/`null`) devolve
`{ evento: 'erro', motivo: 'estado invalido', ... }` e não altera nada.

### 1.5 Distribuição inicial

```js
const { criarPartida, jogarDomino } = require('./src/domino');
const { valida, estado, motivo } = criarPartida({ baralho, gerador, jogadorInicial });
```

- `baralho`: opcional, as 28 peças em **ordem fixa**. As primeiras 7 formam a
  mão 0, as seguintes 7 a mão 1 e as 14 restantes o monte (CT-38, CT-39).
- `gerador`: alternativa a `baralho`; função `(baralhoCanonico) => baralho`,
  chamada uma única vez. `baralho` e `gerador` são mutuamente exclusivos:
  informar os dois ao mesmo tempo, com um gerador que não é função, com um
  baralho de tamanho/peças inválidos ou com peças repetidas produz
  `valida: false`, `estado: null` e `motivo: 'baralho invalido'` (CT-40, CT-52).
- `jogadorInicial`: `0` (padrão) ou `1`; qualquer outro valor é erro (CT-40).
- Sem opções — inclusive `criarPartida()` sem argumentos — usa o baralho
  canônico ordenado de `[0,0]` a `[6,6]` (CT-54). Não há
  `Math.random`, relógio nem sorteio: o mesmo gerador sempre entrega a mesma
  distribuição, chamada exatamente uma vez (CT-40, CT-53).
- O `estado` devolvido contém `maos`, `monte`, `mesa: []`, `jogador` e
  `vencedor: null`. Para encadear turnos, use `estado = jogarDomino(estado)`:
  o retorno já traz todos os campos do estado (CT-44 a CT-46).

### 1.6 Vocabulário de `motivo`

Os testes comparam `motivo` por valor. As strings permitidas são:

| Situação | `motivo` |
|---|---|
| Peça encaixada | `'jogada'` |
| Passagem de vez | `'sem joga'` |
| Fim por vitória | `'vitoria'` |
| Fim por bloqueio | `'bloqueio'` |
| Estado inválido (inclui peça fora de `0..6`, `vencedor` inválido e entrada `null`) | `'estado invalido'` |
| Mão vazia no início do turno | `'mao vazia no inicio do turno'` |
| Turno após `evento: 'fim'` | `'partida encerrada'` |
| `criarPartida` com baralho/gerador inválidos | `'baralho invalido'` |

`criarPartida` usa `motivo: ''` quando `valida: true`. Os motivos de erro de
`criarPartida` fora da tabela acima (por exemplo `jogadorInicial` inválido)
também são comparados por valor nos testes que os exercitam (CT-40).

## 2. Funcionamento dos casos de teste

Os casos estão em
[`casos_de_teste_domino.docx`](casos_de_teste_domino.docx), no padrão do
template oficial (`aulas/SEMANA 02/docs/Caso de Teste.docx`). Cada caso contém
**Descrição**, **Pré-condições**, **Passos**, **Cenário 1** com **Dados de
Teste** e **Resultado Esperado**, e **Pós-condições**.

Cada caso tem um teste equivalente em `test/domino.test.js`, com o mesmo ID
(CT-01 a CT-57). O `.docx` é a especificação legível; o `.js` é a versão
executável, atendendo a exigência "casos de teste em Javascript para testar
Javascript".

### Casos incluídos

| ID | Objetivo | Evento esperado |
|---|---|---|
| CT-01 | Primeira jogada com mesa vazia | `jogada` |
| CT-02 | Encaixe na ponta direita, sem inverter | `jogada` |
| CT-03 | Encaixe na ponta direita, invertendo | `jogada` |
| CT-04 | Encaixe na ponta esquerda, sem inverter | `jogada` |
| CT-05 | Encaixe na ponta esquerda, invertendo | `jogada` |
| CT-06 | Dupla jogada mantém as duas pontas | `jogada` |
| CT-07 | Primeira peça jogável da mão tem prioridade | `jogada` |
| CT-08 | Pontas iguais: tenta a direita antes da esquerda | `jogada` |
| CT-09 | Sem jogada e monte vazio: passa a vez | `passou` |
| CT-10 | Compra peça jogável e joga no mesmo turno | `jogada` |
| CT-11 | Compra peça não jogável e passa a vez | `passou` |
| CT-12 | Vitória ao esgotar a mão (jogador 0) | `fim` / `vitoria` |
| CT-13 | Vitória ao esgotar a mão (jogador 1) | `fim` / `vitoria` |
| CT-14 | Bloqueio: menor soma de pontos vence | `fim` / `bloqueio` |
| CT-15 | Bloqueio com somas iguais: empate | `fim` / `bloqueio` |
| CT-16 | Estado recebido não é alterado | `jogada` |
| CT-17 | Outra partida válida (não derivada dos anteriores) | `jogada` |
| CT-18 | Peça com valor `7` fora do domínio | `erro` |
| CT-19 | Peça com valor negativo | `erro` |
| CT-20 | Peça com valor decimal `1.5` | `erro` |
| CT-21 | Peça não é um par de dois números | `erro` |
| CT-22 | `jogador` diferente de `0`/`1` | `erro` |
| CT-23 | `maos` não é um par de arrays | `erro` |
| CT-24 | Entrada `null` | `erro` |
| CT-25 | Campo `mesa` ausente | `erro` |
| CT-26 | Campo `monte` ausente | `erro` |
| CT-27 | Campo `jogador` ausente | `erro` |
| CT-28 | Campo `maos` ausente | `erro` |
| CT-29 | Compra que encaixa à esquerda | `jogada` |
| CT-30 | Compra não zera a mão (não gera vitória) | `jogada` |
| CT-31 | Bloqueio após compra que esvazia o monte | `fim` / `bloqueio` |
| CT-32 | Peça inválida na `mesa` | `erro` |
| CT-33 | Peça inválida no `monte` | `erro` |
| CT-34 | `jogador` como string `"0"` | `erro` |
| CT-35 | `maos` com 3 elementos | `erro` |
| CT-36 | Peça com `NaN` | `erro` |
| CT-37 | Peça com booleano | `erro` |
| CT-38 | Distribuição completa 7 / 7 / 14 | `jogada` |
| CT-39 | `criarPartida()` padrão: 7 / 7 / 14, 28 peças únicas | `valida: true` |
| CT-40 | Gerador fixo reproduzível; gerador e `jogadorInicial` inválidos | `valida: true` / erro |
| CT-41 | Uma compra por turno, mesmo com a 2ª peça encaixando | `passou` |
| CT-42 | Compra que encaixa à direita invertendo | `jogada` |
| CT-43 | Bloqueio com jogador 1 na vez | `fim` / `bloqueio` |
| CT-44 | Passagem seguida da jogada do adversário | `passou` → `jogada` |
| CT-45 | Partida completa até vitória | `fim` / `vitoria` |
| CT-46 | Partida completa até bloqueio | `fim` / `bloqueio` |
| CT-47 | Turno após `evento: 'fim'` | `erro` |
| CT-48 | `monte`/`mesa` não-array e peças inválidas nesses campos | `erro` |
| CT-49 | Mão vazia no início do turno | `erro` |
| CT-50 | Dupla jogada na perpendicular | `jogada` / `perpendicular` |
| CT-51 | Dupla encostada na ponta esquerda | `jogada` / `perpendicular` |
| CT-52 | Baralho duplicado e baralho curto | `erro` / `baralho invalido` |
| CT-53 | Gerador injetado chamado uma única vez | `valida: true` / contador 1 |
| CT-54 | `criarPartida()` sem argumentos | `valida: true` / baralho canônico |
| CT-55 | Evento de entrada diferente de `fim` | `jogada` |
| CT-56 | `vencedor` fora de `0`/`1`/`null` | `erro` / `estado invalido` |
| CT-57 | Vocabulário fechado de `motivo` | `erro` / motivo do vocabulário |

### Cobertura das regras

| Regra / premissa | Casos que a cobrem |
|---|---|
| Mesa vazia / primeira peça | CT-01 |
| Encaixe na direita (com e sem inversão) | CT-02, CT-03, CT-08 |
| Encaixe na esquerda (com e sem inversão) | CT-04, CT-05 |
| Duplas | CT-06 |
| Ordem de escolha determinística | CT-07, CT-08 |
| Passagem | CT-09, CT-11 |
| Compra do monte | CT-10, CT-11, CT-29, CT-30, CT-31 |
| Vitória | CT-12, CT-13 |
| Bloqueio e soma de pontos | CT-14, CT-15, CT-31 |
| Não mutação | CT-16 (e verificação automática em todos os casos) |
| Caminho válido independente | CT-17 |
| Distribuição 7 / 7 / 14 | CT-38 |
| Validação de estado | CT-18 a CT-28, CT-32 a CT-37, CT-48, CT-49 |
| Distribuição determinística | CT-39, CT-40 |
| Uma compra por turno | CT-41 |
| Compra invertendo à direita | CT-42 |
| Simetria do jogador 1 | CT-13, CT-43 |
| Partida encadeada | CT-44, CT-45, CT-46 |
| Pós-fim | CT-47 |
| Duplas na perpendicular | CT-06, CT-50, CT-51 |
| Baralho duplicado/curto e gerador | CT-40, CT-52, CT-53, CT-54 |
| Evento de entrada | CT-47, CT-55 |
| Vencedor inválido | CT-56 |
| Vocabulário de erro | CT-18 a CT-28, CT-32 a CT-37, CT-48, CT-49, CT-52, CT-56, CT-57 |

### Casos executáveis em JavaScript

- **Runner:** `node --test` (nativo do Node.js 18+), sem dependências.
- **Executar:** `npm test` na raiz do repositório.
- **Situação atual:** os 57 casos viram 60 testes (CT-48 tem quatro linhas) e
  falham: `# tests 60`, `# pass 0`, `# fail 60`. Esse é o estado **RED**
  esperado: a implementação do jogo não faz parte deste entregável. As mensagens
  citam `src/domino.js` e trazem o `stack` real de carregamento.
- **Ciclo TDD:** o RED é registrado neste repositório; o GREEN (60/60) e a
  refatoração foram executados em cópia descartável com implementação de
  referência e 10 variantes defeituosas (compra múltipla, distribuição
  alternada, turno pós-fim, ausência de `orientacao`, mão vazia aceita, dupla
  na esquerda sem perpendicular, baralho duplicado, gerador chamado duas vezes,
  baralho padrão invertido, vencedor inválido, motivo fora do vocabulário e
  mutação da mão). Todas as 10 variantes foram detectadas. Nenhuma
  implementação foi deixada aqui.
- **Determinismo:** nenhum caso usa `Math.random`, sorteio ou tempo. As mãos, o
  monte, a mesa e o jogador estão fixos no caso; quando a distribuição é
  necessária, o baralho é explícito ou vem de um gerador injetado com sequência
  fixa (CT-40, CT-45, CT-46).
- **Correção do helper:** `copia` preserva `NaN` e funções. O `JSON.stringify`
  original convertia `NaN` em `null` e já fazia o CT-36 falhar mesmo com a
  implementação correta; a nova cópia também permite injetar `gerador`. O
  `motivo` é comparado **por valor** em todos os casos, inclusive nos de erro;
  a checagem relaxada de "string não vazia" foi removida.

### Premissas que podem ser revisadas

Se o professor adotar outra variante, estes pontos precisam mudar em conjunto:
número de peças e tamanho das mãos (1.1, exercitado no CT-38 com as 28 peças),
ordem de prioridade do encaixe (1.3.2), compra de uma peça por turno (1.3.3),
critério de bloqueio (1.3.6), o metadado `orientacao` das duplas (1.2,
CT-50, CT-51), o vocabulário de `motivo` (1.6, CT-57), a validação de
`vencedor` (CT-56) e a regra de que somente `evento: 'fim'` encerra o turno
(1.3.8, CT-55).
O monte do CT-31 foi corrigido para `[6,6]`: o baralho double-six tem cada peça
uma única vez; o bloqueio e o vencedor 1 foram preservados (somas 25 e 7).

## 3. Estrutura do repositório

```
desafio_teste_domino/
├── README.md
├── package.json
├── casos_de_teste_domino.docx
└── test/
    └── domino.test.js
```

Não há implementação do jogo neste repositório: o entregável é a especificação
dos casos (`.docx`) e sua versão executável em JavaScript (`test/`).

## 4. Colaboradores

- Gabriel de Oliveira Gnoatto — RA 23298801-2
