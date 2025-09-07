class AbrigoAnimais {
  /**
   * @param {string} brinquedosPessoa1  ex: 'RATO,BOLA'
   * @param {string} brinquedosPessoa2  ex: 'RATO,NOVELO'
   * @param {string} ordemAnimais       ex: 'Rex,Fofo'
   * @returns {{lista?: string[], erro?: string}}
   */
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Base do enunciado
    const BD = {
      REX:  { nome: 'Rex',  especie: 'cao',    quer: ['RATO','BOLA'] },
      MIMI: { nome: 'Mimi', especie: 'gato',   quer: ['BOLA','LASER'] },
      FOFO: { nome: 'Fofo', especie: 'gato',   quer: ['BOLA','RATO','LASER'] },
      ZERO: { nome: 'Zero', especie: 'gato',   quer: ['RATO','BOLA'] },
      BOLA: { nome: 'Bola', especie: 'cao',    quer: ['CAIXA','NOVELO'] },
      BEBE: { nome: 'Bebe', especie: 'cao',    quer: ['LASER','RATO','BOLA'] },
      LOCO: { nome: 'Loco', especie: 'jabuti', quer: ['SKATE','RATO'] }, // Regra 6
    };

    // Funções auxiliares
    const separa = (s) =>
      typeof s === 'string'
        ? s.split(',').map(x => x.trim().toUpperCase()).filter(Boolean)
        : [];

    const temDup = (arr) => new Set(arr).size !== arr.length;

    
    // Regras 1 e 2: precisa ter todos os brinquedos NA ORDEM; pode intercalar outros itens
    // (para gatos passamos "bloqueados" para não reutilizar o MESMO índice)
    const subseq = (brinq, desejados, bloqueados = null) => {
      let i = 0; const usados = [];
      for (const d of desejados) {
        while (i < brinq.length && (brinq[i] !== d || (bloqueados && bloqueados.has(i)))) i++;
        if (i === brinq.length) return { ok: false, usados: [] };
        usados.push(i); i++;
      }
      return { ok: true, usados };
    };

    const contemTodos = (brinq, desejados) => {
      const set = new Set(brinq);
      return desejados.every(d => set.has(d));
    };

    // Normaliza entradas
    const p1 = separa(brinquedosPessoa1);
    const p2 = separa(brinquedosPessoa2);
    const ordem = separa(ordemAnimais);

    // Validações
    const chaves = Object.keys(BD);
    const brinquedosValidos = new Set(chaves.flatMap(k => BD[k].quer));

    const brinquedoInvalido = (lst) =>
      lst.length > 0 && (temDup(lst) || !lst.every(x => brinquedosValidos.has(x)));
    if (brinquedoInvalido(p1) || brinquedoInvalido(p2)) return { erro: 'Brinquedo inválido' };

    if (!ordem.length || temDup(ordem) || !ordem.every(a => chaves.includes(a)))
      return { erro: 'Animal inválido' };

    // Estado de adoção
    const usadosGato = { p1: new Set(), p2: new Set() }; // Regra 3
    const adotados   = { p1: 0,         p2: 0         }; // Regra 5
    const destino = {};

    // Processa cada animal na ordem informada
    for (const chave of ordem) {
      const a = BD[chave];

      const cap1 = adotados.p1 < 3; // Regra 5
      const cap2 = adotados.p2 < 3;

      let p1Ok = false, p2Ok = false, i1 = [], i2 = [];

      if (chave === 'LOCO') {
        // Regra 6: ordem não importa, mas precisa já ter outro animal
        if (cap1) p1Ok = contemTodos(p1, a.quer) && adotados.p1 >= 1;
        if (cap2) p2Ok = contemTodos(p2, a.quer) && adotados.p2 >= 1;
      } else {
        // Regras 1 e 2 (+ Regra 3 para gatos)
        if (cap1) { const r = subseq(p1, a.quer, a.especie === 'gato' ? usadosGato.p1 : null); p1Ok = r.ok; i1 = r.usados; }
        if (cap2) { const r = subseq(p2, a.quer, a.especie === 'gato' ? usadosGato.p2 : null); p2Ok = r.ok; i2 = r.usados; }
      }

      // Regra 4: se ambos podem, vai para o abrigo
      let dest = 'abrigo';
      if (p1Ok && !p2Ok) dest = 'pessoa 1';
      else if (!p1Ok && p2Ok) dest = 'pessoa 2';

      // Aplica efeitos
      if (dest === 'pessoa 1') {
        adotados.p1++;
        if (a.especie === 'gato') i1.forEach(ix => usadosGato.p1.add(ix)); // Regra 3
      } else if (dest === 'pessoa 2') {
        adotados.p2++;
        if (a.especie === 'gato') i2.forEach(ix => usadosGato.p2.add(ix)); // Regra 3
      }

      destino[a.nome] = dest;
    }

    // Saída em ordem alfabética (EX: "Fofo - abrigo")
    return {
      lista: Object.keys(destino)
        .sort((a, b) => a.localeCompare(b))
        .map(nome => `${nome} - ${destino[nome]}`)
    };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
