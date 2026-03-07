import { useState } from 'react';
import { UserPlus, Building, Briefcase, Mail, Lock, ShieldCheck, CreditCard, ChevronRight, LogOut, CheckCircle, Map, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import ListaParticipantes from './ListaParticipantes';

const FUNCOES = [
  'Recepcionista',
  'Segurança',
  'Apoio Técnico',
  'Coordenador',
  'Limpeza'
];

const INITIAL_MOCK_PARTICIPANTES = [
  { id: 1, nome: 'João Silva', categoria: 'Expositor', email: 'joao@empresa.com', status: 'Validado' },
  { id: 2, nome: 'Maria Souza', categoria: 'Visitante', email: 'maria@email.com', status: 'Pendente' },
  { id: 3, nome: 'Carlos Mendes', categoria: 'Cafeicultor', email: 'carlos@fazenda.com', status: 'Validado' },
  { id: 4, nome: 'Ana Paula', categoria: 'Imprensa', email: 'ana@portal.com', status: 'Pendente' },
  { id: 5, nome: 'Lucas Oliveira', categoria: 'Visitante', email: 'lucas@email.com', status: 'Validado' },
];

export default function HomeAdmin() {
  const navigate = useNavigate();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cadastro' | 'lista'>('dashboard');
  
  // Participant List State (simulating a DB)
  const [listaPessoas, setListaPessoas] = useState<any[]>(INITIAL_MOCK_PARTICIPANTES);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    funcao: '',
    outraFuncao: '',
    tipoEmpresa: 'Comissão Organizadora',
    cnpj: '',
    nomeEmpresa: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoSelect = (tipo: string) => {
    setFormData(prev => ({
      ...prev,
      tipoEmpresa: tipo,
      ...(tipo === 'Comissão Organizadora' ? { cnpj: '', nomeEmpresa: '' } : {})
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro Funcionario:', formData);
    
    const novoParticipante = {
      id: Date.now(),
      nome: formData.nome,
      categoria: formData.tipoEmpresa, // Maps to "Comissão Organizadora" or "Colaborador Terceirizado"
      email: formData.email,
      status: 'Validado' // Auto-validate system admins/employees
    };

    setListaPessoas(prev => [novoParticipante, ...prev]);

    alert('Funcionário/Colaborador cadastrado com sucesso!');
    setFormData({
      nome: '', cpf: '', email: '', senha: '', funcao: '', outraFuncao: '', tipoEmpresa: 'Comissão Organizadora', cnpj: '', nomeEmpresa: ''
    });
    
    // Optional: Switch to list view so admin can see who they just added
    setActiveTab('lista');
  };

  // The original form abstracted into a sub-render
  const renderCadastroFuncionario = () => (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form className="space-y-8" onSubmit={handleSubmit}>
        
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Tipo de Vínculo</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'Comissão Organizadora', icon: Building, desc: 'Equipe interna do evento' },
            { id: 'Colaborador Terceirizado', icon: CreditCard, desc: 'Empresas e prestadores de serviço' }
          ].map(tipo => {
            const isSelected = formData.tipoEmpresa === tipo.id;
            const Icon = tipo.icon;
            return (
              <div 
                key={tipo.id}
                onClick={() => handleTipoSelect(tipo.id)}
                className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50/50 shadow-md shadow-amber-100' 
                    : 'border-gray-200 bg-white/60 hover:border-amber-200 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-amber-500 animate-in zoom-in">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{tipo.id}</h4>
                    <p className="text-xs text-gray-500 mt-1">{tipo.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pt-4">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-400" /> Dados do Cadastro
            </h3>

            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
              <input id="nome" name="nome" type="text" required value={formData.nome} onChange={handleChange}
                     className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="Nome do funcionário" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1 ml-1">CPF</label>
                <input id="cpf" name="cpf" type="text" required value={formData.cpf} onChange={handleChange}
                       className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="000.000.000-00" />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Função / Cargo</label>
                  <select id="funcao" name="funcao" required value={formData.funcao} onChange={handleChange}
                          className="glass-input block w-full px-4 py-3 rounded-xl text-sm">
                    <option value="">Selecione</option>
                    {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                {formData.funcao === 'Outros' && (
                  <div className="animate-in fade-in slide-in-from-top-1">
                    <input id="outraFuncao" name="outraFuncao" type="text" required value={formData.outraFuncao} onChange={handleChange}
                           className="glass-input block w-full px-4 py-3 rounded-xl text-sm border-amber-200 focus:border-amber-400" placeholder="Qual a função?" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-mail para Login</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                         className="glass-input block w-full pl-9 pr-4 py-3 rounded-xl text-sm" placeholder="acesso@evento.com" />
                </div>
              </div>
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="senha" name="senha" type="password" required value={formData.senha} onChange={handleChange}
                         className="glass-input block w-full pl-9 pr-4 py-3 rounded-xl text-sm" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className={`transition-all duration-500 overflow-hidden ${formData.tipoEmpresa === 'Colaborador Terceirizado' ? 'max-h-[500px] opacity-100' : 'max-h-1 opacity-50'}`}>
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/60 h-full">
                  <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-5 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    Informações da Empresa Contratada
                  </h4>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="cnpj" className="block text-xs font-semibold text-amber-900/70 mb-1 ml-1">CNPJ</label>
                      <input type="text" name="cnpj" id="cnpj" required={formData.tipoEmpresa === 'Colaborador Terceirizado'} value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00"
                             className="bg-white border border-amber-200/60 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 focus:outline-none block w-full px-4 py-3 rounded-xl text-sm transition-all" />
                    </div>
                    <div>
                      <label htmlFor="nomeEmpresa" className="block text-xs font-semibold text-amber-900/70 mb-1 ml-1">Nome da Empresa</label>
                      <input type="text" name="nomeEmpresa" id="nomeEmpresa" required={formData.tipoEmpresa === 'Colaborador Terceirizado'} value={formData.nomeEmpresa} onChange={handleChange} placeholder="Razão Social"
                             className="bg-white border border-amber-200/60 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 focus:outline-none block w-full px-4 py-3 rounded-xl text-sm transition-all" />
                    </div>
                  </div>
                </div>
             </div>

             {formData.tipoEmpresa === 'Comissão Organizadora' && (
               <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-8 text-center text-gray-500 text-sm animate-in fade-in">
                 Nenhuma informação de empresa adicional é necessária para a comissão interna.
               </div>
             )}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex justify-end">
           <button 
              type="submit"
              className="relative group overflow-hidden pl-6 pr-4 py-3 rounded-xl bg-gray-900 text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative">Cadastrar Colaborador</span>
              <div className="relative bg-gray-700/50 rounded-lg p-1.5 transition-transform duration-300 group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      
      {/* Background Decor Global */}
      <div className="fixed top-0 left-0 w-full h-80 bg-gradient-to-br from-gray-900 to-slate-800 -z-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 fixed h-full bg-white/40 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-20 flex flex-col text-gray-800">
        <div className="p-8 flex items-center gap-3 border-b border-gray-200">
          <ShieldCheck className="w-10 h-10 text-alta-orange" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Master</h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Gestão Integrada</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-alta-orange/10 text-alta-orange border border-alta-orange/20 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Informações do Evento
          </button>

          <button 
            onClick={() => setActiveTab('lista')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeTab === 'lista' 
                ? 'bg-alta-orange/10 text-alta-orange border border-alta-orange/20 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" /> Pessoas Cadastradas
          </button>
          
          <button 
            onClick={() => setActiveTab('cadastro')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
              activeTab === 'cadastro' 
                ? 'bg-alta-orange/10 text-alta-orange border border-alta-orange/20 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-5 h-5" /> Cadastrar Funcionário
          </button>
        </nav>

        <div className="p-6 border-t border-gray-200">
           <button onClick={() => navigate('/admin')} className="w-full flex justify-center items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-8 z-10 relative h-screen overflow-y-auto scroll-smooth">
        
        <header className="mb-10 text-gray-900">
          <h2 className="text-3xl font-bold">
            {activeTab === 'dashboard' && 'Painel de Informações'}
            {activeTab === 'cadastro' && 'Cadastro de Colaboradores'}
            {activeTab === 'lista' && 'Gestão de Cadastros'}
          </h2>
          <p className="text-gray-500 mt-2">
            {activeTab === 'dashboard' && 'Visão geral e métricas em tempo real do Hackathon Agrotech.'}
            {activeTab === 'cadastro' && 'Adicione novos membros à comissão organizadora ou equipe terceirizada.'}
            {activeTab === 'lista' && 'Consulte, filtre e interaja com os registros de todos os usuários.'}
          </p>
        </header>
        
        {/* Render Tab Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardAdmin />}
          {activeTab === 'lista' && <ListaParticipantes data={listaPessoas} />}
          {activeTab === 'cadastro' && renderCadastroFuncionario()}
        </div>
        
      </main>

    </div>
  );
}
