# Noox Expenses Tracker Backend

Backend API para la aplicación Noox Expenses Tracker, desarrollada con FastAPI y SQLAlchemy.

## Estructura de Carpetas

```
backend/
  app/
    api/         # Endpoints de la API (por recursos)
    core/        # Configuración y utilidades
    db/          # Base de datos, sesión, inicialización
    models/      # Modelos ORM
    schemas/     # Esquemas Pydantic (para endpoints)
    seeders/     # Scripts para poblar la base de datos
    main.py      # Punto de entrada FastAPI
  requirements.txt
  README.md
```

## Requisitos
- Python 3.9+
- pip

## Instalación

1. **Clona el repositorio y entra a la carpeta backend:**
   ```bash
   git clone <repo-url>
   cd nooxexpensestracker/backend
   ```

2. **Crea un entorno virtual (opcional pero recomendado):**
   ```bash
   python -m venv venv
   # Activa el entorno:
   # En Windows:
   venv\Scripts\activate
   # En Mac/Linux:
   source venv/bin/activate
   ```


3. **Copia y configura el archivo de variables de entorno (.env):**
   ```bash
   cp .env.example .env  # O crea .env manualmente
   # Edita .env y coloca tus credenciales de MySQL
   ```

   Ejemplo de `.env`:
   ```env
   DB_USER=usuario
   DB_PASSWORD=contrasena
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=nooxexpenses
   ```

4. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   pip install python-dotenv pymysql
   ```

5. **Inicializa la base de datos:**
   ```bash
   cd app
   python -m app.db.init_db
   ```

6. **(Opcional) Agrega datos demo:**
   ```bash
   python -m app.seeders.seed
   ```

7. **Inicia el servidor FastAPI:**
   ```bash
   uvicorn app.main:app --reload
   ```

8. **Accede a la documentación interactiva:**
   - [http://localhost:8000/docs](http://localhost:8000/docs)

## Uso
- La API estará disponible en `http://localhost:8000/`
- Endpoints y documentación interactiva en `/docs`
- Puedes extender la API agregando endpoints en `app/api/`

## Notas
- Por defecto usa MySQL. Configura las credenciales en el archivo `.env` en la raíz de `backend`.
- Los modelos y seeders están listos para desarrollo y pruebas.

---

¿Dudas o sugerencias? ¡Contribuye o abre un issue!
