from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
)
from api.models import db, User
from api.utils import generate_sitemap, APIException

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "20Feb1979"  # Clave secreta para firmar los tokens
api = Blueprint('api', __name__)
CORS(api)

@api.route('/verify-token', methods=['POST'])
def verify_token():
    try:
        verify_jwt_in_request()  # Verificar el token en la solicitud
        current_user = get_jwt_identity()  # Obtener la identidad del usuario
        return jsonify({"valid": True, "user": current_user}), 200
    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 401

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "El usuario ya está registrado"}), 400

    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado con éxito"}), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "Email o contraseña incorrecta"}), 401

    # Crear un token de acceso
    access_token = create_access_token(identity={"email": user.email})
    return jsonify({"access_token": access_token}), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    try:
        current_user = get_jwt_identity()  # Obtener la identidad del usuario
        return jsonify({"msg": f"Bienvenido {current_user['email']}, estás en una página privada"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401  

# Añadir el blueprint a la aplicación principal de Flask
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
