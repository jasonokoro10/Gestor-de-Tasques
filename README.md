# 📋 Gestor de Tasques API - Autenticació JWT

API RESTful completa per a la gestió de tasques amb un sistema robust d'autenticació i autorització basat en JSON Web Tokens (JWT).

## 🚀 Característiques Principals

- **Autenticació Segura**: Registre i Login amb JWT.
- **Autorització per Rols**: Diferenciació entre usuaris (`user`) i administradors (`admin`).
- **Seguretat de Dades**: Contrasenyes xifrades amb `bcrypt` i protecció contra injeccions.
- **Privadesa**: Els usuaris només poden gestionar les seves pròpies tasques.
- **Administració**: Panell d'admin per gestionar usuaris i veure totes les tasques del sistema.
- **Validació**: Validació estricta de dades d'entrada amb `express-validator`.

---

## 🛠️ Instal·lació i Configuració

### 1. Clonar i Instal·lar Dependències

```bash
# Accedir al directori del projecte
cd task-manager-api

# Instal·lar paquets
npm install
```

### 2. Configurar Variables d'Entorn

L'arxiu `.env` ja està configurat per defecte per a desenvolupament, però pots personalitzar-lo:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-manager-api
JWT_SECRET=la_teva_clau_secreta_super_segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Executar el Servidor

```bash
# Mode desenvolupament (amb nodemon)
npm run dev

# Mode producció
npm start
```

---

## 🔐 Sistema d'Autenticació

L'API utilitza **Bearer Tokens**. Per accedir a rutes protegides, cal incloure el token al header de la petició:

`Authorization: Bearer <el_teu_token_jwt>`

### Flux d'Usuari:

1.  **Registre (`/register`)**: L'usuari crea un compte i rep un token.
2.  **Login (`/login`)**: L'usuari s'identifica i rep un token nou.
3.  **Accés (`/tasks`)**: L'usuari envia el token per gestionar les seves tasques.

---

## 📡 Endpoints Disponibles

### 👤 Autenticació (Públic)

| Mètode | Ruta                 | Descripció                     |
| :----- | :------------------- | :----------------------------- |
| `POST` | `/api/auth/register` | Crear nou compte d'usuari      |
| `POST` | `/api/auth/login`    | Iniciar sessió i obtenir token |

### 👤 Usuari (Privat - Requereix Token)

| Mètode | Ruta                        | Descripció                     |
| :----- | :-------------------------- | :----------------------------- |
| `GET`  | `/api/auth/me`              | Obtenir dades del perfil propi |
| `PUT`  | `/api/auth/profile`         | Actualitzar nom o email        |
| `PUT`  | `/api/auth/change-password` | Canviar contrasenya            |

### 📝 Tasques (Privat - Dades pròpies)

| Mètode   | Ruta               | Descripció                           |
| :------- | :----------------- | :----------------------------------- |
| `GET`    | `/api/tasks`       | Llistar totes les meves tasques      |
| `POST`   | `/api/tasks`       | Crear una nova tasca                 |
| `GET`    | `/api/tasks/:id`   | Veure detall d'una tasca             |
| `PUT`    | `/api/tasks/:id`   | Editar una tasca                     |
| `DELETE` | `/api/tasks/:id`   | Eliminar una tasca                   |
| `GET`    | `/api/tasks/stats` | Estadístiques (Total, Costos, Hores) |

### 👑 Administració (Només Rol Admin)

| Mètode   | Ruta                        | Descripció                                   |
| :------- | :-------------------------- | :------------------------------------------- |
| `GET`    | `/api/admin/users`          | Veure tots els usuaris registrats            |
| `GET`    | `/api/admin/tasks`          | Veure totes les tasques del sistema          |
| `DELETE` | `/api/admin/users/:id`      | Eliminar un usuari i les seves tasques       |
| `PUT`    | `/api/admin/users/:id/role` | Ascendir o degradar usuaris (User <-> Admin) |

---

## 🧪 Exemples d'Ús (JSON Body)

**Registrar Usuari:**

```json
{
  "name": "Joan Garcia",
  "email": "joan@example.com",
  "password": "password123"
}
```

**Crear Tasca:**

```json
{
  "title": "Desenvolupar API",
  "description": "Implementar autenticació amb JWT",
  "cost": 500,
  "hours_estimated": 10
}
```

**Canviar Rol (Admin):**

```json
{
  "role": "admin"
}
```

---

## 🛡️ Estructura del Projecte

```
task-manager-api/
├── controllers/    # Lògica de negoci
├── middleware/     # Seguretat (auth, rols) i validacions
├── models/         # Esquemes de Mongoose (User, Task)
├── routes/         # Definició d'endpoints
├── utils/          # Helpers (Errors, Tokens)
└── app.js          # Punt d'entrada de l'aplicació
```
