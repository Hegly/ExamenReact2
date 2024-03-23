import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


/**
 * Componente que retorna el flujo de categorias
 * 
 * @returns Componente categorias
 */

const Categorias = () => {
    const url = 'https://api.escuelajs.co/api/v1/categories';
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [imagen, setImagen] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    /**
     * Obtiene listado de productos desde la API
     */
    const getCategories = async () => {
        const response = await axios.get(url);
        setCategories(response.data);
    }

    useEffect( () => {
        getCategories();
    }, []);

    /**
     * Abre el modal con los atributos de la categoria, si se va a editar, se cargan los datos.
     * 
     * @param {String} operation - 1. Agregar, 2. Editar
     * @param {Number} id - Identificador de la categoria
     * @param {String} name - Nombre de la categoria
     * @param {ImageData} imagen - Imagen
     */
    const openModal = (operation, id, name, imagen) => {
        setId('');
        setName('');
        setImagen('');

        if (operation === 1) {
            setTitleModal('Registrar Categoria');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Categoria');
            setId(id);
            setName(name);
            setImagen(imagen);
            setOperation(2);
        }
    }

    /**
     * Permite el uso de la API dependiendo el tipo de operación
     * 
     * @param {String} url - URL de la API a consumir 
     * @param {String} metodo - Tipo de metodo a utilizar: POST, PUT o DELETE
     * @param {JSON} parametros - Objeto JSON que se enviará a la API
     */
    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        };
        await axios(obj).then( () => {
            let mensaje;

            if (metodo === 'POST') {
                mensaje = 'Se guardó la categoria';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó la categoria';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó la categoria';
            }
            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getCategories();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    /**
     * Valida que cada uno de los campos del formulario no vayan vacíos
     */
    const validar = () => {
        let payload;
        let metodo;
        let urlAxios;

        if (title === '') {
            alertaWarning('Escriba el nombre de la Categoria', 'name');
        } else {
            payload = {
                name: name,
                categoryId: 6,
                images: ['https://api.lorem.space/image/fashion?w=640&h=480&r=4278']
            };

            if (operation === 1) {
                metodo = 'POST';
                urlAxios = 'https://api.escuelajs.co/api/v1/categories/';
            } else {
                metodo = 'PUT';
                urlAxios = `https://api.escuelajs.co/api/v1/categories/${id}`;
            }

            enviarSolicitud(urlAxios, metodo, payload);
        }
    }

    /**
     * Proceso para eliminar una categoria
     * 
     * @param {Number} id - Identificador de la categoria a eliminar 
     */
    const deleteCategories = (id) => {
        let urlDelete = `https://api.escuelajs.co/api/v1/categories/${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar esta categoria?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            alertaError(error);
            console.log(error);
        });
    }

 return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='rwo mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCategories'>
                            <i className='fa-solid fa-circle-plus' /> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Categoria</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {
                                categories.map( (category, i) => (
                                    <tr key={category.id}>
                                        <td>{i + 1}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            {category.images && category.images.length > 0 ? ( // Verifica si 'images' está definido y tiene al menos un elemento
                                                <img src={category.images[0]} alt={category.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                            ) : (
                                                <span>No hay imagen disponible</span> // Muestra un mensaje si no hay imagen disponible
                                            )}
                                        </td>
                                        <td>
                                            <button onClick={() => openModal(2, category.id, category.name)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalCategories'>
                                                <i className='fa-solid fa-edit' />
                                            </button>
                                            <button onClick={() => deleteCategories(category.id)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash' />
                                            </button>
                                        </td>
                                        </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id='modalCategories' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{titleModal}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='cloase' />
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id' />
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift' /></span>
                            <input type='text' id='name' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-image' /></span>
                                <input type='text' id='imagen' className='form-control' placeholder='URL de la imagen' value={imagen} onChange={(e) => setImagen(e.target.value)} />
                            </div>
                    </div>
                    <div className='modal-footer'>
                        <button onClick={() => validar()} className='btn btn-success'>
                            <i className='fa-solid fa-floppy-disk' /> Guardar
                        </button>
                        <button id='btnCerrarModal' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Categorias
