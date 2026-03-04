// CODIGO DE EVENTO.HTML


function mostrarInputOtro() {
    const select = document.getElementById('tipoRegalo');
    const container = document.getElementById('inputOtroContainer');
    if (!select || !container) return;

    if (select.value === 'otro') {
        container.classList.remove('d-none');
    } else {
        container.classList.add('d-none');
        const inputOtro = document.getElementById('eventoPersonalizado');
        if (inputOtro) inputOtro.value = '';
    }
}

function cargarDatosEvento() {
    const guardado = localStorage.getItem('swapjoy_evento');
    if (!guardado) return;

    const datos = JSON.parse(guardado);
    const select = document.getElementById('tipoRegalo');
    const inputOtro = document.getElementById('eventoPersonalizado');
    const container = document.getElementById('inputOtroContainer');
    const nombreEvento = document.getElementById('nombreEvento');

    if (!select) return;

    const opcionExiste = [...select.options].some(op => op.value === datos.tipoEvento);

    if (opcionExiste) {
        select.value = datos.tipoEvento;
    } else {
        select.value = 'otro';
        container.classList.remove('d-none');
        inputOtro.value = datos.tipoEvento;
    }

    if (nombreEvento) nombreEvento.value = datos.nombreEvento || '';
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosEvento();

    // Interceptamos <a> para no mover el html directamente jjajja y no se vea feo
    const btnContinuar = document.querySelector('a[href="fechaPresupuesto.html"]');
    if (btnContinuar) {
        btnContinuar.addEventListener('click', function (e) {
            e.preventDefault(); //detiene la nevegacion

            const select = document.getElementById('tipoRegalo');
            const inputOtro = document.getElementById('eventoPersonalizado');
            const nombreEvento = document.getElementById('nombreEvento');

            if (!select.value) {
                alert('Por favor seleccione un tipo de evento!');
                return;
            }

            if (select.value === 'otro' && !inputOtro.value.trim()) {
                alert('⚠️ Escribe el nombre del tipo de evento personalizado.');
                return;
            }

            if (!nombreEvento.value.trim()) {
                alert('⚠️ Por favor escribe un nombre para el intercambio.');
                return;
            }

            const tipoFinal = select.value === 'otro'
                ? inputOtro.value.trim()
                : select.value;

            const datosEvento = {
                tipoEvento: tipoFinal,
                nombreEvento: nombreEvento.value.trim()
            };

            localStorage.setItem('swapjoy_evento', JSON.stringify(datosEvento));
            console.log('✅ Evento guardado:', datosEvento);

            // Ahora sí navega
            window.location.href = 'fechaPresupuesto.html';
        });
    }
});