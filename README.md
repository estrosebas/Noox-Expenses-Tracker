# Noox Expenses Tracker

Sistema completo de gestión de gastos personales con autenticación facial, chatbot financiero con IA (Gemini), reportes y dashboard interactivo.

---

## Características principales
- **Frontend:** React + TypeScript, Vite, framer-motion, lucide-react
- **Backend:** FastAPI, SQLAlchemy, JWT, Gemini API (Google)
- **Autenticación:** Email/contraseña, Google, y reconocimiento facial
- **Dashboard:** Gráficos, desglose por categorías, reportes descargables
- **Chatbot:** Asistente financiero con IA (Gemini)

---

## Requisitos previos
- Python 3.10+
- Node.js 18+
- npm o yarn
- MySQL/MariaDB
- (Producción) Servidor Linux con Apache2 y Certbot

---

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/estrosebas/nooxexpensestracker.git
cd nooxexpensestracker
```

### 2. Configuración del backend
```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de base de datos y tu GEMINI_API_KEY
```

Instala dependencias y crea la base de datos:
```bash
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
# Crea la base de datos y ejecuta migraciones si aplica
```

Levanta el backend (por defecto en el puerto 8000):
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Configuración del frontend
```bash
cd ../tracker-front
cp .env.example .env
# Edita VITE_API_URL en .env si tu backend no está en localhost:8000
npm install
npm run dev
```

---

## Uso básico
- Accede a `http://localhost:5173` para el frontend.
- Regístrate, inicia sesión, prueba el login facial y el chatbot.
- El dashboard muestra tus gastos, ingresos y reportes.

---

## Despliegue en producción con Apache2 y Certbot

### 1. Backend (FastAPI) con Uvicorn y Apache2 (proxy)
- Instala Apache2 y Certbot:
```bash
sudo apt update
sudo apt install apache2 certbot python3-certbot-apache
```
- Habilita los módulos necesarios:
```bash
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite ssl
sudo systemctl restart apache2
```
- Crea un archivo de configuración para tu dominio, por ejemplo `/etc/apache2/sites-available/noox.conf`:
```
<VirtualHost *:80>
    ServerName tu-dominio.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8000/
    ProxyPassReverse / http://127.0.0.1:8000/
</VirtualHost>
```
- Habilita el sitio y reinicia Apache:
```bash
sudo a2ensite noox.conf
sudo systemctl reload apache2
```

### 2. Certificado SSL con Certbot
```bash
sudo certbot --apache -d tu-dominio.com
```

### 3. Frontend (Vite build)
```bash
cd tracker-front
npm run build
# Copia el contenido de dist/ a /var/www/html o tu carpeta pública
sudo cp -r dist/* /var/www/html/
```

---

## Notas de seguridad y producción
- Usa variables de entorno seguras y nunca subas tu .env real al repositorio.
- Usa HTTPS siempre en producción.
- Limita el acceso a endpoints sensibles.
- Mantén tus dependencias actualizadas.

---

## Estructura de carpetas
```
nooxexpensestracker/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── tracker-front/
│   ├── src/
│   ├── public/
│   └── ...
├── README.md
└── ...
```

---

## Contacto y soporte
Para dudas o soporte, abre un issue en GitHub o contacta con nosotros.
