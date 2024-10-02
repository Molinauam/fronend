$('#formRegister').on('submit', function(event) {
  event.preventDefault(); // Agrega paréntesis

  const formData = {
      id: "5",
      nombreCompleto: $('input[name="fullName"]').val(),
      tipoDocumento: $('select[name="documentType"]').val(),
      documento: $('input[name="documentNumber"]').val(),
      contrasena: $('input[name="password"]').val(),
      rol: $('select[name="role"]').val(),
      estado: $('input[name="status"]').val(),
      numeroDeTelefono: $('input[name="numeroDeTelefono"]').val(),
      correoElectronico: $('input[name="correoElectronico"]').val()
  };

  $.post('http://localhost:4000/auth/createUser', formData, function(data) {
      // Limpiar formulario de registro
      $('#formRegister')[0].reset(); // Cambiado a reset()

      setTimeout(function() {
          window.location.href = 'http://localhost:5500/login.html';
      }, 5000);

      // SweetAlert2
      const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
          }
      });

      Toast.fire({
          icon: "success",
          title: data.result.message
      });
  }).fail(function() { // Manejo de errores
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar el usuario.'
      });
  });
});
