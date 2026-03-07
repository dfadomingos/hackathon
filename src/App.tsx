import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CadastroParticipante from './components/CadastroParticipante'
import LoginFuncionario from './components/LoginFuncionario'
import HomeFuncionario from './components/HomeFuncionario'
import LoginAdmin from './components/LoginAdmin'
import HomeAdmin from './components/HomeAdmin'
import CredencialImpressao from './components/CredencialImpressao'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroParticipante />} />
        <Route path="/funcionario/login" element={<LoginFuncionario />} />
        <Route path="/funcionario/home" element={<HomeFuncionario />} />
        <Route path="/funcionario/credencial" element={<CredencialImpressao />} />
        
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/home" element={<HomeAdmin />} />
        <Route path="/admin/credencial" element={<CredencialImpressao />} />
        
        {/* Default route fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
