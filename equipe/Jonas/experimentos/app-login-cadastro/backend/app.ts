console.log("ARQUIVO CERTO");
let indiceAtual = 0;
let app: HTMLDivElement;

function limparTela() {
    app.innerHTML = "";
}

function mostrarMensagem(texto: string, sucesso: boolean) {
    const div = document.createElement("div");
    div.classList.add("resultado");
    div.classList.add(sucesso ? "acerto" : "erro");
    div.innerText = texto;

    app.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 1500);
}

function renderLogin() {
    limparTela();

    const container = document.createElement("div");
    container.classList.add("mobile");

    const logo = document.createElement("div");
    logo.classList.add("logo");
    logo.innerHTML = "Next <span>Enem</span>";

    const titulo = document.createElement("h2");
    titulo.innerText = "Login";

    const subtitulo = document.createElement("div");
    subtitulo.classList.add("subtitle");
    subtitulo.innerText = "Entre na sua conta para continuar aprendendo";

    const card = document.createElement("div");
    card.classList.add("card");

    // INPUT USUÁRIO
    const groupUsuario = document.createElement("div");
    groupUsuario.classList.add("input-group");

    const inputUsuario = document.createElement("input");
    inputUsuario.placeholder = "Usuário";

    groupUsuario.appendChild(inputUsuario);

    // INPUT SENHA
    const groupSenha = document.createElement("div");
    groupSenha.classList.add("input-group");

    const inputSenha = document.createElement("input");
    inputSenha.placeholder = "Senha";
    inputSenha.type = "password";

    groupSenha.appendChild(inputSenha);

    // BOTÃO ENTRAR
    const botao = document.createElement("button");
    botao.classList.add("btn-primary");
    botao.innerText = "Entrar";

    botao.onclick = async () => {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: inputUsuario.value,
                senha: inputSenha.value
            })
        });

        if (response.ok) {
            carregarQuestao();
        } else {
            mostrarMensagem("Login inválido!", false);
        }
    };

    // BOTÃO GOOGLE (visual)
    const google = document.createElement("button");
    google.classList.add("btn-google");
    google.innerText = "Continuar com o Google";

    const esqueceu = document.createElement("div");
    esqueceu.classList.add("link");
    esqueceu.innerText = "Esqueceu sua senha?";

    const cadastro = document.createElement("div");
    cadastro.classList.add("link");
    cadastro.innerHTML = "Não tem conta? <a href='#'>Criar agora</a>";

    card.append(
        groupUsuario,
        groupSenha,
        botao,
        google,
        esqueceu,
        cadastro
    );

    container.append(
        logo,
        titulo,
        subtitulo,
        card
    );

    app.appendChild(container);
}

async function carregarQuestao() {
    limparTela();

    const response = await fetch(`/questoes/${indiceAtual}`);
    const data = await response.json();

    if (data.finalizado) {
        const fim = document.createElement("h2");
        fim.innerText = "🎉 Simulado Finalizado!";
        app.appendChild(fim);
        return;
    }

    const titulo = document.createElement("h2");
    titulo.innerText = `Questão ${data.numero}`;

    const texto = document.createElement("p");
    texto.innerText = data.texto;

    app.append(titulo, texto);

    let selecionado: string | null = null;

    for (const letra in data.alternativas) {
        const div = document.createElement("div");
        div.classList.add("alternativa");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "resposta";
        radio.value = letra;

        radio.onchange = () => {
            selecionado = letra;
        };

        const label = document.createElement("label");
        label.append(
            radio,
            document.createTextNode(` ${letra}. ${data.alternativas[letra]}`)
        );

        div.appendChild(label);
        app.appendChild(div);
    }

    const botao = document.createElement("button");
    botao.classList.add("btn-primary");
    botao.innerText = "Responder";

    botao.onclick = async () => {
        if (!selecionado) {
            mostrarMensagem("Selecione uma resposta!", false);
            return;
        }

        const resposta = await fetch("/responder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                indice: indiceAtual,
                resposta: selecionado
            })
        });

        const resultado = await resposta.json();

        if (resultado.acertou) {
            mostrarMensagem("Você acertou! ✅", true);
        } else {
            mostrarMensagem(
                `Você errou! ❌ Correta: ${resultado.correta}`,
                false
            );
        }

        setTimeout(() => {
            indiceAtual++;
            carregarQuestao();
        }, 1500);
    };

    app.appendChild(botao);
}

window.onload = () => {
    app = document.getElementById("app") as HTMLDivElement;
    renderLogin();
};