# Architecture Globale

L’architecture cible repose sur :

- une API Gateway comme point d’entrée unique  
- un service de découverte (Eureka)  
- des microservices indépendants avec leur propre base  
- une communication mixte : REST + RabbitMQ  
- un service composite pour les vues métier  
- un module de notifications (Email, FCM)

![Diagramme Architecture](./images/diagramme-architecture.png)
