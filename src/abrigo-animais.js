class AbrigoAnimais
 {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Base do enunciado
    const BD = {
      REX:  { nome: 'Rex',  quer: ['RATO', 'BOLA'],  especie: 'cao'   },
      MIMI: { nome: 'Mimi', quer: ['BOLA', 'LASER'], especie: 'gato'  },
      FOFO: { nome: 'Fofo', quer: ['BOLA', 'RATO', 'LASER'], especie: 'gato' },
      ZERO: { nome: 'Zero', quer: ['RATO', 'BOLA'],  especie: 'gato'  },
      BOLA: { nome: 'Bola', quer: ['CAIXA', 'NOVELO'], especie: 'cao' },
      BEBE: { nome: 'Bebe', quer: ['LASER', 'RATO', 'BOLA'], especie: 'cao' },
      LOCO: { nome: 'Loco', quer: ['SKATE', 'RATO'], especie: 'jabuti' }, // regra 6
    };

    // --- Helpers ---
    const separa = (txt) =>
      typeof txt === 'string'
        ? txt.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
        : [];

    const temDuplicata = (lista) => new Set(lista).size !== lista.length;

    // checa subsequência (pode intercalar); se consumirIndices=true, retorna também os índices usados
    const subsequencia = (brinquedos, desejados, bloqueados = null) => {
      let i = 0; const usados = [];
      for (const d of desejados) {
        while (i < brinquedos.length && (brinquedos[i] !== d || (bloqueados && bloqueados.has(i)))) i++;
        if (i === brinquedos.length) return { ok: false, usados: [] };
        usados.push(i); i++;
      }
      return { ok: true, usados };
    };

    const contemTodos = (brinq, desejados) => {
      const set = new Set(brinq);
      return desejados.every(d => set.has(d));
    };

    const chaves = Object.keys(BD);
    const brinquedosValidos = new Set(chaves.flatMap(k => BD[k].quer));

    // Normalização
    const p1 = separa(brinquedosPessoa1);
    const p2 = separa(brinquedosPessoa2);
    const ordem = separa(ordemAnimais);

    // Validações de entrada
    const brinquedoInvalido = (lst) =>
      lst.length > 0 && (temDuplicata(lst) || !lst.every(x => brinquedosValidos.has(x)));
    if (brinquedoInvalido(p1) || brinquedoInvalido(p2)) return { erro: 'Brinquedo inválido' };
    if (!ordem.length || temDuplicata(ordem) || !ordem.every(a => chaves.includes(a))) {
      return { erro: 'Animal inválido' };
    }

    // Estado para as regras 3 e 5
    const usadosGato = { p1: new Set(), p2: new Set() }; // índices de brinquedos já usados por GATOS
    const adotados = { p1: 0, p2: 0 };                   // máx. 3 por pessoa

    const destino = {};

    for (const chave of ordem) {
      const an = BD[chave];

      // capacidade (regra 5)
      const cap1 = adotados.p1 < 3;
      const cap2 = adotados.p2 < 3;

      let p1Ok = false, p2Ok = false, idx1 = [], idx2 = [];

      if (chave === 'LOCO') {
        // Regra 6: não importa a ordem, precisa já ter outro animal
        if (cap1) p1Ok = contemTodos(p1, an.quer) && adotados.p1 >= 1;
        if (cap2) p2Ok = contemTodos(p2, an.quer) && adotados.p2 >= 1;
      } else {
        // Ordem importa (regras 1 e 2). Para GATO, não pode dividir brinquedo (regra 3).
        if (cap1) {
          const r = subsequencia(p1, an.quer, an.especie === 'gato' ? usadosGato.p1 : null);
          p1Ok = r.ok; idx1 = r.usados;
        }
        if (cap2) {
          const r = subsequencia(p2, an.quer, an.especie === 'gato' ? usadosGato.p2 : null);
          p2Ok = r.ok; idx2 = r.usados;
        }
      }

      // Regra 4: se ambos podem, ninguém adota (vai para abrigo)
      let dest = 'abrigo';
      if (p1Ok && !p2Ok) dest = 'pessoa 1';
      else if (!p1Ok && p2Ok) dest = 'pessoa 2';

      // aplica efeitos de adoção
      if (dest === 'pessoa 1') {
        adotados.p1++;
        if (an.especie === 'gato') idx1.forEach(i => usadosGato.p1.add(i));
      } else if (dest === 'pessoa 2') {
        adotados.p2++;
        if (an.especie === 'gato') idx2.forEach(i => usadosGato.p2.add(i));
      }

      destino[an.nome] = dest;
    }

    return {
      lista: Object.keys(destino)
        .sort((a, b) => a.localeCompare(b))
        .map(nome => `${nome} - ${destino[nome]}`)
    };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
