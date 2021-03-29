// show sign up form from the signup page
const showSignUpForm = () => {
    const alreaySignUpBtn = document.querySelector(".already-sign-up");
    const newSignUpBtn = document.querySelector(".sign-me-up");
    const alreadySignUpForm = document.getElementById("old-user");
    const newSignUpForm = document.getElementById("new-user");
    if (alreaySignUpBtn) {
        alreaySignUpBtn.addEventListener("click", () => {
            newSignUpForm.style.opacity = "0";
            setTimeout(() => {
                newSignUpForm.style.display = "none";
            }, 400);
            setTimeout(() => {
                alreadySignUpForm.style.display = "block";
            }, 500);
    
            alreadySignUpForm.style.opacity = "1";
        });
    }
    
    if (newSignUpBtn) {
        newSignUpBtn.addEventListener("click", () => {
            alreadySignUpForm.style.opacity = "0";
            setTimeout(() => {
                alreadySignUpForm.style.display = "none"
            }, 400);
            setTimeout(() => {
                newSignUpForm.style.display = "block";
            }, 500);
            newSignUpForm.style.opacity = "1";
        });
    }
}

const checkExperience = (id) => {
    const stage = document.getElementById(`stage-${id}`);
    const emploi = document.getElementById(`emploi-${id}`);
    const condidatCheckMarck = document.getElementById("condidat-spontaner");
    const ipnuts = document.querySelectorAll(".input-exp")
    const disabled = document.querySelector(".disable-btn");

    if (stage && emploi && condidatCheckMarck) {
        stage.addEventListener("click", (e) => {
            if(e.target.checked) {
                emploi.checked = false;
                condidatCheckMarck.checked = false;
                // enable all the inputs
                ipnuts.forEach(input => {
                    input.removeAttribute("readonly");
                });
                disabled.style.display = "none";
            }
        });

        emploi.addEventListener("click", (e) => {
            if(e.target.checked) {
                stage.checked = false;
                condidatCheckMarck.checked = false;
                // enable all the inputs
                ipnuts.forEach(input => {
                    input.removeAttribute("readonly");
                });
                disabled.style.display = "none";
            }
        });

        condidatCheckMarck.addEventListener("click", (e) => {
            if(e.target.checked) {
                stage.checked = false;
                emploi.checked = false;
                // disable all the inputs
                ipnuts.forEach(input => {
                    input.setAttribute("readonly", true);
                });
                disabled.style.display = "block";
            }
        })        
    }
}

const getExperiencesId = () => {
    const stage = document.getElementById(`stage-1`);
    const emploi = document.getElementById(`emploi-1`);
    
    if (stage && emploi) {
        let idStage = stage.getAttribute("id").split("-");
        idStage = parseInt(idStage[1]);
        checkExperience(idStage)
    }
}

const addSectionForm = () => {
    // select buttons
    const addDiplomaBtn = document.getElementById("add-diploma");
    const addExperienceBtn = document.getElementById("add-experience");

    const diplomaSection = document.getElementById("diploma");
    const experienceSection = document.getElementById("experience")

    let diplomaNumber = 1;

    const addDiplomaForm = (e) => {
        e.preventDefault();
        
        diplomaNumber++;
        let diplomaForm = document.createElement("div");
        diplomaForm.id = "diploma-container";
        diplomaForm.className = "diploma-container";
        diplomaForm.innerHTML = `
            <div class="row-input-2">
                <div class="input-group">
                    <label class="label-checkbox" for="diplom">diplom:</label>
                </div>
                <div class="input-group">
                    <input type="text" placeholder="diplom" name="diplom" class="input-form">
                </div>
            </div>
            <div class="row-input-2">
                <div class="input-group">
                    <label class="label-checkbox">etablissment ou institution:</label>
                </div>
                <div class="input-group">
                    <input type="text" placeholder="etablissement" name="institution" class="input-form">
                </div>
            </div>
            <div class="row-input-2">
                <div class="input-group">
                    <label class="label-checkbox" for="year-of-obtaining">année d'obtention:</label>
                </div>
                <div class="input-group">
                    <input type="text" placeholder="année" name="date_de_obtention" class="input-form">
                </div>
            </div>
        `;

        diplomaSection.appendChild(diplomaForm)
    }

    if (addDiplomaBtn) {
        addDiplomaBtn.addEventListener("click", addDiplomaForm);
    }
}

const checkGender = () => {
    const male = document.querySelector(".male");
    const female = document.querySelector(".female");

    if (male && female) {
        male.addEventListener("click", (e) => {
            if (e.target.checked) {
                female.checked = false
            }
        });
    
        female.addEventListener("click", (e) => {
            if (e.target.checked) {
                male.checked = false
            }
        });
    }
}

const uploadPhotoAndCV = () => {
    // bring inputs
    const uploadInputPhoto = document.getElementById("input-upload-photo");
    const uploadInputCV = document.getElementById("input-upload-cv");
    // bring btns
    const uploadPhotoBtn = document.getElementById("upload-photo");
    const uploadCVBtn = document.getElementById("upload-cv");

    if (uploadPhotoBtn && uploadCVBtn) {
        // add the click events to btns
        uploadPhotoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (e.target.classList.contains("upload_photo")) {
                console.log(e.target)
                uploadInputPhoto.click();
            }
        })

        uploadCVBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (e.target.classList.contains("upload_cv")) {
                console.log(e.target)
                uploadInputCV.click();
            }
        })
    }
}

const situationActuelle = () => {
    const etudiant = document.getElementById("etudiant");
    const stagiaire = document.getElementById("stagiaire");
    const salarier = document.getElementById("salarier");
    const cdi = document.getElementById("cdi");
    const cdd = document.getElementById("cdd");
    const recherchDemplois = document.getElementById("recherchDemplois");
    const autre = document.getElementById("autre");
    const stageInputs = document.querySelectorAll(".stage")
    const emplois = document.querySelectorAll(".emplois");
    const etudiantInputs = document.querySelectorAll(".etudiant");
    const autreTextArea = document.querySelector(".autreTextArea");
    
    
    if (etudiant && stagiaire && salarier && cdi && cdd && recherchDemplois && autre) {
        etudiant.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                salarier.checked = false;
                stagiaire.checked = false;
                cdi.checked = false;
                cdd.checked = false;
                recherchDemplois.checked = false;
                autre.checked = false;
                emplois.forEach(emploi => {
                    emploi.setAttribute("readonly", true);
                });
                stageInputs.forEach(stageInput => {
                    stageInput.setAttribute("readonly", true);
                });
                etudiantInputs.forEach(etudiantInput => {
                    etudiantInput.removeAttribute("readonly");
                });
                autreTextArea.setAttribute("readonly", true);
            }
        });

        stagiaire.addEventListener("click", (e) => {
            if (e.target.checked) {
                etudiant.checked = false;
                salarier.checked = false;
                cdi.checked = false;
                cdd.checked = false;
                recherchDemplois.checked = false;
                autre.checked = false;
                emplois.forEach(emploi => {
                    emploi.setAttribute("readonly", true);
                    emploi.value = "";
                });
                etudiantInputs.forEach(etudiantInput => {
                    etudiantInput.setAttribute("readonly", true);
                    etudiantInput.value = "";
                });
                stageInputs.forEach(stageInput => {
                    stageInput.removeAttribute("readonly");
                });
                autreTextArea.setAttribute("readonly", true);
            }
        });

        salarier.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                etudiant.checked = false;
                stagiaire.checked = false;
                recherchDemplois.checked = false;
                autre.checked = false;
                emplois.forEach(emploi => {
                    emploi.removeAttribute("readonly");
                });
                etudiantInputs.forEach(etudiantInput => {
                    etudiantInput.setAttribute("readonly", true);
                    etudiantInput.value = "";
                });
                stageInputs.forEach(stageInput => {
                    stageInput.setAttribute("readonly", true);
                    stageInput.value = "";
                });
                autreTextArea.setAttribute("readonly", true);
                autreTextArea.value = "";
            }
        });

        cdi.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                etudiant.checked = false;
                stagiaire.checked = false;
                cdd.checked = false;
                recherchDemplois.checked = false;
                autre.checked = false;
            }
        });

        cdd.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                etudiant.checked = false;
                stagiaire.checked = false;
                cdi.checked = false;
                recherchDemplois.checked = false;
                autre.checked = false
            }
        });

        recherchDemplois.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                etudiant.checked = false;
                stagiaire.checked = false;
                salarier.checked = false;
                cdi.checked = false;
                cdd.checked = false;
                autre.checked = false;
                etudiantInputs.forEach(etudiantInput => {
                    etudiantInput.setAttribute("readonly", true);
                    etudiantInput.value = "";
                });
                stageInputs.forEach(stageInput => {
                    stageInput.setAttribute("readonly", true);
                    stageInput.value = "";
                });
                emplois.forEach(emploi => {
                    emploi.setAttribute("readonly", true);
                    emploi.value = "";
                });
                autreTextArea.setAttribute("readonly", true);
                autreTextArea.value = "";
            }
        });

        autre.addEventListener("click", (e) => {
            // e.preventDefault();
            if (e.target.checked) {
                etudiant.checked = false;
                stagiaire.checked = false;
                salarier.checked = false;
                cdi.checked = false;
                cdd.checked = false;
                recherchDemplois.checked = false;
                emplois.forEach(emploi => {
                    emploi.setAttribute("readonly", true);
                    emploi.value = "";
                });
                etudiantInputs.forEach(etudiantInput => {
                    etudiantInput.setAttribute("readonly", true);
                    etudiantInput.value = "";
                });
                stageInputs.forEach(stageInput => {
                    stageInput.setAttribute("readonly", true);
                    stageInputs.value = "";
                });
                autreTextArea.removeAttribute("readonly");
            }
        });
    }
}

const experiences = () => {
    // select the add button
    const addBtn = document.getElementById("add-experience")
    // select the id
    const stage = document.getElementById("stage-1");
    if (addBtn, stage) {
        let id = stage.getAttribute("id").split("-");
        id = +id[1]
        // add a new expereience section that take an id param
        const addSection = (id) => {
            const experienceParrent = document.getElementById("experience");
            const experienceContainer = document.createElement("div")
            experienceContainer.className = "experience-container";
            experienceContainer.id = "experience-container";
            experienceContainer.innerHTML = `
                <div class="input-check">
                    <div class="input-group-checkbox">
                        <label class="label-checkbox">stage</label>
                        <input type="checkbox" id="stage-${id}" name="experience" value="stage" class="chechbox-input stage">
                    </div>
                    <div class="input-group-checkbox">
                        <label class="label-checkbox" for="emploi">emplois</label>
                        <input type="checkbox" id="emploi-${id}" name="experience" value="emploi" class="chechbox-input stage">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox">debut de period:</label>
                    </div>
                    <div class="input-group">
                        <input type="date" placeholder="debut" name="debut" class="input-form input-exp">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox">fin de period:</label>
                    </div>
                    <div class="input-group">
                        <input type="date" placeholder="fin" name="fin" class="input-form input-exp">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox">nom de ste ou entreprise:</label>
                    </div>
                    <div class="input-group">
                        <input type="text" placeholder="Ste ou Entreprise" name="nom_de_ste" class="input-form">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox">secteur:</label>
                    </div>
                    <div class="input-group">
                        <input type="text" placeholder="secteur" name="secteur" class="input-form">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox">departement:</label>
                    </div>
                    <div class="input-group">
                        <input type="text" placeholder="departement" name="departement" class="input-form">
                    </div>
                </div>
                <div class="row-input-2">
                    <div class="input-group">
                        <label class="label-checkbox" for="fonction">post ou fonction:</label>
                    </div>
                    <div class="input-group">
                        <input type="text" placeholder="fonction" name="fonction" class="input-form">
                    </div>
                </div>
            `
            experienceParrent.appendChild(experienceContainer)
            console.log(experienceContainer);
        }

        const checkExpereinceBox = (id) => {
            const stage = document.getElementById(`stage-${id}`);
            const emploi = document.getElementById(`emploi-${id}`);
            if (stage && emploi) {
                stage.addEventListener("click", (e) => {
                    if (e.target.checked) {
                        emploi.checked = false
                    }
                });
                emploi.addEventListener("click", (e) => {
                    if (e.target.checked) {
                        stage.checked = false
                    }
                });
            }
        }

        // add event listner the button
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            id = id +1
            addSection(id);
            checkExpereinceBox(id)
        });

        checkExpereinceBox(id)
    }
}

const checkComputer = () => {
    const yes = document.getElementById("pc-yes");
    const no = document.getElementById("pc-no");
    const internetYes = document.getElementById("internet-yes");
    const internetNo = document.getElementById("internet-no");
    const adsel = document.getElementById("adsel");
    const fourG = document.getElementById("4g");

    if (yes && no && internetYes && internetNo && adsel && fourG) {
        yes.addEventListener("click", (e) => {
            if (e.target.checked) {
                no.checked = false
            }
        });
        no.addEventListener("click", (e) => {
            if (e.target.checked) {
                yes.checked = false
            }
        });
        internetYes.addEventListener("click", (e) => {
            if (e.target.checked) {
                internetNo.checked = false
            }
        });
        internetNo.addEventListener("click", (e) => {
            if (e.target.checked) {
                internetYes.checked = false
            }
        });
        adsel.addEventListener("click", (e) => {
            if (e.target.checked) {
                fourG.checked = false
            }
        });
        fourG.addEventListener("click", (e) => {
            if (e.target.checked) {
                adsel.checked = false
            }
        });
    }
}

const showWarning = () => {
    const showAlert = document.querySelector(".already-warning");
    const close = document.querySelector(".close-warning");
    if (showAlert) {
        setTimeout(() => {
            showAlert.style.opacity = "0";
        }, 6000);
        setTimeout(() => {
            showAlert.style.display = "none";
        }, 7000);

        close.addEventListener("click", () => {
            showAlert.style.opacity = "0";
            setTimeout(() => {
                showAlert.style.display = "none";
            }, 1000);
        })
    }
}

checkGender();
showSignUpForm();
addSectionForm();
uploadPhotoAndCV();
situationActuelle();
getExperiencesId();
experiences();
checkComputer();
showWarning();