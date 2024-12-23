PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
INSERT INTO requests VALUES(1,1,'Test request','pending',0,'2024-12-05 03:29:43');
COMMIT;
