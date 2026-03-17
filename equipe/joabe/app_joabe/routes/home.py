from flask import Blueprint, render_template, session, redirect, url_for

home = Blueprint("home", __name__)

foco_usuario = {}

@home.route("/home")
def home_page():

    if "email" not in session:
        return redirect(url_for("auth.login"))

    email = session["email"]
    foco = foco_usuario.get(email, "Não definido")
    progresso = session.get("pontos", 0)

    return render_template(
        "home.html",
        email=email,
        foco=foco,
        progresso=progresso
    )