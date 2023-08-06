from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import json

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

# user schema
class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(32), nullable=False, unique=True)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.String, nullable=False)
    cart_products = db.relationship('CartProduct')

    # method to return user object as json to populate react user state
    def return_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
    
# cart schemaa
class CartProduct(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    product = db.Column(db.String, db.ForeignKey('product.id'))
    qty = db.Column(db.Integer)
    user = db.Column(db.String, db.ForeignKey('user.id'))

    def return_json(self):
        return {
            "id": self.id,
            "product": self.product,
            "qty": self.qty,
            "user": self.user
        }
    
# product schema
class Product(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    image = db.Column(db.String)
    category = db.Column(db.String)
    name = db.Column(db.String)
    price = db.Column(db.String)
    cart_products = db.relationship('CartProduct')

    def return_json(self):
        return {
            "id": self.id,
            "img": self.image,
            "category": self.category,
            "name": self.name,
            "price": self.price,
        }
