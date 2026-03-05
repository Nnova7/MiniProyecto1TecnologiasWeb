// -------------------------------------------------------------------------------------------------------------------------
// ORGANIZADOR
// -------------------------------------------------------------------------------------------------------------------------

function guardarOrganizador() {
    const nombre = document.getElementById("nombreOrganizador").value.trim();
    const error = document.getElementById("error");

  //validacion
    if (!nombre) {
    error.style.display = "block";
    return;
    }

    error.style.display = "none";

    const incluyeOrganizador = document.getElementById("incluyeOrganizador").checked;

  //guardar en localStorage
    const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
    swapjoy.organizador = nombre;
    swapjoy.organizadorParticipa = incluyeOrganizador;

  //si el organizador participa, ya lo metemos como primer participante
    if (incluyeOrganizador) {
    swapjoy.participantes = [nombre];
    } else {
    swapjoy.participantes = swapjoy.participantes || [];
    }

    localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  // Verificar en consola (inspeccionar a Application a localStorage)
    console.log("Organizador guardado correctamente:", swapjoy);

  //alerta de guardado
    alert(`Organizador "${nombre}" guardado correctamente.`);

  //siguiente pantalla
    window.location.href = "participantes.html";
}

// -------------------------------------------------------------------------------------------------------------------------
// PARTICIPANTES
// -------------------------------------------------------------------------------------------------------------------------

function cargarParticipantes() {
    const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
    const participantes = swapjoy.participantes || [];
    renderizarLista(participantes);
}

function agregarParticipante() {
    const input = document.getElementById("nombreParticipante");
    const nombre = input.value.trim();

    if (!nombre) {
    input.classList.add("is-invalid");
    input.placeholder = "Escribe un nombre primero";
    return;
    }

    input.classList.remove("is-invalid");
    input.placeholder = "Nombre del participante";

    const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
    const participantes = swapjoy.participantes || [];

  //evitar duplicados
    if (participantes.map(p => p.toLowerCase()).includes(nombre.toLowerCase())) {
    input.classList.add("is-invalid");
    input.value = "";
    input.placeholder = "Ese nombre ya esta en la lista";
    return;
    }

    participantes.push(nombre);
    swapjoy.participantes = participantes;
    localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

    console.log("Participante agregado:", nombre, "| Total:", participantes);

    input.value = "";
    renderizarLista(participantes);
}

function eliminarParticipante(index) {
    const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
    const participantes = swapjoy.participantes || [];

    const eliminado = participantes[index];

  //no dejar eliminar al organizador si participa por las dudas
    if (swapjoy.organizadorParticipa && eliminado === swapjoy.organizador) {
    alert("El organizador participa en el sorteo y no puede ser eliminado aquí.");
    return;
    }

    participantes.splice(index, 1);
    swapjoy.participantes = participantes;
    localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

    console.log("Participante eliminado:", eliminado, "| Lista actual:", participantes);

    renderizarLista(participantes);
}

function renderizarLista(participantes) {
    const lista = document.getElementById("listaParticipantes");
    const contador = document.getElementById("contador");

    contador.textContent = participantes.length;

    if (participantes.length === 0) {
    lista.innerHTML = `<p class="text-center text-muted">Aún no hay participantes.</p>`;
    return;
    }

    lista.innerHTML = participantes.map((nombre, index) => `
    <div class="d-flex justify-content-between align-items-center mb-2 px-3 py-2 rounded"
        style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);">
        <span> ${nombre} 🎁</span>
        <button onclick="eliminarParticipante(${index})"
            class="btn btn-sm btn-danger boton-presion">
        ✕
        </button>
    </div>
    `).join("");
}

function continuarParticipantes() {
    const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
    const participantes = swapjoy.participantes || [];

    if (participantes.length < 2) {
    alert(" Necesitas agregar al menos 2 participantes para continuar.");
    return;
    }

    const nombres = participantes.join(", ");
    alert(` ¡Listo!\n\n Participantes registrados (${participantes.length}):\n${nombres}\n\nVamos a configurar las exclusiones.`);

    window.location.href = "preguntaExlusiones.html";
}

//agregar con Enter
document.addEventListener("DOMContentLoaded", () => {
  //ccargar lista al entrar a la pagina
  if (document.getElementById("listaParticipantes")) {
    cargarParticipantes();

    document.getElementById("nombreParticipante")
      .addEventListener("keydown", (e) => {
        if (e.key === "Enter") agregarParticipante();
      });
  }
});

// -----------------------------------------------------------------------------------------------------------------------------------
// EXCLUSIONES (incluye al HTML de prgunta exluciones y al de exclusiones )
// ------------------------------------------------------------------------------------------------------------------------------------

function cargarSelectExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  const participantes = swapjoy.participantes || [];
  const select = document.getElementById("personaSeleccionada");

  if (!select) return;

  select.innerHTML = participantes.map((nombre, i) =>
    `<option value="${i}">${nombre}</option>`
  ).join("");

  //mostrar checkboxes del primero por defecto
  mostrarOpcionesExclusion();
}

function mostrarOpcionesExclusion() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  const participantes = swapjoy.participantes || [];
  const exclusiones = swapjoy.exclusiones || {};

  const select = document.getElementById("personaSeleccionada");
  const indexSeleccionado = parseInt(select.value);
  const nombreSeleccionado = participantes[indexSeleccionado];

  const lista = document.getElementById("listaExclusiones");

  //exclusiones ya guardadas para esta persona
  const yaExcluidos = exclusiones[nombreSeleccionado] || [];

  //mstrar todos menos el mismo
  const opciones = participantes.filter((_, i) => i !== indexSeleccionado);

  if (opciones.length === 0) {
    lista.innerHTML = `<p class="text-muted text-center">No hay otros participantes para excluir.</p>`;
    return;
  }

  lista.innerHTML = `
    <label class="form-label">¿Con quién <strong>NO</strong> puede quedar <strong>${nombreSeleccionado}</strong>?</label>
    <div class="row g-2">
      ${opciones.map(nombre => `
        <div class="col-6 col-md-4">
          <div class="form-check px-3 py-2 rounded"
              style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);">
            <input class="form-check-input" type="checkbox"
                  id="excl_${nombre}"
                  value="${nombre}"
                  ${yaExcluidos.includes(nombre) ? "checked" : ""}>
            <label class="form-check-label" for="excl_${nombre}">
              🚫 ${nombre}
            </label>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function guardarExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  const participantes = swapjoy.participantes || [];
  const exclusiones = swapjoy.exclusiones || {};

  const select = document.getElementById("personaSeleccionada");
  const indexSeleccionado = parseInt(select.value);
  const nombreSeleccionado = participantes[indexSeleccionado];

  //leer los checkboxes marcados
  const checkboxes = document.querySelectorAll("#listaExclusiones input[type='checkbox']");
  const seleccionados = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  exclusiones[nombreSeleccionado] = seleccionados;
  swapjoy.exclusiones = exclusiones;
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log(" Exclusiones guardadas:", exclusiones);

  //resumen en alert
  if (seleccionados.length === 0) {
    alert(` ${nombreSeleccionado} no tiene exclusiones.\n\n¡Puede regalarle a cualquiera!`);
  } else {
    alert(` Exclusiones de ${nombreSeleccionado} guardadas:\n\n No puede tocar a: ${seleccionados.join(", ")}`);
  }

  window.location.href = "evento.html";
}

//Inicializar al cargar la pagina
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("personaSeleccionada")) {
    cargarSelectExclusiones();
  }
});

// PREGUNTA EXCLUSIONES----------------------------------------------------------------------------------------------------------------
function sinExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  swapjoy.exclusiones = {};
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Sin exclusiones, exclusiones guardadas como vacio");

  alert("Sin exclusiones.\n\n¡Todos pueden regalarle a cualquier persona!");

  window.location.href = "evento.html";
}

// -------------------------------------------------------------------------------------------------------------------------
// MODALES NAVBAR (Nosotras y Tutorial)
// -------------------------------------------------------------------------------------------------------------------------

function abrirNosotras() {
    document.getElementById("modalNosotras").classList.add("activo");
}

function abrirTutorial() {
    document.getElementById("modalTutorial").classList.add("activo");
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove("activo");
}

// Cierra si hacen clic en el fondo oscuro (fuera del cuadro)
function cerrarModalFondo(event, id) {
    if (event.target.id === id) {
        cerrarModal(id);
    }
}