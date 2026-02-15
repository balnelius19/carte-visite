/* ============================
   UTILITAIRES GÉNÉRIQUES
============================ */

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
}

function restoreStyle(el, props) {
    props.forEach(p => el.style[p] = "");
}

/* ============================
   RECTO — UPLOAD + PERSISTENCE
============================ */

$$('.recto .zone').forEach(zone => {
    const id = zone.dataset.id;
    const img = zone.querySelector('img');
    const fileInput = zone.querySelector('input[type="file"]');
    const placeholder = zone.querySelector('.placeholder');

    const saved = sessionStorage.getItem("recto" + id);
    if (saved) {
        img.src = saved;
        placeholder.style.display = "none";
    }

    zone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        readFile(file, data => {
            img.src = data;
            placeholder.style.display = "none";
            sessionStorage.setItem("recto" + id, data);
        });
    });
});

/* ============================
   VERSO — FOND IMPRIMABLE
============================ */

const versoBgImg = $("#verso-bg-img");
const versoFile = $("#versoFile");

// Charger le fond sauvegardé
const savedVersoBg = sessionStorage.getItem("versoBg");
if (savedVersoBg) versoBgImg.src = savedVersoBg;

// Changer le fond via le bouton
versoFile.addEventListener("change", () => {
    const file = versoFile.files[0];
    if (!file) return;

    readFile(file, data => {
        versoBgImg.src = data;          // <--- vraie image
        sessionStorage.setItem("versoBg", data);
    });
});

/* ============================
   TEXTES — SAUVEGARDE
============================ */

["tel1", "tel2", "site", "extra", "mentions"].forEach(key => {
    const el = $("#" + key);
    const saved = sessionStorage.getItem("verso_" + key);
    if (saved) el.value = saved;

    el.addEventListener("input", () =>
        sessionStorage.setItem("verso_" + key, el.value)
    );
});

/* ============================
   COULEURS CYCLIQUES
============================ */

const colorList = [
    "#000000", "#5b3314", "#1a3b6b", "#6b1a4a", "#8b0000",
    "#006400", "#2f4f4f", "#4b0082", "#8b4513", "#2e8b57",
    "#483d8b", "#b22222", "#556b2f", "#191970", "#800000"
];

$$(".color-cycle").forEach(btn => {
    const targetId = btn.dataset.target;
    const targetEl = $("#" + targetId);
    if (!targetEl) return;

    let index = colorList.indexOf(sessionStorage.getItem("color_" + targetId));
    if (index < 0) index = 0;

    targetEl.style.color = colorList[index];

    btn.addEventListener("click", () => {
        index = (index + 1) % colorList.length;
        const newColor = colorList[index];
        targetEl.style.color = newColor;
        sessionStorage.setItem("color_" + targetId, newColor);
    });
});

/* ============================
   EXTRA — LIMITE 3 LIGNES
============================ */

$("#extra").addEventListener("input", e => {
    const lines = e.target.value.split("\n");
    if (lines.length > 3) {
        e.target.value = lines.slice(0, 3).join("\n");
    }
});

/* ============================
   POLICES HYBRIDES
============================ */

const offlineFonts = [
    "'Arial', sans-serif", "'Verdana', sans-serif", "'Tahoma', sans-serif",
    "'Segoe UI', sans-serif", "'Trebuchet MS', sans-serif", "'Impact', sans-serif",
    "'Times New Roman', serif", "'Georgia', serif", "'Garamond', serif",
    "'Palatino Linotype', serif", "'Book Antiqua', serif", "'Courier New', monospace",
    "'Comic Sans MS', cursive", "'Segoe Script', cursive", "'Lucida Handwriting', cursive",
    "'Brush Script MT', cursive", "'Gabriola', cursive", "'Kristen ITC', cursive",
    "'Monotype Corsiva', cursive", "'Candara', sans-serif", "'Calibri', sans-serif",
    "'Century Gothic', sans-serif"
];

const onlineFonts = [
    "'Rakkas', cursive", "'Amatic SC', cursive", "'Kalam', cursive",
    "'Merienda', cursive", "'Ubuntu', sans-serif", "'Zilla Slab Highlight', serif",
    "'Rubik Dirt', cursive", "'Rubik Wet Paint', cursive", "'Bungee Shade', cursive",
    "'Fredericka the Great', cursive", "'Playfair Display', serif", "'Lora', serif",
    "'Merriweather', serif", "'Montserrat', sans-serif", "'Roboto', sans-serif",
    "'Poppins', sans-serif", "'Indie Flower', cursive", "'Caveat', cursive",
    "'Dancing Script', cursive", "'Great Vibes', cursive", "'Pacifico', cursive",
    "'Satisfy', cursive"
];

const fontList = navigator.onLine ? [...offlineFonts, ...onlineFonts] : offlineFonts;

let fontIndex = { extra: 0, tel1: 0, tel2: 0, site: 0, mentions: 0 };

function applyFont(field) {
    $("#" + field).style.fontFamily = fontList[fontIndex[field] % fontList.length];
}

["extra", "tel1", "tel2", "site", "mentions"].forEach(applyFont);

$$(".font-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const field = btn.dataset.field;
        fontIndex[field] = (fontIndex[field] + 1) % fontList.length;
        applyFont(field);
    });
});

/* ============================
   TAILLES DE POLICE CYCLIQUES
============================ */

const fontSizes = ["10px", "12px", "14px", "16px", "18px"];

let fontSizeIndex = {
    extra: 2,
    tel1: 2,
    tel2: 2,
    site: 2,
    mentions: 2
};

function applyFontSize(field) {
    const el = $("#" + field);
    if (!el) return;
    el.style.fontSize = fontSizes[fontSizeIndex[field]];
}

["extra", "tel1", "tel2", "site", "mentions"].forEach(applyFontSize);

$$(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const field = btn.dataset.field;
        fontSizeIndex[field] = (fontSizeIndex[field] + 1) % fontSizes.length;
        applyFontSize(field);
    });
});

/* ============================
   STYLE EMAIL
============================ */

const emailProps = {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "8pt",
    letterSpacing: "0.5px",
    fontWeight: "600",
    color: "#1a3b6b",
    textDecoration: "underline",
    border: "none",
    padding: "0",
    borderRadius: "0"
};

function applyEmailStyle() {
    Object.assign($("#site").style, emailProps);
}

function removeEmailStyle() {
    const mail = $("#site");
    restoreStyle(mail, Object.keys(emailProps));
    applyFont("site");
}

$(".style-email-btn").addEventListener("click", () => {
    const isOn = sessionStorage.getItem("style_mail") === "1";
    if (isOn) {
        sessionStorage.removeItem("style_mail");
        removeEmailStyle();
    } else {
        sessionStorage.setItem("style_mail", "1");
        applyEmailStyle();
    }
});

if (sessionStorage.getItem("style_mail") === "1") applyEmailStyle();

/* ============================
   STYLE LIEN
============================ */

function applyLinkStyle() {
    Object.assign($("#site").style, emailProps);
    $("#site").value = "../CarteVisite.html";
}

function removeLinkStyle() {
    const site = $("#site");
    restoreStyle(site, Object.keys(emailProps));
    applyFont("site");
}

$(".style-link-btn").addEventListener("click", () => {
    const isOn = sessionStorage.getItem("style_link") === "1";

    if (isOn) {
        sessionStorage.removeItem("style_link");
        removeLinkStyle();
    } else {
        sessionStorage.setItem("style_link", "1");
        applyLinkStyle();
        window.location.href = "../CarteVisite.html";
    }
});

if (sessionStorage.getItem("style_link") === "1") applyLinkStyle();

/* ============================
   TOGGLE MAIL (label + champ)
============================ */

const mailRow = $(".mail-row");
const toggleMailLabelBtn = $(".toggle-mail-label-btn");
const versoInner = $(".verso-inner");

if (sessionStorage.getItem("mail_hidden") === "1") {
    mailRow.classList.add("hidden");
    versoInner.classList.add("mail-hidden");
    toggleMailLabelBtn.textContent = "Afficher Mail";
}

toggleMailLabelBtn.addEventListener("click", () => {
    const isHidden = sessionStorage.getItem("mail_hidden") === "1";

    if (isHidden) {
        mailRow.classList.remove("hidden");
        versoInner.classList.remove("mail-hidden");
        sessionStorage.removeItem("mail_hidden");
        toggleMailLabelBtn.textContent = "Cacher Mail";
    } else {
        mailRow.classList.add("hidden");
        versoInner.classList.add("mail-hidden");
        sessionStorage.setItem("mail_hidden", "1");
        toggleMailLabelBtn.textContent = "Afficher Mail";
    }
});

/* ============================
   TOGGLE TEL2 + TEL1 FULL WIDTH
============================ */

const telRow = $(".tel-row");
const toggleTel2Btn = $(".toggle-tel2-btn");

if (sessionStorage.getItem("tel2_hidden") === "1") {
    telRow.classList.add("tel2-hidden");
    toggleTel2Btn.textContent = "Afficher Tel 2";
}

toggleTel2Btn.addEventListener("click", () => {
    const isHidden = sessionStorage.getItem("tel2_hidden") === "1";

    if (isHidden) {
        telRow.classList.remove("tel2-hidden");
        sessionStorage.removeItem("tel2_hidden");
        toggleTel2Btn.textContent = "Cacher Tel 2";
    } else {
        telRow.classList.add("tel2-hidden");
        sessionStorage.setItem("tel2_hidden", "1");
        toggleTel2Btn.textContent = "Afficher Tel 2";
    }
});

/* ============================
   POLICE GLOBALE
============================ */

$(".font-btn-all").addEventListener("click", () => {
    // On récupère la police actuelle du champ EXTRA (référence)
    const currentFont = $("#extra").style.fontFamily;

    // Si EXTRA n'a pas encore de police appliquée, on prend la police cyclique actuelle
    const fallbackFont = fontList[fontIndex.extra % fontList.length];
    const fontToApply = currentFont || fallbackFont;

    // On applique à tous les champs
    ["extra", "tel1", "tel2", "site", "mentions"].forEach(field => {
        $("#" + field).style.fontFamily = fontToApply;
    });
});

/* ============================
   FOOTER — MODES TEXTE / IMAGE / MIXTES
============================ */

const footer = $(".mentions-bottom");

// Liste des classes possibles
const footerModes = [
    "footer-mode-texte",
    "footer-mode-image",
    "footer-mode-mixte-gauche",
    "footer-mode-mixte-droite"
];

// Fonction pour appliquer un mode
function setFooterMode(mode) {
    // Retirer les anciens modes
    footerModes.forEach(m => footer.classList.remove(m));

    // Appliquer le nouveau
    footer.classList.add(mode);

    // Sauvegarde
    sessionStorage.setItem("footer_mode", mode);
}

// Restaurer le mode au chargement
const savedFooterMode = sessionStorage.getItem("footer_mode");
if (savedFooterMode && footerModes.includes(savedFooterMode)) {
    footer.classList.add(savedFooterMode);
} else {
    // Mode par défaut : texte
    setFooterMode("footer-mode-texte");
}

// Brancher les boutons
$$(".size-btn").forEach(btn => {
    const field = btn.dataset.field;

    if (field === "modeTexte") {
        btn.addEventListener("click", () => setFooterMode("footer-mode-texte"));
    }
    if (field === "modeImage") {
        btn.addEventListener("click", () => setFooterMode("footer-mode-image"));
    }
    if (field === "modeImageGTexteD") {
        btn.addEventListener("click", () => setFooterMode("footer-mode-mixte-gauche"));
    }
    if (field === "modeImageDTexteG") {
        btn.addEventListener("click", () => setFooterMode("footer-mode-mixte-droite"));
    }
});

/* ============================
   FOOTER — UPLOAD IMAGE MENTIONS
============================ */

const mentionsImg = $("#mentions-img");
const mentionsFile = $("#mentions-file");

// Restaurer l'image si elle existe
const savedMentionsImg = sessionStorage.getItem("mentions_img");
if (savedMentionsImg) {
    mentionsImg.src = savedMentionsImg;
}

// Clic sur l'image → ouvrir le sélecteur
mentionsImg.addEventListener("click", () => {
    mentionsFile.click();
});

// Upload d'une nouvelle image
mentionsFile.addEventListener("change", () => {
    const file = mentionsFile.files[0];
    if (!file) return;

    readFile(file, data => {
        mentionsImg.src = data;
        sessionStorage.setItem("mentions_img", data);
    });
});

$("#printPDF").addEventListener("click", () => {
    window.print();
});
//tentative de masquer heure et date a l'impression
  window.onbeforeprint = function() {
    // Code exécuté JUSTE AVANT l'impression
    // Exemple: trouver un élément et vider son contenu
    var dateElement = document.querySelector('.date-impression');
    if (dateElement) {
        // Stocke le contenu original pour le remettre après
        dateElement.setAttribute('data-original-text', dateElement.innerText);
        dateElement.innerText = ''; // Vide le texte
    }
  };

  window.onafterprint = function() {
    // Code exécuté JUSTE APRÈS l'impression (ou l'annulation)
    var dateElement = document.querySelector('.date-impression');
    if (dateElement) {
        // Restaure le texte original
        dateElement.innerText = dateElement.getAttribute('data-original-text');
    }
  };