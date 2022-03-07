async function consultarAPI(){
  try {
     const url = `${server}/api/servicios`; 
     const resultado = await fetch(url); 
     const servicios = await resultado.json(); 
     mostrarServicios(servicios);
  } catch (error) { 
     console.log(error); 
 }
}

let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); // Muestra y oculta las secciones
  tabs(); //Cambia la seccion cuando se presionan los tabs
  botonesPaginador(); //Agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();
  
  consultarAPI();// Consulta la API en el backend

  // idCliente();  
  nombreCliente();//Añade el nombre del cliente al objeto de cita
  seleccionarFecha();//Añade la fecha de la cita en el objeto
  seleccionarHora();//Añade la hora de la cita en el objeto

  mostrarResumen();// Muestra resumen cita
}

function mostrarSeccion(){
  
  //Ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector('.mostrar');
  if(seccionAnterior) {
    seccionAnterior.classList.remove('mostrar');
  }  

  //Seleccionar la seccion con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add('mostrar');

  //Quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector('.actual');
  if(tabAnterior) {
    tabAnterior.classList.remove('actual');
  }

  //Resalta el tab actual 
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add('actual')
}

function tabs() {
  const botones = document.querySelectorAll('.tabs button');

  botones.forEach( boton =>  {
    boton.addEventListener('click', function(e) {
      paso = parseInt(e.target.dataset.paso);

      mostrarSeccion();
      botonesPaginador();

    })
  });
}

function botonesPaginador() {
  
  const paginaAnterior = document.querySelector('#anterior');
  const paginaSiguiente = document.querySelector('#siguiente');

  if(paso === 1) {
    paginaAnterior.classList.add('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  } else if (paso === 3) {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.add('ocultar');

    mostrarResumen();

  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', function() {
    
    if(paso <= pasoInicial) return;

    paso--;

    botonesPaginador();
  })
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', function() {
    
    if(paso >= pasoFinal) return;

    paso++;

    botonesPaginador();
  })
}

async function consultarAPI() {
  try {
    const url = 'http://localhost:3000/api/servicios';
    const resultado = await fetch(url);
    const servicios = await resultado.json();
    mostrarServicios(servicios);

  } catch (error) {
    console.log('error');
  }
}

function mostrarServicios(servicios) {
  servicios.forEach(servicio => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement('P');
    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = `$ ${precio}`; // Se coloca un template string para poder colocar el simbolo de dolar.

    const servicioDiv = document.createElement('DIV');
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function() {
      seleccionarServicio(servicio);
    }

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector('#servicios').appendChild(servicioDiv);
  })
};

function seleccionarServicio(servicio) {
  const { id } = servicio; // Es el objeto de cada uno de los servicios que aparece en nuestra API
  const { servicios } = cita; // Servicios es el objeto que contiene la informacion de la cita

  //Identificar el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio = "${id}"]`);

  //Comprobar si un servicio ya fue agregado o quitarlo
  if( servicios.some(agregado => agregado.id === id) ) {
    //Eliminarlo
    cita.servicios = servicios.filter( agregado => agregado.id !== id );
    divServicio.classList.remove('seleccionado');
  } else { 
    //Agregarlo;
    cita.servicios = [...servicios, servicio];//Con los 3 puntos lo que hace es copiar los servicios y luego agregar servicio para convertir lo en un solo array
    divServicio.classList.add('seleccionado');
  }
  
  // console.log(cita);
}

function idCliente(){
  cita.id = Document.querySelector('#id').value;
}

function nombreCliente() {
  nombre = document.querySelector('#nombre');
  nombre.addEventListener('input', leerNombre);
  
  function leerNombre(e) {
    cita[e.target.id] = e.target.value;
  }
}  

function seleccionarFecha() {
  const inputFecha = document.querySelector('#fecha');

  inputFecha.addEventListener('input', function(e) {

    const dia = new Date(e.target.value).getUTCDay();

    if( [6, 0].includes(dia) ) {
        e.target.value = '';
        mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
    } else {
        cita.fecha = e.target.value;
    }
  })
}

function seleccionarHora() {
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', function(e) {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];
    if(hora < 9 || hora >18) {
      e.target.value = '';
      mostrarAlerta('Horas nos válidas', 'error', '.formulario');
    } else {
      cita.hora = e.target.value;
    };
  })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  //Previene que se generen mas de 1 alerta
  const alertaPrevia = document.querySelector('.alerta');
  if(alertaPrevia) {
    alertaPrevia.remove();
  };
  //Scripting para crear la alerta
  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);

  const refencia = document.querySelector(elemento);
  refencia.appendChild(alerta);
  
  //Eliminar la alerta
  if(desaparece) {
    setTimeout( () => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector('.contenido-resumen');
  
  // Limpiar el Contenido de Resumen
  while(resumen.firstChild) {
      resumen.removeChild(resumen.firstChild);
  }

  if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
      mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

      return;
  } 
  
  //Formatear el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  //Heading para servicios en resumen
  const headingServicios = document.createElement('H3');
  headingServicios.textContent = 'Resumen de Servicios';
  resumen.appendChild(headingServicios);

  //Iterando y mostrando servicios
  servicios.forEach(servicio => {
    const { id, precio, nombre } = servicio;
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.innerHTML = `<span>Precio:</span> $ ${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);

  })
  //Heading para cita en resumen
  const headingCita = document.createElement('H3');
  headingCita.textContent = 'Resumen de Cita';
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //Formatear la fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);


  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

  //Boton para crear una cita
  const botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Cita';
  botonReservar.onclick = reservarCita;
  
  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCliente);
  resumen.appendChild(horaCliente);

  resumen.appendChild(botonReservar);
}

async function reservarCita() {

  const{ nombre, fecha, hora, servicios, id } = cita;

  const idServicios = servicios.map(servicio => servicio.id);
  // console.log(idServicios);

  const datos = new FormData();
  
  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('usuarioId', id);
  datos.append('servicios', idServicios);

  // console.log([...datos]);

  try {
        //Peticion hacia la API
      const url = 'http://localhost:3000/api/citas'

      const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
      });

      const resultado = await respuesta.json();
      console.log(resultado);

      if(resultado.resultado) {
        Swal.fire({
          icon: 'success',
          title: 'Cita Creada',
          text: 'Tu Cita fue creada correctamente!',
          button: 'OK'
        }).then( () => {
          setTimeout(() => {
            window.location.reload();
        }, 3000);
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar la cita'
    })
  }
  // console.log([...datos]); Muestra info de datos
}  