# Abrigo de Animais

Este projeto resolve um desafio técnico: decidir, para cada animal do abrigo, se ele vai para a **pessoa 1**, **pessoa 2** ou permanece no **abrigo**, seguindo regras claras.

Minha implementação passou em todos os testes automatizados fornecidos.

---

## O que o sistema faz (explicação simples)

- Cada animal tem uma **lista de brinquedos favoritos em uma ordem específica**.  
- Cada pessoa apresenta sua **lista de brinquedos**.  
- O animal só é adotado se a pessoa conseguir mostrar **todos** os brinquedos favoritos **na mesma ordem** (pode haver outros brinquedos no meio).  
- **Gatos** não “reutilizam” o mesmo brinquedo: um mesmo **índice** da lista de uma pessoa não serve para dois gatos.  
- Se **as duas pessoas** atendem às condições para o mesmo animal, **ninguém leva**: o animal fica no abrigo.  
- Cada pessoa pode adotar **no máximo três** animais.  
- **Loco** (jabuti) **não liga para a ordem**, mas só vai para quem **já adotou** outro animal.

---

## Regras do desafio (resumo)

1. A **ordem** dos brinquedos favoritos importa.  
2. Pode **intercalar** brinquedos que o animal não pediu.  
3. **Gatos** não dividem o mesmo brinquedo (mesmo índice da lista).  
4. Se **ambas** as pessoas podem adotar, o animal fica no **abrigo**.  
5. Cada pessoa adota **no máximo 3** animais.  
6. **Loco** ignora a ordem, mas só vai se a pessoa **já tiver adotado** outro animal.

---

## Animais considerados

| Nome | Espécie | Brinquedos favoritos (na ordem) |
| ---- | ------- | -------------------------------- |
| Rex  | cão     | RATO, BOLA                        |
| Mimi | gato    | BOLA, LASER                       |
| Fofo | gato    | BOLA, RATO, LASER                 |
| Zero | gato    | RATO, BOLA                        |
| Bola | cão     | CAIXA, NOVELO                     |
| Bebe | cão     | LASER, RATO, BOLA                 |
| Loco | jabuti  | SKATE, RATO                       |

---

## Como rodar localmente

Pré-requisito: **Node.js 18+**

```bash
npm install
npm test
````
---


## Exemplos

### Caso válido

Entrada:

```js
'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'
```

Saída:

```js
{ lista: ['Fofo - abrigo', 'Rex - pessoa 1'] }
```

### Caso inválido (animal desconhecido)

Entrada:

```js
'CAIXA,RATO', 'RATO,BOLA', 'Lulu'
```

Saída:

```js
{ erro: 'Animal inválido' }
```

---

## Como implementei (em termos práticos)

* **Preparação das entradas**
  Transformo as três strings (brinquedos da pessoa 1, da pessoa 2, ordem dos animais) em listas: separo por vírgula, removo espaços e padronizo em maiúsculas para evitar problemas de formatação.

* **Validações**
  Verifico se os animais informados existem e não se repetem. Verifico também se os brinquedos são válidos e sem duplicatas. Em caso de erro, retorno exatamente: `Animal inválido` ou `Brinquedo inválido`.

* **Decisão animal por animal**
  Para cada animal, confiro se cada pessoa consegue formar a sequência de brinquedos **na ordem**, permitindo itens no meio.
  Para **gatos**, marco os **índices** já usados de brinquedos para não reutilizar em outro gato daquela pessoa.
  Aplico a **regra de empate** (vai para o abrigo), o **limite de três** por pessoa e a **regra do Loco** (ignora ordem, mas exige já ter adotado alguém).

* **Saída**
  Devolvo a lista **ordenada alfabeticamente** no formato:
  `Nome - pessoa 1 | pessoa 2 | abrigo`.

---

## “Test Suites: 1 passed”

![Print da aplicação](img/PrintTestDB.png)

---
