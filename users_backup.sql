PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
, role VARCHAR(50));
INSERT INTO users VALUES(1,'Admin','User','admin@example.com','securepassword','admin');
INSERT INTO users VALUES(2,'Staff','Member','staff@example.com','securepassword','staff');
INSERT INTO users VALUES(3,'Elderly','User','elderly@example.com','securepassword','elderly');
INSERT INTO users VALUES(NULL,'po','po','po@gmail.com','$2a$10$Sy.hHpL12c1Br1cw6PATeO/t0FusRnaSi.npCSYlN3LrfAKARVuvO','staff');
INSERT INTO users VALUES(NULL,'pie','pie','pie@gmail.com','$2a$10$F.qUaWLeH1fA.qq7wDvS2exWZGhDpEE2LLifsAigoct9SrJp5CtK2','elderly');
INSERT INTO users VALUES(NULL,'atm','atm','atm@gmail.com','$2a$10$Y.aEKMY4c4ysabr846Ks..wC5cwqxCBw0qr21.mPZf9RRTDui0fWq','elderly');
INSERT INTO users VALUES(NULL,'pan','pan','pan@gmail.com','$2a$10$R1ttP2RtGbnhmbjWo7kR.OQsmtkTax.n2dsNuI5qzIj1cma7WfECe','elderly');
COMMIT;
