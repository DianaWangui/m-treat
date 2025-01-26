CREATE DATABASE patientdb;

-- Create the user
CREATE USER diana WITH PASSWORD 'diana';

ALTER ROLE diana SET client_encoding TO 'utf8';
ALTER ROLE diana SET default_transaction_isolation TO 'read committed';
ALTER ROLE diana SET timezone TO 'Africa/Nairobi';
GRANT ALL PRIVILEGES ON DATABASE patientdb TO diana;
\c patientdb
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO diana;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO diana;
