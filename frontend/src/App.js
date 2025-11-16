import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro';
import Casas from './components/Casas/Casas';
import UserProfile from './components/UserProfile/UserProfile';
import AdminPanel from './components/AdminPanel/AdminPanel';
import GerenciarCredencial from './components/GerenciarCredencial/GerenciarCredencial';
import ProtectedRoute from './components/ProtectedRoute';
import GerenciarGaleria from './components/GerenciarGaleria/GerenciarGaleria';
import GerenciarCasas from './components/GerenciarCasas/GerenciarCasas';
import AdicionarImovel from './components/GerenciarCasas/AdicionarImovel';
import EditarImovel from './components/GerenciarCasas/EditarImovel';
import CasaExpandida from './components/Casas/CasaExpandida';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/casas" element={<Casas />} />
          <Route path="/userProfile" element={<UserProfile />} />


          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
                      path="/gerenciarCredencial"
                      element={
                        <ProtectedRoute>
                          <GerenciarCredencial />
                        </ProtectedRoute>
                      }
                    />

       <Route
                   path="/gerenciarGaleria"
                   element={
                     <ProtectedRoute>
                       <GerenciarGaleria />
                     </ProtectedRoute>
                   }
                 />
        <Route
                   path="/gerenciarCasas"
                   element={
                     <ProtectedRoute>
                       <GerenciarCasas />
                     </ProtectedRoute>
                   }
                 />

        <Route
                           path="/adicionarImovel"
                           element={
                             <ProtectedRoute>
                               <AdicionarImovel />
                             </ProtectedRoute>
                           }
                         />

            <Route
                path="/editarImovel/:id"
                element={
                    <ProtectedRoute>
                        <EditarImovel />
                    </ProtectedRoute>
                }
            />

            <Route path="/casaExpandida/:id" element={<ProtectedRoute> <CasaExpandida /> </ProtectedRoute>} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
