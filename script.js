// =====================================================
// Explorador Rick and Morty
// Consume https://rickandmortyapi.com/api/character con fetch()
// =====================================================

// ---------- 1. CONFIGURACIÓN ----------
const URL_API = "https://rickandmortyapi.com/api/character";
const CLAVE_FAVORITOS = "favoritos-rym"; // nombre con el que guardamos en localStorage
const CLAVE_TEMA = "tema-rym";           // (EXTRA) nombre para guardar el tema

// Traducciones para mostrar los datos en español
const ESTADOS = { alive: "Vivo", dead: "Muerto", unknown: "Desconocido" };
const GENEROS = { Female: "Femenino", Male: "Masculino", Genderless: "Sin género", unknown: "Desconocido" };
const ESPECIES = { Human: "Humano", Humanoid: "Humanoide" };

// ---------- 2. ELEMENTOS DE LA PÁGINA ----------
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtro-estado");
const filtroEspecie = document.getElementById("filtro-especie");
const filtroGenero = document.getElementById("filtro-genero");
const btnLimpiar = document.getElementById("btn-limpiar");
const mensaje = document.getElementById("mensaje");
const listaPersonajes = document.getElementById("lista-personajes");
const listaFavoritos = document.getElementById("lista-favoritos");
const paginacion = document.getElementById("paginacion");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const infoPagina = document.getElementById("info-pagina");

// ---------- 3. VARIABLES DE ESTADO ----------
let paginaActual = 1;
let totalPaginas = 1;
let personajesMostrados = [];       // personajes de la página actual
let favoritos = leerFavoritos();    // personajes guardados como favoritos
let controlador = null;             // para cancelar consultas viejas
let temporizador = null;            // para esperar a que el usuario termine de escribir

// ---------- 4. FAVORITOS CON localStorage ----------
// Lee los favoritos guardados. Si no hay nada o hay un error, devuelve una lista vacía.
function leerFavoritos() {
  try {
    const guardado = localStorage.getItem(CLAVE_FAVORITOS);
    const lista = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

// Guarda la lista de favoritos como texto (localStorage solo guarda texto).
function guardarFavoritos() {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  } catch (error) {
    mostrarMensaje("No se pudieron guardar los favoritos en este navegador.", "error");
  }
}

function esFavorito(id) {
  return favoritos.some((f) => f.id === id);
}

// Agrega o quita un personaje de favoritos.
function alternarFavorito(personaje) {
  if (esFavorito(personaje.id)) {
    favoritos = favoritos.filter((f) => f.id !== personaje.id);
  } else {
    favoritos = [...favoritos, personaje];
  }
  guardarFavoritos();
  mostrarFavoritos();
  actualizarBotonesFavorito();
}

// ---------- 5. DATOS DE LA API ----------
// Convierte el personaje de la API a un objeto más pequeño con solo lo que usamos.
function normalizar(p) {
  return {
    id: p.id,
    nombre: p.name,
    estado: p.status,
    especie: p.species,
    genero: p.gender,
    imagen: p.image,
    origen: p.origin.name,
    ubicacion: p.location.name,
    episodios: p.episode.length
  };
}

// Pide los personajes a la API según el buscador, los filtros y la página.
async function cargarPersonajes() {
  // Si había una consulta anterior en curso, la cancelamos
  if (controlador) controlador.abort();
  controlador = new AbortController();

  // Armamos la dirección con los parámetros (ej: ?page=1&name=rick&status=alive)
  const parametros = new URLSearchParams({ page: paginaActual });
  const nombre = buscador.value.trim();
  if (nombre) parametros.set("name", nombre);
  if (filtroEstado.value) parametros.set("status", filtroEstado.value);
  if (filtroEspecie.value) parametros.set("species", filtroEspecie.value);
  if (filtroGenero.value) parametros.set("gender", filtroGenero.value);

  mostrarMensaje("Cargando personajes...", "info");

  try {
    const respuesta = await fetch(`${URL_API}?${parametros}`, { signal: controlador.signal });

    // La API responde 404 cuando no hay personajes que coincidan
    if (respuesta.status === 404) {
      personajesMostrados = [];
      totalPaginas = 1;
      mostrarPersonajes();
      actualizarPaginacion(0);
      mostrarMensaje("No se encontraron personajes. Cambia el nombre o quita algún filtro.", "aviso");
      return;
    }

    // Cualquier otro error del servidor
    if (!respuesta.ok) {
      throw new Error("Error HTTP " + respuesta.status);
    }

    const datos = await respuesta.json();
    personajesMostrados = datos.results.map(normalizar);
    totalPaginas = datos.info.pages;
    mostrarPersonajes();
    actualizarPaginacion(datos.info.count);
    mostrarMensaje("", "");
  } catch (error) {
    // Si cancelamos nosotros la consulta, no es un error real
    if (error.name === "AbortError") return;

    personajesMostrados = [];
    mostrarPersonajes();
    actualizarPaginacion(0);
    mostrarMensaje("No se pudo cargar la información. Revisa tu conexión a internet y vuelve a intentarlo.", "error");
    console.error("Error al consultar la API:", error);
  }
}

// ---------- 6. MOSTRAR INFORMACIÓN EN LA PÁGINA ----------
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje" + (tipo ? " mensaje-" + tipo : "");
  mensaje.hidden = !texto;
}

// Crea una ficha: foto grande con el nombre encima, botón de favorito y datos debajo.
function crearTarjeta(p) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";

  // Zona de la foto: imagen + botón de favorito + nombre y estado
  const foto = document.createElement("div");
  foto.className = "foto";

  const imagen = document.createElement("img");
  imagen.src = p.imagen;
  imagen.alt = "Retrato de " + p.nombre;
  imagen.width = 300;
  imagen.height = 300;
  imagen.loading = "lazy";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn-fav";
  boton.dataset.id = p.id;
  boton.dataset.nombre = p.nombre;
  pintarBotonFavorito(boton, esFavorito(p.id));
  boton.addEventListener("click", () => alternarFavorito(p));

  const pie = document.createElement("div");
  pie.className = "foto-pie";

  const titulo = document.createElement("h3");
  titulo.textContent = p.nombre;

  const estado = document.createElement("p");
  estado.className = "estado estado-" + p.estado;
  estado.textContent = ESTADOS[p.estado] || p.estado;

  pie.append(titulo, estado);
  foto.append(imagen, boton, pie);

  // Datos debajo de la foto
  const datos = document.createElement("dl");
  datos.className = "datos";
  agregarDato(datos, "Especie", ESPECIES[p.especie] || p.especie);
  agregarDato(datos, "Género", GENEROS[p.genero] || p.genero);
  agregarDato(datos, "Episodios", p.episodios);
  agregarDato(datos, "Origen", p.origen, true);
  agregarDato(datos, "Última ubicación", p.ubicacion, true);

  tarjeta.append(foto, datos);
  return tarjeta;
}

// Agrega un dato (etiqueta + valor). Si "ancho" es true, ocupa toda la fila.
function agregarDato(lista, etiqueta, valor, ancho) {
  const grupo = document.createElement("div");
  grupo.className = "dato" + (ancho ? " dato-ancho" : "");

  const termino = document.createElement("dt");
  termino.textContent = etiqueta;

  const descripcion = document.createElement("dd");
  descripcion.textContent = valor;

  grupo.append(termino, descripcion);
  lista.append(grupo);
}

// Cambia la estrella (☆ o ★) y el texto para lectores de pantalla.
function pintarBotonFavorito(boton, activo) {
  const accion = activo ? "Quitar de favoritos a " : "Agregar a favoritos a ";
  boton.textContent = activo ? "★" : "☆";
  boton.title = accion + boton.dataset.nombre;
  boton.setAttribute("aria-label", accion + boton.dataset.nombre);
  boton.classList.toggle("activo", activo);
  boton.setAttribute("aria-pressed", activo);
}

// Actualiza solo los botones de la lista principal (sin volver a dibujar todo).
function actualizarBotonesFavorito() {
  listaPersonajes.querySelectorAll(".btn-fav").forEach((boton) => {
    pintarBotonFavorito(boton, esFavorito(Number(boton.dataset.id)));
  });
}

function mostrarPersonajes() {
  listaPersonajes.replaceChildren(...personajesMostrados.map(crearTarjeta));
}

function mostrarFavoritos() {
  if (favoritos.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "vacio";
    vacio.textContent = "Aún no tienes favoritos. Usa «Agregar a favoritos» en cualquier personaje.";
    listaFavoritos.replaceChildren(vacio);
    return;
  }
  listaFavoritos.replaceChildren(...favoritos.map(crearTarjeta));
}

function actualizarPaginacion(total) {
  paginacion.hidden = personajesMostrados.length === 0;
  infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas} (${total} personajes)`;
  btnAnterior.disabled = paginaActual <= 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}

// ---------- 7. EVENTOS ----------
// Buscador: espera 400 ms después de la última tecla para no saturar la API
buscador.addEventListener("input", () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    paginaActual = 1;
    cargarPersonajes();
  }, 400);
});

// Filtros: al cambiar uno, volvemos a la página 1 y consultamos de nuevo
[filtroEstado, filtroEspecie, filtroGenero].forEach((filtro) => {
  filtro.addEventListener("change", () => {
    paginaActual = 1;
    cargarPersonajes();
  });
});

btnLimpiar.addEventListener("click", () => {
  buscador.value = "";
  filtroEstado.value = "";
  filtroEspecie.value = "";
  filtroGenero.value = "";
  paginaActual = 1;
  cargarPersonajes();
});

btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    cargarPersonajes();
    window.scrollTo(0, 0);
  }
});

btnSiguiente.addEventListener("click", () => {
  if (paginaActual < totalPaginas) {
    paginaActual++;
    cargarPersonajes();
    window.scrollTo(0, 0);
  }
});

// ---------- 8. EXTRA (Etapa 9): MODO OSCURO / CLARO ----------
// Esta sección se agrega en el Pull Request. Sin ella la app funciona igual.
const btnTema = document.getElementById("btn-tema");

// Decide el tema inicial: el guardado, o el que usa el sistema del usuario
function temaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === "oscuro" || guardado === "claro") return guardado;
  } catch (error) {
    // si localStorage falla, seguimos con el tema del sistema
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
}

// Pone el tema en la etiqueta <html> (el CSS cambia los colores según data-tema)
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  btnTema.textContent = tema === "oscuro" ? "Modo claro" : "Modo oscuro";
  btnTema.setAttribute("aria-pressed", tema === "oscuro");
}

if (btnTema) {
  aplicarTema(temaInicial());
  btnTema.addEventListener("click", () => {
    const nuevo = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
    aplicarTema(nuevo);
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo);
    } catch (error) {
      // no pasa nada si no se puede guardar
    }
  });
}
// ---------- FIN EXTRA ----------

// ---------- 9. INICIO ----------
mostrarFavoritos();
cargarPersonajes();
