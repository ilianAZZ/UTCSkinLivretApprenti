/**
 * Check if the version of the extension is the latest by
 * comparing the version in the manifest.json and the one in the github repo
 */
const isExtensionLastVersion = () => {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;
    const url =
        "https://raw.githubusercontent.com/IlianAZZ/UTCSkinLivretApprenti/main/manifest.json";
    // sync request
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    const latestVersion = JSON.parse(xhr.responseText).version;

    return version == latestVersion;
};

/*
Checking if the extension is the latest version,
if not, display a warning message
*/
const createAlertIfNotLastVersion = () => {
    if (!isExtensionLastVersion()) {
        const div = document.createElement("div");
        div.classList.add("alert");

        div.innerHTML = `
		<div>
			<h1>ATTENTION</h1>
			<p>Votre extension n'est pas à jour, veuillez la mettre à jour en suivant les instructions :</p>

			<p>Rendez-vous sur la <a target=_blank href="https://github.com/ilianAZZ/UTCSkinLivretApprenti">page github</a>, tout en bas dans la section "Mise à jour"</p>
			
			
			<button onclick="this.parentElement.parentElement.remove()" type="button" class="btn-close" >X</button>
		</div>
		<style>
			.alert {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);

				width: 40%;
				height: 50%;

				background-color: #343a40;
				padding: 20px;  
				color: white;
				text-align: center;
				box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
			}	

			.btn-close {
				position: absolute;
				top: 10px;
				right: 10px;
				background-color: transparent;
				color: white;
				border: none;
				font-size: 1.5em;
				cursor: pointer;

			}

		</style>
	`;

        document.body.prepend(div);
    }
};

/**
 *	Apply CSS for a specific page
 */
function cssForSpecificPage(page) {
    if (page.startsWith("accueil.php")) {
        createAlertIfNotLastVersion();
    } else if (page.startsWith("sujet.php")) {
        document.querySelectorAll("body > div")[1].classList.add("div-contact");

        const span = document.createElement("span");
        span.classList.add("get-infos");
        span.innerHTML = "ⓘ";
        document.querySelectorAll("body > div")[1].appendChild(span);

        span.addEventListener("mouseenter", (e) => {
            document.querySelectorAll("body > div")[1].style.display = "block";
        });

        span.addEventListener("mouseleave", (e) => {
            document.querySelectorAll("body > div")[1].style.display = "none";
        });
    } else if (page.startsWith("eval_sequences.php")) {
        // $("body > div").eq(3).addClass("float-top-left");

        document
            .querySelectorAll("body > div")[3]
            .classList.add("float-top-left");
    }
}

/**
 * Perform a HTTP request to get the name and the company of the user (from the main page)
 * Used if the data is not in the local storage
 */
function setNameAndCompanyFromWeb(storage) {
    const request = new XMLHttpRequest();
    request.open("GET", "./accueil.php", false);
    request.send(null);
    const html = request.responseText;

    const company = html.split("<h3>")[1].split("</h3>")[0];
    chrome.storage.local.set({ companyName: company });
    storage.companyName = company;

    const name = html
        .split("<h3>")[2]
        .split("</h3>")[0]
        .split("<font>")[1]
        .split("</font>")[0];
    chrome.storage.local.set({
        name: name,
        company: storage.company,
    });

    storage.name = name;
}

const getCssFromFile = () => {
    const request = new XMLHttpRequest();
    request.open("GET", chrome.runtime.getURL("style.css"), false);
    request.send(null);
    return request.responseText;
};

const insertCssInPage = () => {
    const css = getCssFromFile();
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    document.head.appendChild(style);
};

/**
 * Perform a HTTP request to get the profile picture (from the main page)
 * Used if the data is not in the local storage
 */
function setPictureFromWeb(storage) {
    const request = new XMLHttpRequest();
    request.open("GET", "./acteurs.php", false);
    request.send(null);
    const html = request.responseText;

    const picture = html.split('src="')[1].split('"')[0];
    chrome.storage.local.set({ picture: picture });
    storage.picture = picture;
}

const removeHash = () => {
    location.hash = "";
};

const getCurrentPage = () => {
    var a = window.location.href.split("/");
    a = a[a.length - 1];

    // remove the hash
    if (a.includes("#")) {
        a = a.split("#")[0];
    }

    return a;
};

var style = document.createElement("style");
document.documentElement.appendChild(style);

var header = document.createElement("header");

// Default values
storage = {
    companyName: undefined,
    name: undefined,
    theme: "dark",
    skin_enable: true,
    picture: undefined,
};

// actions : toggle theme, set theme and reload page
if (window.location.hash == "#dark") {
    chrome.storage.local.set({ theme: "dark" });
    storage.theme = "dark";
    removeHash();
} else if (window.location.hash == "#light") {
    chrome.storage.local.set({ theme: "light" });
    storage.theme = "light";
    removeHash();
} else if (window.location.hash == "#enableTheme") {
    chrome.storage.local.set({ skin_enable: true });
    storage.skin_enable = true;
    removeHash();
} else if (window.location.hash == "#disableTheme") {
    chrome.storage.local.set({ skin_enable: false });
    storage.skin_enable = false;
    removeHash();
} else if (window.location.hash == "#toggleTheme") {
    chrome.storage.local.set({
        theme: storage.theme == "dark" ? "light" : "dark",
    });
    storage.theme = storage.theme == "dark" ? "light" : "dark";
    removeHash();
} else if (window.location.hash == "#reload") {
    chrome.storage.local.clear();
    removeHash();
}

chrome.storage.local.get((result) => {
    for (let key in result) {
        storage[key] = result[key];
    }

    if (storage.name == undefined || storage.companyName == undefined)
        setNameAndCompanyFromWeb(storage);

    if (storage.picture == undefined) setPictureFromWeb(storage);

    // defining theme colors
    if (storage.theme == "dark") {
        black_main = "#161d24";
        black_second = "#252d34";
        yellow_main = "#ffd600";
        yellow_second = "#c7a700";
        font_main = yellow_main;
        font_second = "white";
    } else {
        black_main = "#dfdfdf";
        black_second = "#e9e9e9";
        yellow_main = "#ffd600";
        yellow_second = "#c7a700";
        font_main = yellow_main;
        font_second = "black";
    }

    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
	:root {
		--black-main: ${black_main};
		--black-second: ${black_second};
		--yellow-main: ${yellow_main};
		--yellow-second: ${yellow_second};
		--font-main: ${font_main};
		--font-second: ${font_second};
	}
	`;
    document.head.appendChild(style);

    a = window.location.href.split("/");
    currentPage = a[a.length - 1];

    // Add the checkbox to enable/disable the theme on the page "parametrage.php"
    if (currentPage.startsWith("parametrage.php")) {
        document.querySelector("form").innerHTML += `
			<h4>Skin UTC</h4>
			<input onclick="self.location.href = '#${
                storage.skin_enable ? "disableTheme" : "enableTheme"
            }'; location.reload()" type=checkbox ${
            storage.skin_enable && "checked"
        } >
			<span class='marge20'>Activer le thème</span><br>
			<button class='marge20' onclick="self.location.href='#reload'"}>Reload</button>`;
    }

    if (storage.skin_enable) {
        insertCssInPage();

        // Left menu
        header.innerHTML = `
		<div class="container">
			<h1>UTC apprentissage</h1>
		</div>
		<div class="container">
			<div id=card>
				<div id=picture><img height="300px" src="${
                    storage.picture
                }" alt="photo de profil"></div>
				<div>
					<h2 id="name">${storage.name}</h2>
					<h3 id="company">${storage.companyName}</h3>
				</div>
			</div>
		</div>
		<hr>
		<nav class="container" style="margin-bottom: 8px;">  
			<h3>Pages</h3> 
			<div class="nav-container">
				<a href="accueil.php">Accueil</a> 					
				<a href="acteurs.php">Contacts</a> 					
				<a href="sujet.php">Missions</a>					
				<a href="eval_sequences.php">Carnet de bord</a> 				
				<a href="suivi_referentiel.php">Compétences</a>					
				<a href="evaluation_annuelle.php">Evaluations en entreprise</a> 	
				<a href="evaluation_utc.php">Evaluations UTC</a> 
				<a href="rapport.php">Rapports</a>					
				<a href="parametrage.php">Paramétrages</a>								
			</div>
		</nav>
		<h3>Annexe</h3> 
		<div style="margin-top:5px;">
			Envoie un mail a la <a href="mailto:3333@utc.fr">hotline</a>
		</div>
		<div class=footer style="margin-top:15px;">
			Crédit : <a target="_blank" href="https://ilianazz.com">Ilian A</a> &copy; 2020 - ${new Date().getFullYear()} 
		</div>`;

        document.body.prepend(header);

        // Set in yellow the current page in the menu
        const title = getCurrentPage();
        cssForSpecificPage(title);

        // rewrite in native JS
        const currentPage = document.querySelector(`a[href='${title}']`);
        currentPage.style.backgroundColor = yellow_second;
        document.title = "Livret Apprentissage UTC - " + currentPage.text;

        // Favicon
        const head = `
			<link rel="icon" href="https://www.utc.fr/wp-content/uploads/sites/28/2021/03/cropped-faviconutc-32x32.jpg" sizes="32x32">
			<link rel="icon" href="https://www.utc.fr/wp-content/uploads/sites/28/2021/03/cropped-faviconutc-192x192.jpg" sizes="192x192">
		`;
        document.querySelector("html head").innerHTML += head;

        // adding the theme toggle button
        const text = `<div>
			<label id='change-mode'>
				<input onclick="self.location.href = '#${
                    storage.theme == "dark" ? "light" : "dark"
                }';location.reload()" class='toggle-checkbox' type='checkbox' ${
            storage.theme == "light" && "checked"
        } ></input>
				<div class='toggle-slot'>
					<div class='sun-icon-wrapper'>
					<div class="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
					</div>
					<div class='toggle-button'></div>
					<div class='moon-icon-wrapper'>
					<div class="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
					</div>
				</div>
			</label>
			<style>
			
			</style>
		</div>`;

        document.body.innerHTML += text;
    }
});

/*
Web pages :
	Accueil 					accueil.php
	Contacts 					acteurs.php
	Missions					sujet.php
	Carnet de bord				eval_sequences.php
	Compétences					suivi_referentiel.php
	Evaluations en entreprise	evaluation_annuelle.php
	Rapports					rapport.php
	Paramétrages				parametrage.php
	Evaluations UTC				evaluation_utc.php
*/
