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

//cierra si hacen clic en el fondo oscuro (fuera del cuadro) por si no quieren usar el boton de cerrado
function cerrarModalFondo(event, id) {
    if (event.target.id === id) {
        cerrarModal(id);
    }
}

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
        <span> ${nombre} </span>
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
    alert("Necesitas agregar al menos 2 participantes para continuar.");
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

// PREGUNTA EXCLUSIONES----------------------------------------------------------------------------------------------------------------
//aqui guardamos lo que puso en local, todo mensaje se manda directo a consola
function sinExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  swapjoy.exclusiones = {};
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Sin exclusiones");

  alert("Sin exclusiones.\n\n¡Todos pueden regalarle a cualquier persona!");

  window.location.href = "evento.html";
}

function irAExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  swapjoy.exclusiones = {};
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Usuario desea realizar exclusiones");

  alert("Se aplicarán exclusiones.");

  window.location.href = "exclusiones.html";
}

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
               ${nombre}
            </label>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}


//Inicializar al cargar la pagina
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("personaSeleccionada")) {
    cargarSelectExclusiones();
  }
});

//--------------------------------------------------------------------------------------------------------------------
//EXCLUSIONES
//--------------------------------------------------------------------------------------------------------------------
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

  console.log(" Exclusiones guardadas:", swapjoy.exclusiones);

  //resumen en alert
  if (seleccionados.length === 0) {
    alert(` ${nombreSeleccionado} no tiene exclusiones.\n\n¡Puede regalarle a cualquiera!`);
  } else {
    alert(` Exclusiones de ${nombreSeleccionado} guardadas:\n\n No puede tocar a: ${seleccionados.join(", ")}`);
  }
}

function finalizarExclusiones() {
  window.location.href = "evento.html";
}

//----------------------------------------------------------------------------------------------------------------
//TIPO DE EVENTO Y NOMBRE DE EVENTO
//----------------------------------------------------------------------------------------------------------------
//Si desea seleccionar la opción de Otro...
function mostrarInputOtro() {
  const select = document.getElementById("tipoRegalo");
  const container = document.getElementById("inputOtroContainer");

  if (select.value === "otro") {
    container.classList.remove("d-none");
  } else {
    container.classList.add("d-none");
  }
}

//Guardar la información del evento
function guardarEvento(){
  const tipoSelect = document.getElementById("tipoRegalo");
  const nombreEventoInput = document.getElementById("nombreEvento");
  const eventoPersonalizado = document.getElementById("eventoPersonalizado");

  let tipoEvento = tipoSelect.value;
  let nombreEvento = nombreEventoInput.value.trim();

  if (!tipoEvento) {
    alert("Selecciona un tipo de evento.");
    return;
  }

  // Si eligió Otro
  if (tipoEvento === "otro") {
    if (!eventoPersonalizado.value.trim()) {
      alert("Escribe el tipo de evento personalizado.");
      return;
    }
    tipoEvento = eventoPersonalizado.value.trim();
  }

  if (!nombreEvento) {
    alert("Escribe un nombre para el intercambio.");
    return;
  }

  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  swapjoy.evento = {
    tipo: tipoEvento,
    nombre: nombreEvento
  };

  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));
  console.log("Evento guardado:", swapjoy.evento);
  window.location.href = "fechaPresupuesto.html";
}

//Si se regresa a otra página, guardar lo que ya se tenía
document.addEventListener("DOMContentLoaded", () => {

  if (!document.getElementById("tipoRegalo")) return;

  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  if (!swapjoy.evento) return;

  const tipoSelect = document.getElementById("tipoRegalo");
  const nombreEventoInput = document.getElementById("nombreEvento");
  const eventoPersonalizado = document.getElementById("eventoPersonalizado");
  const container = document.getElementById("inputOtroContainer");

  const tipoGuardado = swapjoy.evento.tipo;
  const nombreGuardado = swapjoy.evento.nombre;

  nombreEventoInput.value = nombreGuardado;

  // Verificar si el tipo está dentro de las opciones del select
  const opciones = Array.from(tipoSelect.options).map(opt => opt.value);

  if (opciones.includes(tipoGuardado)) {
    tipoSelect.value = tipoGuardado;
  } else {
    // Si no está en la lista, es un "Otro"
    tipoSelect.value = "otro";
    container.classList.remove("d-none");
    eventoPersonalizado.value = tipoGuardado;
  }

});


//----------------------------------------------------------------------------------------------------------------
//FECHA Y PRESUPUESTO
//----------------------------------------------------------------------------------------------------------------
//Un input si selecciona la opción de otro
function mostrarInputPresupuesto() {
  //select donde el usuario elige el presupuesto
  const select = document.getElementById("presupuestoSelect");
  //input
  const container = document.getElementById("inputPresupuestoContainer");
  //si el usuario selecciona otro
  if (select.value === "otro") {
    //se quita la clase d-none para mostrar el input
    container.classList.remove("d-none");
  } else {
    //si elige otra opción que ya estaba así se deja
    container.classList.add("d-none");
  }
}

//Guardar fecha y presupyesto
function guardarFechaPresupuesto() {
  //se obtiene el valor de la fecha
  const fechaInput = document.getElementById("fechaEvento");
  //se obtiene el select del presupuesto
  const presupuestoSelect = document.getElementById("presupuestoSelect");
  //input del presupuesto deseado
  const presupuestoPersonalizado = document.getElementById("presupuestoPersonalizado");
  //se guardan los valores en las variables
  let fecha = fechaInput.value;
  let presupuesto = presupuestoSelect.value;

  //Validar que si haya fecha seleccionada
  if (!fecha) {
    alert("Selecciona una fecha para el intercambio.");
    return;
  }
  //validar presupuesto seleccionado y que no este vacío
  if (!presupuesto) {
    alert("Selecciona un presupuesto.");
    return;
  }
  //Si eligió "Otro"
  if (presupuesto === "otro") {
    if (!presupuestoPersonalizado.value || presupuestoPersonalizado.value <= 0) {
      alert("Escribe una cantidad válida.");
      return;
    }
    //se reemplaza el valor del presupuesto por el personalizado
    presupuesto = presupuestoPersonalizado.value;
  }
  //se recupera lo que hay en swapjoy para el localstorage
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  //sección detalles se actualiza o se crea
  swapjoy.detalles = {
    fecha: fecha,
    presupuesto: presupuesto
  };
  //se guarda nuevamente todo el objeto el localstorage
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));
  //se muestra en consola
  console.log("Fecha y presupuesto guardados:", swapjoy.detalles);
  alert("Fecha y presupuesto guardados correctamente.");
  window.location.href = "sorteo.html";
}

//Si se regresa de página que se guarde lo seleccionado anteriormente
document.addEventListener("DOMContentLoaded", () => {
  //si esta pagina no tiene el input de fecha no hace nada
  if (!document.getElementById("fechaEvento")) return;
  //se recuperan datos guardados
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  if (!swapjoy.detalles) return;
  //se obtienen referencias a los elementos
  const fechaInput = document.getElementById("fechaEvento");
  const presupuestoSelect = document.getElementById("presupuestoSelect");
  const presupuestoPersonalizado = document.getElementById("presupuestoPersonalizado");
  const container = document.getElementById("inputPresupuestoContainer");
  //se rellena fecha guardada
  fechaInput.value = swapjoy.detalles.fecha;
  //opciones disponibles del select
  const opciones = Array.from(presupuestoSelect.options).map(opt => opt.value);
  //si el rpesupuesto es de los que ya estaban se selecciona directamente
  if (opciones.includes(swapjoy.detalles.presupuesto)) {
    presupuestoSelect.value = swapjoy.detalles.presupuesto;
  } else {
    //si no está ahí es porque es personalizado
    presupuestoSelect.value = "otro";
    //se muestra el input
    container.classList.remove("d-none");
    //se coloca el valor que se desea
    presupuestoPersonalizado.value = swapjoy.detalles.presupuesto;
  }

});


////----------------------------------------------------------------------------------------------------------------
// SORTEO
////----------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("mostrarFecha")) return;

  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  //Resumen
  document.getElementById("mostrarOrganizador").textContent = swapjoy.organizador || "-";
  document.getElementById("mostrarNombreEvento").textContent = swapjoy.evento?.nombre || "-";
  document.getElementById("mostrarTipo").textContent = swapjoy.evento?.tipo || "-";
  document.getElementById("mostrarFecha").textContent = swapjoy.detalles?.fecha || "-";
  document.getElementById("mostrarPresupuesto").textContent =
    swapjoy.detalles?.presupuesto ? `$${swapjoy.detalles.presupuesto} MXN` : "-";

  //Exclusiones
  if (swapjoy.exclusiones && Object.keys(swapjoy.exclusiones).length > 0) {
    let texto = "";
    for (let persona in swapjoy.exclusiones) {
      if (swapjoy.exclusiones[persona].length > 0) {
        texto += `${persona} → ${swapjoy.exclusiones[persona].join(", ")} | `;
      }
    }
    document.getElementById("mostrarExclusiones").textContent = texto.trim().replace(/\|$/, "") || "Sin exclusiones";
  } else {
    document.getElementById("mostrarExclusiones").textContent = "Sin exclusiones";
  }

  //Si ya hay resultados guardados
  if (swapjoy.resultados) {
    const boton = document.querySelector("button[onclick='realizarSorteo()']");
    if (boton) {
      boton.disabled = true;
      boton.textContent = "Sorteo ya realizado";
    }
    mostrarResultados(swapjoy.resultados);
  }
});

//Hacer sorteo
function realizarSorteo() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  if (swapjoy.resultados) {
    alert("El sorteo ya fue realizado.\n\nNo se puede repetir.");
    const boton = document.querySelector("button[onclick='realizarSorteo()']");
    if (boton) boton.disabled = true;
    mostrarResultados(swapjoy.resultados);
    return;
  }

  const participantes = swapjoy.participantes || [];
  const exclusiones = swapjoy.exclusiones || {};

  if (participantes.length < 2) {
    alert("Se necesitan al menos 2 participantes para realizar el sorteo.");
    return;
  }

  let intentos = 0;
  let asignaciones = {};
  let valido = false;

  while (!valido && intentos < 500) {
    intentos++;
    valido = true;
    asignaciones = {};

    let disponibles = [...participantes];

    for (let persona of participantes) {
      let posibles = disponibles.filter(p => {
        if (p === persona) return false;
        if (exclusiones[persona]) return !exclusiones[persona].includes(p);
        return true;
      });

      if (posibles.length === 0) {
        valido = false;
        break;
      }

      let elegido = posibles[Math.floor(Math.random() * posibles.length)];
      asignaciones[persona] = elegido;
      disponibles = disponibles.filter(p => p !== elegido);
    }
  }

  if (!valido) {
    alert("No se pudo realizar el sorteo con las exclusiones actuales.\n\nRevisa que no haya demasiadas restricciones.");
    return;
  }

  swapjoy.resultados = asignaciones;
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Resultados del sorteo:", asignaciones);

  // Deshabilitar botón
  const boton = document.querySelector("button[onclick='realizarSorteo()']");
  if (boton) {
    boton.disabled = true;
    boton.textContent = "Sorteo ya realizado";
  }

  // Alert con resumen antes de mostrar
  const resumen = Object.entries(asignaciones)
    .map(([p, r]) => `${p} → ${r}`)
    .join("\n");
  alert(`Sorteo realizado con éxito!\n\n${resumen}`);

  mostrarResultados(asignaciones);
}

// ── Mostrar tarjetas ──
function mostrarResultados(asignaciones) {
  const contenedor = document.getElementById("resultadoSorteo");
  if (!contenedor) return;

  contenedor.innerHTML = `
    <h5 class="text-center fw-bold mb-4 resumen-titulo">
      Resultados del Sorteo
    </h5>
    <div class="row g-3">
      ${Object.entries(asignaciones).map(([persona, regalo]) => `
        <div class="col-md-6 col-lg-4">
          <div class="sorteo-card">
            <img src="img/santa.png" class="sorteo-santa" alt="santa">
            <div class="sorteo-nombre">${persona}</div>
            <img src="img/regalito.png" class="sorteo-regalito" alt="regalo">
            <div class="sorteo-regala-text">le regala a</div>
            <div class="sorteo-nombre sorteo-receptor">${regalo}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}