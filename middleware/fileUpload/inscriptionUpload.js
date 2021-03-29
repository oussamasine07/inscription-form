const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { check } = require("express-validator");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir(`./public/uploads/users/files/${req.body.nom}_${req.body.prenom}`, () => {
            cb(null, path.resolve() + `\\public\\uploads\\users\\files\\${req.body.nom}_${req.body.prenom}`);
        });
    },
    filename: (req, file, cb) => {
        cb(null, req.body.nom + "_" + req.body.prenom + "-" + Date.now() + path.extname(file.originalname));
    }
});

const filter = (req, file, cb) => {
    
    // photo extention
    if (file.fieldname == "stagiaire_photo") {
        
        const photoTypes = /jpg|png|jpeg/;
        const photoTest = photoTypes.test(path.extname(file.originalname));
        req.validations = [];

        if (photoTest) {
            cb(null, true);
        } else {
            req.validations.push({ 
                msg: "s'il vous plaît, seuls les fichiers avec les extensions .jpg, jpeg ou .png sont acceptés",
                param: "stagiaire_photo"
            });
            cb(null, false);
        }
    }
    
    // // cv extention
    if (file.fieldname == "stagiaire_cv") {
        const cvTypes = /pdf|doc|docx/;
        const cvTest = cvTypes.test(path.extname(file.originalname));
        
        if (cvTest) {
            cb(null, true);
        } else {
            req.validations.push({ 
                msg: "s'il vous plaît, seuls les fichiers avec les extensions .jpg, jpeg ou .png sont acceptés",
                param: "stagiaire_cv"
            });
            cb(null, false);
        }
    }

    
    
}

const upload = multer({
    storage,
    fileFilter: filter
}).fields([
    { name: "stagiaire_photo" },
    { name: "stagiaire_cv"}
]);

const validator = [
    check("nom").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("prenom").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("email").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("email").isEmail().withMessage("veuillez ajouter un email valide"),
    check("tele_portable").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("adress_personnelle").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("date_de_naissance").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("lieu_de_naissance").not().isEmpty().withMessage("veuillez remplir ce champ, est obligatoire!"),
    check("sex").not().isEmpty().withMessage("veuillez choisir votre sexe masculin ou féminin")
]
    

module.exports = {
    upload, 
    validator
};