import React, { useState, useEffect, useMemo } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaCheck, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaWhatsapp, FaLightbulb, FaEye, FaCrown, FaMapMarkerAlt, FaStar, FaSearch, FaUsers, FaHome, FaBed, FaArrowUp, FaChevronDown, FaChevronUp, FaChair, FaDollarSign, FaImage } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// URL base de la API
const API_BASE_URL = 'https://www.bosquesagrado.somee.com/api';

// Funciones API para obtener datos
const fetchCabinsFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Cabanas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo cabañas');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo cabañas:', error);
    throw error;
  }
};

const fetchServicesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Servicios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo servicios');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    throw error;
  }
};

const fetchSedesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Sede`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo sedes');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo sedes:', error);
    throw error;
  }
};

const fetchTiposCabanasFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/TipoCabana`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo tipos de cabañas');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo tipos de cabañas:', error);
    throw error;
  }
};

const fetchComodidadesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Comodidades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo comodidades');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo comodidades:', error);
    throw error;
  }
};

const fetchCabanaComodidadesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/CabanaPorComodidades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo relaciones cabaña-comodidades');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo relaciones cabaña-comodidades:', error);
    throw error;
  }
};

const fetchImagenesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ImgCabana`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo imágenes');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    throw error;
  }
};

// Funciones de autenticación MEJORADAS
const loginWithAPI = async (email, password) => {
  try {
    console.log('🔐 Intentando login con:', { email, password });
   
    const response = await fetch(`${API_BASE_URL}/Usuarios/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contrasena: password
      })
    });

    console.log("📩 Respuesta del servidor:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Error en el login';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Login exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en login:', error);
   
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en https://www.bosquesagrado.somee.com');
    }
   
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuarios');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

const getAllRoles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Rol`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo roles');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    throw error;
  }
};

// MODIFICADA: Función para buscar usuario en lista - MEJORADA
const findUserInList = async (email) => {
  try {
    const allUsers = await getAllUsers();
    console.log('📊 Todos los usuarios obtenidos:', allUsers);
   
    const user = allUsers.find(u => u.correo && u.correo.toLowerCase() === email.toLowerCase());
   
    if (user) {
      console.log('✅ Usuario encontrado en BD con todos los campos:', user);
      console.log('📝 Campos disponibles:', {
        tipoDocumento: user.tipoDocumento,
        numeroDocumento: user.numeroDocumento,
        nombre: user.nombre,
        apellido: user.apellido,
        celular: user.celular,
        fechaNacimiento: user.fechaNacimiento,
        correo: user.correo,
        idRol: user.idRol
      });
    } else {
      console.warn('⚠️ Usuario NO encontrado en BD para email:', email);
    }
   
    return user;
  } catch (error) {
    console.error('Error buscando usuario en lista:', error);
    return null;
  }
};

const getUserRoleInfo = async (idRol) => {
  try {
    const allRoles = await getAllRoles();
    const role = allRoles.find(r => r.idRol === idRol);
    return role;
  } catch (error) {
    console.error('Error obteniendo información del rol:', error);
    return null;
  }
};

const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('❌ Servidor no disponible:', error);
    return false;
  }
};

const registerWithAPI = async (userData) => {
  try {
    console.log('📝 Intentando registrar usuario:', userData);
   
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Respuesta del registro:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = 'Error en el registro';
      try {
        const errorText = await response.text();
        if (errorText.includes('correo') || errorText.includes('duplicado')) {
          errorMessage = 'El correo electrónico ya está registrado';
        } else if (errorText.includes('18 años')) {
          errorMessage = 'Debes ser mayor de 18 años para registrarte';
        } else {
          errorMessage = errorText || 'Error desconocido';
        }
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Registro exitoso:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en registro:', error);
   
    if (error.name === 'AbortError') {
      throw new Error('La conexión con el servidor tardó demasiado tiempo. Verifica que el backend esté funcionando correctamente.');
    }
   
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en https://www.bosquesagrado.somee.com');
    }
   
    throw error;
  }
};

// MODIFICADA: Función para enviar código de verificación (más tolerante a errores)
const sendVerificationCode = async (email) => {
  try {
    console.log('📤 Enviando código de verificación a:', email);
    const response = await fetch(`${API_BASE_URL}/Usuarios/SendVerificationCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email })
    });

    console.log('📨 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.warn('⚠️ Respuesta no OK al enviar código:', response.status, response.statusText);
      return { exito: false, mensaje: `Error ${response.status}: ${response.statusText}` };
    }

    const result = await response.json();
    console.log('✅ Resultado del envío de código:', result);
    return result;
  } catch (error) {
    console.error('❌ Error enviando código:', error);
    return { exito: false, mensaje: error.message };
  }
};

// MODIFICADA: Función para verificar código (más tolerante a errores)
const verifyCode = async (email, code) => {
  try {
    console.log('🔐 Verificando código para:', email);
    console.log('📝 Código ingresado:', code);
   
    const response = await fetch(`${API_BASE_URL}/Usuarios/VerificarCodigo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        codigo: code
      })
    });

    console.log('📨 Respuesta del servidor (verify):', response.status, response.statusText);

    if (!response.ok) {
      console.warn('⚠️ Respuesta no OK al verificar código:', response.status, response.statusText);
     
      let errorMessage = 'Error verificando código';
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
     
      return { exito: false, mensaje: errorMessage };
    }

    const result = await response.json();
    console.log('✅ Resultado de la verificación:', result);
    return result;
  } catch (error) {
    console.error('❌ Error verificando código:', error);
    return { exito: false, mensaje: error.message };
  }
};

// NUEVAS FUNCIONES: Olvidó contraseña
const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/OlvidoContrasena`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error enviando código de recuperación';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error en olvidó contraseña:', error);
    throw error;
  }
};

const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Usuarios/RestablecerClave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        codigo: code,
        nuevaContrasena: newPassword
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error restableciendo contraseña';
      try {
        const errorData = await response.json();
        if (errorData && errorData.mensaje) {
          errorMessage = errorData.mensaje;
        }
      } catch (e) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error restableciendo contraseña:', error);
    throw error;
  }
};

// FUNCIONES DE AUTENTICACIÓN CORREGIDAS - GUARDAR TODOS LOS CAMPOS NECESARIOS
const saveUser = (user) => {
  // Guardar todos los campos necesarios para el formulario de reserva
  const userData = {
    // Datos básicos de autenticación
    idUsuario: user.idUsuario,
    email: user.correo || user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    nombreRol: user.nombreRol,
    idRol: user.idRol,
   
    // DATOS CRÍTICOS PARA EL FORMULARIO DE RESERVA
    tipoDocumento: user.tipoDocumento,
    numeroDocumento: user.numeroDocumento,
    celular: user.celular,
    fechaNacimiento: user.fechaNacimiento,
   
    // Campos adicionales por si acaso
    correo: user.correo || user.email,
    estado: user.estado
  };
 
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userRole', user.rol);
  localStorage.setItem('userEmail', user.correo || user.email);
 
  console.log('💾 Usuario guardado en localStorage:', userData);
};

const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
};

// Estilos para comodidades
const comodidadTagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  backgroundColor: '#E8F5E8',
  color: '#2E5939',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '500',
  margin: '2px'
};

function LoginRegister() {
  const navigate = useNavigate();
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCabins, setShowCabins] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isServerOnline, setIsServerOnline] = useState(true);

  // Estados para datos de la API
  const [cabañas, setCabañas] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tiposCabanas, setTiposCabanas] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [cabanaComodidades, setCabanaComodidades] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Estados para olvidó contraseña
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordCode, setResetPasswordCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Estados para filtros
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCapacidad, setFiltroCapacidad] = useState("");
  const [cabinImageIndex, setCabinImageIndex] = useState(0);
  const [sedeImageIndex, setSedeImageIndex] = useState(0);

  // Estados para paginación
  const [currentSedePage, setCurrentSedePage] = useState(1);
  const [currentCabinPage, setCurrentCabinPage] = useState(1);
  const sedesPerPage = 3;
  const cabinsPerPage = 4;

  // Estados para registro
  const [tipoDocumento, setTipoDocumento] = useState("Cédula de Ciudadanía");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [celular, setCelular] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Nuevos estados para mostrar más cabañas y servicios
  const [showAllCabins, setShowAllCabins] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  // Opciones para tipo de documento
  const tiposDocumento = [
    "Cédula de Ciudadanía",
    "Cédula de Extranjería",
    "Pasaporte",
    "Tarjeta de Identidad"
  ];

  // Efecto para scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar datos de la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cabinsData, servicesData, sedesData, tiposData, comodidadesData, cabanaComodidadesData, imagenesData] = await Promise.all([
          fetchCabinsFromAPI(),
          fetchServicesFromAPI(),
          fetchSedesFromAPI(),
          fetchTiposCabanasFromAPI(),
          fetchComodidadesFromAPI(),
          fetchCabanaComodidadesFromAPI(),
          fetchImagenesFromAPI()
        ]);

        console.log("📊 Datos obtenidos de la API:", {
          cabañas: cabinsData,
          servicios: servicesData,
          sedes: sedesData,
          tipos: tiposData,
          comodidades: comodidadesData,
          relaciones: cabanaComodidadesData,
          imágenes: imagenesData
        });

        // Transformar datos de cabañas para que coincidan con la estructura esperada
        const transformedCabins = cabinsData.map(cabin => {
          // Obtener comodidades de esta cabaña
          const comodidadesCabin = cabanaComodidadesData
            .filter(cc => cc.idCabana === cabin.idCabana)
            .map(cc => {
              const comodidad = comodidadesData.find(c => c.idComodidades === cc.idComodidades);
              return comodidad ? comodidad.nombreComodidades : null;
            })
            .filter(Boolean);

          // Obtener imágenes de esta cabaña
          const imagenesCabin = imagenesData
            .filter(img => img.idCabana === cabin.idCabana)
            .map(img => img.rutaImagen);

          // Obtener tipo de cabaña
          const tipoCabana = tiposData.find(t => t.idTipoCabana === cabin.idTipoCabana);
          const nombreTipo = tipoCabana ? tipoCabana.nombreTipoCabana : "Estándar";

          // Obtener sede
          const sede = sedesData.find(s => s.idSede === cabin.idSede);
          const nombreSede = sede ? sede.nombreSede : "Sede Principal";

          return {
            id: cabin.idCabana,
            name: cabin.nombre,
            description: cabin.descripcion || "Cabaña cómoda y acogedora para tu estadía.",
            img: imagenesCabin.length > 0 ? imagenesCabin[0] : "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
            price: `$${(cabin.precio || 0).toLocaleString()} COP/noche`,
            precioNumerico: cabin.precio || 0,
            sede: nombreSede,
            tipo: nombreTipo,
            capacidad: cabin.capacidad || 2,
            habitaciones: cabin.habitaciones || 1,
            imagenes: imagenesCabin.length > 0 ? imagenesCabin : ["https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg"],
            comodidades: comodidadesCabin.length > 0 ? comodidadesCabin : ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"],
            // Información adicional de la API
            idSede: cabin.idSede,
            idTipoCabana: cabin.idTipoCabana,
            precio: cabin.precio,
            descripcionCompleta: cabin.descripcion,
            estado: cabin.estado
          };
        });

        // Transformar datos de servicios
        const transformedServices = servicesData.map(service => ({
          name: service.nombreServicio,
          img: service.imagen || "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg",
          description: service.descripcion || "Servicio de calidad para tu comodidad.",
          price: `$${(service.precioServicio || 0).toLocaleString()} COP`
        }));

        setCabañas(transformedCabins);
        setPaquetes(transformedServices);
        setSedes(sedesData);
        setTiposCabanas(tiposData);
        setComodidades(comodidadesData);
        setCabanaComodidades(cabanaComodidadesData);
        setImagenes(imagenesData);
        setDataError(null);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setDataError('Error al cargar los datos. Mostrando información de ejemplo.');
        // Datos de ejemplo en caso de error
        setCabañas(getDefaultCabins());
        setPaquetes(getDefaultPackages());
        setSedes(getDefaultSedes());
        setTiposCabanas([]);
        setComodidades([]);
        setCabanaComodidades([]);
        setImagenes([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Funciones auxiliares para transformar datos
  const getSedeNombre = (idSede, sedesData) => {
    const sede = sedesData.find(s => s.idSede === idSede);
    return sede ? sede.nombreSede : "Sede Principal";
  };

  // Datos por defecto en caso de error
  const getDefaultCabins = () => [
    {
      id: 101,
      name: "Cabaña Ambar Room",
      description: "Amplia cabaña con jacuzzi privado. Ideal para parejas que buscan privacidad y lujo.",
      img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
      price: "$395.000 COP/noche",
      precioNumerico: 395000,
      sede: "Copacabana",
      tipo: "Premium",
      capacidad: 2,
      habitaciones: 1,
      imagenes: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img2_dfakst.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img3_lnpt77.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575208/img4_snjxn5.jpg"
      ],
      comodidades: ["Jacuzzi Privado", "Baño Privado", "Mini Bar", "Malla Catamarán", "BBQ a Gas", "Desayuno incluido", "Estacionamiento privado"],
      estado: true
    }
  ];

  const getDefaultPackages = () => [
    {
      name: "Kit de Asado",
      img: "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg",
      description: "Perfecto para una noche especial, este kit incluye un jugoso corte de carne acompañado de papas doradas y crujientes.",
      price: "$150.000 COP",
    }
  ];

  const getDefaultSedes = () => [
    {
      idSede: 1,
      nombreSede: "Copacabana",
      descripcion: "Disfruta de una experiencia única en nuestras cabañas premium ubicadas en Copacabana.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575223/img1_x2yzaj.jpg"
      ],
      cabañasCount: 4
    },
    {
      idSede: 2,
      nombreSede: "San Felix",
      descripcion: "Vive momentos inolvidables en San Felix, donde la tranquilidad y el confort se fusionan.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg",
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575322/img1_r6txan.jpg"
      ],
      cabañasCount: 7
    },
    {
      idSede: 3,
      nombreSede: "Cerro de las Cruces",
      descripcion: "Experimenta la magia de la montaña en nuestras cabañas con vistas espectaculares.",
      images: [
        "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575279/img1_nmydmr.jpg"
      ],
      cabañasCount: 0
    }
  ];

  // Transformar sedes para la galería - TODAS LAS SEDES
  const sedesParaGaleria = useMemo(() => {
    const sedesTransformadas = sedes.map(sede => ({
      id: sede.idSede,
      name: sede.nombreSede,
      description: sede.descripcion || `Disfruta de nuestras cabañas en ${sede.nombreSede}`,
      cabañasCount: cabañas.filter(c => c.idSede === sede.idSede).length,
      images: sede.images || ["https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg"],
      cabañas: cabañas.filter(c => c.idSede === sede.idSede) // Agregar las cabañas de cada sede
    }));
    
    return sedesTransformadas;
  }, [sedes, cabañas]);

  // Obtener opciones únicas para filtros desde la API
  const sedesUnicas = useMemo(() => {
    if (sedes && sedes.length > 0) {
      return sedes.map(sede => ({
        id: sede.idSede,
        nombre: sede.nombreSede
      }));
    }
    return [];
  }, [sedes]);

  const tiposUnicos = useMemo(() => {
    if (tiposCabanas && tiposCabanas.length > 0) {
      return tiposCabanas.map(tipo => ({
        id: tipo.idTipoCabana,
        nombre: tipo.nombreTipoCabana
      }));
    }
    return [];
  }, [tiposCabanas]);

  const capacidadesUnicas = useMemo(() => {
    return [...new Set(cabañas.map(cabin => cabin.capacidad))].sort((a, b) => a - b).filter(Boolean);
  }, [cabañas]);

  // Función para filtrar cabañas
  const cabañasFiltradas = cabañas.filter(cabin => {
    const coincideSede = !filtroSede || cabin.idSede === parseInt(filtroSede);
    const coincideTipo = !filtroTipo || cabin.idTipoCabana === parseInt(filtroTipo);
    const coincideCapacidad = !filtroCapacidad || cabin.capacidad >= parseInt(filtroCapacidad);
   
    return coincideSede && coincideTipo && coincideCapacidad;
  });

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroSede("");
    setFiltroTipo("");
    setFiltroCapacidad("");
    setCurrentCabinPage(1);
  };

  // Función para manejar cambio de imagen en el popup
  const nextImage = () => {
    if (selectedCabin) {
      setCabinImageIndex((prev) =>
        prev === selectedCabin.imagenes.length - 1 ? 0 : prev + 1
      );
    }
    if (selectedSede) {
      setSedeImageIndex((prev) =>
        prev === selectedSede.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedCabin) {
      setCabinImageIndex((prev) =>
        prev === 0 ? selectedCabin.imagenes.length - 1 : prev - 1
      );
    }
    if (selectedSede) {
      setSedeImageIndex((prev) =>
        prev === 0 ? selectedSede.images.length - 1 : prev - 1
      );
    }
  };

  // Efecto para mostrar el botón de scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para verificar autenticación al cargar
  useEffect(() => {
    const user = getUser();

    if (!user) return;

    if (window.location.pathname === "/home" && user.rol === "Cliente") return;
    if (window.location.pathname === "/dashboard" && user.rol === "Admin") return;

    if (user.rol === "Cliente") {
      navigate("/home", { replace: true });
    } else if (user.rol === "Admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Verificar estado del servidor al cargar el componente
  useEffect(() => {
    const checkServerStatus = async () => {
      const online = await checkServerConnection();
      setIsServerOnline(online);
    };
   
    checkServerStatus();
  }, []);

  // Función para scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Función para manejar clics en enlaces del footer
  const handleFooterLinkClick = (action) => {
    action();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Función para abrir enlaces de redes sociales en nueva ventana
  const handleSocialMediaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showAlert = (title, text, icon, timer = 3000) => {
    Swal.fire({
      title,
      text,
      icon,
      timer,
      timerProgressBar: true,
      showConfirmButton: icon === 'error',
      confirmButtonColor: '#2E5939',
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#2E5939',
      background: '#fff',
      color: '#2E3A30',
    });
  };

  const handleShowLogin = () => {
    setIsRegisterActive(false);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setErrors({});
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleShowRegister = () => {
    setIsRegisterActive(true);
    setShowForm(true);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setErrors({});
    setTipoDocumento("Cédula de Ciudadanía");
    setNumeroDocumento("");
    setFirstName("");
    setLastName("");
    setCelular("");
    setFechaNacimiento("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
  };

  const handleShowLanding = () => {
    setShowForm(false);
    setShowAboutUs(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowAllCabins(false);
    setShowAllServices(false);
  };

  const handleShowAboutUs = () => {
    setShowAboutUs(true);
    setShowForm(false);
    setShowCabins(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowAllCabins(false);
    setShowAllServices(false);
  };

  const handleShowDetails = (paquete) => {
    setSelectedPackage(paquete);
    setShowPopup(true);
  };

  const handleShowCabinDetails = (cabin) => {
    setSelectedCabin(cabin);
    setCabinImageIndex(0);
    setShowPopup(true);
  };

  // Nueva función para mostrar galería de sede con cabañas
  const handleShowSedeGallery = (sede) => {
    setSelectedSede(sede);
    setSedeImageIndex(0);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPackage(null);
    setSelectedCabin(null);
    setSelectedSede(null);
    setCabinImageIndex(0);
    setSedeImageIndex(0);
  };

  const handleReserveCabin = () => {
    setShowPopup(false);
    handleShowLogin();
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % cabañas.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + cabañas.length) % cabañas.length);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/;
    return nameRegex.test(name);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9+]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const isValidDate = (date) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate < today;
  };

  // NUEVA FUNCIÓN: Manejar olvidé contraseña
  const handleForgotPassword = () => {
    if (!loginEmail) {
      showErrorAlert('Correo requerido', 'Por favor ingresa tu correo electrónico para recuperar tu contraseña');
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showErrorAlert('Correo inválido', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    setForgotPasswordEmail(loginEmail);
    setShowForgotPassword(true);
    setShowForm(false);

    forgotPassword(loginEmail)
      .then(result => {
        if (result && result.exito) {
          showSuccessAlert('Código enviado', result.mensaje || 'Se ha enviado un código de verificación a tu correo electrónico');
        } else {
          showErrorAlert('Error', result?.mensaje || 'No se pudo enviar el código de recuperación');
        }
      })
      .catch(error => {
        console.error('❌ Error en olvidó contraseña:', error);
        showErrorAlert('Error', error.message || 'No se pudo enviar el código de recuperación. Intenta más tarde.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // NUEVA FUNCIÓN: Verificar código de recuperación
  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
   
    if (!resetPasswordCode) {
      showErrorAlert('Código requerido', 'Por favor ingresa el código de verificación');
      return;
    }

    setIsLoading(true);

    try {
      setShowResetPassword(true);
      setShowForgotPassword(false);
      showSuccessAlert('Código aceptado', 'Ahora puedes establecer tu nueva contraseña');
    } catch (error) {
      console.error('Error verificando código:', error);
      showErrorAlert('Error', 'El código de verificación es incorrecto o ha expirado');
    } finally {
      setIsLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Restablecer contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
   
    if (!newPassword || !confirmNewPassword) {
      showErrorAlert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      showErrorAlert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showErrorAlert('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(forgotPasswordEmail, resetPasswordCode, newPassword);
     
      if (result) {
        showSuccessAlert('Contraseña restablecida', 'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión.');
       
        setTimeout(() => {
          setShowResetPassword(false);
          setShowForm(true);
          setIsRegisterActive(false);
          setResetPasswordCode("");
          setNewPassword("");
          setConfirmNewPassword("");
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error restableciendo contraseña:', error);
      showErrorAlert('Error', error.message || 'No se pudo restablecer la contraseña. Verifica el código e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFICADA: Función de Login - MEJORADA para guardar todos los campos
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
   
    if (!isServerOnline) {
      showErrorAlert(
        'Servidor no disponible',
        'El servidor no está disponible. Verifica que el backend esté corriendo en https://www.bosquesagrado.somee.com'
      );
      return;
    }

    setIsLoading(true);

    if (!loginEmail || !loginPassword) {
      showErrorAlert('Campos requeridos', 'Por favor ingresa tu correo electrónico y contraseña');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(loginEmail)) {
      showErrorAlert('Correo inválido', 'Por favor ingresa un correo electrónico válido');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Iniciando proceso de login para:', loginEmail);
      const loginResult = await loginWithAPI(loginEmail, loginPassword);
     
      if (loginResult && loginResult.exito && loginResult.usuario) {
        const user = loginResult.usuario;
        console.log("👤 Usuario logueado:", user);

        // Consultar el usuario completo desde la BD para obtener TODOS los campos
        const userFromDB = await findUserInList(user.correo);

        if (!userFromDB) {
          throw new Error('Usuario no encontrado en la base de datos');
        }

        // Obtener información del rol
        const roleInfo = await getUserRoleInfo(userFromDB.idRol);
       
        // Determinar el rol basado en idRol
        let rol = "Cliente"; // Por defecto
        let nombreRol = "Cliente";
       
        if (userFromDB.idRol === 1) {
          rol = "Admin";
          nombreRol = roleInfo?.nombreRol || "Administrador";
        } else if (userFromDB.idRol === 2) {
          rol = "Cliente";
          nombreRol = roleInfo?.nombreRol || "Cliente";
        }

        console.log("🎯 Rol del usuario:", { idRol: userFromDB.idRol, rol, nombreRol });
        console.log("📋 Datos completos del usuario desde BD:", userFromDB);

        // CORREGIDO: Guardar usuario en localStorage con TODOS los campos necesarios
        const userToSave = {
          // Datos del login
          ...user,
          // Datos completos de la BD (incluye tipoDocumento, numeroDocumento, celular, etc.)
          ...userFromDB,
          // Información del rol
          rol,
          nombreRol,
          idRol: userFromDB.idRol
        };

        saveUser(userToSave);

        // Verificar que se guardó correctamente
        const savedUser = getUser();
        console.log('✅ Usuario guardado en localStorage:', savedUser);

        // Enviar código de verificación
        const verificationResult = await sendVerificationCode(loginEmail);
       
        // MOSTRAR PANTALLA DE VERIFICACIÓN INMEDIATAMENTE
        console.log('🔄 Activando pantalla de verificación...');
        setUserEmail(loginEmail);
        setShowVerification(true);
        setShowForm(false);
        setShowAboutUs(false);
        setShowCabins(false);
        setShowForgotPassword(false);
        setShowResetPassword(false);
       
        console.log('📱 Estado actual - showVerification:', true);
        console.log('📧 Email guardado para verificación:', loginEmail);
       
        if (verificationResult && verificationResult.exito) {
          showSuccessAlert('Código enviado', 'Se ha enviado un código de verificación a tu correo electrónico');
        } else {
          showAlert(
            'Revisa tu correo',
            'El código podría haberse enviado. Por favor revisa tu bandeja de entrada y spam.',
            'info',
            5000
          );
        }
       
      } else {
        showErrorAlert('Error en el login', loginResult?.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('❌ Error durante el login:', error);
     
      if (error.message.includes('No se pudo encontrar') ||
          error.message.includes('no existe') ||
          error.message.includes('no registrado')) {
        showErrorAlert('Usuario no encontrado', 'No existe una cuenta con este correo electrónico.');
      } else if (error.message.includes('contraseña') ||
                 error.message.includes('credenciales') ||
                 error.message.includes('clave') ||
                 error.message.includes('Password')) {
        showErrorAlert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
      } else if (error.message.includes('inactivo') ||
                 error.message.includes('desactivada')) {
        showErrorAlert('Cuenta inactiva', 'Tu cuenta está desactivada. Contacta al administrador.');
      } else {
        showErrorAlert('Error de conexión', error.message || 'No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN CORREGIDA: Manejar verificación de código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
   
    if (!verificationCode) {
      showErrorAlert('Código requerido', 'Por favor ingresa el código de verificación');
      return;
    }

    if (verificationCode.length !== 6) {
      showErrorAlert('Código inválido', 'El código debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Verificando código:', verificationCode, 'para:', userEmail);
     
      const verificationResult = await verifyCode(userEmail, verificationCode);
     
      console.log('📊 Resultado completo de verificación:', verificationResult);
     
      // MODIFICACIÓN CLAVE: Verificar si la verificación fue exitosa
      const isSuccess = verificationResult && verificationResult.exito;
     
      if (isSuccess) {
        console.log('✅ Verificación exitosa');
       
        // Obtener el usuario actual
        const currentUser = getUser();
       
        if (currentUser) {
          // Mensaje y redirección según rol
          if (currentUser.rol === "Admin") {
            showSuccessAlert('Inicio de sesión', `¡Bienvenido Administrador ${currentUser.nombre || ''}!`);
            navigate("/dashboard");
          } else {
            showSuccessAlert('Inicio de sesión', `¡Bienvenido ${currentUser.nombre || ''}!`);
            navigate("/home");
          }
        } else {
          showErrorAlert('Error', 'No se pudo obtener la información del usuario');
        }
      } else {
        // Si la verificación falla
        console.error('❌ Verificación fallida:', verificationResult);
        const errorMessage = verificationResult?.mensaje || 'El código de verificación es incorrecto o ha expirado.';
        showErrorAlert('Código incorrecto', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error en verificación:', error);
      showErrorAlert('Error de verificación', error.message || 'No se pudo verificar el código. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función de Registro
  const validateRegisterForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!numeroDocumento) {
      newErrors.numeroDocumento = "El número de documento es obligatorio.";
      isValid = false;
    }

    if (!firstName) {
      newErrors.firstName = "El nombre es obligatorio.";
      isValid = false;
    } else if (!isValidName(firstName)) {
      newErrors.firstName = "El nombre solo debe contener letras y espacios.";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    } else if (!isValidName(lastName)) {
      newErrors.lastName = "El apellido solo debe contener letras y espacios.";
      isValid = false;
    }

    if (!celular) {
      newErrors.celular = "El número de celular es obligatorio.";
      isValid = false;
    } else if (!isValidPhone(celular)) {
      newErrors.celular = "Formato de celular inválido. Debe contener 10-15 dígitos.";
      isValid = false;
    }

    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
      isValid = false;
    } else if (!isValidDate(fechaNacimiento)) {
      newErrors.fechaNacimiento = "La fecha de nacimiento debe ser una fecha válida en el pasado.";
      isValid = false;
    }

    if (!registerEmail) {
      newErrors.registerEmail = "El correo electrónico es obligatorio.";
      isValid = false;
    } else if (!isValidEmail(registerEmail)) {
      newErrors.registerEmail = "Formato de correo electrónico inválido.";
      isValid = false;
    }

    if (!registerPassword) {
      newErrors.registerPassword = "La contraseña es obligatoria.";
      isValid = false;
    } else if (registerPassword.length < 6) {
      newErrors.registerPassword = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña es obligatorio.";
      isValid = false;
    } else if (registerPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateRegisterForm()) {
      showErrorAlert('Error en el formulario', 'Por favor corrige los errores marcados en el formulario');
      return;
    }

    if (!isServerOnline) {
      showErrorAlert(
        'Servidor no disponible',
        'El servidor de registro no está disponible. Por favor:\n\n' +
        '1. Verifica que el backend .NET esté corriendo\n' +
        '2. Asegúrate de que esté en el puerto 5272\n' +
        '3. Intenta nuevamente en unos momentos'
      );
      return;
    }

    setIsLoading(true);
 
    try {
      const userData = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento.trim(),
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        celular: celular.trim(),
        fechaNacimiento: fechaNacimiento,
        correo: registerEmail.trim(),
        contrasena: registerPassword,
        idRol: 2,
        estado: true
      };

      const result = await registerWithAPI(userData);
   
      if (result) {
        showSuccessAlert('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.');
     
        setTimeout(() => {
          handleShowLogin();
        }, 2000);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showErrorAlert('Error en el registro', error.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/g, ''));
  };

  const handleDocumentNumberChange = (e) => {
    const value = e.target.value;
    setNumeroDocumento(value.replace(/[^a-zA-Z0-9]/g, ''));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setCelular(value.replace(/[^0-9+]/g, ''));
  };

  // Lógica de paginación para sedes
  const sedesPaginadas = useMemo(() => {
    const startIndex = (currentSedePage - 1) * sedesPerPage;
    return sedesParaGaleria.slice(startIndex, startIndex + sedesPerPage);
  }, [sedesParaGaleria, currentSedePage]);

  const totalSedePages = Math.ceil(sedesParaGaleria.length / sedesPerPage);

  // Lógica para mostrar cabañas (6 iniciales, luego todas)
  const cabañasParaMostrar = useMemo(() => {
    if (showAllCabins) {
      return cabañasFiltradas;
    }
    return cabañasFiltradas.slice(0, 6);
  }, [cabañasFiltradas, showAllCabins]);

  // Lógica para mostrar servicios (6 iniciales, luego todas)
  const serviciosParaMostrar = useMemo(() => {
    if (showAllServices) {
      return paquetes;
    }
    return paquetes.slice(0, 6);
  }, [paquetes, showAllServices]);

  // Componente de paginación
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem', 
        marginTop: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#2E5939',
            color: currentPage === 1 ? '#666' : '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <FaChevronLeft />
        </button>
        
        <span style={{ 
          color: '#2E5939', 
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#2E5939',
            color: currentPage === totalPages ? '#666' : '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  // Imagen de fondo para formularios
  const backgroundImage = "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* NAV - SIN MARGENES */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgba(46, 89, 57, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "15px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          margin: 0,
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowLanding)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowAboutUs)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Quienes Somos
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowLogin)}
              style={{
                cursor: "pointer",
                color: "#E8F5E9",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "10px 15px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              Iniciar Sesión
            </a>
          </li>
          <li>
            <a
              onClick={() => handleFooterLinkClick(handleShowRegister)}
              style={{
                cursor: "pointer",
                backgroundColor: "#E8F5E9",
                color: "#2E5939",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                padding: "12px 25px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(232, 245, 233, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(232, 245, 233, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(232, 245, 233, 0.3)";
              }}
            >
              Registrarse
            </a>
          </li>
        </ul>
      </nav>

      {/* Indicador de estado del servidor */}
      {!isServerOnline && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#ff6b6b",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          ⚠️ El servidor no está disponible. Verifica que el backend esté corriendo en https://www.bosquesagrado.somee.com
        </div>
      )}

      {/* Indicador de carga de datos */}
      {loading && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#2E5939",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          📡 Cargando datos desde la API...
        </div>
      )}

      {/* Indicador de error de datos */}
      {dataError && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          backgroundColor: "#ff9800",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: 999,
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          ⚠️ {dataError}
        </div>
      )}

      {/* MAIN CONTENT - SIN MARGENES */}
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#f8faf8",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        width: "100%",
      }}>
        <main style={{ 
          width: "100%", 
          margin: 0, 
          padding: 0, 
          overflowX: "hidden",
          backgroundColor: "#f8faf8"
        }}>
         
          {/* POPUPS */}
          {showPopup && selectedPackage && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "500px",
                  width: "90%",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1rem" }}>{selectedPackage.name}</h2>
                <img
                  src={selectedPackage.img}
                  alt={selectedPackage.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>{selectedPackage.description}</p>
                <h4 style={{ color: "#3E7E5C", textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
                  Precio: {selectedPackage.price}
                </h4>
                <button
                  onClick={handleClosePopup}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {showPopup && selectedCabin && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "800px",
                  width: "90%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1.5rem" }}>{selectedCabin.name}</h2>
               
                {/* Carrusel de imágenes */}
                <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <img
                    src={selectedCabin.imagenes[cabinImageIndex]}
                    alt={selectedCabin.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                    }}
                  />
                  {selectedCabin.imagenes.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          color: "#2E5939",
                          fontSize: "1.5rem",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaChevronRight />
                      </button>
                      <div style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "0.5rem",
                      }}>
                        {selectedCabin.imagenes.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: index === cabinImageIndex ? "#2E5939" : "rgba(255,255,255,0.5)",
                              cursor: "pointer",
                            }}
                            onClick={() => setCabinImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Información detallada - MEJORADA */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaMapMarkerAlt /> {selectedCabin.sede}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaHome /> {selectedCabin.tipo}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaUsers /> {selectedCabin.capacidad} personas
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63" }}>
                        <FaBed /> {selectedCabin.habitaciones} habitación{selectedCabin.habitaciones > 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                 
                  <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>
                    {selectedCabin.descripcionCompleta || selectedCabin.description}
                  </p>

                  {/* Comodidades desde la API - MEJORADO */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ color: "#2E5939", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaChair /> Comodidades:
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {selectedCabin.comodidades && selectedCabin.comodidades.map((comodidad, index) => (
                        <span
                          key={index}
                          style={comodidadTagStyle}
                        >
                          <FaChair size={10} /> {comodidad}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Información de imágenes */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ color: "#2E5939", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaImage /> Galería de Imágenes:
                    </h4>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
                      gap: "0.5rem",
                      marginTop: "0.5rem"
                    }}>
                      {selectedCabin.imagenes.slice(0, 6).map((imagen, index) => (
                        <img
                          key={index}
                          src={imagen}
                          alt={`${selectedCabin.name} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => setCabinImageIndex(index)}
                          onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <h4 style={{ 
                  color: "#3E7E5C", 
                  textAlign: "center", 
                  fontSize: "1.8rem", 
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <FaDollarSign /> Precio: {selectedCabin.price}
                </h4>
               
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={handleReserveCabin}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      backgroundColor: "#2E5939",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Reservar
                  </button>
                  <button
                    onClick={handleClosePopup}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      backgroundColor: "#e0e0e0",
                      color: "#333",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POPUP PARA GALERÍA DE SEDES - MODIFICADO PARA MOSTRAR CABAÑAS */}
          {showPopup && selectedSede && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
              onClick={handleClosePopup}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "15px",
                  maxWidth: "900px",
                  width: "90%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ color: "#2E5939", textAlign: "center", marginBottom: "1.5rem" }}>{selectedSede.name}</h2>
               
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#2E5939",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    color: "#fff",
                    fontSize: "2rem",
                    fontWeight: "bold"
                  }}>
                    {selectedSede.name.charAt(0)}
                  </div>
                  <h3 style={{ color: "#2E5939", marginBottom: "1rem" }}>{selectedSede.name}</h3>
                  <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1rem" }}>
                    {selectedSede.description}
                  </p>
                </div>

                <p style={{ lineHeight: "1.6", color: "#2E3A30", marginBottom: "1.5rem", textAlign: "center" }}>
                  {selectedSede.cabañasCount} cabaña{selectedSede.cabañasCount !== 1 ? 's' : ''} disponible{selectedSede.cabañasCount !== 1 ? 's' : ''}
                </p>

                {/* Mostrar cabañas de esta sede */}
                {selectedSede.cabañas && selectedSede.cabañas.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h4 style={{ 
                      color: "#2E5939", 
                      marginBottom: "1rem", 
                      textAlign: "center",
                      borderBottom: "2px solid #2E5939",
                      paddingBottom: "0.5rem"
                    }}>
                      Cabañas en {selectedSede.name}
                    </h4>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                      gap: "1rem",
                      maxHeight: "300px",
                      overflowY: "auto",
                      padding: "1rem",
                      backgroundColor: "#f8faf8",
                      borderRadius: "10px"
                    }}>
                      {selectedSede.cabañas.map((cabin, index) => (
                        <div
                          key={cabin.id}
                          style={{
                            backgroundColor: "#fff",
                            padding: "1rem",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease"
                          }}
                          onClick={() => {
                            setSelectedCabin(cabin);
                            setSelectedSede(null);
                            setCabinImageIndex(0);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <img
                              src={cabin.imagenes && cabin.imagenes.length > 0 ? cabin.imagenes[0] : cabin.img}
                              alt={cabin.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px"
                              }}
                              onError={(e) => {
                                e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                              }}
                            />
                            <div>
                              <h5 style={{ margin: "0 0 0.3rem 0", color: "#2E5939" }}>{cabin.name}</h5>
                              <p style={{ margin: "0", fontSize: "0.9rem", color: "#5D6D63" }}>
                                {cabin.capacidad} personas • {cabin.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSede.cabañasCount === 0 && (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "2rem", 
                    backgroundColor: "#f8faf8", 
                    borderRadius: "10px",
                    marginBottom: "1.5rem"
                  }}>
                    <p style={{ color: "#5D6D63", margin: 0 }}>
                      Actualmente no hay cabañas disponibles en esta sede.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleClosePopup}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "#2E5939",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  Cerrar Galería
                </button>
              </div>
            </div>
          )}

          {/* QUIENES SOMOS - MODIFICADO PARA MOSTRAR LOGO EN VEZ DE IMAGEN */}
          {showAboutUs && (
            <section style={{ 
              padding: "4rem 2rem", 
              backgroundColor: "#f8faf8", 
              margin: 0,
              width: "100%",
              boxSizing: "border-box"
            }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{
                  backgroundColor: "#fff",
                  padding: "3rem",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  marginBottom: "3rem"
                }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    marginBottom: "2rem",
                    textAlign: "center",
                    fontFamily: "Georgia, serif"
                  }}>
                    Nuestra Historia
                  </h2>
                  <div style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "1.5rem",color: "black" }}>
                        En <strong>Bosque Sagrado</strong>, creemos que la conexión con la naturaleza no debe estar reñida con el lujo y la comodidad. Somos un santuario de glamping ubicado en Antioquia, Colombia, dedicados a ofrecerte una escapada mágica.
                      </p>
                      <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color:"black" }}>
                        Nuestro objetivo es brindarte un refugio lejos del bullicio de la ciudad, un lugar para reconectar contigo mismo, con tu pareja o con tus seres queridos, rodeado de la belleza y la tranquilidad del entorno natural.
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado Logo"
                        style={{
                          width: "250px",
                          height: "250px",
                          borderRadius: "15px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <div style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2.5rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
                  }}>
                    <FaLightbulb size={60} color="#3E7E5C" style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>Nuestra Misión</h3>
                    <p style={{ color: "#000000ff", fontSize: "1.2rem" }}>Ofrecer una experiencia de glamping inolvidable, combinando el lujo y la comodidad con la serenidad de la naturaleza.</p>
                  </div>
                  <div style={{
                    flex: 1,
                    minWidth: "280px",
                    backgroundColor: "#fff",
                    padding: "2.5rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
                  }}>
                    <FaEye size={60} color="#3E7E5C" style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontSize: "1.8rem", color: "#2E5939", marginBottom: "1rem" }}>Nuestra Visión</h3>
                    <p style={{ color: "#000000ff", fontSize: "1.2rem" }}>Convertirnos en el destino de glamping líder en Colombia, reconocidos por nuestra excelencia en el servicio y la sostenibilidad.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VERIFICACIÓN DE CÓDIGO PARA LOGIN */}
          {showVerification && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              width: "100%",
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleVerifyCode}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Verifica tu identidad</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Por seguridad, hemos enviado un código a:</p>
                    <p style={{ color: "#3E7E5C", margin: "0.5rem 0 0", fontWeight: "500", fontSize: "1.1rem" }}>{userEmail}</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                      Código de verificación
                    </label>
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem", transition: "border-color 0.3s ease" }}>
                      <FaCheck style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Ingresa el código de 6 dígitos"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1.1rem", letterSpacing: "2px" }}
                        maxLength={6}
                      />
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "#5D6D63", textAlign: "center" }}>
                      Revisa tu bandeja de entrada y spam
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Verificando..." : "Verificar Código"}
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#5D6D63", fontSize: "0.9rem" }}>
                      ¿No recibiste el código?{" "}
                      <span
                        style={{
                          color: "#2E5939",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                        onClick={async () => {
                          try {
                            await sendVerificationCode(userEmail);
                            showSuccessAlert('Código reenviado', 'Se ha enviado un nuevo código a tu correo electrónico');
                          } catch (error) {
                            showErrorAlert('Error', 'No se pudo reenviar el código. Intenta más tarde.');
                          }
                        }}
                      >
                        Reenviar código
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVerification(false);
                      setShowForm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    Volver al Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FORMULARIO OLVIDÓ CONTRASEÑA - INGRESAR CÓDIGO */}
          {showForgotPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              width: "100%",
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleVerifyResetCode}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Verificar Código</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa el código enviado a tu correo</p>
                    <p style={{ color: "#3E7E5C", margin: "0.5rem 0 0", fontWeight: "500" }}>{forgotPasswordEmail}</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                      <FaCheck style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="text"
                        placeholder="Código de verificación"
                        required
                        value={resetPasswordCode}
                        onChange={(e) => setResetPasswordCode(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Verificando..." : "Verificar Código"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowForm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Volver al Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FORMULARIO RESTABLECER CONTRASEÑA */}
          {showResetPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              width: "100%",
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
              }}>
                <form onSubmit={handleResetPassword}>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      <img
                        src="/images/Logo.png"
                        alt="Bosque Sagrado"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Nueva Contraseña</h3>
                    <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa tu nueva contraseña</p>
                  </div>
                 
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                      <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                      <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                      <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      backgroundColor: isLoading ? "#7a9c87" : "#2E5939",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "12px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setShowForgotPassword(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      backgroundColor: "transparent",
                      color: "#2E5939",
                      fontWeight: "600",
                      border: "2px solid #2E5939",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Volver Atrás
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FORMULARIOS DE LOGIN Y REGISTRO */}
          {showForm && !showVerification && !showForgotPassword && !showResetPassword && (
            <div style={{
              padding: "4rem 2rem",
              background: `linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              width: "100%",
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: isRegisterActive ? "500px" : "450px"
              }}>
               
                {!isRegisterActive ? (
                  // LOGIN FORM
                  <form onSubmit={handleLoginSubmit}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                        <img
                          src="/images/Logo.png"
                          alt="Bosque Sagrado"
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Bienvenido de Nuevo</h3>
                      <p style={{ color: "#5D6D63", margin: 0 }}>Ingresa a tu cuenta para continuar</p>
                    </div>
                   
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                        <FaEnvelope style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="email"
                          placeholder="Correo electrónico"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                        <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="password"
                          placeholder="Contraseña"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>
                    </div>

                    {/* Olvidé contraseña */}
                    <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                      <span
                        style={{
                          color: "#2E5939",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                        onClick={handleForgotPassword}
                      >
                        ¿Olvidaste tu contraseña?
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isServerOnline}
                      style={{
                        width: "100%",
                        padding: "1.2rem",
                        backgroundColor: isLoading || !isServerOnline ? "#7a9c87" : "#2E5939",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "12px",
                        cursor: isLoading || !isServerOnline ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                    </button>

                    {!isServerOnline && (
                      <div style={{
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                      }}>
                        <p style={{ color: "#856404", margin: 0, fontSize: "0.9rem" }}>
                          ⚠️ El servidor no está disponible. Verifica que el backend esté corriendo.
                        </p>
                      </div>
                    )}

                    <p style={{ textAlign: "center", color: "#5D6D63" }}>
                      ¿No tienes cuenta?{" "}
                      <span style={{ color: "#2E5939", fontWeight: "600", cursor: "pointer" }} onClick={handleShowRegister}>
                        Regístrate aquí
                      </span>
                    </p>
                  </form>
                ) : (
                  // REGISTER FORM - 2 COLUMNAS
                  <form onSubmit={handleRegisterSubmit}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                        <img
                          src="/images/Logo.png"
                          alt="Bosque Sagrado"
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <h3 style={{ marginBottom: "0.5rem", color: "#2E5939", fontSize: "2rem", fontFamily: "'Playfair Display', serif" }}>Únete a Nosotros</h3>
                      <p style={{ color: "#5D6D63", margin: 0 }}>Crea tu cuenta y comienza tu aventura</p>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                      {/* Fila 1: Tipo Documento y Número Documento */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaIdCard style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <select
                              value={tipoDocumento}
                              onChange={(e) => setTipoDocumento(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem", background: "transparent" }}
                            >
                              {tiposDocumento.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaIdCard style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Número Documento"
                              required
                              value={numeroDocumento}
                              onChange={handleDocumentNumberChange}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fila 2: Nombre y Apellido */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaUser style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Nombre"
                              required
                              value={firstName}
                              onChange={(e) => handleTextInputChange(e, setFirstName)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaUser style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Apellido"
                              required
                              value={lastName}
                              onChange={(e) => handleTextInputChange(e, setLastName)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fila 3: Celular y Fecha Nacimiento */}
                      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaPhone style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="text"
                              placeholder="Celular"
                              required
                              value={celular}
                              onChange={handlePhoneChange}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaCalendarAlt style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="date"
                              required
                              value={fechaNacimiento}
                              onChange={(e) => setFechaNacimiento(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
                        <FaEnvelope style={{ marginRight: "12px", color: "#3E7E5C" }} />
                        <input
                          type="email"
                          placeholder="Correo electrónico"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                        />
                      </div>

                      {/* Fila 4: Contraseña y Confirmar Contraseña */}
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="password"
                              placeholder="Contraseña"
                              required
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", padding: "1rem", borderRadius: "12px" }}>
                            <FaLock style={{ marginRight: "12px", color: "#3E7E5C" }} />
                            <input
                              type="password"
                              placeholder="Confirmar Contraseña"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isServerOnline && (
                      <div style={{
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                      }}>
                        <p style={{ color: "#856404", margin: 0, fontSize: "0.9rem" }}>
                          ⚠️ El servidor no está disponible. No podrás registrarte hasta que el backend esté corriendo.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !isServerOnline}
                      style={{
                        width: "100%",
                        padding: "1.2rem",
                        backgroundColor: isLoading || !isServerOnline ? "#7a9c87" : "#2E5939",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "12px",
                        cursor: isLoading || !isServerOnline ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
                    </button>

                    <p style={{ textAlign: "center", color: "#5D6D63" }}>
                      ¿Ya tienes cuenta?{" "}
                      <span style={{ color: "#2E5939", fontWeight: "600", cursor: "pointer" }} onClick={handleShowLogin}>
                        Inicia sesión aquí
                      </span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* LANDING PAGE ACTUALIZADA CON DATOS DE LA API */}
          {!showForm && !showAboutUs && !showCabins && !showVerification && !showForgotPassword && !showResetPassword && (
            <>
              {/* HERO SECTION - SIN ESPACIOS BLANCOS */}
              <section
                style={{
                  width: "100%",
                  height: "90vh",
                  background: "linear-gradient(135deg, rgba(46, 89, 57, 0.9) 0%, rgba(62, 126, 92, 0.8) 100%), url('https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#fff",
                  padding: "0",
                  margin: "0",
                  position: "relative",
                }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "2rem"
                  }}>
                    <img
                      src="/images/Logo.png"
                      alt="Bosque Sagrado"
                      style={{
                        width: "120px",
                        height: "120px",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                      }}
                    />
                  </div>
                  <h1 style={{
                    fontSize: "4.5rem",
                    marginBottom: "1rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: "700",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
                  }}>
                    Bosque Sagrado
                  </h1>
                  <p style={{ fontSize: "1.8rem", marginBottom: "2rem", textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}>
                    Donde el lujo se encuentra con la naturaleza
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <button
                    onClick={handleShowRegister}
                    style={{
                      backgroundColor: "#E8F5E9",
                      color: "#2E5939",
                      border: "none",
                      padding: "18px 35px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    Descubre la Magia
                  </button>
                  <button
                    onClick={handleShowAboutUs}
                    style={{
                      backgroundColor: "transparent",
                      color: "#E8F5E9",
                      border: "2px solid #E8F5E9",
                      padding: "18px 35px",
                      borderRadius: "30px",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    Nuestra Historia
                  </button>
                </div>
              </section>

              {/* NUEVA SECCIÓN EXCLUSIVA CON IMAGEN DE FONDO COMPLETA */}
              <section
                style={{
                  width: "100%",
                  height: "70vh",
                  backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  margin: 0,
                  padding: 0,
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(46, 89, 57, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{
                    textAlign: "center",
                    color: "#fff",
                    maxWidth: "800px",
                    padding: "2rem",
                  }}>
                    <h2 style={{
                      fontSize: "3.5rem",
                      marginBottom: "1.5rem",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: "700",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
                    }}>
                      Vive una Experiencia Única
                    </h2>
                    <p style={{
                      fontSize: "1.5rem",
                      marginBottom: "2.5rem",
                      lineHeight: "1.6",
                      textShadow: "1px 1px 4px rgba(0,0,0,0.5)"
                    }}>
                      Descubre la magia de conectar con la naturaleza sin sacrificar el confort. 
                      Nuestras cabañas premium te ofrecen el equilibrio perfecto entre lujo y aventura.
                    </p>
                    <button
                      onClick={handleShowRegister}
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E5939",
                        border: "none",
                        padding: "18px 35px",
                        borderRadius: "30px",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                      }}
                    >
                      Reserva Ahora
                    </button>
                  </div>
                </div>
              </section>

              {/* SEDES - 3 SEDES POR PÁGINA CON PAGINACIÓN */}
              {sedesParaGaleria.length > 0 && (
                <section style={{ 
                  padding: "5rem 2rem", 
                  backgroundColor: "#fff", 
                  margin: 0,
                  width: "100%",
                  boxSizing: "border-box"
                }}>
                  <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h2 style={{
                      fontSize: "3rem",
                      color: "#2E5939",
                      textAlign: "center",
                      marginBottom: "3rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Nuestras Sedes
                    </h2>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "2rem",
                      justifyContent: "center"
                    }}>
                      {sedesPaginadas.map((sede, index) => (
                        <div
                          key={sede.id}
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            overflow: "hidden",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                            width: "100%",
                            maxWidth: "350px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            margin: "0 auto",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                          }}
                        >
                          <div style={{
                            backgroundColor: "#2E5939",
                            padding: "2rem 1.5rem",
                            textAlign: "center",
                            color: "#fff"
                          }}>
                            <div style={{
                              width: "60px",
                              height: "60px",
                              backgroundColor: "#E8F5E9",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 1rem",
                              color: "#2E5939",
                              fontSize: "1.5rem",
                              fontWeight: "bold"
                            }}>
                              {sede.name.charAt(0)}
                            </div>
                            <h3 style={{
                              margin: "0",
                              fontSize: "1.5rem",
                              textAlign: "center"
                            }}>
                              {sede.name}
                            </h3>
                          </div>
                          <div style={{ padding: "1.5rem" }}>
                            <p style={{
                              color: "#5D6D63",
                              marginBottom: "1.5rem",
                              lineHeight: "1.5",
                              textAlign: "center",
                              fontSize: "0.95rem"
                            }}>
                              {sede.description}
                            </p>
                            <div style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "1rem",
                              marginBottom: "1.5rem"
                            }}>
                              <span style={{
                                backgroundColor: "#E8F5E9",
                                color: "#2E5939",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "15px",
                                fontWeight: "600",
                                fontSize: "0.85rem"
                              }}>
                                {sede.cabañasCount} cabaña{sede.cabañasCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div style={{
                              display: "flex",
                              justifyContent: "center"
                            }}>
                              <button
                                onClick={() => handleShowSedeGallery(sede)}
                                style={{
                                  backgroundColor: "#2E5939",
                                  color: "#fff",
                                  border: "none",
                                  padding: "10px 20px",
                                  borderRadius: "20px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                Ver Detalles
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginación para sedes - SOLO SI HAY MÁS DE 3 SEDES */}
                    {sedesParaGaleria.length > sedesPerPage && (
                      <Pagination
                        currentPage={currentSedePage}
                        totalPages={totalSedePages}
                        onPageChange={setCurrentSedePage}
                      />
                    )}
                  </div>
                </section>
              )}

              {/* TODAS NUESTRAS CABAÑAS CON FILTROS - MEJORADO */}
              <section style={{ 
                padding: "3rem 2rem", 
                backgroundColor: "#f8faf8", 
                margin: 0,
                width: "100%",
                boxSizing: "border-box"
              }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "2rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Todas Nuestras Cabañas
                  </h2>
                 
                  <div style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    marginBottom: "2rem"
                  }}>
                    <h3 style={{ color: "#2E5939", marginBottom: "1.5rem", textAlign: "center" }}>
                      Encuentra tu Cabaña Ideal
                    </h3>
                   
                    {/* Filtros desde la API - CORREGIDOS Y MEJORADOS */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "1rem" }}>
                      {/* Filtro por sede - USANDO IDs */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaMapMarkerAlt style={{ marginRight: "0.5rem" }} /> Sede
                        </label>
                        <select
                          value={filtroSede}
                          onChange={(e) => {
                            setFiltroSede(e.target.value);
                            setCurrentCabinPage(1);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Todas las sedes</option>
                          {sedesUnicas.map((sede, index) => (
                            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro por tipo desde API - USANDO IDs */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaHome style={{ marginRight: "0.5rem" }} /> Tipo
                        </label>
                        <select
                          value={filtroTipo}
                          onChange={(e) => {
                            setFiltroTipo(e.target.value);
                            setCurrentCabinPage(1);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Todos los tipos</option>
                          {tiposUnicos.map((tipo, index) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro por capacidad */}
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#2E5939", fontWeight: "500" }}>
                          <FaUsers style={{ marginRight: "0.5rem" }} /> Capacidad mínima
                        </label>
                        <select
                          value={filtroCapacidad}
                          onChange={(e) => {
                            setFiltroCapacidad(e.target.value);
                            setCurrentCabinPage(1);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        >
                          <option value="">Cualquier capacidad</option>
                          {capacidadesUnicas.map((capacidad, index) => (
                            <option key={index} value={capacidad}>{capacidad} personas</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Botón limpiar */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        onClick={limpiarFiltros}
                        style={{
                          padding: "0.8rem 1.5rem",
                          backgroundColor: "#e0e0e0",
                          color: "#333",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>

                  {/* Resultados de búsqueda */}
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <p style={{ color: "#5D6D63", fontSize: "1.1rem" }}>
                      {cabañasFiltradas.length} cabaña{cabañasFiltradas.length !== 1 ? 's' : ''} encontrada{cabañasFiltradas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </section>

              {/* CABINAS DESTACADAS CON FILTROS APLICADOS Y BOTÓN VER MÁS - MEJORADO */}
              <section style={{ 
                padding: "0 2rem 5rem", 
                backgroundColor: "#f8faf8", 
                margin: 0,
                width: "100%",
                boxSizing: "border-box"
              }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
                    {cabañasParaMostrar.map((cabin, index) => (
                      <div
                        key={cabin.id}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onClick={() => handleShowCabinDetails(cabin)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                        }}
                      >
                        <img
                          src={cabin.imagenes && cabin.imagenes.length > 0 ? cabin.imagenes[0] : cabin.img}
                          alt={cabin.name}
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763575207/img1_gi8hgx.jpg";
                          }}
                        />
                        <div style={{ padding: "2rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <h3 style={{ margin: "0", color: "#2E5939" }}>{cabin.name}</h3>
                            <div style={{ display: "flex", alignItems: "center", color: "#FFD700" }}>
                              <FaStar />
                              <FaStar />
                              <FaStar />
                              <FaStar />
                              <FaStar />
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaMapMarkerAlt /> {cabin.sede}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaHome /> {cabin.tipo}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#5D6D63", fontSize: "0.9rem" }}>
                              <FaUsers /> {cabin.capacidad} personas
                            </span>
                          </div>
                          
                          {/* Comodidades en la tarjeta */}
                          {cabin.comodidades && cabin.comodidades.length > 0 && (
                            <div style={{ marginBottom: "1rem" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                                {cabin.comodidades.slice(0, 3).map((comodidad, index) => (
                                  <span
                                    key={index}
                                    style={comodidadTagStyle}
                                  >
                                    <FaChair size={8} /> {comodidad}
                                  </span>
                                ))}
                                {cabin.comodidades.length > 3 && (
                                  <span style={{
                                    ...comodidadTagStyle,
                                    backgroundColor: '#F7F4EA'
                                  }}>
                                    +{cabin.comodidades.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <p style={{ color: "#5D6D63", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                            {cabin.description.length > 120 
                              ? `${cabin.description.substring(0, 120)}...` 
                              : cabin.description}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3E7E5C", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <FaDollarSign size={14} /> {cabin.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowCabinDetails(cabin);
                              }}
                              style={{
                                backgroundColor: "#2E5939",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "20px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cabañasFiltradas.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#5D6D63" }}>
                      <h3 style={{ marginBottom: "1rem" }}>No se encontraron cabañas</h3>
                      <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  )}

                  {/* Botón Ver Más Cabañas - SOLO SI HAY MÁS DE 6 CABAÑAS */}
                  {cabañasFiltradas.length > 6 && !showAllCabins && (
                    <div style={{ textAlign: "center", marginTop: "3rem" }}>
                      <button
                        onClick={() => setShowAllCabins(true)}
                        style={{
                          backgroundColor: "#2E5939",
                          color: "#fff",
                          border: "none",
                          padding: "15px 30px",
                          borderRadius: "25px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          margin: "0 auto"
                        }}
                      >
                        Ver Más Cabañas <FaChevronDown />
                      </button>
                    </div>
                  )}

                  {/* Botón Ver Menos Cabañas - CUANDO SE MUESTRAN TODAS */}
                  {showAllCabins && (
                    <div style={{ textAlign: "center", marginTop: "3rem" }}>
                      <button
                        onClick={() => setShowAllCabins(false)}
                        style={{
                          backgroundColor: "#e0e0e0",
                          color: "#333",
                          border: "none",
                          padding: "15px 30px",
                          borderRadius: "25px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          margin: "0 auto"
                        }}
                      >
                        Ver Menos Cabañas <FaChevronUp />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* SERVICIOS CON BOTÓN VER MÁS */}
              <section style={{ 
                padding: "5rem 2rem", 
                backgroundColor: "#fff", 
                margin: 0,
                width: "100%",
                boxSizing: "border-box"
              }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2 style={{
                    fontSize: "3rem",
                    color: "#2E5939",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Servicios Exclusivos
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    {serviciosParaMostrar.map((paquete, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#f8faf8",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={paquete.img}
                          alt={paquete.name}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dou17w0m0/image/upload/v1763576016/asados_nfmvlb.jpg";
                          }}
                        />
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                          <h3 style={{ color: "#2E5939", marginBottom: "1rem", fontSize: "1.5rem" }}>{paquete.name}</h3>
                          <p style={{ color: "#5D6D63", marginBottom: "1.5rem" }}>{paquete.description}</p>
                          <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#3E7E5C", marginBottom: "1.5rem" }}>
                            {paquete.price}
                          </div>
                          <button
                            onClick={() => handleShowDetails(paquete)}
                            style={{
                              backgroundColor: "#2E5939",
                              color: "#fff",
                              border: "none",
                              padding: "12px 25px",
                              borderRadius: "25px",
                              fontWeight: "600",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Más Información
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón Ver Más Servicios - SOLO SI HAY MÁS DE 6 SERVICIOS */}
                  {paquetes.length > 6 && !showAllServices && (
                    <div style={{ textAlign: "center", marginTop: "3rem" }}>
                      <button
                        onClick={() => setShowAllServices(true)}
                        style={{
                          backgroundColor: "#2E5939",
                          color: "#fff",
                          border: "none",
                          padding: "15px 30px",
                          borderRadius: "25px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          margin: "0 auto"
                        }}
                      >
                        Ver Más Servicios <FaChevronDown />
                      </button>
                    </div>
                  )}

                  {/* Botón Ver Menos Servicios - CUANDO SE MUESTRAN TODOS */}
                  {showAllServices && (
                    <div style={{ textAlign: "center", marginTop: "3rem" }}>
                      <button
                        onClick={() => setShowAllServices(false)}
                        style={{
                          backgroundColor: "#e0e0e0",
                          color: "#333",
                          border: "none",
                          padding: "15px 30px",
                          borderRadius: "25px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          margin: "0 auto"
                        }}
                      >
                        Ver Menos Servicios <FaChevronUp />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* CALL TO ACTION */}
              <section style={{ 
                padding: "5rem 2rem", 
                background: "linear-gradient(135deg, #2E5939 0%, #3E7E5C 100%)", 
                color: "#fff", 
                textAlign: "center", 
                margin: 0,
                width: "100%",
                boxSizing: "border-box"
              }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>¿Listo para tu Aventura?</h2>
                  <p style={{ fontSize: "1.3rem", marginBottom: "2.5rem" }}>
                    Únete a la familia Bosque Sagrado y descubre la magia de conectar con la naturaleza sin sacrificar el confort.
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={handleShowRegister}
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E5939",
                        border: "none",
                        padding: "18px 35px",
                        borderRadius: "30px",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Crear Cuenta
                    </button>
                    <button
                      onClick={handleShowLogin}
                      style={{
                        backgroundColor: "transparent",
                        color: "#E8F5E9",
                        border: "2px solid #E8F5E9",
                        padding: "18px 35px",
                        borderRadius: "30px",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        {/* BOTÓN SCROLL TO TOP */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#2E5939",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              boxShadow: "0 4px 15px rgba(46, 89, 57, 0.3)",
              zIndex: 1000,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(46, 89, 57, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(46, 89, 57, 0.3)";
            }}
          >
            <FaArrowUp />
          </button>
        )}

        {/* FOOTER COMPLETO - SIN ESPACIOS BLANCOS */}
        <footer
          style={{
            backgroundColor: "#2E5939",
            color: "#fff",
            padding: "4rem 0 2rem",
            margin: 0,
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
            padding: "0 2rem"
          }}>
            {/* Logo y descripción */}
            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <img
                  src="/images/Logo.png"
                  alt="Bosque Sagrado"
                  style={{
                    width: "80px",
                    height: "80px",
                    marginRight: "1rem",
                  }}
                />
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: "bold",
                  fontSize: "2rem"
                }}>
                  Bosque Sagrado
                </span>
              </div>
              <p style={{
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "1.5rem"
              }}>
                Donde el lujo se encuentra con la naturaleza. Experimenta la magia del glamping en los paisajes más espectaculares de Antioquia.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  onClick={() => handleSocialMediaClick("https://www.facebook.com/glampingbosquesagrado/?ref=_xav_ig_profile_page_web#")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaFacebook />
                </a>
                <a
                  onClick={() => handleSocialMediaClick("https://www.instagram.com/bosquesagradoglamping/")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaInstagram />
                </a>
                <a
                  onClick={() => handleSocialMediaClick("https://api.whatsapp.com/send?phone=573145894884&text=Bienvenid%40%20a%20Bosque%20Sagrado%20Glamping.%20%0AMi%20nombre%20es%20Olga%20P%C3%A9rez%2C%20asesora%20autorizada.%20Ser%C3%A1%20un%20gusto%20asesorarte%20para%20que%20vivas%20una%20experiencia%20%C3%BAnica%20y%20hagas%20una%20excelente%20elecci%C3%B3n%20%F0%9F%8C%B3%F0%9F%8C%99%E2%98%80%EF%B8%8F")}
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Enlaces Rápidos
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowLanding)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Inicio
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowAboutUs)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Quiénes Somos
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowLogin)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Iniciar Sesión
                  </a>
                </li>
                <li style={{ marginBottom: "0.8rem" }}>
                  <a
                    onClick={() => handleFooterLinkClick(handleShowRegister)}
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                  >
                    Registrarse
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 style={{
                marginBottom: "1.5rem",
                fontSize: "1.3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                Contacto
              </h4>
              <div style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
                <p style={{ margin: "0 0 1rem" }}>📞 +57 314 589 4884</p>
                <p style={{ margin: "0 0 1rem" }}>✉️ info@bosquesagrado.com</p>
                <p style={{ margin: "0" }}>📍 Copacabana, Antioquia</p>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "2rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            width: "100%",
            padding: "2rem 2rem 0"
          }}>
            <p style={{ margin: 0 }}>
              © 2024 Bosque Sagrado. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Estilos CSS para fuentes */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>
    </>
  );
}

export default LoginRegister;