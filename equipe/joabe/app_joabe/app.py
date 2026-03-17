from flask import Flask
from routes.auth import auth
from routes.home import home

app = Flask(__name__)
app.secret_key = "nextenem_super_secreto"

app.register_blueprint(auth)
app.register_blueprint(home)

if __name__ == "__main__":
    app.run(debug=True)