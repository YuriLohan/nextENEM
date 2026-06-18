from flask import Blueprint, render_template, request, redirect, url_for, session

auth = Blueprint("auth", __name__)

# Banco fake será importado depois

usuarios = [
    {"email": "teste@gmail.com", "senha": "1234"}
]

@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")

        for usuario in usuarios:
            if usuario["email"] == email and usuario["senha"] == senha:
                session["email"] = email
                session["indice"] = 0
                session["pontos"] = 0
                return redirect(url_for("home.home"))

        return render_template("login.html", erro="Email ou senha inválidos")

    return render_template("login.html")


@auth.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")

        for usuario in usuarios:
            if usuario["email"] == email:
                return render_template("register.html", erro="Usuário já existe")

        usuarios.append({
            "email": email,
            "senha": senha
        })

        session["email"] = email
        return redirect(url_for("home.home"))

    return render_template("register.html")


@auth.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))