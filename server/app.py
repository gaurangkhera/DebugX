from flask import Flask, request, jsonify, session, url_for
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
import json
from models import db, User, Product, CartProduct
import os
import stripe

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SESSION_TYPE'] = 'filesystem'
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config['SECRET_KEY'] = 'super secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51NTgT6SAvDl2UTdKhZ5BOMiSCEJ5zQ8Gd0aiOcjIqWAG8wiMHOoSgW1U0ykaPgob27lDECWRW7H6GW9JacjjmSsJ00Iy6SDvkv'
app.config['STRIPE_SECRET_KEY'] = 'sk_test_51NTgT6SAvDl2UTdKQM3LUyirhm3n4DQbWtLhY8b4QX6vajOaBgFcNP2TGMLcvjyu1RSH7Z3NR7T1k7GTucNe52aN0069n7nZh2'

stripe.api_key = app.config['STRIPE_SECRET_KEY']

sess = Session()
sess.init_app(app=app)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

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
    print(session.get('user_id'))
    return jsonify({ "id": new_user.id, "email": new_user.email })

@app.route('/cart')
def cart():
    if session.get('user_id') is None:
        return "403"
    user = User.query.filter_by(id=session.get('user_id')).first()
    products = [Product.query.filter_by(id=product.product).first().return_json() for product in user.cart_products]
    return jsonify(products)

@app.route('/stripe_pay', methods=['GET', 'POST'])
def stripe_pay():
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': 'price_1NTgYsSAvDl2UTdKUmRdLnFD',
            'quantity': 1,
        }],
        mode='payment',
        success_url="http://localhost:3000/catalogue",
        cancel_url="http://localhost:3000/"
    )
    return {
        'checkout_session_id': session['id'],
        'checkout_public_key': app.config['STRIPE_PUBLIC_KEY']
    }

@app.route('/success')
def success():
    return "thanks for buy"

@app.route('/cancel')
def cancel():
    return "why cancel bruv"

@app.route('/addtocart/<id>', methods=['GET', 'POST'])
def addtocart(id):
    if session.get('user_id') is None:
        return "403"
    user = User.query.filter_by(id=session.get('user_id')).first()
    product = Product.query.filter_by(id=id).first()
    cartProduct = CartProduct(product=product.id, qty=1, user=user.id)
    db.session.add(cartProduct)
    db.session.commit()
    print('added')
    return "200"

@app.route('/removefromcart/<id>', methods=['GET', 'POST'])
def removefromcart(id):
    if session.get('user_id') is None:
        return "403"
    user = User.query.filter_by(id=session.get('user_id')).first()
    product = Product.query.filter_by(id=id).first()
    cartProduct = CartProduct.query.filter_by(user=user.id, product=product.id).first()
    db.session.delete(cartProduct)
    db.session.commit()
    print('removed')
    return "200"

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"error": "Unauthorized"}), 404
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 403
    session["user_id"] = user.id
    print(session.get('user_id'))
    return jsonify({ "id": user.id, "email": user.email })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"

@app.route("/@me", methods=['GET', 'POST'])
def get_current_user():
    user_id = session.get("user_id")
    print(user_id)
    if not user_id:
        return jsonify({"error": "User Id is Null!"}), 401
    user = User.query.filter_by(id=user_id).first()
    return jsonify({ "id": user.id, "username": user.username, "email": user.email })

if __name__ == "__main__":
    app.run(debug=True)