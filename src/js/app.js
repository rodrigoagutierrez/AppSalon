let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
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

  nombreCliente();
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
  
  console.log(cita);
}

