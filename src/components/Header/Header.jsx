import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const usuarioAutenticado = useSelector((state) => state.client?.client !== null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  document.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  return (
    <header className='header'>
      <div className="logo">
        <NavLink to="/">
          <h1>
            Gruapp
          </h1>
        </NavLink>
      </div>
      <nav className='navbar'>
        <ul>
          <li>
            <NavLink className='opciones' to="/">Inicio</NavLink>
            <NavLink className='opciones' to="/Gruas">Servicios</NavLink>

            {usuarioAutenticado && (
              <NavLink className='aggGrua' to="/AgregarGrua">+ Grúa</NavLink>
            )}

            {usuarioAutenticado && (
              <NavLink className='rayasHorizontales'>
                <img src="https://cdn-icons-png.flaticon.com/128/14505/14505987.png" alt="" />
                <ul className='menuVertical'>
                  <li>
                    <NavLink to='/ProfileForm'>
                      Perfil
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/" onClick={handleLogout}>
                      <img className='cerrar' src="https://cdn-icons-png.flaticon.com/128/4113/4113923.png" alt="" />
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
            )}

            {!usuarioAutenticado && (
              <div className="login-register">
                <NavLink className="login" to="/login">Login</NavLink>
                <NavLink className="register" to="/register">Register</NavLink>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

