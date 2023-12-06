
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Servicios from './components/Servicios/Servicios';
import Beneficios from './components/Beneficios/Beneficios';
import Gruas from './components/Gruas/Gruas';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const App = () => {
  return (
      <div>
        <Header/>
        <Routes>
          <Route path='/' element ={<Section />} />
          {/* <Route path='/servicio' element= {<Servicios />} />
          <Route path='/beneficio' element = {<Beneficios />} /> */}
          <Route path='/gruas' element = {<Gruas/>} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/register' element = {<Register/>} />
      </Routes>
      </div>
  );
};

export default App;
