import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartoesProvider } from './contextos/CartoesContext';
import Layout from './componentes/layout/Layout';
import Dashboard from './paginas/Dashboard';
import Relatorios from './paginas/Relatorios';
import Ajuda from './paginas/Ajuda';
import './App.css';
import ListarTickets from './paginas/ListarTickets';

function App() {
  return (
    <CartoesProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/listar" element={<ListarTickets />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/ajuda" element={<Ajuda />} />
        </Routes>
      </Layout>
    </CartoesProvider>
  );
}

export default App;
