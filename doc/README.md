# Documentation du Projet WillBank – Architecture Microservices

Ce dépôt contient la documentation complète du projet de migration de WillBank vers une architecture microservices moderne, scalable et résiliente.

## Structure de la documentation

1. Vue d’ensemble du projet  
2. Architecture logicielle et technique  
3. Cahier de conception (modèles de données, APIs, interactions)  
4. Guides d’implémentation (Eureka, API Gateway, RabbitMQ, FCM)  
5. Stratégie de tests  
6. CI/CD et déploiement  
7. Annexes (glossaire, références, cahier des charges)

## Objectif principal

Transformer un système monolithique bancaire en une architecture microservices capable de gérer une forte charge, d’intégrer de nouveaux canaux et de garantir une haute disponibilité.

## Diagrammes

Les images et schémas UML se trouvent dans :

``docs/02-architecture/images/``  
``docs/03-design/schemas-bdd/``

## Technologies principales

- Spring Boot Microservices  
- Spring Cloud (Eureka, API Gateway)  
- RabbitMQ pour la communication asynchrone  
- Firebase Cloud Messaging pour les notifications  
- Docker et Docker Compose  
- REST APIs

---

## Pour commencer

Consultez d’abord :

- `01-overview/introduction.md`
- `02-architecture/architecture-globale.md`
