CREATE TABLE stagiaire_info (
    id INT(50) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tele_portable VARCHAR(255) NOT NULL,
    tele_domicile VARCHAR(255),
    adress_personnelle VARCHAR(255) NOT NULL,
    codepostal_personnelle VARCHAR(255) NOT NULL,
    adress_domicile VARCHAR(255),
    codepostal_domicile VARCHAR(255),
    date_de_naissance VARCHAR(255) NOT NULL,
    lieu_de_naissance VARCHAR(255) NOT NULL,
    sex VARCHAR(255) NOT NULL,
    stagiaire_photo VARCHAR(255) NOT NULL,
    stagiaire_cv VARCHAR(255) NOT NULL
);

CREATE TABLE course (
    course_id INT(50) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    student_id VARCHAR NOT NULL,
    course_name VARCHAR NOT NULL,
    course_city VARCHAR NOT NULL
);

-- CREATE TABLE situation_actuelle (
--     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--     stagiaire_id INT NOT NULL,
--     etudiant VARCHAR(255),
--     etude VARCHAR(255),
--     salarier VARCHAR(255),
--     type_de_contrat VARCHAR(255),
--     secteure_de_activite VARCHAR(255),
--     recherch_de_emploi VARCHAR(255),
--     autre VARCHAR(255),
--     autre_a_preciser VARCHAR(255),
--     FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
-- );

CREATE TABLE situation_actuelle (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    stagiaire_id INT NOT NULL,
    situation_actuelle VARCHAR(255),
    currentDate DATETIME,
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE diploms (
    stagiaire_id INT NOT NULL,
    nom_de_diplom VARCHAR(255),
    annee_de_optention VARCHAR(255),
    institution VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE experiences_et_stage (
    stagiaire_id INT NOT NULL,
    stage_ou_emploi VARCHAR(255),
    nom_de_ste VARCHAR(255),
    secteur_de_ste VARCHAR(255),
    departement VARCHAR(255),
    post VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE centre_de_interet (
    stagiaire_id INT NOT NULL,
    centre_de_interet VARCHAR(255)
);

CREATE TABLE connaissance_general (
    stagiaire_id INT NOT NULL,
    juridique VARCHAR(225),
    social VARCHAR(225),
    finance_et_comptabilite VARCHAR(225),
    audit_et_controle_interne VARCHAR(225),
    fiscalite VARCHAR(225),
    managment_et_commercial VARCHAR(225),
    informatique VARCHAR(225),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE connaissance_informatique (
    stagiaire_id INT NOT NULL,
    ordinateur_disponible VARCHAR(255),
    internet_disponible VARCHAR(255),
    type_internet VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE etudiants (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stagiaire_id INT NOT NULL,
    specialite VARCHAR(255),
    etablissement VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE stagiaires (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stagiaire_id INT NOT NULL,
    nom_de_ste VARCHAR(255),
    secteur VARCHAR(255),
    post VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE salariers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stagiaire_id INT NOT NULL,
    type_de_contract VARCHAR(255),
    nom_de_ste VARCHAR(255),
    secteur VARCHAR(255),
    post VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

-- CREATE TABLE rechech_de_emploi (

-- );

CREATE TABLE autre_situations (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stagiaire_id INT NOT NULL,
    preciser VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

CREATE TABLE stagiaire_formations (
    stagiaire_id INT NOT NULL,
    formation VARCHAR(255),
    ville VARCHAR(255),
    FOREIGN KEY(stagiaire_id) REFERENCES stagiaire_info(id) ON DELETE CASCADE
);

ALTER TABLE experiences_et_stage
    ADD debut_de_period DATE,
    ADD fin_de_period DATE;

ALTER TABLE stagiaire_info 
    ADD date_de_inscription DATE NOT NULL;