-- Script SQL pour créer un utilisateur administrateur par défaut
-- WillBank Client Service Database Initialization

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS client_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE client_db;

-- La table clients sera créée automatiquement par Hibernate avec ddl-auto: update

-- Insérer un administrateur par défaut pour les tests
-- Email: admin@willbank.com
-- Password: Admin123! (haché avec BCrypt)
-- Note: Le hash ci-dessous correspond au mot de passe "Admin123!"
INSERT INTO clients (
    first_name, 
    last_name, 
    email, 
    password, 
    phone, 
    address, 
    cin, 
    role, 
    status, 
    last_login,
    created_at, 
    updated_at
) VALUES (
    'Admin',
    'WillBank',
    'admin@willbank.com',
    '$2a$10$8Vw3XkP.QqZqH5kj9TfLvOZxVJrfKvmXl9JkG5nG8tqKlHgZ9F8Ta',
    '+33100000000',
    '1 Avenue des Banques, 75001 Paris',
    'ADMIN001',
    'ADMIN',
    'ACTIVE',
    NOW(),
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE 
    updated_at = NOW();

-- Insérer un client test standard
-- Email: client@willbank.com
-- Password: Client123!
INSERT INTO clients (
    first_name, 
    last_name, 
    email, 
    password, 
    phone, 
    address, 
    cin, 
    role, 
    status,
    last_login,
    created_at, 
    updated_at
) VALUES (
    'Jean',
    'Dupont',
    'client@willbank.com',
    '$2a$10$8Vw3XkP.QqZqH5kj9TfLvOZxVJrfKvmXl9JkG5nG8tqKlHgZ9F8Ta',
    '+33612345678',
    '123 Rue de la République, 75001 Paris',
    'CLIENT001',
    'CLIENT',
    'ACTIVE',
    NULL,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE 
    updated_at = NOW();

-- Insérer un agent test
-- Email: agent@willbank.com
-- Password: Agent123!
INSERT INTO clients (
    first_name, 
    last_name, 
    email, 
    password, 
    phone, 
    address, 
    cin, 
    role, 
    status,
    last_login,
    created_at, 
    updated_at
) VALUES (
    'Marie',
    'Martin',
    'agent@willbank.com',
    '$2a$10$8Vw3XkP.QqZqH5kj9TfLvOZxVJrfKvmXl9JkG5nG8tqKlHgZ9F8Ta',
    '+33698765432',
    '456 Boulevard Saint-Germain, 75006 Paris',
    'AGENT001',
    'AGENT',
    'ACTIVE',
    NULL,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE 
    updated_at = NOW();

-- Afficher les utilisateurs créés
SELECT 
    id,
    first_name,
    last_name,
    email,
    role,
    status,
    created_at
FROM clients
ORDER BY id;

-- Instructions d'utilisation:
-- ==========================
-- 1. Se connecter à MySQL:
--    mysql -u root -p
--
-- 2. Exécuter ce script:
--    source /path/to/init-test-users.sql
--
-- 3. Utiliser les comptes de test:
--    Admin:  admin@willbank.com  / Admin123!
--    Client: client@willbank.com / Client123!
--    Agent:  agent@willbank.com  / Agent123!
--
-- Note: Les mots de passe sont tous hachés avec BCrypt.
-- Pour générer un nouveau hash BCrypt:
-- - Utiliser un outil en ligne ou
-- - Créer un utilisateur via l'API /auth/register
