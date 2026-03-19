"use strict";

console.log("ARQUIVO CERTO");

let indiceAtual = 0;
let app;


// LIMPAR TELA
function limparTela(){
    app.innerHTML = "";
}


// MENSAGENS
function mostrarMensagem(texto, sucesso){

    const div = document.createElement("div");

    div.classList.add("resultado");
    div.classList.add(sucesso ? "acerto" : "erro");

    div.innerText = texto;

    app.appendChild(div);

    setTimeout(()=>{
        div.remove();
    },1500);
}


// CADASTRO
function renderCadastro(){

    limparTela();

    const container = document.createElement("div");
    container.classList.add("mobile");

    const logo = document.createElement("div");
    logo.classList.add("logo");
    logo.innerHTML = "Next <span>Enem</span>";

    const titulo = document.createElement("h2");
    titulo.innerText = "Criar Conta";

    const subtitulo = document.createElement("div");
    subtitulo.classList.add("subtitle");
    subtitulo.innerText = "Cadastre-se para começar seu simulado";

    const card = document.createElement("div");
    card.classList.add("card");


    const inputNome = document.createElement("input");
    inputNome.placeholder = "Nome";

    const inputEmail = document.createElement("input");
    inputEmail.placeholder = "Email";

    const inputSenha = document.createElement("input");
    inputSenha.placeholder = "Senha";
    inputSenha.type = "password";


    const botao = document.createElement("button");
    botao.classList.add("btn-primary");
    botao.innerText = "Cadastrar";


    botao.onclick = async () => {

        const response = await fetch("/cadastrar",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                nome: inputNome.value,
                email: inputEmail.value,
                senha: inputSenha.value
            })

        });

        const data = await response.json();

        if(data.success){

            mostrarMensagem("Conta criada!", true);

           setTimeout(()=>{
              renderLogin();
            },1500);

        }else if(data.erro){

               mostrarMensagem(data.erro, false);

        }else{

            mostrarMensagem("Erro ao cadastrar!", false);

        }

    };
    


    const login = document.createElement("div");
    login.classList.add("link");
    login.innerHTML = "Já tem conta? <b>Entrar</b>";

    login.onclick = renderLogin;


    card.append(inputNome,inputEmail,inputSenha,botao,login);

    container.append(logo,titulo,subtitulo,card);

    app.appendChild(container);

}



// LOGIN
function renderLogin(){

    limparTela();

    const container = document.createElement("div");
    container.classList.add("mobile");

    const logo = document.createElement("div");
    logo.classList.add("logo");
    logo.innerHTML = "Next <span>Enem</span>";

    const titulo = document.createElement("h2");
    titulo.innerText = "Login";

    const card = document.createElement("div");
    card.classList.add("card");


    const inputEmail = document.createElement("input");
    inputEmail.placeholder = "Email";

    const inputSenha = document.createElement("input");
    inputSenha.placeholder = "Senha";
    inputSenha.type = "password";


    const botao = document.createElement("button");
    botao.classList.add("btn-primary");
    botao.innerText = "Entrar";


    botao.onclick = async () => {

        const response = await fetch("/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email: inputEmail.value,
                senha: inputSenha.value
            })

        });

        const data = await response.json();

        if(data.success){

            carregarQuestao();

        }else{

            mostrarMensagem("Login inválido!", false);

        }

    };


    const cadastro = document.createElement("div");
    cadastro.classList.add("link");
    cadastro.innerHTML = "Não tem conta? <b>Criar agora</b>";

    cadastro.onclick = renderCadastro;


    card.append(inputEmail,inputSenha,botao,cadastro);

    container.append(logo,titulo,card);

    app.appendChild(container);

}



// QUESTÕES
async function carregarQuestao(){

    limparTela();

    const response = await fetch(`/questoes/${indiceAtual}`);

    const data = await response.json();

    if(data.finalizado){

        const fim = document.createElement("h2");
        fim.innerText = "Simulado Finalizado 🎉";

        app.appendChild(fim);

        return;
    }


    const titulo = document.createElement("h2");
    titulo.innerText = `Questão ${data.numero}`;

    const texto = document.createElement("p");
    texto.innerText = data.texto;

    app.append(titulo,texto);


    let selecionado = null;

    for(const letra in data.alternativas){

        const div = document.createElement("div");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "resposta";
        radio.value = letra;

        radio.onchange = ()=>{
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

        const resposta = await fetch("/responder",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                indice: indiceAtual,
                resposta: selecionado
            })

        });

        const resultado = await resposta.json();

        if(resultado.acertou){

            mostrarMensagem("Você acertou!", true);

        }else{

            mostrarMensagem(`Você errou! Correta: ${resultado.correta}`, false);

        }

        setTimeout(()=>{
            indiceAtual++;
            carregarQuestao();
        },1500);

    };


    app.appendChild(botao);

}



window.onload = ()=>{

    app = document.getElementById("app");

    renderCadastro();

};