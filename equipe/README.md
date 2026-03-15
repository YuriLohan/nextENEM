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

# 🤝 Como Contribuir — NextENEM

Leia com atenção antes de fazer qualquer coisa no repositório!

---

## ⚠️ Problema comum

Se você **fez um fork** do repositório e tentou abrir um Pull Request, ele vai fechar automaticamente.
**Não use fork.** Siga o guia abaixo.

---

## ✅ Passo a passo correto

### 1. Peça acesso ao repositório
Fale com o **YuriLohan** para te adicionar como colaborador.
Você receberá um convite por e-mail — aceite antes de continuar.

### 2. Clone o repositório original
```bash
git clone https://github.com/YuriLohan/nextENEM.git
cd nextENEM
```

> ⚠️ Se você já tiver clonado via fork, delete a pasta e clone novamente pelo link acima.

### 3. Entre na branch de testes
```bash
git checkout teste
```

### 4. Crie sua pasta dentro de `equipe/`
```bash
mkdir -p equipe/SeuUsuarioGitHub/experimentos
touch equipe/SeuUsuarioGitHub/experimentos/.gitkeep
```

> Use exatamente o seu nome de usuário do GitHub, respeitando maiúsculas e minúsculas.

### 5. Adicione seu README pessoal
Crie o arquivo `equipe/SeuUsuarioGitHub/README.md` com o seguinte conteúdo:

```markdown
# Experimentos — [Seu Usuário GitHub]

## O que estou desenvolvendo
...

## Como rodar
...

## Status
- [ ] Em andamento
- [ ] Pronto para revisão
- [ ] Mergeado na main
```

### 6. Suba suas alterações
```bash
git add equipe/SeuUsuarioGitHub/
git commit -m "feat: adiciona espaço de experimentos - SeuUsuarioGitHub"
git push origin teste
```

---

## 🔁 Abrindo um Pull Request

Quando seu experimento estiver pronto para ser integrado ao projeto:

1. Acesse o repositório no GitHub
2. Clique em **Pull requests → New pull request**
3. Configure assim:
   - **base:** `main`
   - **compare:** `teste`
4. Descreva o que foi desenvolvido e clique em **Create pull request**

---

## 🚨 Regras

- **Não mexa** nas pastas `API_enemDEV/` e `NextENEM/` direto na branch `teste`
- **Não delete** a pasta de outro integrante
- Dúvidas? Fale com o **YuriLohan**