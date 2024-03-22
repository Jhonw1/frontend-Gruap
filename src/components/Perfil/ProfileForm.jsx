import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileForm.css';
import { useSelector } from 'react-redux';

function ProfileForm() {
  const user = useSelector((state) => state.client?.client);
  const defaultProfileImage = 'https://cdn-icons-png.flaticon.com/128/1946/1946392.png';

  const [photo, setPhoto] = useState(user?.photo || defaultProfileImage);
  const [userCranes, setUserCranes] = useState([]);
  const [editingUser, setEditingUser] = useState(false); // Estado para controlar la edición del usuario
  const [editedUserData, setEditedUserData] = useState({
    user: '',
    email: '',
    phone: ''
  }); // Estado para almacenar los datos editados del usuario
  const [currentGroup, setCurrentGroup] = useState(0); 

  const handlePhotoChange = (event) => {
    const selectedPhoto = event.target.files[0];
    setPhoto(selectedPhoto ? URL.createObjectURL(selectedPhoto) : defaultProfileImage);
  };

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:3000/gruasClient/${user.id}`)
        .then((response) => {
          setUserCranes(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener las grúas del usuario:', error);
        });
    }
  }, [user?.id]);

  const handleGruaChange = (event, index) => {
    const { name, value } = event.target;
    const updatedUserCranes = [...userCranes];
    updatedUserCranes[index][name] = value;
    setUserCranes(updatedUserCranes);
  };

  const handleDeleteGrua = (idGrua) => {
    axios.delete(`http://localhost:3000/eliminarGrua/${idGrua}`)
      .then(() => {
        setUserCranes(prevCranes => prevCranes.filter(grua => grua.id !== idGrua));
      })
      .catch((error) => {
        console.error('Error al eliminar la grúa:', error);
      });
  };

  const handleEditGrua = (idGrua, newData) => {
    axios.put(`http://localhost:3000/editarGrua/${idGrua}`, newData)
      .then(() => {
        setUserCranes(prevCranes => {
          return prevCranes.map(grua => {
            if (grua.id === idGrua) {
              return { ...grua, ...newData };
            }
            return grua;
          });
        });
      })
      .catch((error) => {
        console.error('Error al editar la grúa:', error);
      });
  };

  // Función para manejar la edición del usuario
  const handleEditUser = () => {
    setEditingUser(true);
    // Puedes inicializar editedUserData con los datos actuales del usuario
    setEditedUserData({
      user: user.user,
      email: user.email,
      phone: user.phone
    });
  };

  // Función para manejar el cambio en los datos editados del usuario
  const handleEditedUserDataChange = (event) => {
    const { name, value } = event.target;
    setEditedUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Función para enviar la solicitud de edición del usuario al backend
  const handleSubmitEditUser = () => {
    axios.put(`http://localhost:3000/editarUser/${user.id}`, editedUserData)
      .then((response) => {
        console.log('Usuario actualizado exitosamente:', response.data);
        // Actualizar el estado local del usuario con los nuevos datos
        // setUser(prevUser => ({
        //   ...prevUser,
        //   ...editedUserData
        // }));
        // Restablecer el estado de edición del usuario
        setEditingUser(false);
      })
      .catch((error) => {
        console.error('Error al actualizar el usuario:', error);
      });
  };
  const handleNextGroup = () => {
    setCurrentGroup((prevGroup) => prevGroup + 1);
  };

  // Función para retroceder al grupo anterior de grúas
  const handlePrevGroup = () => {
    setCurrentGroup((prevGroup) => prevGroup - 1);
  };

  const groupCranesVertically = () => {
    const groups = [];
    for (let i = 0; i < userCranes.length; i += 3) {
      groups.push(userCranes.slice(i, i + 3));
    }
    return groups;
  };
  return (
    <section className='section-perfil'>
      <div className="profile-editor">
        <div className="prteProfile1">
          <div className="tituloEditar">
            <h2>Editar perfil</h2>
          </div>
  
          <div className="containerFotoProfile">
            <img className="profile-photo" src={photo} alt="Perfil" />
            <div className="option-cambiar">
              <label className='labelCambiarfoto' htmlFor="photo">Cambiar foto</label>
              <input className='input-cambiar' type="file" name="photo" id="photo" onChange={handlePhotoChange} />
            </div>
          </div>
  
          <div className="infoProfile">
            <div className="form-group">
              <label className='labelUser' htmlFor="user">Usuario:</label>
              <input
                className={`input-user ${editingUser ? 'editable' : ''}`}
                type="text"
                name="user"
                id="user"
                value={editingUser ? editedUserData.user : user?.user ?? "undefined"}
                readOnly={!editingUser}
                onChange={handleEditedUserDataChange}
              />
            </div>
  
            <div className="form-group">
              <label className='labelPhone' htmlFor="phone">Teléfono:</label>
              <input
                className={`input-phoneNumber ${editingUser ? 'editable' : ''}`}
                type="text"
                name="phone"
                id="phone"
                value={editingUser ? editedUserData.phone : user?.phone ?? "undefined"}
                readOnly={!editingUser}
                onChange={handleEditedUserDataChange}
              />
            </div>
  
            <div className="form-group">
              <label className='labelCorreo' htmlFor="email">Correo-e:</label>
              <input
                className={`input-email ${editingUser ? 'editable' : ''}`}
                type="email"
                id="email"
                value={editingUser ? editedUserData.email : user?.email ?? "undefined"}
                readOnly={!editingUser}
                onChange={handleEditedUserDataChange}
              />
            </div>
  
            <button className='butonEditarprofile' onClick={editingUser ? handleSubmitEditUser : handleEditUser}>
              {editingUser ? 'Guardar Cambios' : 'Editar Usuario'}
            </button>
          </div>
        </div>
  
        <div className="user-cranes">
        <div className="tituloGruasP"> 
        <h3>Grúas Publicadas:</h3>
        </div>
        <div className="gruas-list">
          {userCranes.slice(currentGroup * 3, (currentGroup + 1) * 3).map((grua, index) => (
            <div key={index} className="grua-card">
              <input
                className='input-marca'
                type="text"
                name="marca"
                value={grua.marca}
                onChange={(event) => handleGruaChange(event, index)}
              />
              <input
                className='input-modelo'
                type="text"
                name="modelo"
                value={grua.modelo}
                onChange={(event) => handleGruaChange(event, index)}
              />
              <input
                className='input-capacidad'
                type="number"
                name="capacidad"
                value={grua.capacidad}
                onChange={(event) => handleGruaChange(event, index)}
              />
              <input
                className='input-whatsapp'
                type="text"
                name="whatsapp"
                value={grua.whatsapp}
                onChange={(event) => handleGruaChange(event, index)}
              />
              <input
                className='input-ubicacion'
                type="text"
                name="ubicacion"
                value={grua.ubicacion}
                onChange={(event) => handleGruaChange(event, index)}
              />
              <div className="botonesperfil">

              <button className='butonEliminar' onClick={() => handleDeleteGrua(grua.id)}>Eliminar</button>
              <button className='butonEditar' onClick={() => handleEditGrua(grua.id, {
                marca: grua.marca,
                modelo: grua.modelo,
                capacidad: grua.capacidad,
                whatsapp: grua.whatsapp,
                ubicacion: grua.ubicacion,
                foto_path: grua.foto_path
              })}>Editar</button>
            </div>
            </div>
          ))}
        <div className="navigation-arrows">
          <button className='butonAnterior' disabled={currentGroup === 0} onClick={handlePrevGroup}>Anterior</button>
          <button className='butonSiguiente' disabled={(currentGroup + 1) * 3 >= userCranes.length} onClick={handleNextGroup}>Siguiente</button>
        </div>
        </div>
      </div>
    </div>
  </section>
);
              } 
export default ProfileForm;