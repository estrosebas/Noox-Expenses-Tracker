
import os
from sqlalchemy import create_engine, text
from app.db.session import engine, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
from app.db.base import Base
from app.models import user, provider, transaction

def create_database_if_not_exists():
    tmp_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/"
    tmp_engine = create_engine(tmp_url, echo=True)
    with tmp_engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"))
        print(f"[DEBUG] Base de datos '{DB_NAME}' verificada/creada.")
    tmp_engine.dispose()

def init_db():
    create_database_if_not_exists()
    print("[DEBUG] Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("[DEBUG] Tablas creadas correctamente.")

if __name__ == "__main__":
    init_db()
