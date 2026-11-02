# Explorador Rick and Morty

Aplicación web que consulta personajes de la [Rick and Morty API](https://rickandmortyapi.com/documentation), muestra sus datos y permite buscar, filtrar y guardar favoritos.



## Integrantes

-  Carlos Alejandro Tec Uicab (tecuicabcarlosp1-create)


## Enlaces

- Repositorio: (https://github.com/tecuicabcarlosp1-create/proyectoweb)
- publicada:  (https://tecuicabcarlosp1-create.github.io/proyectoweb/)

## Descripción

La página usa `fetch()` para pedir personajes a la API y los muestra como tarjetas con imagen, estado, especie, género, origen, última ubicación y número de episodios. No hay datos escritos a mano: todo viene de la API.

## Funciones

- Lista de personajes (20 por página) con imagen y descripción.
- Buscador por nombre.
- Filtros por estado, especie y género.
- Paginación (anterior y siguiente).
- Favoritos guardados con `localStorage` (siguen ahí al recargar la página).
- Mensajes cuando no hay resultados o falla la consulta.
- Diseño adaptable a celulares y computadoras.
- Funcionalidad extra: modo oscuro y claro.

## Instrucciones de uso

1. Abre la aplicación publicada.
2. Escribe un nombre en el buscador o elige un filtro. Los resultados se actualizan solos.
3. Usa **Limpiar filtros** para volver a la lista completa.
4. Pulsa **Agregar a favoritos** en una tarjeta. Aparecerá en la sección **Mis favoritos**.
5. Pulsa **Quitar de favoritos** para eliminarlo.
6. Pulsa **Modo oscuro** o **Modo claro** para cambiar el tema.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `style.css` | Colores, diseño y adaptación a celulares |
| `script.js` | Consulta a la API, buscador, filtros, favoritos y tema |
| `README.md` | Documentación del proyecto |

## Cómo funciona

- **fetch():** `cargarPersonajes()` arma la dirección con el nombre, los filtros y la página, y pide los datos a la API con `fetch()` y `await`.
- **Buscador:** cada vez que se escribe, espera 400 ms y vuelve a consultar la API con el parámetro `name`.
- **Filtros:** al cambiar un filtro se consulta de nuevo con los parámetros `status`, `species` y `gender`.
- **Cuando la API no responde:** el bloque `catch` muestra un mensaje de error. Si la API responde 404, muestra "No se encontraron personajes".
- **Favoritos:** se guardan en `localStorage` como texto JSON y se leen al abrir la página.

## Funcionalidad extra: modo oscuro y claro

- El botón cambia el atributo `data-tema` de la etiqueta `<html>`.
- En `style.css`, el bloque `[data-tema="oscuro"]` redefine las variables de color.
- La elección se guarda en `localStorage`. Si no hay una guardada, se usa el tema del sistema del usuario.

COMPLETAR: explicar con sus palabras cómo funciona y qué cambiaron ustedes.

## Uso de inteligencia artificial

**Herramienta usada:** (ChatGPT Plus o Claude Pro)

### Tres prompts importantes

**1. Base de la aplicación con fetch()**

```
Actúa como tutor de desarrollo web. Estoy haciendo una página con HTML, CSS y JavaScript puros que consulte la Rick and Morty API (https://rickandmortyapi.com/api/character).

Necesito, solo para esta etapa:
1. Un index.html con un contenedor vacío para las tarjetas y un elemento para mensajes.
2. Una función async en script.js que use fetch() para traer los personajes y los muestre como tarjetas con imagen, nombre, estado, especie y origen.
3. Un mensaje visible si la consulta falla (try/catch) y otro si la API responde 404.

Restricciones: sin librerías, sin datos escritos a mano, código con comentarios en español y estilo simple, listo para pegar en el editor web de GitHub.
Al final, explícame línea por línea qué hace fetch(), await y .json(), y hazme dos preguntas para comprobar que lo entendí.
```

Sirvió para construir la consulta a la API y entender cómo funciona `fetch()` con `async/await`.

**2. Depurar un error**

```
Tengo un error en mi proyecto (Rick and Morty API con HTML, CSS y JS puros, publicado en GitHub Pages).

Qué esperaba que pasara: que se vea bien el apartado y con la informacion correcta 
Qué pasa en realidad: no se veia la informacion


No me des directamente la versión corregida de todo el archivo. Primero explícame qué causa el error y cómo puedo comprobarlo yo mismo. Después dame el cambio mínimo para arreglarlo y dime qué debo probar para confirmar que quedó resuelto.
```

Sirvió para encontrar la causa de un error sin copiar una solución completa. COMPLETAR: pegar aquí el prompt exacto que enviaron, con los datos reales del error.

**3. Funcionalidad extra: modo oscuro y claro**

```
Mi aplicación ya funciona con buscador, filtros y favoritos. Quiero agregar un modo oscuro y claro, y tengo que poder explicar cómo funciona, así que no me des la solución completa de golpe.

Guíame en pasos pequeños:
1. Cómo organizar los colores del CSS con variables.
2. Cómo cambiar de tema con JavaScript.
3. Cómo guardar la elección con localStorage.

En cada paso dame el código de ese paso, explícame por qué funciona y pídeme que lo pruebe antes de seguir. Al final, hazme tres preguntas como las que haría un profesor para comprobar que entendí la modificación.
```


### Una respuesta de la IA que requirió correcciones

La IA generó un `README.md` con las instrucciones de uso escritas para el primer diseño de las tarjetas, donde el botón decía "Agregar a favoritos". Después pedimos rediseñar las tarjetas y el botón pasó a ser una estrella en la esquina de la foto, así que esas instrucciones quedaron desactualizadas. Las corregimos en los pasos 4 y 5 de "Instrucciones de uso".


### Un error encontrado y cómo lo resolvimos

la informacion no se veia y lo resolvimos editamos `index.html` desde GitHub y corregimos el nombre a `script.js`. Hicimos commit, esperamos un minuto a que GitHub Pages se actualizara y recargamos la página con Ctrl + F5. Los personajes aparecieron.

### Una modificación al código que podemos explicar

Rediseñamos las tarjetas de personajes sin cambiar la lógica de la API:

- **Antes:** una tarjeta con la imagen arriba, el texto en una lista y un botón con texto para favoritos.
- **Ahora:** una ficha con foto grande, el nombre y el estado sobre la foto, una estrella de favoritos en la esquina y los datos debajo en cuadrícula.
- **En `script.js`:** la función `crearTarjeta()` crea la ficha con `document.createElement`. Los datos usan `<dl>`, `<dt>` y `<dd>` en lugar de una lista. `pintarBotonFavorito()` cambia entre ☆ y ★ y actualiza la etiqueta de accesibilidad.
- **En `style.css`:** `.foto` tiene `position: relative` y la imagen se coloca encima con `position: absolute`. El nombre queda legible gracias a un degradado oscuro (`linear-gradient`) y los datos usan `display: grid` con dos columnas.


### Reflexión: qué aprendimos usando IA

La IA me ahorró tiempo escribiendo código base, pero entender ese código fue trabajo nuestro. Aprendimos que:

- Un prompt con rol, restricciones y formato de respuesta da resultados más ordenados que una petición corta.
- La IA no siempre mantiene todo coherente: al cambiar el diseño, el README quedó desactualizado y hubo que revisarlo.
- Hay que probar el código en el navegador y leer los errores de la consola, porque la IA no lo ejecuta por nosotros.
- Si no podemos explicar una parte del código, no la entendimos, aunque funcione.

## Dificultades

tuve un problema con la informacion de la api que no se veia la informacion de los personajes 