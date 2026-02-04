// Impression de la carte
document.getElementById("imprimer_carte").addEventListener("click", function () {
    window.print();
});

// Fonction unique pour créer un input ou textarea + bouton valider
function creerInputAvecValidation(selectorElement, placeholder, maxLength = null, isTextarea = false) {
    const element = document.querySelector(selectorElement);

    // Empêcher plusieurs inputs simultanés
    if (document.getElementById("input_temporaire")) return;

    // Conteneur
    const container = document.createElement("div");
    container.id = "input_temporaire";
    container.style.width = "100%";            // 👉 occupe toute la ligne
    container.style.flex = "0 0 100%";         // 👉 force le full-width dans un flex
    container.style.background = "red";        // 👉 ton rouge vif
    container.style.padding = "15px";
    container.style.marginTop = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.boxSizing = "border-box";

    // Input ou textarea
    const input = isTextarea ? document.createElement("textarea") : document.createElement("input");
    input.placeholder = placeholder;
    input.style.padding = "5px";
    input.style.width = "250px";

    if (isTextarea) {
        input.style.height = "60px";
        input.style.resize = "none";
    }

    if (maxLength) input.maxLength = maxLength;

    // Bouton Valider
    const bouton = document.createElement("button");
    bouton.textContent = "Valider";
    bouton.style.padding = "5px 10px";
    bouton.style.cursor = "pointer";

    bouton.addEventListener("click", () => {
        if (input.value.trim() !== "") {
            element.textContent = input.value;
        }
        container.remove();
    });

    // Ajouter dans la page
    container.appendChild(input);
    container.appendChild(bouton);
    document.querySelector(".boutons-action").appendChild(container);


    input.focus();
}

// Bouton : changer le titre
document.getElementById("change_titre").addEventListener("click", () => {
    creerInputAvecValidation("h3", "Nouveau titre…");
});

// Bouton : changer le nom
document.getElementById("change_nom").addEventListener("click", () => {
    creerInputAvecValidation(".nom h2", "Nouveau nom…");
});

// Bouton : changer le texte de présentation (100 caractères max)
document.getElementById("change_presentation").addEventListener("click", () => {
    creerInputAvecValidation("#texte_presentation", "Nouveau texte (100 caractères max)", 100, true);
});

document.getElementById("change_telephone").addEventListener("click", () => {
    creerInputAvecValidation(".tel", "Nouveau numéro de téléphone…");
});

document.getElementById("change_email").addEventListener("click", () => {
    creerInputAvecValidation(".email", "Nouvel email…");
});

document.getElementById("change_reseaux_sociaux").addEventListener("click", () => {
    creerInputAvecValidation(".reseaux_sociaux", "Nouveau lien / pseudo…");
});

document.getElementById("change_logo").addEventListener("click", () => {
    creerInputLogo(".logo img");
});

function creerInputLogo(selectorElement) {
    const element = document.querySelector(selectorElement);

    // Empêcher plusieurs inputs simultanés
    if (document.getElementById("input_temporaire")) return;

    // Conteneur
    const container = document.createElement("div");
    container.id = "input_temporaire";
    container.style.marginTop = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "5px";

    // Input file
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.padding = "5px";

    // Bouton Valider
    const bouton = document.createElement("button");
    bouton.textContent = "Valider";
    bouton.style.padding = "5px 10px";
    bouton.style.cursor = "pointer";

    bouton.addEventListener("click", () => {
        const fichier = input.files[0];
        if (!fichier) {
            container.remove();
            return;
        }

        const lecteur = new FileReader();
        lecteur.onload = function (e) {
            element.src = e.target.result;
        };
        lecteur.readAsDataURL(fichier);

        container.remove();
    });

    // 👉 Ajouter juste sous le bouton "Changer le logo"
    const boutonLogo = document.getElementById("change_logo");
    boutonLogo.insertAdjacentElement("afterend", container);

    container.appendChild(input);
    container.appendChild(bouton);

    // Ouvre automatiquement la fenêtre de sélection
    input.click();
}

// --- IMAGES DU HAUT ---
const imagesHaut = [
    "hautCarousel/image1.jpg",
    "hautCarousel/image2.jpg",
    "hautCarousel/image3.jpg",
    "hautCarousel/image4.jpg",
    "hautCarousel/image5.jpg",
    "hautCarousel/image6.jpg",
    "hautCarousel/image7.jpg",
    "hautCarousel/image8.jpg",
    "hautCarousel/image9.jpg",
    "hautCarousel/image10.jpg"
];

let indexHaut = 0;
const imgHaut = document.getElementById("image_carte_1");

function majImageHaut() {
    imgHaut.src = imagesHaut[indexHaut];
}

document.getElementById("prev_image").addEventListener("click", () => {
    indexHaut = (indexHaut - 1 + imagesHaut.length) % imagesHaut.length;
    majImageHaut();
});

document.getElementById("next_image").addEventListener("click", () => {
    indexHaut = (indexHaut + 1) % imagesHaut.length;
    majImageHaut();
});

// --- IMAGES DU BAS ---
const imagesBas = [
    "basCarousel/image1.jpg",
    "basCarousel/image2.jpg",
    "basCarousel/image3.jpg",
    "basCarousel/image4.jpg",
    "basCarousel/image5.jpg",
    "basCarousel/image6.jpg",
    "basCarousel/image7.jpg",
    "basCarousel/image8.jpg",
    "basCarousel/image9.jpg",
    "basCarousel/image10.jpg"
];

let indexBas = 0;
const imgBas = document.getElementById("image_carte_2");

function majImageBas() {
    imgBas.src = imagesBas[indexBas];
}

document.getElementById("prev_image_2").addEventListener("click", () => {
    indexBas = (indexBas - 1 + imagesBas.length) % imagesBas.length;
    majImageBas();
});

document.getElementById("next_image_2").addEventListener("click", () => {
    indexBas = (indexBas + 1) % imagesBas.length;
    majImageBas();
});


function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Charger image custom du haut si elle existe
const savedHaut = localStorage.getItem("customImageHaut");
if (savedHaut) {
    imagesHaut[9] = savedHaut; // remplace image10
    indexHaut = 9;
    majImageHaut();
}

// Charger image custom du bas si elle existe
const savedBas = localStorage.getItem("customImageBas");
if (savedBas) {
    imagesBas[9] = savedBas; // remplace image10
    indexBas = 9;
    majImageBas();
}


document.getElementById("uploadImageHaut").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);

    // Stocker dans le localStorage
    localStorage.setItem("customImageHaut", base64);

    // Remplacer image10 dans le tableau
    imagesHaut[9] = base64;

    // Afficher immédiatement
    indexHaut = 9;
    majImageHaut();
});

document.getElementById("uploadImageBas").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);

    // Stocker dans le localStorage
    localStorage.setItem("customImageBas", base64);

    // Remplacer image10 dans le tableau
    imagesBas[9] = base64;

    // Afficher immédiatement
    indexBas = 9;
    majImageBas();
});
/* ------------------------------
   50 POLICES CLASSÉES PAR FAMILLE
------------------------------ */

const policesDispo = [
    // --- 12 SERIF ---
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Baskerville",
    "Palatino",
    "Book Antiqua",
    "Didot",
    "Cambria",
    "Constantia",
    "Bodoni MT",
    "Lucida Bright",
    "Charter",

    // --- 12 SANS-SERIF ---
    "Arial",
    "Helvetica",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Segoe UI",
    "Calibri",
    "Futura",
    "Gill Sans",
    "Century Gothic",
    "Franklin Gothic",
    "Roboto",

    // --- 12 SCRIPT ---
    "Brush Script MT",
    "Lucida Handwriting",
    "Pacifico",
    "Dancing Script",
    "Great Vibes",
    "Satisfy",
    "Allura",
    "Parisienne",
    "Cookie",
    "Yellowtail",
    "Alex Brush",
    "Marck Script",

    // --- 14 AUTRES ---
    "Courier New",       // monospace
    "Consolas",          // monospace
    "Inconsolata",       // monospace
    "Impact",
    "Comic Sans MS",
    "Montserrat",
    "Lato",
    "Poppins",
    "Raleway",
    "Ubuntu",
    "Quicksand",
    "Merriweather",
    "Playfair Display",
    "Nunito"
];


/* ------------------------------
   FONCTION : CHANGER POLICE
------------------------------ */

function changerPolice(selectorElement) {
    const element = document.querySelector(selectorElement);

    // Empêcher plusieurs zones ouvertes
    if (document.getElementById("input_temporaire")) return;

    const container = document.createElement("div");
    container.id = "input_temporaire";

    // Bande rouge full-width
    container.style.width = "100%";
    container.style.flex = "0 0 100%";
    container.style.background = "#ff0000";
    container.style.padding = "15px";
    container.style.marginTop = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "stretch";
    container.style.gap = "10px";
    container.style.boxSizing = "border-box";

    // Select des polices
    const select = document.createElement("select");
    select.style.padding = "10px";
    select.style.fontSize = "16px";
    select.style.width = "100%";

    policesDispo.forEach(police => {
        const option = document.createElement("option");
        option.value = police;
        option.textContent = police;
        option.style.fontFamily = police;
        select.appendChild(option);
    });

    // Bouton valider
    const bouton = document.createElement("button");
    bouton.textContent = "Valider";
    bouton.style.padding = "10px";
    bouton.style.fontSize = "16px";
    bouton.style.width = "100%";

    bouton.addEventListener("click", () => {
        element.style.fontFamily = select.value;
        container.remove();
    });

    container.appendChild(select);
    container.appendChild(bouton);

    // Ajout dans la div des boutons police
    document.querySelector(".boutons-police").appendChild(container);

    // Scroll automatique vers la zone rouge
    setTimeout(() => {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
}


/* ------------------------------
   BOUTONS
------------------------------ */

document.getElementById("change_police_Nom").addEventListener("click", () => {
    changerPolice(".nom h2");
});

document.getElementById("change_police_Titre").addEventListener("click", () => {
    changerPolice("h3");
});

document.getElementById("change_police_Presentation").addEventListener("click", () => {
    changerPolice("#texte_presentation");
});

document.getElementById("change_police_Telephone").addEventListener("click", () => {
    changerPolice(".tel");
});

document.getElementById("change_police_Email").addEventListener("click", () => {
    changerPolice(".email");
});

document.getElementById("change_police_Reseaux").addEventListener("click", () => {
    changerPolice(".reseaux_sociaux");
});



