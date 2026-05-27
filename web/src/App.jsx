import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartoesProvider } from './contextos/CartoesContext';
import { TicketsProvider } from './contextos/TicketsContext';
import { useAuth } from './contextos/AuthContext';
import Layout from './componentes/layout/Layout';
import Dashboard from './paginas/Dashboard';
import Relatorios from './paginas/Relatorios';
import Ajuda from './paginas/Ajuda';
import './App.css';
import ListarTickets from './paginas/ListarTickets';
import Login from './paginas/Login';

function RotasProtegidas() {
  const { token, user, logout, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        A carregar…
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <TicketsProvider>
      <CartoesProvider>
        <Layout user={user} onLogout={logout}>
          <Outlet />
        </Layout>
      </CartoesProvider>
    </TicketsProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RotasProtegidas />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/listar" element={<ListarTickets />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/ajuda" element={<Ajuda />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
