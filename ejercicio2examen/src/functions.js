import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

/**
 * Alerta para notificar una operación exitosa
 * 
 * @param {String} mensaje - Mensaje a mostrar en la alerta
 */
const alertaSuccess = (mensaje) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'success'
    });
}

/**
 * Alerta para notificar un error en la operación
 * 
 * @param {String} mensaje - Mensaje a mostrar en la alerta
 */
const alertaError = (mensaje) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'error'
    });
}

/**
 * Alerta para notificar una advertencia en la operación
 * 
 * @param {String} mensaje - Mensaje a mostrar en la alerta
 */
const alertaWarning = (mensaje, id = '') => {
    onFocus(id);
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'warning'
    });
}

const onFocus = (id) => {
    if (id !== '') {
        document.getElementById(id).focus();
    }    
}

export { alertaSuccess, alertaError, alertaWarning };