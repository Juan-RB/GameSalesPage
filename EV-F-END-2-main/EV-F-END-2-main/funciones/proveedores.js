// Obtener la lista de clientes del Local Storage si existe, o crear una lista vacía
let listaClientes = JSON.parse(localStorage.getItem("clientes")) || [];

const cliente = {
  rut: "",
  nombre: "",
  comuna: "",
  email: "",
};

function agregarCliente(cliente) {
  listaClientes.push({ ...cliente });

  // Guardar la lista de clientes en el Local Storage
  localStorage.setItem("clientes", JSON.stringify(listaClientes));

  listarClientes();
}

function validarEmail(email) {
  // Expresión regular para validar el formato del email
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/;
  return regex.test(email);
}



function validarFormulario() {
  Swal.fire({
    title: '¿Estás seguro?',
    html: '¿Desea guardar los cambios?',
    text: "Esta acción no se puede deshacer!",
    icon: 'warning',
    showDenyButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Si',
    denyButtonColor: '#DE0303',
    denyButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      var rut = document.getElementById("rut").value;
      var nombre = document.getElementById("nombre").value;
      var comuna = document.getElementById("comuna").value;
      var email = document.getElementById("email").value;

      if (rut.length === 0 || nombre.length === 0 || email.length === 0 || comuna.length === 0) {
        Swal.fire('Error', 'Debe completar todos los campos.', 'error');
        return;
      }
	    if (rut.length < 8 || !/^\d+$/.test(rut)) {
        Swal.fire('Error', 'El rut debe tener 9 caracteres numéricos, en caso de ser necesaria la letra K, reemplazar por un 0.', 'error');
        return; // Detener la ejecución
      }
      if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        Swal.fire('Error', 'El nombre solo debe contener letras.', 'error');
        return; // Detener la ejecución
      }
      if (!/^[a-zA-Z\s]+$/.test(comuna)) {
        Swal.fire('Error', 'La comuna solo debe contener letras.', 'error');
        return; // Detener la ejecución
      }
      if (!validarEmail(email)) {
        Swal.fire('Error', 'El email debe tener un formato válido.', 'error');
        return;
      }

      cliente.rut = rut;
      cliente.nombre = nombre;
      cliente.comuna = comuna;
      cliente.email = email;

      agregarCliente(cliente);
      document.frm_registro.reset();

      Swal.fire('Cambios guardados exitosamente', '', 'success').then((result) => {
        listarClientes();
      });
    } else if (result.isDenied) {
      Swal.fire('Cambios no guardados', '', 'error');
    }
  });
}


function listarClientes() {
  limpiarHTML();

  const tbody = document.getElementById("data");

  listaClientes.forEach((cliente) => {
    const { rut, nombre, comuna, email } = cliente;

    var tr = document.createElement("TR");

    var td1 = document.createElement("TD");
    td1.appendChild(document.createTextNode(`${rut}`));

    var td2 = document.createElement("TD");
    td2.appendChild(document.createTextNode(`${nombre}`));

    var td3 = document.createElement("TD");
    td3.appendChild(document.createTextNode(`${comuna}`));

    var td4 = document.createElement("TD");
    td4.appendChild(document.createTextNode(`${email}`));

    var td5 = document.createElement("TD");
    const editarBoton = document.createElement("button");
    editarBoton.textContent = "Editar";
    editarBoton.setAttribute("class", "btn btn-primary");
    editarBoton.addEventListener("click", () => cargarCliente(listaClientes.indexOf(cliente)));
    td5.appendChild(editarBoton);

    var td6 = document.createElement("TD");
    const botonEliminar = document.createElement("button");
    botonEliminar.addEventListener("click", () => Borrar(listaClientes.indexOf(cliente)));
    botonEliminar.textContent = "Borrar";
    botonEliminar.setAttribute("class", "btn btn-danger");
    td6.appendChild(botonEliminar);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    tbody.appendChild(tr);
  });
}

function Limpiar() {
  document.frm_registro.reset();
  var miBoton = document.querySelector("#guardar");
  miBoton.textContent = "Guardar datos";
  miBoton.onclick = function() {
    validarFormulario();
  };

  document.getElementById("rut").removeAttribute("readonly");
}

function limpiarHTML() {
  const tbody = document.getElementById("data");

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

function Borrar(index) {

  Swal.fire({
    title: '¿Estás seguro?',
    html: '¿Deseas eliminar los datos seleccionados?',
    text: "Esta acción no se puede deshacer!",
    icon: 'warning',
    showDenyButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Si',
    denyButtonColor: '#DE0303',
    denyButtonText: 'No'
  }).then((result) => {

    if (result.isConfirmed) {
    listaClientes.splice(index, 1);
    localStorage.setItem('clientes', JSON.stringify(listaClientes)); // Almacena la matriz actualizada en el almacenamiento local
    listarClientes();
    Swal.fire('Datos eliminados exitosamente',"", 'success');
    document.getElementById("guardar").removeAttribute("disabled");
    document.getElementById("editar").setAttribute("disabled", "false");
    document.getElementById("rut").removeAttribute("readonly");
    }else if (result.isDenied) {
      Swal.fire('Datos no eliminados', '', 'error');
    }
  });
}

    
function cargarCliente(index) {
  var miBoton = document.querySelector("#guardar");
  miBoton.textContent = "Modificar datos";
  miBoton.onclick = function() {
    guardarCambios(index);
  };

  const clienteModificado = { ...listaClientes[index] };
  document.getElementById("rut").value = clienteModificado.rut;
  document.getElementById("nombre").value = clienteModificado.nombre;
  document.getElementById("comuna").value = clienteModificado.comuna;
  document.getElementById("email").value = clienteModificado.email;

  document.getElementById("rut").setAttribute("readonly", "true");
  document.getElementById("nombre").removeAttribute("readonly");
  document.getElementById("comuna").removeAttribute("readonly");
  document.getElementById("email").removeAttribute("readonly");

  document.getElementById("editar").onclick = function() {
    guardarCambios(index);
  };
}

function guardarCambios(index) {


  var miBoton = document.querySelector("#guardar");
  var rut = document.getElementById("rut").value;
  var nombre = document.getElementById("nombre").value;
  var comuna = document.getElementById("comuna").value;
  var email = document.getElementById("email").value;

  if (rut.length === 0 || nombre.length === 0 || email.length === 0 || comuna.length === 0) {
    Swal.fire('Error', 'Debe completar todos los campos.', 'error');
    return;
  }
  if (rut.length < 8 || !/^\d+$/.test(rut)) {
    Swal.fire('Error', 'El rut debe tener 9 caracteres numéricos, en caso de ser necesaria la letra K, reemplazar por un 0.', 'error');
    return; // Detener la ejecución
  }
  if (!/^[a-zA-Z\s]+$/.test(nombre)) {
    Swal.fire('Error', 'El nombre solo debe contener letras.', 'error');
    return; // Detener la ejecución
  }
  if (!/^[a-zA-Z\s]+$/.test(comuna)) {
    Swal.fire('Error', 'La comuna solo debe contener letras.', 'error');
    return; // Detener la ejecución
  }
  if (!validarEmail(email)) {
    Swal.fire('Error', 'El email debe tener un formato válido.', 'error');
    return;
  
  }


    listaClientes[index].nombre = nombre;
    listaClientes[index].comuna = comuna;
    listaClientes[index].email = email;

    document.getElementById("rut").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("comuna").value = "";
    document.getElementById("email").value = "";

    document.getElementById("rut").removeAttribute("readonly");

    // Guardar la lista de clientes en el Local Storage después de editar un cliente
    localStorage.setItem("clientes", JSON.stringify(listaClientes));

    listarClientes()

    miBoton.textContent = "Guardar datos";
    miBoton.onclick = function() {
      validarFormulario();
    };


  }





