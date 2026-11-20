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

const copia = (v) => v == null ? v : JSON.parse(JSON.stringify(v));

const verifica = (id, descricao, entrada, esperado) => {
  test(`${id} — ${descricao}`, () => {
    const estadoAntes = copia(entrada);
    const saida = jogarDomino(entrada);
    for (const [campo, valor] of Object.entries(esperado)) {
      if (campo === 'motivo' && esperado.evento === 'erro') {
        assert.equal(typeof saida.motivo, 'string', `${id}: motivo deve ser string`);
        assert.ok(saida.motivo.length > 0, `${id}: motivo nao pode ser vazio`);
      } else {
        assert.deepEqual(saida[campo], valor, `${id}: campo ${campo}`);
      }
    }
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
});

verifica('CT-24', 'rejeitar entrada nula', null, {
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
    [0, 0]
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
      [0, 0]
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
  evento: 'erro'
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
