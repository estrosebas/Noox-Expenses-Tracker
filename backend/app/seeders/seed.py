from app.db.session import SessionLocal
from app.models.user import User
from app.models.provider import Provider
from app.models.transaction import Transaction, TransactionTypeEnum
from sqlalchemy.sql import func
import datetime

def seed():
    db = SessionLocal()
    # Usuarios demo
    user1 = User(nombre="Sebastian", apellido="Estro", correo="sebastian@noox.com", password="hashedpassword1")
    user2 = User(nombre="Maria", apellido="Perez", correo="maria@noox.com", password="hashedpassword2")
    db.add_all([user1, user2])
    db.commit()
    # Proveedores demo
    provider1 = Provider(name="Banco de Lima", email_sender="noreply@bancodelima.com")
    provider2 = Provider(name="Supermercado Peru", email_sender="info@superperu.com")
    db.add_all([provider1, provider2])
    db.commit()
    # Transacciones demo
    t1 = Transaction(user_id=user1.id, provider_id=provider1.id, type=TransactionTypeEnum.entrada, amount=1500.00, currency="PEN", date=datetime.datetime.now(), subject="Pago de salario", raw_email_snippet="Pago recibido de Banco de Lima.")
    t2 = Transaction(user_id=user1.id, provider_id=provider2.id, type=TransactionTypeEnum.salida, amount=200.50, currency="PEN", date=datetime.datetime.now(), subject="Compra supermercado", raw_email_snippet="Compra realizada en Supermercado Peru.")
    db.add_all([t1, t2])
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
