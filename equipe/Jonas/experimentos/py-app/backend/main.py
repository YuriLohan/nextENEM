from flask import Flask, request, jsonify, session, render_template
from questoes22 import perguntas
from database import conectar

app = Flask(__name__)
app.secret_key = "segredo123"

gabarito = ['B','C','B','D','B']


@app.route("/")
def home():
    return render_template("index.html")


# CADASTRO
@app.route("/cadastrar", methods=["POST"])
def cadastrar():

    data = request.json

    nome = data["nome"]
    email = data["email"]
    senha = data["senha"]

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    # verificar se email já existe
    sql = "SELECT * FROM usuarios WHERE email=%s"
    cursor.execute(sql,(email,))
    usuario = cursor.fetchone()

    if usuario:
        return jsonify({"success":False,"erro":"Email já cadastrado"})

    # inserir usuário
    sql = "INSERT INTO usuarios (nome,email,senha) VALUES (%s,%s,%s)"
    cursor.execute(sql,(nome,email,senha))

    conexao.commit()

    return jsonify({"success":True})


# LOGIN
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    senha = data["senha"]

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    sql = "SELECT * FROM usuarios WHERE email=%s AND senha=%s"
    cursor.execute(sql,(email,senha))

    usuario = cursor.fetchone()

    if usuario:

        session["usuario"] = usuario["nome"]

        return jsonify({"success":True})

    return jsonify({"success":False})


# QUESTÕES
@app.route("/questoes/<int:indice>")
def questoes(indice):

    if 'usuario' not in session:
        return jsonify({"error":"Não autorizado"}),403

    if indice >= len(perguntas):
        return jsonify({"finalizado":True})

    return jsonify(perguntas[indice])


# RESPOSTA
@app.route("/responder", methods=["POST"])
def responder():

    data = request.json

    indice = data["indice"]
    resposta = data["resposta"]

    correta = gabarito[indice]

    return jsonify({
        "correta": correta,
        "acertou": resposta == correta
    })


if __name__ == "__main__":
    app.run(debug=True, port=8000)