# Guide d’Installation

Prérequis :
- Java 17  
- Maven ou Gradle  
- Docker et Docker Compose  
- RabbitMQ  
- Firebase service account

Lancement :

```bash
docker compose up -d

---

## 04-implementation/docker-compose.md

```md
# Docker Compose – Microservices WillBank

Inclut :
- Eureka Server  
- API Gateway  
- RabbitMQ  
- Microservices (client, compte, transaction, notification, composite)

Astuce : utiliser des networks dédiés pour éviter les conflits.
