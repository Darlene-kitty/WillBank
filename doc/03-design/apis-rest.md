# APIs REST

## Microservice Client

### GET /clients/{id}
Retourne les informations du client.

### POST /clients
Crée un client.

### PUT /clients/{id}
Met à jour le client.

---

## Microservice Compte

### GET /accounts/{id}
Retourne un compte.

### POST /accounts
Crée un compte.

---

## Microservice Transaction

### POST /transactions
Effectue un virement ou une opération.

### GET /transactions/history?accountId=
Retourne les transactions d’un compte.
