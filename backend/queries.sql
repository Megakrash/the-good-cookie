PRAGMA foreign_keys = ON;

CREATE TABLE Category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL
);

INSERT INTO Category (name) VALUES
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Furniture'),
    ('Property'),
    ('Cars');


CREATE TABLE Ad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    owner VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    createdDate DATE NOT NULL,
    picture VARCHAR(500),
    location VARCHAR(100) NOT NULL,
    category INTEGER NOT NULL,
    FOREIGN KEY(category_id) REFERENCES Category(id)
    );

-- PRAGMA foreign_keys = ON;
INSERT INTO Ad (title, description, owner, price, createdDate, picture, location, category) VALUES
    ('CG Evga GTX980Ti Hydro Copper', 'Superbe carte graphique', 'carte.graphique@thegoodcorner.com', 249, '2023-9-1', 'https://media.topachat.com/media/s1000/630de00d033120593446ae0a.webp', 'Nantes', 1 ),
    ('T-shirt mauve', 'Superbe T-shirt mauve', 'tshirt.mauve@thegoodcorner.com', 15, '2023-9-1', 'https://www.monproduitdecom.com/images/produits/tshirt-10409.jpg', 'Bordeaux', 2 ),
    ('Le Silmarillon', 'Superbe livre', 'livre@thegoodcorner.com', 19, '2023-9-1', 'https://m.media-amazon.com/images/I/91vOYLA7beL._SL1500_.jpg', 'Lyon', 3 ),
    ('Table basse IKEA', 'Superbe table basse', 'table.basse@thegoodcorner.com', 8, '2023-9-1', 'https://m.media-amazon.com/images/I/41vM9+epqJL._AC_SL1500_.jpg', 'Nantes',  4),
    ('Maison de campagne', 'Superbe maison', 'maison@thegoodcorner.com', 1259000, '2023-9-1', 'https://i.f1g.fr/media/eidos/805x604_crop/2020/04/27/XVM6fdd6896-8650-11ea-bef4-6835ce68601a-805x604.jpg', 'Bordeaux', 5 ),
    ('Mercedes ClasseB 2013', 'Superbe voiture', 'mercedes@thegoodcorner.com', 2500, '2023-9-1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYqSpgKAUecjumNfdUNFlCGk7gJ6tJXy4-Cw&usqp=CAU', 'Lyon', 6 ),
    ('CG Evga GTX2080Ti', 'Superbe carte graphique', 'carte.graphique2@thegoodcorner.com', 549, '2023-9-1', 'https://media.topachat.com/media/s1000/630de00d033120593446ae0a.webp', 'Nantes', 1 ),
    ('T-shirt vert', 'Superbe T-shirt vert', 'tshirt.vert@thegoodcorner.com', 12, '2023-9-1', 'https://www.monproduitdecom.com/images/produits/tshirt-10409.jpg', 'Bordeaux', 2 ),
    ('Terre et mer Tome1', 'Superbe livre', 'livre2@thegoodcorner.com', 8, '2023-9-1', 'https://m.media-amazon.com/images/I/91vOYLA7beL._SL1500_.jpg', 'Lyon', 3 ),
    ('Table basse BUT', 'Superbe table basse', 'table.basse2@thegoodcorner.com', 49, '2023-9-1', 'https://m.media-amazon.com/images/I/41vM9+epqJL._AC_SL1500_.jpg', 'Nantes',  4),
    ('Maison de ville', 'Superbe maison', 'maison2@thegoodcorner.com', 775000, '2023-9-1', 'https://i.f1g.fr/media/eidos/805x604_crop/2020/04/27/XVM6fdd6896-8650-11ea-bef4-6835ce68601a-805x604.jpg', 'Bordeaux', 5 ),
    ('Twingo 2009', 'Superbe voiture', 'twingo@thegoodcorner.com', 1300, '2023-9-1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYqSpgKAUecjumNfdUNFlCGk7gJ6tJXy4-Cw&usqp=CAU', 'Lyon', 6 ),
    ('CG Evga GTX4080Ti', 'Superbe carte graphique', 'carte.graphique3@thegoodcorner.com', 1049, '2023-9-1', 'https://media.topachat.com/media/s1000/630de00d033120593446ae0a.webp', 'Nantes', 1 ),
    ('T-shirt noir', 'Superbe T-shirt noir', 'tshirt.vert@thegoodcorner.com', 18, '2023-9-1', 'https://www.monproduitdecom.com/images/produits/tshirt-10409.jpg', 'Bordeaux', 2 ),
    ('Terre et mer Tome2', 'Superbe livre', 'livre3@thegoodcorner.com', 8, '2023-9-1', 'https://m.media-amazon.com/images/I/91vOYLA7beL._SL1500_.jpg', 'Lyon', 3 ),
    ('Table basse INCONNUE', 'Superbe table basse', 'table.basse3@thegoodcorner.com', 254, '2023-9-1', 'https://m.media-amazon.com/images/I/41vM9+epqJL._AC_SL1500_.jpg', 'Nantes',  4),
    ('Maison de mer', 'Superbe maison', 'maison3@thegoodcorner.com', 985000, '2023-9-1', 'https://i.f1g.fr/media/eidos/805x604_crop/2020/04/27/XVM6fdd6896-8650-11ea-bef4-6835ce68601a-805x604.jpg', 'Bordeaux', 5 ),
    ('Peugeot 307 2015', 'Superbe voiture', 'twingo@thegoodcorner.com', 8500, '2023-9-1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYqSpgKAUecjumNfdUNFlCGk7gJ6tJXy4-Cw&usqp=CAU', 'Lyon', 6 ),
    ('CG Evga GTX9080Ti', 'Superbe carte graphique', 'carte.graphique4@thegoodcorner.com', 1680, '2023-9-1', 'https://media.topachat.com/media/s1000/630de00d033120593446ae0a.webp', 'Nantes', 1 ),
    ('T-shirt treillis', 'Superbe T-shirt treillis', 'tshirt.treillis@thegoodcorner.com', 22, '2023-9-1', 'https://www.monproduitdecom.com/images/produits/tshirt-10409.jpg', 'Bordeaux', 2 );

DELETE FROM Ad;

SELECT * FROM Ad WHERE location='Nantes';