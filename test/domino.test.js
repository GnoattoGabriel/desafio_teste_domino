'use strict';

// Casos de teste executaveis correspondentes a casos_de_teste_domino.docx.
// A implementacao de src/domino.js deve ser produzida a partir da especificacao
// em .docx. Enquanto ela nao existe, os testes falham com mensagem clara
// (estado RED esperado do desafio).

const test = require('node:test');
const assert = require('node:assert/strict');

let jogarDomino;
try {
  jogarDomino = require('../src/domino').jogarDomino;
} catch (erro) {
  const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
  jogarDomino = () => {
    throw new Error(
      'Crie src/domino.js exportando jogarDomino. ' + detalhe
    );
  };
}
if (typeof jogarDomino !== 'function') {
  jogarDomino = () => {
    throw new Error('Exporte jogarDomino de src/domino.js');
  };
}

let criarPartida;
try {
  criarPartida = require('../src/domino').criarPartida;
} catch (erro) {
  const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
  criarPartida = () => {
    throw new Error(
      'Crie src/domino.js exportando criarPartida. ' + detalhe
    );
  };
}
if (typeof criarPartida !== 'function') {
  criarPartida = () => { throw new Error('Exporte criarPartida de src/domino.js'); };
}

// Copia profunda que preserva NaN e funcoes (JSON.stringify corrompe ambos).
const copia = (v) => {
  if (typeof v === 'function' || v == null) return v;
  if (Array.isArray(v)) return v.map(copia);
  if (typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copia(x)]));
  }
  return v;
};

// opcoes.funcao troca a funcao testada (criarPartida); opcoes.passos encadeia
// turnos de jogarDomino; opcoes.proximo extrai o estado inicial apos criarPartida;
// opcoes.apos permite conferir chamadas adicionais dentro do mesmo caso.
const verifica = (id, descricao, entrada, esperado, opcoes = {}) => {
  test(`${id} — ${descricao}`, () => {
    const estadoAntes = copia(entrada);
    const funcao = opcoes.funcao || jogarDomino;
    const saida = funcao(entrada);
    const checar = (atual, previsto) => {
      for (const [campo, valor] of Object.entries(previsto)) {
        assert.deepEqual(atual[campo], valor, `${id}: campo ${campo}`);
      }
    };
    checar(saida, esperado);
    if (opcoes.passos) {
      let atual = opcoes.proximo ? opcoes.proximo(saida) : saida;
      for (const passo of opcoes.passos) {
        const objeto = atual;
        const antesDoPasso = copia(objeto);
        atual = jogarDomino(objeto);
        checar(atual, passo);
        assert.deepEqual(objeto, antesDoPasso, `${id}: turno encadeado nao pode alterar o estado recebido`);
      }
    }
    if (opcoes.apos) opcoes.apos(saida);
    assert.deepEqual(entrada, estadoAntes, `${id}: estado recebido nao pode ser alterado`);
  });
};

verifica('CT-01', 'jogar a primeira peca com a mesa vazia', {
  maos: [
    [
      [2, 4],
      [1, 1],
      [6, 3]
    ],
    [
      [5, 5],
      [0, 2],
      [4, 6]
    ]
  ],
  monte: [
    [3, 3],
    [2, 2]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [2, 4],
  mesa: [
    [2, 4]
  ],
  maos: [
    [
      [1, 1],
      [6, 3]
    ],
    [
      [5, 5],
      [0, 2],
      [4, 6]
    ]
  ],
  monte: [
    [3, 3],
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-02', 'encaixar na ponta direita sem inverter a peca', {
  maos: [
    [
      [5, 3],
      [0, 0],
      [6, 1]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [5, 3],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 3]
  ],
  maos: [
    [
      [0, 0],
      [6, 1]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-03', 'encaixar na ponta direita invertendo a peca', {
  maos: [
    [
      [3, 5],
      [0, 0],
      [6, 1]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [5, 3],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 3]
  ],
  maos: [
    [
      [0, 0],
      [6, 1]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-04', 'encaixar na ponta esquerda sem inverter a peca', {
  maos: [
    [
      [6, 1],
      [0, 0],
      [3, 4]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [6, 1],
  mesa: [
    [6, 1],
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 0],
      [3, 4]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-05', 'encaixar na ponta esquerda invertendo a peca', {
  maos: [
    [
      [1, 4],
      [0, 0],
      [3, 6]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [4, 1],
  mesa: [
    [4, 1],
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 0],
      [3, 6]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-06', 'jogar uma dupla mantendo as duas pontas', {
  maos: [
    [
      [3, 3],
      [1, 1],
      [4, 5]
    ],
    [
      [6, 6],
      [0, 2],
      [5, 5]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [
    [2, 3]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [3, 3],
  mesa: [
    [2, 3],
    [3, 3]
  ],
  maos: [
    [
      [1, 1],
      [4, 5]
    ],
    [
      [6, 6],
      [0, 2],
      [5, 5]
    ]
  ],
  monte: [
    [0, 0]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-07', 'priorizar a primeira peca jogável da mao', {
  maos: [
    [
      [0, 6],
      [5, 4],
      [1, 3]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [5, 4],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 4]
  ],
  maos: [
    [
      [0, 6],
      [1, 3]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-08', 'com pontas iguais, tentar a direita antes da esquerda', {
  maos: [
    [
      [4, 2],
      [3, 3]
    ],
    [
      [6, 6],
      [0, 1],
      [5, 5]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [4, 4]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [4, 2],
  mesa: [
    [4, 4],
    [4, 2]
  ],
  maos: [
    [
      [3, 3]
    ],
    [
      [6, 6],
      [0, 1],
      [5, 5]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-09', 'passar a vez quando nao há jogada e o monte está vazio', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [5, 1],
      [3, 3]
    ]
  ],
  monte: [],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'passou',
  peca: null,
  mesa: [
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [5, 1],
      [3, 3]
    ]
  ],
  monte: [],
  jogador: 1,
  vencedor: null,
  motivo: 'sem joga',
  comprou: false
});

verifica('CT-10', 'comprar peca jogável e jogá-la no mesmo turno', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [3, 3],
      [1, 1]
    ]
  ],
  monte: [
    [5, 6],
    [0, 0]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [5, 6],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 6]
  ],
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [3, 3],
      [1, 1]
    ]
  ],
  monte: [
    [0, 0]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: true
});

verifica('CT-11', 'comprar peca nao jogável e passar a vez', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [5, 1],
      [2, 2]
    ]
  ],
  monte: [
    [0, 0],
    [3, 3]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'passou',
  peca: null,
  mesa: [
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6],
      [0, 0]
    ],
    [
      [5, 1],
      [2, 2]
    ]
  ],
  monte: [
    [3, 3]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'sem joga',
  comprou: true
});

verifica('CT-12', 'declarar vitoria do jogador 0 ao esgotar a mao', {
  maos: [
    [
      [5, 6]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'fim',
  peca: [5, 6],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 6]
  ],
  maos: [
    [],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  jogador: 0,
  vencedor: 0,
  motivo: 'vitoria',
  comprou: false
});

verifica('CT-13', 'declarar vitoria do jogador 1 ao esgotar a mao', {
  maos: [
    [
      [3, 3],
      [4, 4]
    ],
    [
      [6, 1]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 1
}, {
  evento: 'fim',
  peca: [6, 1],
  mesa: [
    [6, 1],
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [3, 3],
      [4, 4]
    ],
    []
  ],
  monte: [
    [0, 0]
  ],
  jogador: 1,
  vencedor: 1,
  motivo: 'vitoria',
  comprou: false
});

verifica('CT-14', 'bloqueio: vence a menor soma de pontos', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [0, 0],
      [3, 4]
    ]
  ],
  monte: [],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'fim',
  peca: null,
  mesa: [
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [0, 0],
      [3, 4]
    ]
  ],
  monte: [],
  jogador: 0,
  vencedor: 1,
  motivo: 'bloqueio',
  comprou: false
});

verifica('CT-15', 'bloqueio com somas iguais termina em empate', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [6, 4],
      [3, 0]
    ]
  ],
  monte: [],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'fim',
  peca: null,
  mesa: [
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [6, 4],
      [3, 0]
    ]
  ],
  monte: [],
  jogador: 0,
  vencedor: null,
  motivo: 'bloqueio',
  comprou: false
});

verifica('CT-17', 'jogar em uma partida diferente da de referência', {
  maos: [
    [
      [3, 5],
      [2, 2],
      [4, 1]
    ],
    [
      [6, 6],
      [5, 5],
      [0, 4]
    ]
  ],
  monte: [
    [1, 1],
    [2, 3]
  ],
  mesa: [
    [6, 0],
    [0, 3]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [3, 5],
  mesa: [
    [6, 0],
    [0, 3],
    [3, 5]
  ],
  maos: [
    [
      [2, 2],
      [4, 1]
    ],
    [
      [6, 6],
      [5, 5],
      [0, 4]
    ]
  ],
  monte: [
    [1, 1],
    [2, 3]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

verifica('CT-18', 'rejeitar peca com valor 7', {
  maos: [
    [
      [7, 1],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-19', 'rejeitar peca com valor negativo', {
  maos: [
    [
      [-1, 2],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-20', 'rejeitar peca com valor decimal', {
  maos: [
    [
      [1.5, 2],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-21', 'rejeitar peca que nao e um par de numeros', {
  maos: [
    [
      [1],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-22', 'rejeitar jogador diferente de 0 ou 1', {
  maos: [
    [
      [1, 2],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 2
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-23', 'rejeitar maos que nao sao um par de arrays', {
  maos: [
    [
      [1, 2]
    ],
    'invalido'
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-24', 'rejeitar entrada nula', null, {
  evento: 'erro',
  motivo: 'estado invalido'
});

test('CT-16 — o estado recebido nao e alterado', () => {
  const entrada = {
  maos: [
    [
      [5, 3],
      [0, 0],
      [6, 1]
    ],
    [
      [3, 3],
      [4, 4],
      [0, 6]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
};
  const antes = copia(entrada);
  const saida = jogarDomino(entrada);
  assert.equal(saida.evento, 'jogada', 'CT-16: retorno esperado');
  assert.deepEqual(entrada, antes, 'CT-16: o estado nao pode ser alterado');
});

verifica('CT-25', 'rejeitar estado sem o campo mesa', {
  maos: [
    [
      [5, 3],
      [0, 0]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [2, 2]
  ],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-26', 'rejeitar estado sem o campo monte', {
  maos: [
    [
      [5, 3],
      [0, 0]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-27', 'rejeitar estado sem o campo jogador', {
  maos: [
    [
      [5, 3],
      [0, 0]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ]
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-28', 'rejeitar estado sem o campo maos', {
  monte: [
    [2, 2]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-29', 'comprar peca jogável e encaixá-la à esquerda', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [3, 3],
      [2, 2]
    ]
  ],
  monte: [
    [6, 1],
    [0, 0]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [6, 1],
  mesa: [
    [6, 1],
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [3, 3],
      [2, 2]
    ]
  ],
  monte: [
    [0, 0]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: true
});

verifica('CT-30', 'comprar e jogar nao encerra a partida quando sobra peca', {
  maos: [
    [
      [0, 3]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [5, 6]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [5, 6],
  mesa: [
    [1, 2],
    [2, 5],
    [5, 6]
  ],
  maos: [
    [
      [0, 3]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: true
});

verifica('CT-31', 'bloquear apos compra sem encaixe que esvazia o monte', {
  maos: [
    [
      [0, 3],
      [4, 6]
    ],
    [
      [0, 0],
      [3, 4]
    ]
  ],
  monte: [
    [6, 6]
  ],
  mesa: [
    [1, 2],
    [2, 5]
  ],
  jogador: 0
}, {
  evento: 'fim',
  peca: null,
  mesa: [
    [1, 2],
    [2, 5]
  ],
  maos: [
    [
      [0, 3],
      [4, 6],
      [6, 6]
    ],
    [
      [0, 0],
      [3, 4]
    ]
  ],
  monte: [],
  jogador: 0,
  vencedor: 1,
  motivo: 'bloqueio',
  comprou: true
});

verifica('CT-32', 'rejeitar peca inválida na mesa', {
  maos: [
    [
      [1, 2]
    ],
    [
      [3, 3]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [
    [8, 1]
  ],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-33', 'rejeitar peca inválida no monte', {
  maos: [
    [
      [1, 2]
    ],
    [
      [3, 3]
    ]
  ],
  monte: [
    [-2, 3]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-34', 'rejeitar jogador do tipo texto', {
  maos: [
    [
      [1, 2]
    ],
    [
      [3, 3]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: '0'
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-35', 'rejeitar maos com tres elementos', {
  maos: [
    [
      [1, 2]
    ],
    [
      [3, 3]
    ],
    [
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-36', 'rejeitar peca com nan', {
  maos: [
    [
      [NaN, 2],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-37', 'rejeitar peca booleana', {
  maos: [
    [
      [true, 2],
      [2, 2]
    ],
    [
      [3, 3],
      [4, 4]
    ]
  ],
  monte: [
    [0, 0]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'erro',
  motivo: 'estado invalido'
});

verifica('CT-38', 'jogar com a distribuicao completa 7 / 7 / 14', {
  maos: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6]
    ],
    [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [2, 2]
    ]
  ],
  monte: [
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 5],
    [5, 6],
    [6, 6]
  ],
  mesa: [],
  jogador: 0
}, {
  evento: 'jogada',
  peca: [0, 0],
  mesa: [
    [0, 0]
  ],
  maos: [
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6]
    ],
    [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [2, 2]
    ]
  ],
  monte: [
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 5],
    [5, 6],
    [6, 6]
  ],
  jogador: 1,
  vencedor: null,
  motivo: 'jogada',
  comprou: false
});

// -------------------------------------------------------------------------
// Extensao aditiva: distribuicao inicial, turnos encadeados, fim de partida,
// duplas na perpendicular e validacoes adicionais (CT-39 a CT-50).
// CT-01 a CT-38 permanecem com os mesmos IDs, dados e esperados; apenas o
// monte do CT-31 foi corrigido para nao duplicar a dupla [0,0].
// -------------------------------------------------------------------------

verifica('CT-39', 'criarPartida entrega a distribuicao completa 7 / 7 / 14', {}, {
  "valida": true,
  "estado": {
    "maos": [
      [
        [
          0,
          0
        ],
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          3
        ],
        [
          0,
          4
        ],
        [
          0,
          5
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          1,
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          1,
          5
        ],
        [
          1,
          6
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        2,
        3
      ],
      [
        2,
        4
      ],
      [
        2,
        5
      ],
      [
        2,
        6
      ],
      [
        3,
        3
      ],
      [
        3,
        4
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        4
      ],
      [
        4,
        5
      ],
      [
        4,
        6
      ],
      [
        5,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "mesa": [],
    "jogador": 0,
    "vencedor": null
  },
  "motivo": ""
}, { funcao: criarPartida });

verifica('CT-40', 'distribuicao reproduzivel com gerador fixo e erro com gerador invalido',
  { gerador: (d) => [...d].reverse() },
  {
    "valida": true,
    "estado": {
      "maos": [
        [
          [
            6,
            6
          ],
          [
            5,
            6
          ],
          [
            5,
            5
          ],
          [
            4,
            6
          ],
          [
            4,
            5
          ],
          [
            4,
            4
          ],
          [
            3,
            6
          ]
        ],
        [
          [
            3,
            5
          ],
          [
            3,
            4
          ],
          [
            3,
            3
          ],
          [
            2,
            6
          ],
          [
            2,
            5
          ],
          [
            2,
            4
          ],
          [
            2,
            3
          ]
        ]
      ],
      "monte": [
        [
          2,
          2
        ],
        [
          1,
          6
        ],
        [
          1,
          5
        ],
        [
          1,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          6
        ],
        [
          0,
          5
        ],
        [
          0,
          4
        ],
        [
          0,
          3
        ],
        [
          0,
          2
        ],
        [
          0,
          1
        ],
        [
          0,
          0
        ]
      ],
      "mesa": [],
      "jogador": 0,
      "vencedor": null
    },
    "motivo": ""
  }, {
  funcao: criarPartida,
  apos: (saida) => {
    assert.deepEqual(criarPartida({ gerador: (d) => [...d].reverse() }).estado,
      saida.estado, 'CT-40: o mesmo gerador reparte as mesmas maos e o mesmo monte');
    const invalido = criarPartida({ gerador: null });
    assert.equal(invalido.valida, false, 'CT-40: gerador invalido');
    assert.equal(invalido.estado, null, 'CT-40: sem estado com gerador invalido');
    assert.equal(invalido.motivo, 'baralho invalido',
      'CT-40: motivo exato para gerador invalido');
    assert.equal(criarPartida({ jogadorInicial: 1 }).estado.jogador, 1,
      'CT-40: jogadorInicial 1');
    assert.equal(criarPartida({ jogadorInicial: 2 }).valida, false,
      'CT-40: jogadorInicial fora de 0/1');
    const baralhoValido = [
      ...saida.estado.maos[0],
      ...saida.estado.maos[1],
      ...saida.estado.monte
    ];
    const conflito = criarPartida({ baralho: baralhoValido, gerador: (d) => d });
    assert.equal(conflito.valida, false, 'CT-40: baralho e gerador sao exclusivos');
    assert.equal(conflito.estado, null, 'CT-40: sem estado com opcoes conflitantes');
    assert.equal(conflito.motivo, 'baralho invalido',
      'CT-40: motivo exato para opcoes conflitantes');
  }
});

verifica('CT-41', 'comprar apenas a primeira peca do monte quando a segunda encaixaria',
  { maos: [[[0,3],[4,6]], [[3,3],[1,1]]], monte: [[0,0],[5,5]],
  mesa: [[1,2],[2,5]], jogador: 0 },
  {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ],
        [
          0,
          0
        ]
      ],
      [
        [
          3,
          3
        ],
        [
          1,
          1
        ]
      ]
    ],
    "monte": [
      [
        5,
        5
      ]
    ],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  });

verifica('CT-42', 'comprar e encaixar na ponta direita invertendo a peca',
  { maos: [[[0,3],[4,6]], [[3,3],[1,1]]], monte: [[3,5],[0,0]],
  mesa: [[1,2],[2,5]], jogador: 0 },
  {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ]
      ],
      [
        [
          3,
          3
        ],
        [
          1,
          1
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        3
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      3
    ],
    "motivo": "jogada",
    "comprou": true,
    "orientacao": "linear",
    "evento": "jogada"
  });

verifica('CT-43', 'bloquear com o jogador 1 na vez (simetria dos CT-14 e CT-15)',
  { maos: [[[0,3],[4,6]], [[0,0],[3,4]]], monte: [],
  mesa: [[1,2],[2,5]], jogador: 1 },
  {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ]
      ],
      [
        [
          0,
          0
        ],
        [
          3,
          4
        ]
      ]
    ],
    "monte": [],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": 1,
    "peca": null,
    "motivo": "bloqueio",
    "comprou": false,
    "orientacao": null,
    "evento": "fim"
  });

verifica('CT-44', 'passagem seguida da jogada do adversario',
  { maos: [[[0,3],[4,6]], [[5,4],[3,3]]], monte: [],
  mesa: [[1,2],[2,5]], jogador: 0 },
  {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ]
      ],
      [
        [
          5,
          4
        ],
        [
          3,
          3
        ]
      ]
    ],
    "monte": [],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": false,
    "orientacao": null,
    "evento": "passou"
  },
  { passos: [      {
          "maos": [
            [
              [
                0,
                3
              ],
              [
                4,
                6
              ]
            ],
            [
              [
                3,
                3
              ]
            ]
          ],
          "monte": [],
          "mesa": [
            [
              1,
              2
            ],
            [
              2,
              5
            ],
            [
              5,
              4
            ]
          ],
          "jogador": 0,
          "vencedor": null,
          "peca": [
            5,
            4
          ],
          "motivo": "jogada",
          "comprou": false,
          "orientacao": "linear",
          "evento": "jogada"
        }] });

const baralho45 = [
  [
    6,
    6
  ],
  [
    5,
    6
  ],
  [
    5,
    5
  ],
  [
    4,
    6
  ],
  [
    4,
    5
  ],
  [
    4,
    4
  ],
  [
    3,
    6
  ],
  [
    3,
    5
  ],
  [
    3,
    4
  ],
  [
    3,
    3
  ],
  [
    2,
    6
  ],
  [
    2,
    5
  ],
  [
    2,
    4
  ],
  [
    2,
    3
  ],
  [
    2,
    2
  ],
  [
    1,
    6
  ],
  [
    1,
    5
  ],
  [
    1,
    4
  ],
  [
    1,
    3
  ],
  [
    1,
    2
  ],
  [
    1,
    1
  ],
  [
    0,
    6
  ],
  [
    0,
    5
  ],
  [
    0,
    4
  ],
  [
    0,
    3
  ],
  [
    0,
    2
  ],
  [
    0,
    1
  ],
  [
    0,
    0
  ]
];
const passos45 = [
  {
    "maos": [
      [
        [
          5,
          6
        ],
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ],
        [
          3,
          6
        ]
      ],
      [
        [
          3,
          5
        ],
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          6
        ],
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        6
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      6,
      6
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          5,
          6
        ],
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ],
        [
          3,
          6
        ]
      ],
      [
        [
          3,
          5
        ],
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        6
      ],
      [
        6,
        2
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      6,
      2
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ],
        [
          3,
          6
        ]
      ],
      [
        [
          3,
          5
        ],
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      6
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ],
        [
          3,
          6
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      3,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      6,
      3
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          5,
          5
        ],
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      2,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        2
      ],
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "perpendicular",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          4,
          6
        ],
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        4,
        6
      ],
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      4,
      6
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          4,
          5
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        3,
        4
      ],
      [
        4,
        6
      ],
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      3,
      4
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          4,
          4
        ]
      ],
      [
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        3,
        4
      ],
      [
        4,
        6
      ],
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        4
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      4
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        3,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        6
      ],
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        4
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      3,
      3
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "perpendicular",
    "evento": "jogada"
  },
  {
    "maos": [
      [],
      [
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        5
      ],
      [
        0,
        4
      ],
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        0,
        1
      ],
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        3,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        6
      ],
      [
        6,
        3
      ],
      [
        3,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        6,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        4
      ]
    ],
    "jogador": 0,
    "vencedor": 0,
    "peca": [
      4,
      4
    ],
    "motivo": "vitoria",
    "comprou": false,
    "orientacao": "perpendicular",
    "evento": "fim"
  }
];

verifica('CT-45', 'partida completa ate vitoria por esgotar a mao',
  { baralho: baralho45 },
  {
    "valida": true,
    "estado": {
      "maos": [
        [
          [
            6,
            6
          ],
          [
            5,
            6
          ],
          [
            5,
            5
          ],
          [
            4,
            6
          ],
          [
            4,
            5
          ],
          [
            4,
            4
          ],
          [
            3,
            6
          ]
        ],
        [
          [
            3,
            5
          ],
          [
            3,
            4
          ],
          [
            3,
            3
          ],
          [
            2,
            6
          ],
          [
            2,
            5
          ],
          [
            2,
            4
          ],
          [
            2,
            3
          ]
        ]
      ],
      "monte": [
        [
          2,
          2
        ],
        [
          1,
          6
        ],
        [
          1,
          5
        ],
        [
          1,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          6
        ],
        [
          0,
          5
        ],
        [
          0,
          4
        ],
        [
          0,
          3
        ],
        [
          0,
          2
        ],
        [
          0,
          1
        ],
        [
          0,
          0
        ]
      ],
      "mesa": [],
      "jogador": 0,
      "vencedor": null
    },
    "motivo": ""
  },
  { funcao: criarPartida, proximo: (saida) => saida.estado, passos: passos45 });

const baralho46 = [
  [
    1,
    6
  ],
  [
    2,
    2
  ],
  [
    1,
    1
  ],
  [
    0,
    2
  ],
  [
    0,
    4
  ],
  [
    5,
    6
  ],
  [
    0,
    6
  ],
  [
    1,
    5
  ],
  [
    4,
    5
  ],
  [
    2,
    3
  ],
  [
    1,
    4
  ],
  [
    4,
    6
  ],
  [
    0,
    5
  ],
  [
    1,
    2
  ],
  [
    4,
    4
  ],
  [
    1,
    3
  ],
  [
    5,
    5
  ],
  [
    6,
    6
  ],
  [
    2,
    5
  ],
  [
    3,
    5
  ],
  [
    3,
    6
  ],
  [
    2,
    6
  ],
  [
    3,
    4
  ],
  [
    3,
    3
  ],
  [
    0,
    3
  ],
  [
    2,
    4
  ],
  [
    0,
    0
  ],
  [
    0,
    1
  ]
];
const passos46 = [
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          4
        ],
        [
          5,
          6
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          1,
          5
        ],
        [
          4,
          5
        ],
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          0,
          5
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        1,
        6
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      1,
      6
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          4
        ],
        [
          5,
          6
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          4,
          5
        ],
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          0,
          5
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      5,
      1
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          4
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          4,
          5
        ],
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          0,
          5
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      6,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          4
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          0,
          5
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      5,
      4
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          0,
          5
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      4,
      0
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        4,
        4
      ],
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      0,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ]
      ]
    ],
    "monte": [
      [
        1,
        3
      ],
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ]
      ]
    ],
    "monte": [
      [
        5,
        5
      ],
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ]
      ]
    ],
    "monte": [
      [
        6,
        6
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      5
    ],
    "motivo": "jogada",
    "comprou": true,
    "orientacao": "perpendicular",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ]
      ]
    ],
    "monte": [
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          2,
          3
        ],
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ]
      ]
    ],
    "monte": [
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      2
    ],
    "motivo": "jogada",
    "comprou": true,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ]
      ]
    ],
    "monte": [
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": [
      2,
      3
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ]
      ]
    ],
    "monte": [
      [
        3,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      3,
      5
    ],
    "motivo": "jogada",
    "comprou": true,
    "orientacao": "linear",
    "evento": "jogada"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ]
      ]
    ],
    "monte": [
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ]
      ]
    ],
    "monte": [
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ]
      ]
    ],
    "monte": [
      [
        3,
        3
      ],
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ],
        [
          3,
          3
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ]
      ]
    ],
    "monte": [
      [
        0,
        3
      ],
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ],
        [
          3,
          3
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ],
        [
          0,
          3
        ]
      ]
    ],
    "monte": [
      [
        2,
        4
      ],
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ],
        [
          0,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ],
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ],
        [
          0,
          3
        ],
        [
          0,
          0
        ]
      ]
    ],
    "monte": [
      [
        0,
        1
      ]
    ],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "peca": null,
    "motivo": "sem joga",
    "comprou": true,
    "orientacao": null,
    "evento": "passou"
  },
  {
    "maos": [
      [
        [
          2,
          2
        ],
        [
          1,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          6
        ],
        [
          4,
          4
        ],
        [
          2,
          6
        ],
        [
          3,
          3
        ],
        [
          2,
          4
        ],
        [
          0,
          1
        ]
      ],
      [
        [
          1,
          4
        ],
        [
          4,
          6
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          6,
          6
        ],
        [
          3,
          6
        ],
        [
          3,
          4
        ],
        [
          0,
          3
        ],
        [
          0,
          0
        ]
      ]
    ],
    "monte": [],
    "mesa": [
      [
        5,
        1
      ],
      [
        1,
        6
      ],
      [
        6,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        0
      ],
      [
        0,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        5
      ]
    ],
    "jogador": 0,
    "vencedor": 0,
    "peca": null,
    "motivo": "bloqueio",
    "comprou": true,
    "orientacao": null,
    "evento": "fim"
  }
];

verifica('CT-46', 'partida completa ate bloqueio com o monte esgotado',
  { baralho: baralho46 },
  {
    "valida": true,
    "estado": {
      "maos": [
        [
          [
            1,
            6
          ],
          [
            2,
            2
          ],
          [
            1,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            4
          ],
          [
            5,
            6
          ],
          [
            0,
            6
          ]
        ],
        [
          [
            1,
            5
          ],
          [
            4,
            5
          ],
          [
            2,
            3
          ],
          [
            1,
            4
          ],
          [
            4,
            6
          ],
          [
            0,
            5
          ],
          [
            1,
            2
          ]
        ]
      ],
      "monte": [
        [
          4,
          4
        ],
        [
          1,
          3
        ],
        [
          5,
          5
        ],
        [
          6,
          6
        ],
        [
          2,
          5
        ],
        [
          3,
          5
        ],
        [
          3,
          6
        ],
        [
          2,
          6
        ],
        [
          3,
          4
        ],
        [
          3,
          3
        ],
        [
          0,
          3
        ],
        [
          2,
          4
        ],
        [
          0,
          0
        ],
        [
          0,
          1
        ]
      ],
      "mesa": [],
      "jogador": 0,
      "vencedor": null
    },
    "motivo": ""
  },
  { funcao: criarPartida, proximo: (saida) => saida.estado, passos: passos46 });

verifica('CT-47', 'chamada apos fim de partida devolve erro',
    {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ]
      ],
      [
        [
          0,
          0
        ],
        [
          3,
          4
        ]
      ]
    ],
    "monte": [],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": 1,
    "peca": null,
    "motivo": "bloqueio",
    "comprou": false,
    "orientacao": null,
    "evento": "fim"
  },
  {
    "maos": [
      [
        [
          0,
          3
        ],
        [
          4,
          6
        ]
      ],
      [
        [
          0,
          0
        ],
        [
          3,
          4
        ]
      ]
    ],
    "monte": [],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": 1,
    "evento": "erro",
    "peca": null,
    "motivo": "partida encerrada",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-48', 'monte nao array',
    {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": "vazio",
    "mesa": [],
    "jogador": 0
  },
  {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": null,
    "mesa": [],
    "jogador": 0,
    "vencedor": null,
    "evento": "erro",
    "peca": null,
    "motivo": "estado invalido",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-48', 'mesa nao array',
    {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": "vazia",
    "jogador": 0
  },
  {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": null,
    "jogador": 0,
    "vencedor": null,
    "evento": "erro",
    "peca": null,
    "motivo": "estado invalido",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-48', 'peca invalida no monte',
    {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        7,
        1
      ]
    ],
    "mesa": [],
    "jogador": 0
  },
  {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        7,
        1
      ]
    ],
    "mesa": [],
    "jogador": 0,
    "vencedor": null,
    "evento": "erro",
    "peca": null,
    "motivo": "estado invalido",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-48', 'peca invalida na mesa',
    {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        1,
        -2
      ]
    ],
    "jogador": 0
  },
  {
    "maos": [
      [
        [
          1,
          2
        ]
      ],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        1,
        -2
      ]
    ],
    "jogador": 0,
    "vencedor": null,
    "evento": "erro",
    "peca": null,
    "motivo": "estado invalido",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-49', 'mao vazia no inicio do turno e estado invalido',
    {
    "maos": [
      [],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [],
    "jogador": 0
  },
  {
    "maos": [
      [],
      [
        [
          3,
          3
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [],
    "jogador": 0,
    "vencedor": null,
    "evento": "erro",
    "peca": null,
    "motivo": "mao vazia no inicio do turno",
    "comprou": false,
    "orientacao": null
  });

verifica('CT-50', 'dupla jogada na perpendicular mantem as pontas',
  { maos: [[[5,5],[0,3]], [[3,3],[1,1]]], monte: [[0,0]],
    mesa: [[1,2],[2,5]], jogador: 0 },
  {
    "maos": [
      [
        [
          0,
          3
        ]
      ],
      [
        [
          3,
          3
        ],
        [
          1,
          1
        ]
      ]
    ],
    "monte": [
      [
        0,
        0
      ]
    ],
    "mesa": [
      [
        1,
        2
      ],
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "jogador": 1,
    "vencedor": null,
    "peca": [
      5,
      5
    ],
    "motivo": "jogada",
    "comprou": false,
    "orientacao": "perpendicular",
    "evento": "jogada"
  });

// -------------------------------------------------------------------------
// Extensao aditiva (CT-51 a CT-57): lacunas apontadas na revisao da suíte.
// Nenhum caso anterior foi renumerado; os IDs novos continuam CT-51..57.
// -------------------------------------------------------------------------

verifica('CT-51', 'dupla encostada na ponta esquerda vai na perpendicular', {
  maos: [[[1, 1], [0, 3]], [[3, 3], [1, 1]]],
  monte: [[0, 0]],
  mesa: [[1, 2], [2, 5]],
  jogador: 0
}, {
  maos: [[[0, 3]], [[3, 3], [1, 1]]],
  monte: [[0, 0]],
  mesa: [[1, 1], [1, 2], [2, 5]],
  jogador: 1,
  vencedor: null,
  evento: 'jogada',
  peca: [1, 1],
  motivo: 'jogada',
  comprou: false,
  orientacao: 'perpendicular'
});

test('CT-52 — baralho duplicado e baralho curto sao recusados', () => {
  const canonico = [];
  for (let a = 0; a <= 6; a++) {
    for (let b = a; b <= 6; b++) canonico.push([a, b]);
  }
  const duplicado = canonico.map((p) => [...p]);
  duplicado[27] = [0, 0];
  const curto = canonico.slice(0, 27).map((p) => [...p]);
  for (const [rotulo, baralho] of [['duplicado', duplicado], ['curto', curto]]) {
    const antes = copia(baralho);
    const saida = criarPartida({ baralho });
    assert.equal(saida.valida, false, `CT-52: ${rotulo} valida`);
    assert.equal(saida.estado, null, `CT-52: ${rotulo} estado`);
    assert.equal(saida.motivo, 'baralho invalido', `CT-52: ${rotulo} motivo`);
    assert.deepEqual(baralho, antes, `CT-52: ${rotulo} entrada intacta`);
  }
});

test('CT-53 — gerador injetado e chamado exatamente uma vez', () => {
  let chamadas = 0;
  const gerador = (baralho) => {
    chamadas++;
    return [...baralho].reverse();
  };
  const saida = criarPartida({ gerador });
  assert.equal(saida.valida, true, 'CT-53: valida');
  assert.equal(chamadas, 1, 'CT-53: gerador chamado exatamente uma vez');
});

verifica('CT-54', 'criarPartida sem argumentos usa o baralho canonico', null, {
  valida: true,
  estado: {
    maos: [
      [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]],
      [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 2]]
    ],
    monte: [
      [2, 3], [2, 4], [2, 5], [2, 6],
      [3, 3], [3, 4], [3, 5], [3, 6],
      [4, 4], [4, 5], [4, 6],
      [5, 5], [5, 6], [6, 6]
    ],
    mesa: [],
    jogador: 0,
    vencedor: null
  },
  motivo: ''
}, { funcao: () => criarPartida() });

verifica('CT-55', 'evento de entrada diferente de fim nao bloqueia o turno', {
  maos: [[[2, 4], [1, 1]], [[3, 3], [0, 2]]],
  monte: [[6, 6]],
  mesa: [],
  jogador: 0,
  evento: 'passou',
  vencedor: null
}, {
  maos: [[[1, 1]], [[3, 3], [0, 2]]],
  monte: [[6, 6]],
  mesa: [[2, 4]],
  jogador: 1,
  vencedor: null,
  evento: 'jogada',
  peca: [2, 4],
  motivo: 'jogada',
  comprou: false,
  orientacao: 'linear'
});

verifica('CT-56', 'vencedor fora de 0/1/null e estado invalido', {
  maos: [[[2, 4]], [[3, 3]]],
  monte: [[6, 6]],
  mesa: [],
  jogador: 0,
  vencedor: 2
}, {
  maos: [[[2, 4]], [[3, 3]]],
  monte: [[6, 6]],
  mesa: [],
  jogador: 0,
  vencedor: null,
  evento: 'erro',
  peca: null,
  motivo: 'estado invalido',
  comprou: false,
  orientacao: null
});

test('CT-57 — todo erro usa uma string do vocabulario', () => {
  const entradas = [
    { maos: [[[7, 1]], [[3, 3]]], monte: [], mesa: [], jogador: 0 },
    { maos: [[], [[3, 3]]], monte: [], mesa: [], jogador: 0 },
    null
  ];
  const permitidos = new Set([
    'jogada', 'sem joga', 'vitoria', 'bloqueio',
    'estado invalido', 'mao vazia no inicio do turno', 'partida encerrada'
  ]);
  for (const entrada of entradas) {
    const saida = jogarDomino(entrada);
    assert.equal(saida.evento, 'erro', 'CT-57: evento erro');
    assert.ok(permitidos.has(saida.motivo),
      `CT-57: motivo fora do vocabulario: ${saida.motivo}`);
  }
});
