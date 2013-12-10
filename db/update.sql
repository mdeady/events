CREATE TABLE IF NOT EXISTS namespace (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (char_length(name) > 0)
)
;

CREATE TABLE IF NOT EXISTS identifier (
    id SERIAL NOT NULL PRIMARY KEY,
    namespace_id INT NOT NULL,
    name VARCHAR(255) NOT NULL CHECK (char_length(name) > 0),
    UNIQUE (namespace_id, name)
)
;

CREATE TABLE IF NOT EXISTS event (
    id SERIAL NOT NULL PRIMARY KEY,
    identifier_id INT NOT NULL REFERENCES identifier (id),
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT (now())
)
;

CREATE TABLE IF NOT EXISTS attribute (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (char_length(name) > 0)
)
;

CREATE TABLE IF NOT EXISTS identifier_attribute (
    identifier_id INT NOT NULL REFERENCES identifier (id),
    attribute_id INT NOT NULL REFERENCES attribute (id)
)
;

CREATE TABLE IF NOT EXISTS event_attribute (
    event_id INT NOT NULL REFERENCES event (id),
    attribute_id INT NOT NULL REFERENCES attribute (id),
    attribute_value TEXT
)
;
