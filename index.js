const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path")
const { validationResult } = require("express-validator");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");


// require middleware
const pool = require("./database/db");

// middleware
// app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");

// validator middleware
const { validator, upload } = require("./middleware/fileUpload/inscriptionUpload");

// file encryption middleware 
// const encryptFiles = require("./middleware/fileEncryptionAndDecryption/encryptFiles");

app.get("/inscription", (req, res) => {
    let errors = []
    let localStorageBody;

    // localStorage.setItem('body', JSON.stringify({
    //     id: "",
    //     nom: "",
    //     prenom : "",
    //     email : "",
    //     tele_portable : "",
    //     tele_domicile : "",
    //     adress_personnelle : "",
    //     codepostal_personnelle : "",
    //     adress_domicile : "",
    //     codepostal_domicile : "",
    //     date_de_naissance : "",
    //     lieu_de_naissance : "",
    //     sex : "",
    //     stagiaire_photo : "",
    //     stagiaire_cv : ""
    // }));
    
    // localStorage.removeItem("body");
    if (localStorage.getItem("body")) {
        localStorageBody = JSON.parse(localStorage.getItem("body"));

    } else {
        localStorage.setItem('body', JSON.stringify({
            id: "",
            nom: "",
            prenom : "",
            email : "",
            tele_portable : "",
            tele_domicile : "",
            adress_personnelle : "",
            codepostal_personnelle : "",
            adress_domicile : "",
            codepostal_domicile : "",
            date_de_naissance : "",
            lieu_de_naissance : "",
            sex : "",
            stagiaire_photo : "",
            stagiaire_cv : ""
        }));
    }
    
    localStorageBody = JSON.parse(localStorage.getItem("body"));
    
    const {
        nom,
        prenom,
        email,
        tele_portable,
        tele_domicile,
        adress_personnelle,
        codepostal_personnelle,
        adress_domicile,
        codepostal_domicile,
        date_de_naissance,
        lieu_de_naissance,
        sex,
        stagiaire_photo,
        stagiaire_cv
    } = localStorageBody;

    // console.log(localStorageBody);

    // // delete the user folder in case if he return back to correct some data
    const dir = path.resolve() + `\\public\\uploads\\users\\files\\${nom}_${prenom}`;
    
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true });
    }

    res.render("index", {
        errors,
        nom,
        prenom,
        email,
        tele_portable,
        tele_domicile,
        adress_personnelle,
        codepostal_personnelle,
        adress_domicile,
        codepostal_domicile,
        date_de_naissance,
        lieu_de_naissance,
        sex,
        stagiaire_photo,
        stagiaire_cv
    });
});

// app.get("/inscription/valider_inscription", (req, res) => {
//     res.render("valider_inscription");
// });

app.post("/inscription", upload, validator, async (req, res) => {
    let errors = validationResult(req).errors;
    let localStorageBody;

    // step 1) distructure all the inputs from req.body and req.file
    const {
        nom,
        prenom,
        email,
        tele_portable,
        tele_domicile,
        adress_personnelle,
        codepostal_personnelle,
        adress_domicile,
        codepostal_domicile,
        date_de_naissance,
        lieu_de_naissance,
        sex
    } = req.body

    // make a query for email
    const emailDB = await pool.query(
        `
        SELECT EXISTS(SELECT * FROM stagiaire_info WHERE nom = ? OR prenom = ? OR email = ?) AS "user_check"
        `,
        [nom, prenom, email],
    );

    const emailIsExist = emailDB[0][0].user_check;
    
    // check if email is already exist
    if (emailIsExist) {
        const stagiaire_photo = "";
        const stagiaire_cv = "";
        // create the error 
        const error = {
            param: "userExist",
            msg: "vous ne pouvez pas vous inscrire car cet utilisateur existe déjà."
        }
        
        errors.push(error);

        res.render("index", {
            errors,
            nom,
            prenom,
            email,
            tele_portable,
            tele_domicile,
            adress_personnelle,
            codepostal_personnelle,
            adress_domicile,
            codepostal_domicile,
            date_de_naissance,
            lieu_de_naissance,
            sex,
            stagiaire_photo,
            stagiaire_cv
        });
    } else {
        // console.log(req.files);
        if (req.files.stagiaire_photo || req.files.stagiaire_cv) {
            const stagiaire_photo = req.files.stagiaire_photo[0].path
            const stagiaire_cv = req.files.stagiaire_cv[0].path
        }

        // step 2) set all the inputs to local storage
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"))
            localStorageBody.nom = nom;
            localStorageBody.prenom = prenom;
            localStorageBody.email = email;
            localStorageBody.tele_portable = tele_portable;
            localStorageBody.tele_domicile = tele_domicile;
            localStorageBody.adress_personnelle = adress_personnelle;
            localStorageBody.codepostal_personnelle = codepostal_personnelle;
            localStorageBody.adress_domicile = adress_domicile;
            localStorageBody.codepostal_domicile = codepostal_domicile;
            localStorageBody.date_de_naissance = date_de_naissance;
            localStorageBody.lieu_de_naissance = lieu_de_naissance;
            localStorageBody.sex = sex;
            if (req.files.stagiaire_photo) {
                const stagiaire_photo = req.files.stagiaire_photo[0].filename;
                localStorageBody.stagiaire_photo = stagiaire_photo;
            }
            if (req.files.stagiaire_cv) {
                const stagiaire_cv = req.files.stagiaire_cv[0].filename;
                localStorageBody.stagiaire_cv = stagiaire_cv;
            }
        } else {
            localStorageBody = localStorage.setItem('body', JSON.stringify({
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                stagiaire_photo,
                stagiaire_cv
            }));
        }

        localStorage.setItem("body", JSON.stringify(localStorageBody));
        
        if (req.validations && req.validations.length > 0) {
            req.validations.forEach(validation => {
                errors.push(validation);
            });
        } else {
            // check if no file is uploaded
            if (!req.files.stagiaire_photo && !req.files.stagiaire_cv) {
                // create the validation array
                const emptyFiles = [
                    {
                        msg: "s'il vous plaît télécharger votre photo",
                        param: "stagiaire_photo"
                    },
                    {
                        msg: "s'il vous plaît télécharger votre CV",
                        param: "stagiaire_cv"
                    }
                ];

                emptyFiles.forEach(emptyFile => {
                    errors.push(emptyFile)
                });

                // remove the file path from local storage if there is only one file is uploaded
                if (localStorage.getItem("body")) {
                    localStorageBody = JSON.parse(localStorage.getItem("body"));
                    localStorageBody.stagiaire_photo = "";
                    localStorageBody.stagiaire_cv = "";
                }
                localStorage.setItem("body", JSON.stringify(localStorageBody));

                // delete the entire forlder if there is no encrypted file
                const dir = path.resolve() + `\\public\\uploads\\users\\files\\${nom}_${prenom}`;
                if (fs.existsSync(dir)) {
                    fs.rmdirSync(dir, { recursive: true });
                }

            }

            // check if photo is not uploaded
            if (!req.files.stagiaire_photo && req.files.stagiaire_cv) {
                
                const emptyFiles = [
                    {
                        msg: "s'il vous plaît télécharger votre photo",
                        param: "stagiaire_photo"
                    },
                    {
                        msg: "s'il vous plaît télécharger votre CV",
                        param: "stagiaire_cv"
                    }
                ];

                emptyFiles.forEach(emptyFile => {
                    errors.push(emptyFile)
                });

                // remove the file path from local storage if there is only one file is uploaded
                if (localStorage.getItem("body")) {
                    localStorageBody = JSON.parse(localStorage.getItem("body"));
                    localStorageBody.stagiaire_cv = "";
                }
                localStorage.setItem("body", JSON.stringify(localStorageBody));

                // delete the entire forlder if there is no encrypted file
                const dir = path.resolve() + `\\public\\uploads\\users\\files\\${req.body.nom}_${req.body.prenom}`;
                if (fs.existsSync(dir)) {
                    fs.rmdirSync(dir, { recursive: true });
                }
            }

            // check if CV is not uploaded
            if (req.files.stagiaire_photo && !req.files.stagiaire_cv) {
                const emptyFiles = [
                    {
                        msg: "s'il vous plaît télécharger votre photo",
                        param: "stagiaire_photo"
                    },
                    {
                        msg: "s'il vous plaît télécharger votre CV",
                        param: "stagiaire_cv"
                    }
                ];

                emptyFiles.forEach(emptyFile => {
                    errors.push(emptyFile)
                });

                // remove the file path from local storage if there is only one file is uploaded
                if (localStorage.getItem("body")) {
                    localStorageBody = JSON.parse(localStorage.getItem("body"));
                    localStorageBody.stagiaire_photo = "";
                }
                localStorage.setItem("body", JSON.stringify(localStorageBody));

                // delete the entire forlder if there is no encrypted file
                const dir = path.resolve() + `\\public\\uploads\\users\\files\\${req.body.nom}_${req.body.prenom}`;
                if (fs.existsSync(dir)) {
                    fs.rmdirSync(dir, { recursive: true });
                }
            }
        }
        
        if (errors.length > 0) {
            const {
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                stagiaire_photo,
                stagiaire_cv
            } = JSON.parse(localStorage.getItem("body"));
            res.render("index", {
                errors,
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                stagiaire_photo,
                stagiaire_cv
            });
        } else {

            const {
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                stagiaire_photo,
                stagiaire_cv
            } = JSON.parse(localStorage.getItem("body"));
            

            // encryptFiles({
            //     filePhoto: stagiaire_photo, 
            //     fileCV: stagiaire_cv, 
            //     password : "itsmethebestdeverever"
            // });

            // remove the file path from local storage if there is only one file is uploaded
            if (localStorage.getItem("body")) {
                localStorageBody = JSON.parse(localStorage.getItem("body"));
                localStorageBody.stagiaire_photo = req.files.stagiaire_photo[0].filename;
                localStorageBody.stagiaire_cv = req.files.stagiaire_cv[0].filename;
            }
            localStorage.setItem("body", JSON.stringify(localStorageBody));
            
            res.render("valider_inscription", {
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                stagiaire_photo,
                stagiaire_cv
            });
        }

        console.log("there no one with this email")
    }

    

    
});

app.post("/inscriptionValider", async (req, res) => {
    const localStorageBody = JSON.parse(localStorage.getItem("body"));
    let {
        nom,
        prenom,
        email,
        tele_portable,
        tele_domicile,
        adress_personnelle,
        codepostal_personnelle,
        adress_domicile,
        codepostal_domicile,
        date_de_naissance,
        lieu_de_naissance,
        sex,
        stagiaire_photo,
        stagiaire_cv
    } = localStorageBody;

    // extract only the photo name and the extention
    let photoTrimed = stagiaire_photo.split("\\");
    photoTrimed = photoTrimed[photoTrimed.length - 1];
    let cvTrimed = stagiaire_photo.split("\\");
    cvTrimed = cvTrimed[cvTrimed.length - 1];

    
    try {
        // make the query to insert into database
        const insertItem = await pool.query(
            `INSERT INTO stagiaire_info
                (nom, prenom, email, tele_portable, tele_domicile, adress_personnelle, codepostal_personnelle, adress_domicile, codepostal_domicile, date_de_naissance, lieu_de_naissance, sex, stagiaire_photo, stagiaire_cv, date_de_inscription) 
            VALUES 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURDATE())`,
            [
                nom,
                prenom,
                email,
                tele_portable,
                tele_domicile,
                adress_personnelle,
                codepostal_personnelle,
                adress_domicile,
                codepostal_domicile,
                date_de_naissance,
                lieu_de_naissance,
                sex,
                photoTrimed,
                cvTrimed
            ]        
        );
        let localStorageBody;
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.id = insertItem[0].insertId;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));
        res.redirect("/situationactuelle");
    } catch (error) {
        console.log(error)
    }
});

// situation actuelle
app.get("/situationactuelle", (req, res) => {
    const { sex } = JSON.parse(localStorage.getItem("body"));
    
    res.render("situation_actuelle", { sex })
});

app.post("/situation_actuelle", async (req, res) => {
    let localStorageBody;
    let situation;

    const {
        situationActuelle,
        specialite,
        etablissement,
        nomDeSocieteStage,
        activiteStage,
        postOccupeeStage,
        contract,
        nomDeSociete,
        activite,
        postOccupee,
        recherchedemploit,
        autre,
        autrePreciser
    } = req.body;
    // we have 4 inserts
    
    
    // insert if etudiant
    if (situationActuelle == "etudiant") {
        // create the object
        situation = {
            situation: situationActuelle,
            specialite,
            etablissement 
        }
        
        // step 1) get localStorage and update
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.situation_actuelle = situation;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));
        // extarct data from local storage
        const {
            id,
            situation_actuelle
        } = JSON.parse(localStorage.getItem("body"));
        
        // insert into situation actuelle table
        await pool.query(
            `
                INSERT INTO situation_actuelle (stagiaire_id, situation_actuelle, currentDate)
                    VALUES
                (?, ?, NOW())
            `,
            [id, situation_actuelle.situation]
        );

        // insert into etudiants table
        await pool.query(
            `
                INSERT INTO etudiants (stagiaire_id, specialite, etablissement)
                    VALUES
                (?, ?, ?)
            `,
            [id, situation_actuelle.specialite, situation_actuelle.etablissement]
        );
        
    }
    
    // insert if salarier
    if (situationActuelle == "stagiaire") {
        // create the object
        situation = {
            situation: situationActuelle,
            societe: nomDeSocieteStage,
            activite: activiteStage,
            post_occupee: postOccupeeStage,
        }

        // insert into salarier table
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.situation_actuelle = situation;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        const {
            id,
            situation_actuelle
        } = JSON.parse(localStorage.getItem("body"));

        // insert into situationèactuelle table
        await pool.query(
            `
                INSERT INTO situation_actuelle (stagiaire_id, situation_actuelle, currentDate)
                    VALUES
                (?, ?, NOW())
            `,
            [id, situation_actuelle.situation]
        );

        // insert into stage table
        await pool.query(
            `
                INSERT INTO stagiaires (stagiaire_id, nom_de_ste, secteur, post)
                    VALUES
                (?, ?, ?, ?)
            `,
            [id, situation_actuelle.societe, situation_actuelle.activite, situation_actuelle.post_occupee]
        );

    }

    // insert if salarier
    if (situationActuelle == "salarier") {
        // create the object
        situation = {
            situation: situationActuelle,
            contract,
            societe: nomDeSociete,
            activite,
            post_occupee: postOccupee
        }

        // step 1) get localStorage and update
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.situation_actuelle = situation;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        // get itmes from local storage
        const {
            id,
            situation_actuelle
        } = JSON.parse(localStorage.getItem("body"));

        // insert into situation actuelle table
        await pool.query(
            `
                INSERT INTO situation_actuelle (stagiaire_id, situation_actuelle, currentDate)
                    VALUES
                (?, ?, NOW())
            `,
            [id, situation_actuelle.situation]
        );

        // insert into slarier table
        await pool.query(
            `
                INSERT INTO salariers (stagiaire_id, type_de_contract, nom_de_ste, secteur, post)
                    VALUES
                (?, ?, ?, ?, ?)
            `,
            [id, situation_actuelle.contract, situation_actuelle.societe, situation_actuelle.activite, situation_actuelle.post_occupee]
        );
    }

    // // insert if recherch d'emoloi
    if (situationActuelle == "recheche_d'emploi") {
        // step 1) get localStorage and update
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.situation_actuelle = situationActuelle;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));
        
        // get item from local storage
        const {
            id, 
            situation_actuelle
        } = JSON.parse(localStorage.getItem("body"))

        // insert into situation actuelle table
        await pool.query(
            `
                INSERT INTO situation_actuelle (stagiaire_id, situation_actuelle, currentDate)
                    VALUES
                (?, ?, NOW())
            `,
            [id, situation_actuelle]
        );

    }

    // insert if autre 
    if (situationActuelle == "autre") {
        // create the object
        situation = {
            situation: situationActuelle,
            description: autrePreciser
        }

        // step 1) get localStorage and update
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.situation_actuelle = situation;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));
        
        // get item from local storage
        const {
            id, 
            situation_actuelle
        } = JSON.parse(localStorage.getItem("body"));

        // insert into situation actuelle table
        await pool.query(
            `
                INSERT INTO situation_actuelle (stagiaire_id, situation_actuelle, currentDate)
                    VALUES
                (?, ?, NOW())
            `,
            [id, situation_actuelle.situation]
        );

        // insert into autre_situations
        await pool.query(
            `
                INSERT INTO autre_situations (stagiaire_id, preciser)
                    VALUES
                (?, ?)
            `,
            [id, situation_actuelle.description]
        );

    }

    res.redirect("/diplom_et_formations");
});

// diplom et formations
app.get("/diplom_et_formations", (req, res) => {
    const { sex } = JSON.parse(localStorage.getItem("body"));
    res.render("diploms")
});

app.post("/diploms", (req, res) => {
    
    const {
        diplom,
        institution,
        date_de_obtention
    } = req.body;

    let localStorageBody;
    
    // if there is only one diploma
    if (typeof diplom == "string" && typeof date_de_obtention == "string") {
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.diploms = [{ diplom, institution, date_de_obtention }];
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        // get all diploms from localstorage
        const {
            id,
            diploms,
        } = JSON.parse(localStorage.getItem("body"));

        // loop through diploms
        diploms.forEach(async (diplomItem) => {
            // insert into diploms table
            await pool.query(
                `
                    INSERT INTO diploms (stagiaire_id, nom_de_diplom,  annee_de_optention,  institution) 
                        VALUES
                    (?, ?, ?, ?)
                `,
                [id, diplomItem.diplom, diplomItem.date_de_obtention, diplomItem.institution]
            );
        });

    }

    // if there are more than one diploma
    if (typeof diplom == "object" && typeof date_de_obtention == "object") {
        let diploms_ = []
        // create the loop that ethirate through both arrays arrays and create a new array of objects
        diplom.forEach((diplomItem, index) => {
            const stagiaireDiploms = {
                diplom: diplomItem,
                institution: institution[index],
                anne_de_obtention: date_de_obtention[index]
            }
            diploms_.push(stagiaireDiploms);
        });

        // update local storage
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.diploms = diploms_
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        const { id, diploms } = JSON.parse(localStorage.getItem("body"));
        
        // loop through diploms
        diploms.forEach( async diplomItem => {
            // insert into diploms table
            await pool.query(
                `
                    INSERT INTO diploms (stagiaire_id, nom_de_diplom,  annee_de_optention,  institution) 
                        VALUES
                    (?, ?, ?, ?)
                `,
                [id, diplomItem.diplom, diplomItem.anne_de_obtention, diplomItem.institution]
            );
        });

    }

    res.redirect("/experiences_professionnelles")
});

// experience professionnelle
app.get("/experiences_professionnelles", (req, res) => {
    console.log(JSON.parse(localStorage.getItem("body")));
    res.render("expreinces_prefessionnelle");
});

app.post("/experiences_prefessionnelle", (req, res) => {
    // distructure from the req.body
    const {
        experience,
        debut,
        fin,
        nom_de_ste,
        secteur,
        departement,
        fonction,
        centreDeInteret
    } = req.body;

    let localStorageBody;
    let experiences_ = []

    // check if only one entry
    if (typeof experience == "string") {
        experiences_.push({ experience, nom_de_ste, secteur, departement, fonction, debut_de_stage: debut, fin_de_stage: fin })

        // update local storage
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.experiences = experiences_;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        // get experiences from local storage
        const { id, experiences } = JSON.parse(localStorage.getItem("body"));
        
        // loop through experiences
        experiences.forEach( async experience => {
            // insert into experiences table
            pool.query(
                `
                    INSERT INTO experiences_et_stage (stagiaire_id, stage_ou_emploi, nom_de_ste, secteur_de_ste, departement, post, debut_de_period, fin_de_period)
                        VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [ id, experience.experience, experience.nom_de_ste, experience.secteur, experience.departement, experience.fonction, experience.debut_de_stage, experience.fin_de_stage ]
            );
        });
    }


    // check if more than one entry
    if (typeof experience == "object") {
        // create the object of experiences
        experience.forEach((experienceItem, index) => {
            const experienceItems = {
                experience: experienceItem,
                debut_de_stage: debut[index],
                fin_de_stage: fin[index],
                nom_de_ste: nom_de_ste[index],
                secteur: secteur[index],
                departement: departement[index],
                fonction: fonction[index]
            }
            
            experiences_.push(experienceItems);
        });


        // update expreinces from local storage
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.experiences = experiences_;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        // get itme from local storage
        const { id, experiences } = JSON.parse(localStorage.getItem("body"));

        // loop through experiences
        experiences.forEach( async experience => {
            // insert into experiences table
            pool.query(
                `
                    INSERT INTO experiences_et_stage (stagiaire_id, stage_ou_emploi, nom_de_ste, secteur_de_ste, departement, post, debut_de_period, fin_de_period)
                        VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [ id, experience.experience, experience.nom_de_ste, experience.secteur, experience.departement, experience.fonction, experience.debut_de_stage, experience.fin_de_stage ]
            );
        });
    };

    // add centre d'interet
    if (centreDeInteret != "") {
        // update local storage
        if (localStorage.getItem("body")) {
            localStorageBody = JSON.parse(localStorage.getItem("body"));
            localStorageBody.centre_de_interet = centreDeInteret;
        }
        localStorage.setItem("body", JSON.stringify(localStorageBody));

        // get centre d_interet from local storage
        const { id, centre_de_interet } = JSON.parse(localStorage.getItem("body"));

        pool.query(
            `
                INSERT INTO centre_de_interet (stagiaire_id, centre_de_interet) 
                    VALUES 
                (?, ?)
            `,
            [id, centre_de_interet]
        );
    }
    res.redirect("/connaissance_general");
});

//connaisance general
app.get("/connaissance_general", (req, res) => {
    res.render("connaissance_general");
});

app.post("/connaissance_general", async (req, res) => {
    let localStorageBody;
    //update local storage
    if (localStorage.getItem("body")) {
        localStorageBody = JSON.parse(localStorage.getItem("body"));
        localStorageBody.connaissance_general = req.body;
    }
    localStorage.setItem("body", JSON.stringify(localStorageBody));

    // get connaissance from local storage
    const {
        id,
        connaissance_general
    } = JSON.parse(localStorage.getItem("body"));

    // destructure all connaissancs
    const {
        juridique,
        social,
        finance_et_comptabilite,
        audit_et_controle_intern,
        fiscalite,
        managment_et_commercial,
        informatique
    } = connaissance_general;

    await pool.query(
        `
            INSERT INTO connaissance_general (stagiaire_id, juridique, social, finance_et_comptabilite, audit_et_controle_interne, fiscalite, managment_et_commercial, informatique)
                VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [id, juridique, social, finance_et_comptabilite, audit_et_controle_intern, fiscalite, managment_et_commercial, informatique]
    );

    res.redirect("/informatique");
})

// informatique route
app.get("/informatique", (req, res) => {
    res.render("informatique");
});

app.post("/informatique", async (req, res) => {
    // update local storage
    let localStorageBody;
    if (localStorage.getItem("body")) {
        localStorageBody = JSON.parse(localStorage.getItem("body"));
        localStorageBody.connaissance_informatique_ = req.body;
    }
    localStorage.setItem("body", JSON.stringify(localStorageBody));

    // get connaissance from local storage
    const {
        id,
        connaissance_informatique_
    } = JSON.parse(localStorage.getItem("body"));

    // destructure elements from connaissances informatique
    const {
        ordinateur,
        internet,
        type_de_internet,
        connaissance_informatique
    } = connaissance_informatique_;

    // insert into table connassance informatique
    await pool.query(
        `
            INSERT INTO connaissance_informatique (stagiaire_id, ordinateur_disponible, internet_disponible, type_internet, connaissance_informatique) 
                VALUES
            (?, ?, ?, ?, ?)
        `,
        [id, ordinateur, internet, type_de_internet, connaissance_informatique]
    )

    res.redirect("/formation");
});

// formation
app.get("/formation", (req, res) => {
    res.render("formation");
});

app.post("/formation", async (req, res) => {
    // update local storage
    let localStorageBody;
    if (localStorage.getItem("body")) {
        localStorageBody = JSON.parse(localStorage.getItem("body"));
        localStorageBody.formations = {
            nom_de_formation: req.body.formation,
            ville_de_formation: req.body.ville
        }
    }
    localStorage.setItem("body", JSON.stringify(localStorageBody));

    // get formations from local storage
    const {
        id,
        formations
    } = JSON.parse(localStorage.getItem("body"));

    // destructure from formations
    const {
        nom_de_formation,
        ville_de_formation
    } = formations;

    // insert into stagiaire_formations table
    await pool.query(
        `
            INSERT INTO stagiaire_formations (stagiaire_id, formation, ville)
                VALUES
            (?, ?, ?)
        `,
        [id, nom_de_formation, ville_de_formation]
    )
    res.redirect("/generate_pdf");
});


// generate the pdf file
app.get("/generate_pdf", (req, res) => {
    
    const globaleInfo = JSON.parse(localStorage.getItem("body"))
    if (!localStorage.getItem("body")) {
        res.redirect("/inscription")
    }
    res.render("inscriptionpdf", {globaleInfo})

});

app.get("/pdf", async (req, res) => {
    // generat the pdf
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5000/generate_pdf', {
        waitUntil: 'networkidle2',
    });
    const { nom, prenom } = JSON.parse(localStorage.getItem("body"));
    const nameDate = Date.now();
    
    await page.pdf({ path: `./public/inscription/${nom}_${prenom}_${nameDate}.pdf`, format: 'a4' });

    await browser.close();

    // download the pdf
    res.download(`./public/inscription/${nom}_${prenom}_${nameDate}.pdf`);
    localStorage.removeItem("body");

    // res.redirect("/generate_pdf") 
});

// deja inscrit dans la formation
app.get("/deja_inscrit", (req, res) => {
    const error = {}
    res.render("deja_inscrit", {error});
});

// create the number and send it through email
app.post("/deja_inscrit", async (req, res) => {
    // destructure from req.body
    const { form_nom, form_prenom, form_email } = req.body;

    // make a query for email
    const emailDB = await pool.query(
        `
        SELECT EXISTS(SELECT * FROM stagiaire_info WHERE nom = ? AND prenom = ? AND email = ?) AS "user_check"
        `,
        [form_nom, form_prenom, form_email],
    );

    const emailIsExist = emailDB[0][0].user_check;
    
    // check if this user is exist 
    if (!emailIsExist) {
        const error = { msg: "Cet utilisateur n'est pas enregistré" }
        res.render("deja_inscrit", { error });
    } else {
        // select the user from DB
        const userSelect = await pool.query(
            `
                SELECT id, nom, prenom, email FROM stagiaire_info
                WHERE nom = ? AND prenom = ? AND email = ?
            `,
            [ form_nom, form_prenom, form_email ]
        );

        const { id, nom, prenom, email } = userSelect[0][0];
        localStorage.setItem("userInfo", JSON.stringify({id, nom, prenom, email}));

        // 1) generate a number
        const randomNum = Math.floor(Math.random() * 1000000).toString();

        // 2) encrypt and save incrypted number in localstorage
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw error;
            bcrypt.hash(randomNum, salt, (err, hash) => {
                localStorage.setItem("hashedNumber", hash)
            });
        });

        // 3) send number through email
        const OAuth2 = google.auth.OAuth2;

        const oauth2Client = new OAuth2 (
            "719558470355-3runbqq5fd2p1utr3ogkl0qdtnfceq54.apps.googleusercontent.com",
            "g7cTPd0Yl9NkNj5FeM5DrKYY",
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: "1//04p-nqBGTXJ6nCgYIARAAGAQSNwF-L9Irfv8LlWTIc3T1vqp5Z0Kr6vOq9yfyFWmWyAcMqSKwzcGP05EK2_Si6VN-RW5q_3uop18"
       });
       const accessToken = oauth2Client.getAccessToken()

       const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "sineoussama@gmail.com", 
                clientId: "719558470355-3runbqq5fd2p1utr3ogkl0qdtnfceq54.apps.googleusercontent.com",
                clientSecret: "g7cTPd0Yl9NkNj5FeM5DrKYY",
                refreshToken: `1//04p-nqBGTXJ6nCgYIARAAGAQSNwF-L9Irfv8LlWTIc3T1vqp5Z0Kr6vOq9yfyFWmWyAcMqSKwzcGP05EK2_Si6VN-RW5q_3uop18`,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "sineoussama@gmail.com",
            to: email,
            subject: "Node.js Email with Secure OAuth",
            generateTextFromHTML: true,
            html: `<p>veuillez saisir ce code de vérification ${randomNum}</p>`
       };

       smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });

        res.redirect("/deja_inscrit/code_confirmer");
    }
});

app.get("/deja_inscrit/code_confirmer", (req, res) => {
    let error = {}
    res.render("code_confirmer", { error });
});

app.post("/deja_inscrit/code_confirmer", (req, res) => {
    const { code_de_confirmation, formation, ville } = req.body;
    const { id } = JSON.parse(localStorage.getItem("userInfo"));
    const hashedCode = localStorage.getItem("hashedNumber");

    // check for the confirmation code 
    bcrypt.compare(code_de_confirmation, hashedCode, async (err, confirm) => {
        // if err send an error message
        if (confirm) {
            await pool.query(
                `
                    INSERT INTO stagiaire_formations (stagiaire_id, formation, ville) 
                    VALUES (?, ?, ?)
                `,
                [id, formation, ville]
            );
            // delete from the local storage
            localStorage.removeItem("hashedNumber");
            localStorage.removeItem("userInfo");

            // redirect to home page
            res.redirect("/inscription")
        } else {
            let error = { msg: "votre code de confirmation ne correspond pas" }
            res.render("code_confirmer", { error });
        }
    })

});

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`app is running on port ${port}`)});


// ------------------------------ M NODE MAILER ------------------------------ //
// Client ID : 719558470355-3runbqq5fd2p1utr3ogkl0qdtnfceq54.apps.googleusercontent.com
// Client Secret : g7cTPd0Yl9NkNj5FeM5DrKYY

// refresh tocken : 1//04p-nqBGTXJ6nCgYIARAAGAQSNwF-L9Irfv8LlWTIc3T1vqp5Z0Kr6vOq9yfyFWmWyAcMqSKwzcGP05EK2_Si6VN-RW5q_3uop18
// Access Tocken : ya29.a0AfH6SMAsxXzqqIKMz4IEwWhpj7atQXU7zSm3INeswIL8ZLoRk-hq85WtW2AXfYfvT9J2Vt9Z2MQYbyrtPxhCSwQOdX_yQZSwdFisjpHCtbG3BLy36q_zf3qQ6xcKhh3-zsuo5Y6PrgZSFaSZ5uW4VGG3gjLt

