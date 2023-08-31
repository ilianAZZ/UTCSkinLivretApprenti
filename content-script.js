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
} else if (window.location.hash == "#light") {
    chrome.storage.local.set({ theme: "light" });
    storage.theme = "light";
} else if (window.location.hash == "#enableTheme") {
    chrome.storage.local.set({ skin_enable: true });
    storage.skin_enable = true;
    self.location.href = "#";
} else if (window.location.hash == "#disableTheme") {
    chrome.storage.local.set({ skin_enable: false });
    storage.skin_enable = false;
    self.location.href = "#";
} else if (window.location.hash == "#reload") {
    chrome.storage.local.clear();
    self.location.href = "#";
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

    a = window.location.href.split("/");
    currentPage = a[a.length - 1];

    if (currentPage.startsWith("parametrage.php")) {
        $(document).ready(() => {
            document.querySelector("form").innerHTML += `
			<h4>Skin UTFlat21</h4>
			<input onclick="self.location.href = '#${
                storage.skin_enable ? "disableTheme" : "enableTheme"
            }'; location.reload()" type=checkbox ${
                storage.skin_enable && "checked"
            } >
			<span class='marge20'>Activer le thème</span><br>
			<button class='marge20' onclick="self.location.href='#reload'"}>Reload</button>`;
        });
    }

    if (storage.skin_enable) {
        header.innerHTML = `
		<div class="container">
			<h1>UTC apprentissage</h1>
		</div>
		<div class="container">
			<div id=card>
				<div id=picture></div>
				<div>
					<h2 id="name"></h2>
					<h3 id="company"></h3>
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

        style.innerHTML = `
		html, body {
			margin:0 !important;
			padding:0 !important;
			background-color:${black_second} !important;
			background-image:none!important;
			color:${font_second}!important;
		}

		h1, h2, h3 {
			color:${font_main}!important;
			width:unset!important;
			left:unset!important; 
			margin-left:unset!important;
			position:unset!important;

		}

		input[type=submit], button {
			background-color:${yellow_main};
			color:black;
			border:2px solid ${black_main};
			border-radius:5px;
			padding:3px 7px;
		}

		input[type="checkbox"]:checked:before {
			border-color: ${yellow_main};
			background-color:${yellow_main};
		}

		input[type=submit]:hover, button:hover {
			background-color:${yellow_second};
		}

		body {display:flex;}
		iframe:first-of-type {display:none !important; }

		#accueil {
			margin-left:0!important;
			margin-top:25px!important;
			position: unset!important;
			border-left: none!important;
			padding:50px;
		}
		a {
			color:${yellow_main};
		}
		a:hover {
			color:${yellow_second};
		}
		`;

        style.innerHTML += `
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;700;900&display=swap');

		html, body {
			font-family: 'Poppins', sans-serif;
			width:100%;
			/* height: 100%; */
			margin: 0;
			padding: 0;
			position: absolute;
			top: 0;
		}
		header {
			width: 18%;
			background-color: ${black_second};
			border-right:2px solid ${black_main};
			padding: 0 15px;
		}
		header * {
			width: 100%;
		}
		header img {
			width: auto;
			height:90px;
		}
		header h2 {
			text-decoration: none!important;
		}
		hr {
			border-style: none;
			border-width: none;
			margin-block-start: none;
			margin-block-end: none;
			height:2px;
			background-color:${yellow_main};

		}
		#card  {
			display: flex;
		}
		#card > div {
			text-align: center;
		}
		nav .nav-container {
			margin-left: 5px;
		}
		nav .nav-container a {
			display: block;
			text-decoration: none;
			color:${font_second};
			font-weight: 500;
			padding: 5px;
			border-radius: 5px;
		}
		nav .nav-container a:hover {
			background-color: ${yellow_main};!important
		}

		form {
			margin-left:0!important;
			margin-top:25px!important;
			position: unset!important;
			border-left: none!important;
		}

		textarea {
			min-height:150px;
			resize:vertical;
			background-color:transparent;
			padding:5px!important;
			color:${font_second}!important;
			margin-bottom:15px!important;
		}
		label {
			color:${font_second}!important;
		}
		

		a:hover img {
			border-color:${yellow_main}!important;
		}

		`;

        // page contacts
        style.innerHTML += `
		form .contact_rouge, form .contact_bleu , form .contact_jaune , form .contact_vert , form .contact_gris { 
			background: none;
			background-color: rgba(0, 0, 0, 0.2)!important;
			border: 1px solid ${black_main}!important;
			box-shadow: none!important;
			color:${font_second}!important;
		}
		form .contact_rouge {
			border-color: red!important;
		}
		form .contact_bleu {
			border-color: blue!important;
		}
		form .contact_jaune {
			border-color: yellow!important;
		}
		form .contact_vert {
			border-color: green!important;
		}
		form .contact_gris {
			border-color: grey!important;
		}

		`;

        // page carnet de bord

        style.innerHTML += `
		table.calendrier {
			margin: 10px 0;
		}
		table.calendrier.left td[class=""] {
			color:"black";
			background-color:#DDD;
		}
		table.calendrier tr:not([class]){
			color:${font_second}
		}

		table.calendrier tr th {
			border:unset!important;
			margin-bottom:unset!important;
			background-image:unset!important;
		}

		.calendrier tbody .entr label, .calendrier tbody .utc label, .calendrier tbody .abs label,.calendrier tbody  .etg label, .calendrier tbody  .today label, .calendrier tbody .dim label  {
			/* color:black!important; */
		}
		.calendrier tbody, .calendrier tbody label, .calendrier tbody span {
			color:black!important;
		}


		div.pop_visible {
			background-color: ${black_main}!important;
			color:${font_second}!important;
			border:2px solid ${font_main}!important;
		}
		a.fermer:hover {

		}
		a.fermer:hover {
			
		}
		`;

        // Page "mission"
        style.innerHTML += `
		ul.sidemenu {
			position:absolute !important;
			margin:!important;
			float:none!important;
			list-style-type: none!important;
			transform:none!important;
			-webkit-transform:none!important;
			margin-left: calc(18% + 70px) !important;
			margin-top: unset!important;
		}
		.div-contact {
			position: absolute!important;
			top:5px;
			left:calc(18% + 40px) !important;
			width:300px!important;
			background-color: ${black_main}!important;
			display:none;
			z-index:100;
			padding:10px;
		}


		.float-top-left {
			position: absolute!important;
			top:5px;
			left:calc(18% + 40px) !important;
			padding:10px;
		}

		.get-infos {
			position:absolute;
			top:5px;
			left:calc(18% + 40px);
			background-color:red;
			color:white;
			border-radius:100%;
			width:12px;
			height:12px;
			padding:3px;
			cursor:pointer;
		}

		div.groupe span.legende {
			color:${font_second}!important;
		}

		.no-underline,
		.fermer,
		.fermer:-webkit-any-link {
			font-size:3em;
			text-decoration:none!important;
			color:${yellow_main};
		}  
		.no-underline .fermer:hover {
			color:${yellow_second}!important;
		}    
		`;

        // evaluation utc
        style.innerHTML += `
		table {
			background-color:transparent!important;
		}
		`;
        const head = `
		<link rel="icon" href="https://www.utc.fr/wp-content/uploads/sites/28/2021/03/cropped-faviconutc-32x32.jpg" sizes="32x32">
		<link rel="icon" href="https://www.utc.fr/wp-content/uploads/sites/28/2021/03/cropped-faviconutc-192x192.jpg" sizes="192x192">
		`;

        // Menus qui se déplient (évaluations, rapports)
        style.innerHTML += `
			div.titre_evaluation {
				color: white!important;
				border: none!important;
				background-color: #121212!important;
				font-weight: bold!important;
			}

			/* Image flèche pour déployer */
			div.titre_evaluation > a > img {
				mix-blend-mode: difference!important;
				border: none!important;
				margin: 4px!important;
				background-color: ${yellow_main}!important;
				border-radius: 100%!important;
			}
				
		`;

        // Inputs
        style.innerHTML += `
			input, textarea, select {
				background-color: ${black_main}!important;
				color: ${font_second}!important;
				border: 1px solid ${black_main}!important;
				border-radius: 5px!important;
				padding: 5px!important;
			}

			input:focus, textarea:focus, select:focus {
				border: 1px solid ${yellow_main}!important;
			}

			input[type="submit"], input[type="button"], button {
				background-color: ${yellow_main}!important;
				color: black!important;
				border: 2px solid ${black_main}!important;
				border-radius: 5px!important;
				padding: 3px 7px!important;
				cursor: pointer!important;
			}

			input[type="submit"]:hover, input[type="button"]:hover, button:hover {
				background-color: ${yellow_second}!important;
			}


		`;

        $(document).ready(() => {
            document.body.prepend(header);
            $("html head").append(head);

            $("h2#name").text(storage.name);
            $("h3#company").text(storage.companyName);
            $("header #picture").append(
                `<img height="300px" src="${storage.picture}" alt="photo de profil">`
            );

            a = window.location.href.split("/");
            cssForSpecificPage(a[a.length - 1]);

            $("a[href='" + a[a.length - 1] + "']").css({
                "background-color": yellow_second,
            });
            $("title").text(
                "Livret Apprentissage UTC - " +
                    $("a[href='" + a[a.length - 1] + "']").text()
            );

            $("body").append(`<div>
				<script>
					function toggle_mode() {
						self.location.href = '#' + "${storage.theme == "dark" ? "light" : "dark"}";
						location.reload();
					}
					</script>
				<script src="https://code.iconify.design/1/1.0.4/iconify.min.js"></script>
				
				<label id='change-mode'>
					<input onclick='toggle_mode();' class='toggle-checkbox' type='checkbox' ${
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
				#change-mode {
					position:fixed;
					bottom:10px;
					right:30px;
				}

				.toggle-checkbox {
					position: absolute;
					opacity: 0;
					cursor: pointer;
					height: 0;
					width: 0;
				}
				
				.toggle-slot {
					position: relative;
					height: 25px;
					width: 50px;
					border: 5px solid ${font_main};
					border-radius: 10em;
					background-color: white;
					/*box-shadow: 0px 10px 25px #e4e7ec;*/
					transition: background-color 250ms;
				}
				
				.toggle-checkbox:checked ~ .toggle-slot {
					background-color: #374151;
				}
				
				.toggle-button {
					transform: translate(25px, 0);
					position: absolute;
					height: 25px;
					width: 25px;
					border-radius: 50%;
					background-color: #ffeccf;
					box-shadow: inset 0px 0px 0px 0.25em #ffbb52;
					transition: background-color 250ms, border-color 250ms, transform 500ms cubic-bezier(.26,2,.46,.71);
				}
				
				.toggle-checkbox:checked ~ .toggle-slot .toggle-button {
					background-color: #485367;
					box-shadow: inset 0px 0px 0px 0.25em white;
					transform: translate(0, 0);
				}
				
				.sun-icon {
					position: absolute;
					height: 20px;
					width: 20px;
					color: #ffbb52;
				}
				
				.sun-icon-wrapper {
					position: absolute;
					/*height: 6em;
					width: 6em;*/
					opacity: 1;
					transform: translate(5px, 0px) rotate(15deg);
					/*transform-origin: 50% 50%;
					transition: opacity 150ms, transform 500ms cubic-bezier(.26,2,.46,.71);
					*/
				}
				
				.toggle-checkbox:checked ~ .toggle-slot .sun-icon-wrapper {
					opacity: 0;
					transform: translate(3em, 2em) rotate(0deg);
				}
				
				.moon-icon {
					/* position: absolute; */
					height: 20px;
					width: 20px;
					color: white;
				}
				
				.moon-icon-wrapper {
					/* position: absolute;
					height: 6em;
					width: 6em;
					opacity: 0; */
					transform: translate(28px, 2px) rotate(0deg);
					/* transform-origin: 50% 50%;transition: opacity 150ms, transform 500ms cubic-bezier(.26,2.5,.46,.71);*/
				}

				.toggle-checkbox:checked ~ .toggle-slot .moon-icon-wrapper {opacity: 1;}

				</style>
			</div>`);
        });
    }
});

/**
 *	Apply CSS for a specific page
 */
function cssForSpecificPage(page) {
    if (page.startsWith("sujet.php")) {
        $("body > div").eq(1).addClass("div-contact");
        $("<span class=get-infos>ⓘ</span>").insertAfter($("body > div").eq(1));
        $(".get-infos").mouseenter((e) => {
            $(".div-contact").show();
        });
        $(".get-infos").mouseleave((e) => {
            $(".div-contact").hide();
        });
    } else if (page.startsWith("eval_sequences.php")) {
        $("body > div").eq(3).addClass("float-top-left");
    }
}

/**
 * Perform a HTTP request to get the name and the company of the user (from the main page)
 * Used if the data is not in the local storage
 */
function setNameAndCompanyFromWeb(storage) {
    jQuery.ajax({
        url: "./accueil.php",
        success: (res) => {
            const company = $(res).find("h3").eq(0).text();
            chrome.storage.local.set({ companyName: company });
            storage.companyName = company;

            const name = $(res).find("h3").eq(1).find("font").text();
            chrome.storage.local.set({
                name: name,
                company: storage.company,
            });
            storage.name = name;
        },
        async: false,
    });
}

/**
 * Perform a HTTP request to get the profile picture (from the main page)
 * Used if the data is not in the local storage
 */
function setPictureFromWeb(storage) {
    jQuery.ajax({
        url: "./acteurs.php",
        success: (res) => {
            const picture = $(res).find(".contact_vert img").attr("src");
            chrome.storage.local.set({ picture: picture });
            storage.picture = picture;
        },
        async: false,
    });
}

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
