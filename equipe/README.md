# 👥 Área da Equipe — NextENEM

Esta pasta é o espaço de experimentação individual de cada integrante do time.
Aqui cada um pode testar ideias, desenvolver features e iterar livremente
sem impactar o código principal do projeto.

---

## 📁 Estrutura esperada

Cada integrante deve criar uma pasta com seu nome (em minúsculas, sem espaços):
```
equipe/
└── seu-nome/
    ├── README.md        ← obrigatório: descreva o que está fazendo
    └── experimentos/    ← seus projetos e testes
```

---

## ✅ Como começar

1. A partir da branch `teste`, crie sua pasta:
```bash
git checkout teste
mkdir -p equipe/seu-nome/experimentos
```

2. Adicione seu `README.md` pessoal (use o template abaixo).

3. Commite e suba:
```bash
git add equipe/seu-nome/
git commit -m "feat: adiciona espaço de experimentos - seu-nome"
git push origin teste
```

---

## 📝 Template do README pessoal

\```markdown
# Experimentos — [Seu Nome]

## O que estou desenvolvendo
...

## Como rodar
...

## Status
- [ ] Em andamento
- [ ] Pronto para revisão
- [ ] Mergeado na main
\```

---

## 🚨 Regras da branch

- **Não mexa** nas pastas do projeto principal direto nesta branch
- **Não delete** a pasta de outro integrante