use udemy_delivery;

CREATE TABLE users(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email varchar(180) NOT NULL unique,
    name varchar(90) NOT NULL,
    lastname varchar(90) NOT NULL,
    phone varchar(90) NOT NULL unique,
    image varchar(255) NULL,
    password varchar(90) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

USE udemy_delivery;

CREATE TABLE roles(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(180) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO
    roles(
        name,
        route,
        created_at,
        updated_at
    )
VALUES
(
        'RESTAURANTE',
        '/restaurant/orders/list',
        '2023-11-29',
        '2023-11-29'
    );

INSERT INTO
    roles(
        name,
        route,
        created_at,
        updated_at
    )
VALUES
(
        'REPARTIDOR',
        '/delivery/orders/list',
        '2023-11-29',
        '2023-11-29'
    );

INSERT INTO
    roles(name, route, created_at, updated_at)
VALUES
(
        'CLIENTE',
        '/client/products/list',
        '2023-11-29',
        '2023-11-29'
    );

CREATE TABLE user_has_roles(
    id_user BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);

CREATE TABLE categories(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);