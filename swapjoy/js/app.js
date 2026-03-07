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
    Swal.fire({
      icon: "success",
      title: "Organizador guardado",
      text: `El organizador "${nombre}" fue guardado correctamente.`,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Continuar"
    }).then(() => {
      //A la otra página
      window.location.href = "participantes.html";
    });
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

    //BORRAR resultados anteriores si existían
    delete swapjoy.resultados;

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
      Swal.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: "El organizador participa en el sorteo y no puede ser eliminado.",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Entendido"
      });
      return;
    }

    participantes.splice(index, 1);
    swapjoy.participantes = participantes;

    //BORRAR resultados anteriores si existían
    delete swapjoy.resultados;
    
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
      Swal.fire({
        icon: "warning",
        title: "Faltan participantes",
        text: "Necesitas agregar al menos 2 participantes para continuar.",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Entendido"
      });
      return;
    }

    const nombres = participantes.join(", ");

    Swal.fire({
      icon: "success",
      title: "¡Participantes listos!",
      html: `
        <p><b>${participantes.length}</b> participantes registrados:</p>
        <p>${nombres}</p>
        <br>
        <p>Ahora vamos a configurar las exclusiones.</p>
      `,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "preguntaExlusiones.html";
    });
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

  Swal.fire({
    icon: "info",
    title: "Sin exclusiones",
    text: "Todos los participantes podrán regalarle a cualquier persona.",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "Continuar"
  }).then(() => {
    window.location.href = "evento.html";
  });
}

function irAExclusiones() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};
  swapjoy.exclusiones = {};
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Usuario desea realizar exclusiones");

  Swal.fire({
    icon: "info",
    title: "Configurar exclusiones",
    text: "Ahora podrás elegir qué personas no pueden regalarse entre sí.",
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "Continuar"
  }).then(() => {
    window.location.href = "exclusiones.html";
  });
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
  if (seleccionados.length === 0){
    Swal.fire({
      icon: "info",
      title: nombreSeleccionado,
      text: "No tiene exclusiones. ¡Puede regalarle a cualquiera!"
    });
  }else{
    Swal.fire({
      icon: "success",
      title: `Exclusiones de ${nombreSeleccionado} guardadas`,
      html: `No puede tocar a:<br><b>${seleccionados.join(", ")}</b>`
    });
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

  if (!tipoEvento){
    Swal.fire({
      icon: "warning",
      title: "Falta información",
      text: "Selecciona un tipo de evento."
    });
    return;
  }

  //Si eligió Otro
  if (tipoEvento === "otro"){
    if (!eventoPersonalizado.value.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Escribe el tipo de evento personalizado."
      });
      return;
    }
    tipoEvento = eventoPersonalizado.value.trim();
  }

  if (!nombreEvento){
    Swal.fire({
      icon: "warning",
      title: "Nombre del intercambio",
      text: "Escribe un nombre para el intercambio."
    });
    return;
  }

  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  swapjoy.evento = {
    tipo: tipoEvento,
    nombre: nombreEvento
  };

  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));
  console.log("Evento guardado:", swapjoy.evento);
  //Alert de éxito antes de redirigir
  Swal.fire({
    icon: "success",
    title: "¡Guardado!",
    html: `Tipo de evento: <strong>${tipoEvento}</strong><br>Nombre del intercambio: <strong>${nombreEvento}</strong>`,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'Continuar'
  }).then(() => {
    window.location.href = "fechaPresupuesto.html";
  });
}


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

function generarFechasSugeridas() {
  const contenedor = document.getElementById("fechasSugeridas");
  const inputFecha = document.getElementById("fechaEvento");

  if (!inputFecha || !contenedor) return; // Evita errores si no existen

  inputFecha.setAttribute("draggable", true);

  //Permite sacar la fecha del input
  inputFecha.addEventListener("dragstart", (e)=>{
    if(inputFecha.value){
      e.dataTransfer.setData("fecha", inputFecha.value);
    }
  });

  inputFecha.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  inputFecha.addEventListener("drop", (e) => {
    e.preventDefault();
    const fecha = e.dataTransfer.getData("fecha");
    if (fecha) {
      inputFecha.value = fecha;
    }
    //eliminar el botón del contenedor
    if (window.botonArrastrado) {
      window.botonArrastrado.remove();
      window.botonArrastrado = null;
    }
  });

  const hoy = new Date();

  for (let i = 1; i <= 5; i++) {
    let fecha = new Date();
    fecha.setDate(hoy.getDate() + i);

    //Obtener año, mes y día local
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // enero = 0
    const day = String(fecha.getDate()).padStart(2, '0');

    const fechaInput = `${year}-${month}-${day}`; // YYYY-MM-DD

    //formato bonito para mostrar
    const fechaTexto = fecha.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const boton = document.createElement("button");
    boton.className = "btn btn-outline-warning btn-sm";
    boton.textContent = fechaTexto;

    //activar drag
    boton.setAttribute("draggable", true);

    //cuando empieza el arrastre
    boton.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("fecha", fechaInput);
      //guardar el botón que se está arrastrando
      window.botonArrastrado = boton;
      //efecto en la opacidad del botón
      boton.style.opacity = "0.5"; 
    });

    boton.addEventListener("dragend", () => {
      boton.style.opacity = "1";
    });

    boton.onclick = function () {
      inputFecha.value = fechaInput;
    };

    contenedor.appendChild(boton);
  }

  //Permitir regresar la fecha al contenedor
  contenedor.addEventListener("dragover", (e)=>{
    e.preventDefault();
  });

  contenedor.addEventListener("drop", (e)=>{
    e.preventDefault();

    const fecha = e.dataTransfer.getData("fecha");

    if(fecha){

      //Validar duplicados
      const botones = contenedor.querySelectorAll("button");
      for (let b of botones){
        if (b.dataset.fecha === fecha){
          Swal.fire({
            icon: "warning",
            title: "Fecha repetida",
            text: "Esa fecha ya está en la lista."
          });
          return;
        }
      }

      //Evitar problemas con zona horaria
      const partes = fecha.split("-");
      const fechaObjeto = new Date(partes[0], partes[1] - 1, partes[2]);

      const fechaTexto = fechaObjeto.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      const boton = document.createElement("button");
      boton.className = "btn btn-outline-warning btn-sm";
      boton.textContent = fechaTexto;
      boton.draggable = true;
      boton.dataset.fecha = fecha;

      //volver a activar drag
      boton.addEventListener("dragstart", (e)=>{
        e.dataTransfer.setData("fecha", fecha);
        window.botonArrastrado = boton;
        boton.style.opacity = "0.5";
      });

      boton.addEventListener("dragend", ()=>{
        boton.style.opacity = "1";
      });

      contenedor.appendChild(boton);

      //limpiar input
      inputFecha.value = "";
    }
  });
}

//ejecutar cuando cargue la página
window.onload = () => {
  generarFechasSugeridas();
};

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
    Swal.fire({
      icon: "warning",
      title: "Falta la fecha",
      text: "Selecciona una fecha para el intercambio."
    });
    return;
  }
  //validar presupuesto seleccionado y que no este vacío
  if (!presupuesto){
    Swal.fire({
      icon: "warning",
      title: "Selecciona un presupuesto",
      text: "Debes elegir un presupuesto para el intercambio."
    });
    return;
  }
  //Si eligió "Otro"
  if (presupuesto === "otro") {
    if (!presupuestoPersonalizado.value || presupuestoPersonalizado.value <= 0) {
      Swal.fire({
        icon: "error",
        title: "Cantidad inválida",
        text: "Escribe una cantidad válida para el presupuesto.",
        confirmButtonColor: "#f59e0b"
      });
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
  Swal.fire({
    icon: "success",
    title: "¡Datos guardados!",
    text: "La fecha y el presupuesto se guardaron correctamente.",
    confirmButtonColor: "#f59e0b"
  }).then(() => {
    window.location.href = "sorteo.html";
  });
}



////----------------------------------------------------------------------------------------------------------------
// SORTEO
////----------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("resultadoSorteo");
  if (!contenedor) return;

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
    return;
  }

  //Imprimir todo el resumen completo en consola
  console.log("Resumen completo del intercambio");
  console.log(JSON.stringify(swapjoy, null, 2));
});

//Hacer sorteo
function realizarSorteo() {
  const swapjoy = JSON.parse(localStorage.getItem("swapjoy")) || {};

  if (swapjoy.resultados) {
    const boton = document.getElementById("btnSorteo");
    if (boton){
      boton.disabled = true;
      boton.textContent = "Sorteo ya realizado";
    } 
    mostrarResultados(swapjoy.resultados);
  }

  const participantes = swapjoy.participantes || [];
  const exclusiones = swapjoy.exclusiones || {};

  if (participantes.length < 2){
    Swal.fire({
      icon: "warning",
      title: "Faltan participantes",
      text: "Se necesitan al menos 2 participantes para realizar el sorteo.",
      confirmButtonColor: "#f59e0b"
    });
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

  if (!valido){
    Swal.fire({
      icon: "error",
      title: "Sorteo fallido",
      html: "No se pudo realizar el sorteo con las exclusiones actuales.<br><br>Revisa que no haya demasiadas restricciones.",
      confirmButtonColor: "#f59e0b"
    });
    return;
  }

  swapjoy.resultados = asignaciones;
  localStorage.setItem("swapjoy", JSON.stringify(swapjoy));

  console.log("Resultados del sorteo:", asignaciones);

  //Deshabilitar botón
  const boton = document.getElementById("btnSorteo");
  if (boton) {
    boton.disabled = true;
    boton.textContent = "Sorteo ya realizado";
  }

  //Alert con resumen antes de mostrar
  const resumen = Object.entries(asignaciones)
    .map(([p, r]) => `${p} → ${r}`)
    .join("<br>"); // usar <br> en lugar de \n para HTML

  Swal.fire({
    icon: "success",
    title: "Sorteo realizado con éxito!",
    html: `<div style="text-align: left;">${resumen}</div>`,
    confirmButtonColor: "#f59e0b",
    width: "400px",
    scrollbarPadding: false
  }).then(() => {
    // Mostrar las tarjetas del sorteo después de cerrar el SweetAlert
    mostrarResultados(asignaciones);
  });
}

//Mostrar tarjetas 
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

//Al momento de dar click en volvera a inicio si así lo desea se borrará lo anterior
function confirmarReinicio() {
  Swal.fire({
    title: '¿Deseas reiniciar el intercambio?',
    html: 'Se borrarán todos los datos del sorteo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, reiniciar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("swapjoy");
      window.location.href = "index.html";
    } else {
      console.log("El usuario canceló el reinicio");
    }
  });
}



// -------------------------------------------------------------------------------------------------------------------------
// DRAG AND DROP GATO
// -------------------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Se obtienen las imágenes del HTML por su id (declaraciones)
    const gato = document.getElementById("gatoArrastrable");
    const disfraz = document.getElementById("disfrazZona");

    // Si no existen en la página, no hacer nada (para que no truene en otros htmls)
    if (!gato || !disfraz) return;

    // Cuando el usuario empieza a arrastrar el gato
    gato.addEventListener("dragstart", (e) => {
      // Se guarda el dato que se está arrastrando
      e.dataTransfer.setData("id", e.target.id);
      // Se le agrega la clase para que se vea semitransparente mientras se arrastra
      gato.classList.add("gato-arrastrando");
    });

    // Cuando el usuario suelta el gato en cualquier parte
    gato.addEventListener("dragend", (e) => {
        // Se quita el efecto de arrastre
        gato.classList.remove("gato-arrastrando");

        // Se calcula la posición donde se soltó dentro del hero
        // y se posiciona el gato centrado en ese punto
        const heroRect = gato.closest(".hero").getBoundingClientRect();
        gato.style.left = (e.clientX - heroRect.left - gato.offsetWidth / 2) + "px";
        gato.style.top = (e.clientY - heroRect.top - gato.offsetHeight / 2) + "px";
        gato.style.transform = "none";
    });

    // Cuando el gato pasa encima del disfraz, se permite el drop
    disfraz.addEventListener("dragover", (e) => {
        // Sin esto no funciona el drop
        e.preventDefault();
        // Se agrega clase para que el disfraz brille como indicador
        disfraz.classList.add("disfraz-hover");
    });

    // Cuando el gato sale del área del disfraz sin soltarse
    disfraz.addEventListener("dragleave", () => {
        // Se quita el brillo del disfraz
        disfraz.classList.remove("disfraz-hover");
    });

    // Cuando el gato se suelta encima del disfraz
    disfraz.addEventListener("drop", (e) => {
        const id = e.dataTransfer.getData("id");
        e.preventDefault();
        // Se quita el brillo del disfraz
        disfraz.classList.remove("disfraz-hover");

        // El disfraz desaparece
        disfraz.style.display = "none";

        // El gato cambia a gato2 y regresa a su posición original izquierda
        gato.src = "img/gato2.png";
        gato.style.left = "20px";
        gato.style.top = "50%";
        gato.style.transform = "translateY(-50%)";
        // Se marca como transformado para saber que ya es gato2
        gato.classList.add("gato-transformado");
    });
});