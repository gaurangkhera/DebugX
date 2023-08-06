from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
import json
from models import db, User, Product, CartProduct
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'super secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir,'data.sqlite')
sess = Session()
sess.init_app(app=app)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me")
def get_current_user():
    # for i in range(10):
    #     product = Product(image="https://images.unsplash.com/photo-1526900913101-88c16676ca02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", category="Sneakers", name="Air Jordans", price=4000)
    #     db.session.add(product)
    #     db.session.commit()
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 

@app.route('/product/<id>', methods=['GET', 'POST'])
def return_product(id):
    return Product.query.filter_by(id=id).first().return_json()

@app.route('/products', methods=['GET', 'POST'])
def products():
    products = [product.return_json() for product in Product.query.all()]
    return jsonify(products)

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    username = request.json['username']
    password = request.json["password"]

    email_exists = User.query.filter_by(email=email).first() is not None
    username_exists = User.query.filter_by(username=username).first() is not None

    if email_exists:
        return jsonify({"error": "User already exists"}), 409
    
    if username_exists:
        return jsonify({"error": 'Username already exists.'}), 410
    

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, username=username)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    print(email, password)

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 403
    
    session["user_id"] = user.id
    print(session['user_id'])

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

if __name__ == "__main__":
    app.run(debug=True)