let cantidad; //Variable para almacenar la cantidad de gatos vistos
//Al cargar la página, se verifica si ya hay gatos vistos, de lo contrario se inicializa a 0
window.onload = function() {
	if (localStorage.getItem("miautidad") === NaN) {
		localStorage.setItem("miautidad", 0);
		let cantidad = 0;
	}else {
		cantidad = localStorage.getItem("miautidad");
	}
	document.getElementById("miautidad").textContent = cantidad;
};

// Función para obtener un gatito de la API de The Cat API(Muy buena API)
const getCatitos = async () => {
	const respuesta = await fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1");
	const data = await respuesta.json();
        console.log(data);
	const img = document.getElementById("catito");
	catitomostar(data);
}

let catito = document.getElementById("catito");
// Función para mostrar el gatito en la página donde hay una imagen que indica que ahí van los gatos
function catitomostar(data) {
        data.forEach(cat => {
		let img = document.querySelector("#catoimage");
		if (img.src === cat.url) {
			return; // Si la imagen se repite al tocar el botón (Que es super raro pero puede pasar), no hace nada
		}else if (img.src !== cat.url) {
			img.src = cat.url;
			img.alt = "Gatito"; // Un alt por las dudas
			if (catito.lastChild) {
				catito.removeChild(catito.lastChild); //Quita la imagen anterior, se supone que siempre hay una imagen o gif
			}
		
			catito.appendChild(img); 
			cuentagatos(); // LLama a la función que cuenta los gatos vistos
			mascatos(); // Llama a la función para agregar gatos a la colección

		}
	});
}

btncato = document.getElementById("btncato");
// Evento del botón que al hacer click llama a la función para que aparezca otro gato
btncato.addEventListener("click", function() {
	let img = document.querySelector("#catoimage");
	if (img.src === "img/loding.gif") {
		return;
	}else {
		img.src = "img/loding.gif"; // Muy lindo el gif de loading
	}
	getCatitos();
});

function cuentagatos(){
	cantidad++; // Incrementa la cantidad de gatos vistos
	localStorage.setItem("miautidad", cantidad); // Guarda la cantidad en el localStorage
	document.getElementById("miautidad").textContent = cantidad; // Actualiza el contador en la página
}

// Función que se llama al agregar un gato a la colección
let coleccionJson; // Variable para almacenar la colección de gatos
function mascatos() {
	if (localStorage.getItem("miaucoleccion") === null) {
		// Crea un json para almacenar la colección de gatos
		coleccionJson = [];
	}else{
		coleccionJson = JSON.parse(localStorage.getItem("miaucoleccion"));
	}
	let img = document.querySelector("#catoimage");
	coleccionJson.push({
		"id": cantidad, // Usa la cantidad de gatos vistos como ID
		"src": img.src,
		"alt": img.alt // Alt por las dudas
	});
	localStorage.setItem("miaucoleccion", JSON.stringify(coleccionJson)); // Guarda la colección en el localStorage
}

let btncoleccion = document.getElementById("btncoleccion");
// Evento del botón que al hacer click muestra la colección de gatos vistos
btncoleccion.addEventListener("click", function() {
	let coleccion = localStorage.getItem("miautidad");
	if (coleccion === null || coleccion === 0 || coleccion === NaN) {
		coleccionmodal("nocats");
	}else {
		coleccionmodal("coleccion");
	}
});

// Función que muestra un modal con la colección de gatos vistos
function coleccionmodal(content) {
        let modal = document.querySelector(".modal");
	modal.style.display = "flex";
	let modalContent = document.querySelector(".modal-content");
	let catcoleccion = document.querySelector("#coleccion");
	if (content === "nocats") {
		let noCats = document.createElement("p");
		noCats.textContent = "No has visto ningún catito aún. ¡Haz clic en el botón para ver uno!";
		modalContent.appendChild(noCats);
	}else {
		let coleccion = JSON.parse(localStorage.getItem("miaucoleccion"));
		// Recorre el array de la colección y crea un elemento img por cada gato visto
		for (let i = 0; i < coleccion.length; i++) { 
			let img = document.createElement("img");
			img.src = coleccion[i].src;
			img.alt = coleccion[i].alt;
			img.classList.add("cat-image");
			// No permite repetidos
			if (!catcoleccion.querySelector(`img[src="${img.src}"]`)) {
				catcoleccion.appendChild(img);
			}
		}
		// por cada imagen, permite hacer click para ir a el link de la imagen
		let catImages = catcoleccion.querySelectorAll("img");
		catImages.forEach(image => {
			image.addEventListener("click", function() {
				window.open(image.src, "_blank"); // Abre la imagen en una nueva pestaña
			});
		});
	}
}

let btncerrar = document.querySelector(".close");
// Evento del botón de cerrar el modal que al hacer click lo oculta
btncerrar.addEventListener("click", function() {
	let modal = document.querySelector(".modal");
	let catcoleccion = document.querySelector("#coleccion");
	catcoleccion.innerHTML = ""; // Limpia el contenido del modal
	modal.style.display = "none";
});
