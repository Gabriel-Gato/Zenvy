import React, { useEffect, useState } from "react";
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
import Reservas from './components/Reservas/StatusEstadia';
import GerenciarEstadias from './components/GerenciarEstadias/GerenciarEstadias';
import Avaliacao from './components/Avaliacao/Avaliacao';
import Mensagens from './components/Mensagens/Mensagens';
import './App.css';

function App() {
        const [user, setUser] = useState(null);

        useEffect(() => {

            document.title = "Zenvy";


            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/png";
            link.href = "/icons8-airbnb-50.png";
            document.head.appendChild(link);
        });

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

            <Route path="/casaExpandida/:id" element={<CasaExpandida />} />

            <Route path="/statusEstadia" element={<Reservas />} />

            <Route path="/gerenciarEstadias" element={<ProtectedRoute><GerenciarEstadias /> </ProtectedRoute>} />

            <Route path="/avaliacao/:id" element={<Avaliacao /> } />

            <Route path="/mensagens/:reservaId" element={<Mensagens />} />


        </Routes>
      </div>
    </Router>
  );
}



export default App;
