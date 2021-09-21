DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT NOT NULL,
    description VARCHAR(255) NOT NULL,
    due_date DATETIME NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO tasks
    (description, due_date)
VALUES
    ('Make a salad', '2021-09-20 12:30:45'),
    ('Ride a bicycle', '2021-09-17 13:30:45'),
    ('Read a book', '2021-10-13 12:56:34'),
    ('Clean the house', '2021-09-25 17:02:00');
