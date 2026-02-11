/* RECTO */
document.querySelectorAll('.recto .zone').forEach(zone => {
    const id = zone.dataset.id;
    const img = zone.querySelector('img');
    const fileInput = zone.querySelector('input[type="file"]');

    const saved = sessionStorage.getItem("recto" + id);
    if (saved) img.src = saved;

    zone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
            sessionStorage.setItem("recto" + id, reader.result);
        };
        reader.readAsDataURL(file);
    });
});

/* VERSO BG */
const versoBg = document.querySelector(".verso-bg");
const versoFile = document.getElementById("versoFile");

const savedVersoBg = sessionStorage.getItem("versoBg");
if (savedVersoBg) versoBg.style.backgroundImage = `url(${savedVersoBg})`;

versoFile.addEventListener("change", () => {
    const file = versoFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        versoBg.style.backgroundImage = `url(${reader.result})`;
        sessionStorage.setItem("versoBg", reader.result);
    };
    reader.readAsDataURL(file);
});

/* SAUVEGARDE DES TEXTES */
["tel1", "tel2", "site", "extra", "mentions"].forEach(key => {
    const el = document.getElementById(key);
    const saved = sessionStorage.getItem("verso_" + key);
    if (saved) el.value = saved;

    el.addEventListener("input", () =>
        sessionStorage.setItem("verso_" + key, el.value)
    );
});

/* COULEURS CYCLIQUES PAR CHAMP */
const colorList = [
    "#000000", "#5b3314", "#1a3b6b", "#6b1a4a", "#8b0000",
    "#006400", "#2f4f4f", "#4b0082", "#8b4513", "#2e8b57",
    "#483d8b", "#b22222", "#556b2f", "#191970", "#800000"
];

document.querySelectorAll(".color-cycle").forEach(btn => {
    const targetId = btn.dataset.target;
    const targetEl = document.getElementById(targetId);

    const saved = sessionStorage.getItem("color_" + targetId);
    if (saved) targetEl.style.color = saved;

    btn.addEventListener("click", () => {
        let current = sessionStorage.getItem("color_" + targetId);
        let index = colorList.indexOf(current);

        index = (index + 1) % colorList.length;
        const newColor = colorList[index];

        targetEl.style.color = newColor;
        sessionStorage.setItem("color_" + targetId, newColor);
    });
});

/* Limite #extra à 3 lignes */
const extra = document.getElementById("extra");

extra.addEventListener("input", () => {
    const lines = extra.value.split("\n");

    if (lines.length > 3) {
        extra.value = lines.slice(0, 3).join("\n");
    }
});

/* === SYSTEME DE POLICES HYBRIDE (22 OFFLINE / 44 ONLINE) === */

/* 22 polices hors-ligne (web-safe) */
const offlineFonts = [
    "'Arial', sans-serif",
    "'Verdana', sans-serif",
    "'Tahoma', sans-serif",
    "'Segoe UI', sans-serif",
    "'Trebuchet MS', sans-serif",
    "'Impact', sans-serif",

    "'Times New Roman', serif",
    "'Georgia', serif",
    "'Garamond', serif",
    "'Palatino Linotype', serif",
    "'Book Antiqua', serif",
    "'Courier New', monospace",

    "'Comic Sans MS', cursive",
    "'Segoe Script', cursive",
    "'Lucida Handwriting', cursive",
    "'Brush Script MT', cursive",
    "'Gabriola', cursive",
    "'Kristen ITC', cursive",
    "'Monotype Corsiva', cursive",
    "'Candara', sans-serif",
    "'Calibri', sans-serif",
    "'Century Gothic', sans-serif"
];

/* 22 polices en ligne (Google Fonts) */
const onlineFonts = [
    "'Rakkas', cursive",
    "'Amatic SC', cursive",
    "'Kalam', cursive",
    "'Merienda', cursive",
    "'Ubuntu', sans-serif",
    "'Zilla Slab Highlight', serif",
    "'Rubik Dirt', cursive",
    "'Rubik Wet Paint', cursive",
    "'Bungee Shade', cursive",
    "'Fredericka the Great', cursive",

    "'Playfair Display', serif",
    "'Lora', serif",
    "'Merriweather', serif",

    "'Montserrat', sans-serif",
    "'Roboto', sans-serif",
    "'Poppins', sans-serif",

    "'Indie Flower', cursive",
    "'Caveat', cursive",
    "'Dancing Script', cursive",

    "'Great Vibes', cursive",
    "'Pacifico', cursive",
    "'Satisfy', cursive"
];

/* Si internet → 44 polices, sinon → 22 */
const fontList = navigator.onLine
    ? offlineFonts.concat(onlineFonts)
    : offlineFonts;

/* Index par champ */
let fontIndex = {
    extra: 0,
    tel1: 0,
    tel2: 0,
    site: 0,
    mentions: 0
};

/* Appliquer une police */
function applyFont(field) {
    const index = fontIndex[field] % fontList.length;
    document.getElementById(field).style.fontFamily = fontList[index];
}

/* Appliquer au chargement */
["extra", "tel1", "tel2", "site", "mentions"].forEach(applyFont);

/* Boutons Police */
document.querySelectorAll(".font-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const field = btn.dataset.field;
        fontIndex[field] = (fontIndex[field] + 1) % fontList.length;
        applyFont(field);
    });
});

let hasChanges = true;

window.addEventListener("beforeunload", (event) => {
    if (!hasChanges) return;
    event.preventDefault();
    event.returnValue = "";
});

/* RECTO */
document.querySelectorAll('.recto .zone').forEach(zone => {
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

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
            sessionStorage.setItem("recto" + id, reader.result);
            placeholder.style.display = "none";
        };
        reader.readAsDataURL(file);
    });
});

/* === STYLE EMAIL TOGGLE === */

function applyEmailStyle() {
    const mail = document.getElementById("site");

    mail.style.fontFamily = "'Segoe UI', sans-serif";
    mail.style.fontSize = "8pt";
    mail.style.letterSpacing = "0.5px";
    mail.style.fontWeight = "600";
    mail.style.color = "#1a3b6b";
    mail.style.textDecoration = "underline";

    // pas d'encadrement
    mail.style.border = "none";
    mail.style.padding = "0";
    mail.style.borderRadius = "0";
}

function removeEmailStyle() {
    const mail = document.getElementById("site");

    mail.style.fontFamily = "";
    mail.style.fontSize = "";
    mail.style.letterSpacing = "";
    mail.style.fontWeight = "";
    mail.style.color = "";
    mail.style.textDecoration = "";
    mail.style.border = "";
    mail.style.padding = "";
    mail.style.borderRadius = "";

    // retour à la police cyclique
    applyFont("site");
}

document.querySelector(".style-email-btn").addEventListener("click", () => {
    const isOn = sessionStorage.getItem("style_mail") === "1";

    if (isOn) {
        sessionStorage.removeItem("style_mail");
        removeEmailStyle();
    } else {
        sessionStorage.setItem("style_mail", "1");
        applyEmailStyle();
    }
});

// restauration au chargement
if (sessionStorage.getItem("style_mail") === "1") {
    applyEmailStyle();
}



