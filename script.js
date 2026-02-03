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
    container.style.marginTop = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "5px";

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
    document.body.appendChild(container);

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

