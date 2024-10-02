$(document).ready(function() {
  $('#formLogin').on('submit', handleLogin);
});

async function handleLogin(event) {
  event.preventDefault();

  const formData = getFormData();

  try {
      const data = await loginUser(formData);
      handleLoginResponse(data);
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showToast('error', 'Ocurrió un error al procesar la solicitud.');
  }
}

function getFormData() {
  return {
      documentType: $('select[name="documentType"]').val(),
      documentNumber: $('input[name="documentNumber"]').val(),
      password: $('input[name="password"]').val()
  };
}

async function loginUser(formData) {
  return $.post('https://localhost:4000/auth/login', formData);
}

function handleLoginResponse(data) {
  if (data.result.user && data.result.user.length > 0) {
      showToast('success', data.result.message);
      window.location.href = 'dashboard.html';
  } else {
      showToast('error', "Usuario y/o contraseña incorrectos");
  }
}

function showToast(icon, title) {
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

  Toast.fire({ icon, title });
}

const loginAPI = async (req, res) => {
  const { documentNumber, password } = req.body;

  try {
      const response = await login({ documentNumber, password });
      return res.json(new ResponseBody(true, 200, response));
  } catch (error) {
      return res.json(new ResponseBody(false, error.statusCode || 500, error.data || 'Ocurrió un error al procesar la solicitud.'));
  }
};

async function login(options) {
  const user = new User("", "", options.documentNumber, options.password, "", "", "");

  try {
      const userResult = await user.findUser();
      return {
          message: 'Sesión iniciada exitosamente',
          user: userResult,
      };
  } catch (error) {
      throw {
          ok: false,
          statusCode: 500,
          data: 'Ocurrió un error al iniciar sesión'
      };
  }
}

// Asegúrate de que esta función esté dentro de la clase User
async function findUser() {
  const connection = await getConnection();

  try {
      const [result] = await connection.query(`
          SELECT
              id,
              nombre_completo AS fullName,
              tipo_documento AS documentType,
              documento AS documentNumber,
              rol AS role,
              estado AS status
          FROM usuarios
          WHERE documento = ?
          AND contrasena = ?`, [this.documentNumber, this.password]);

      return result;
  } catch (error) {
      throw {
          ok: false,
          statusCode: 500,
          data: 'Ocurrió un error al obtener el usuario'
      };
  } finally {
      connection.release();
  }
}