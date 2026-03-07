import React, { useState } from 'react';
import { User, Mail, MapPin, Target, CheckCircle, Car, Building2, Ticket, Camera, Leaf, ShieldCheck, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIAS = [
  { id: 'Visitante', icon: Ticket, description: 'Acesso às áreas comuns' },
  { id: 'Expositor', icon: Building2, description: 'Estandes e exposição' },
  { id: 'Cafeicultor', icon: Leaf, description: 'Produtores de café' },
  { id: 'Imprensa', icon: Camera, description: 'Cobertura oficial' }
];

const VEICULOS = ['Carro', 'Moto', 'Ônibus/Van', 'Nenhum'];
const COMBUSTIVEIS = ['Gasolina', 'Álcool', 'Flex', 'Diesel', 'Elétrico'];
const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function CadastroParticipante() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    cpf: '',
    rg: '',
    celular: '',
    email: '',
    municipio: '',
    uf: '',
    tipoVeiculo: '',
    tipoCombustivel: '',
    cnpj: '',
    siteEmpresa: '',
    nomeEmpresa: '',
    ccir: '',
    nomePropriedade: '',
    aceiteLgpd: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategorySelect = (categoria: string) => {
    setFormData(prev => ({ ...prev, categoria }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      const payload = {
        tipo_categoria: formData.categoria,
        nome_completo: formData.nome,
        cpf: formData.cpf,
        rg: formData.rg,
        celular: formData.celular,
        email: formData.email,
        municipio: formData.municipio,
        uf: formData.uf,
        tipo_veiculo: formData.tipoVeiculo,
        tipo_combustivel: formData.tipoCombustivel,
        aceitou_lgpd: formData.aceiteLgpd,
        cnpj: formData.cnpj || null,
        site_empresa: formData.siteEmpresa || null,
        nome_empresa: formData.nomeEmpresa || null,
        ccir: formData.ccir || null,
        nome_propriedade: formData.nomePropriedade || null
      };

      const response = await fetch('/api/v1/credenciado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail?.[0]?.msg || errorData?.detail || 'Erro ao realizar cadastro.');
      }

      setSucesso(true);
      // Redirect to home/login after a short delay so the user sees success
      setTimeout(() => {
         navigate('/');
      }, 2000);

    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setErro(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-alta-green/20 to-alta-green/5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-alta-orange/10 to-alta-pink/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-alta-green to-alta-green/80 rounded-2xl mb-4 backdrop-blur-sm border border-alta-green/30 shadow-lg transform hover:-translate-y-1 transition-transform">
             <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Credenciamento <span className="text-transparent bg-clip-text bg-gradient-to-r from-alta-green to-alta-green/70">Alta Café</span>
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Junte-se ao maior evento do setor. Escolha seu perfil e garanta sua vaga.
          </p>
        </div>

        <div className="glass-effect rounded-3xl p-6 sm:p-10 transition-all duration-500 ease-in-out">
          <form className="space-y-10" onSubmit={handleSubmit}>
            
            {/* Seção Categoria Dinâmica - Transformada em Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="bg-alta-green/10 p-2 rounded-lg text-alta-green">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Seu Perfil</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {CATEGORIAS.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = formData.categoria === cat.id;
                  
                  return (
                    <div 
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                        isSelected 
                          ? 'border-alta-green bg-alta-green/5 shadow-md shadow-alta-green/10' 
                          : 'border-transparent bg-white/60 hover:border-alta-green/30 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-alta-green animate-bounce">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                      <div className={`p-3 rounded-xl inline-flex ${isSelected ? 'bg-alta-green text-white' : 'bg-gray-100 text-gray-500'} transition-colors duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className={`mt-4 font-semibold ${isSelected ? 'text-alta-green' : 'text-gray-700'}`}>{cat.id}</h4>
                      <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Renderizar resto do formulário apenas se categoria selecionada */}
            <div className={`transition-all duration-700 overflow-hidden ${formData.categoria ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Coluna 1: Dados Básicos */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-6">
                      <div className="bg-alta-gray/20 p-2 rounded-lg text-alta-gray">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Dados Pessoais</h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
                        <input id="nome" name="nome" type="text" required value={formData.nome} onChange={handleChange}
                               className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="Como deseja ser chamado" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1 ml-1">CPF</label>
                          <input id="cpf" name="cpf" type="text" required value={formData.cpf} onChange={handleChange}
                                 className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="000.000.000-00" />
                        </div>
                        <div>
                          <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-1 ml-1">RG</label>
                          <input id="rg" name="rg" type="text" value={formData.rg} onChange={handleChange}
                                 className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="Registros Gerais" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-mail</label>
                          <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                                 className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="voce@exemplo.com" />
                        </div>
                        <div>
                          <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Celular</label>
                          <input id="celular" name="celular" type="text" required value={formData.celular} onChange={handleChange}
                                 className="glass-input block w-full px-4 py-3 rounded-xl text-sm" placeholder="(00) 00000-0000" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Endereço */}
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Município</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="municipio" name="municipio" type="text" required value={formData.municipio} onChange={handleChange}
                                   className="glass-input block w-full pl-9 pr-4 py-3 rounded-xl text-sm" placeholder="Sua cidade" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="uf" className="block text-sm font-medium text-gray-700 mb-1 ml-1">UF</label>
                          <select id="uf" name="uf" required value={formData.uf} onChange={handleChange}
                                  className="glass-input block w-full px-4 py-3 rounded-xl text-sm appearance-none">
                            <option value="">--</option>
                            {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                          </select>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Coluna 2: Dados Específicos e Transporte */}
                <div className="space-y-8">
                   
                   {/* Transporte */}
                   <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-6">
                      <div className="bg-alta-orange/10 p-2 rounded-lg text-alta-orange">
                        <Car className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Transporte</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tipoVeiculo" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Veículo</label>
                        <select id="tipoVeiculo" name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange}
                                className="glass-input block w-full px-4 py-3 rounded-xl text-sm">
                          <option value="">Selecione</option>
                          {VEICULOS.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className={`transition-opacity duration-300 ${formData.tipoVeiculo && formData.tipoVeiculo !== 'Nenhum' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <label htmlFor="tipoCombustivel" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Combustível</label>
                        <select id="tipoCombustivel" name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleChange}
                                className="glass-input block w-full px-4 py-3 rounded-xl text-sm">
                          <option value="">Selecione</option>
                          {COMBUSTIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Campos Dinâmicos Renderizados com Animação Suave */}
                  <div className={`transition-all duration-500 ease-out transform ${formData.categoria !== 'Visitante' && formData.categoria !== '' ? 'translate-y-0 opacity-100 visible h-auto' : '-translate-y-4 opacity-0 invisible h-0 overflow-hidden'}`}>
                    <div className="bg-gradient-to-br from-alta-green/5 to-gray-50/80 p-6 rounded-2xl border border-alta-green/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-alta-green/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                      
                      <h4 className="text-sm font-bold text-alta-green uppercase tracking-wider mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-alta-green mr-2"></span>
                        Informações {{'Expositor': 'da Empresa', 'Cafeicultor': 'da Propriedade', 'Imprensa': 'do Veículo'}[formData.categoria]}
                      </h4>

                      <div className="space-y-4">
                        {formData.categoria === 'Expositor' && (
                          <>
                            <div>
                              <label htmlFor="cnpj" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">CNPJ</label>
                              <input type="text" name="cnpj" id="cnpj" required={formData.categoria === 'Expositor'} value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00"
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                            <div>
                              <label htmlFor="nomeEmpresa" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">Nome da Empresa</label>
                              <input type="text" name="nomeEmpresa" id="nomeEmpresa" required={formData.categoria === 'Expositor'} value={formData.nomeEmpresa} onChange={handleChange}
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                            <div>
                              <label htmlFor="siteEmpresa" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">Site</label>
                              <input type="url" name="siteEmpresa" id="siteEmpresa" value={formData.siteEmpresa} onChange={handleChange} placeholder="https://"
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                          </>
                        )}

                        {formData.categoria === 'Cafeicultor' && (
                          <>
                            <div>
                              <label htmlFor="ccir" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">CCIR</label>
                              <input type="text" name="ccir" id="ccir" required={formData.categoria === 'Cafeicultor'} value={formData.ccir} onChange={handleChange} 
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                            <div>
                              <label htmlFor="nomePropriedade" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">Nome da Propriedade</label>
                              <input type="text" name="nomePropriedade" id="nomePropriedade" required={formData.categoria === 'Cafeicultor'} value={formData.nomePropriedade} onChange={handleChange} 
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                          </>
                        )}

                        {formData.categoria === 'Imprensa' && (
                          <>
                            <div>
                              <label htmlFor="cnpj" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">CNPJ (Opcional)</label>
                              <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange}
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                            <div>
                              <label htmlFor="siteEmpresa" className="block text-xs font-semibold text-alta-green/70 mb-1 ml-1">Site / Portal</label>
                              <input type="url" name="siteEmpresa" id="siteEmpresa" required={formData.categoria === 'Imprensa'} value={formData.siteEmpresa} onChange={handleChange} placeholder="https://"
                                     className="glass-input block w-full px-4 py-2.5 rounded-lg text-sm bg-white/60" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* LGPD e Submit */}
              <div className="mt-12 pt-8 border-t border-gray-200/60">
                <div className="flex items-start bg-gray-50/50 p-4 rounded-xl border border-gray-200/50 hover:bg-white transition-colors">
                  <div className="flex items-center h-5 mt-1">
                    <input id="aceiteLgpd" name="aceiteLgpd" type="checkbox" required checked={formData.aceiteLgpd} onChange={handleChange}
                           className="focus:ring-alta-green/30 h-5 w-5 text-alta-green border-gray-300 rounded cursor-pointer accent-alta-green transition-all hover:scale-110" />
                  </div>
                  <div className="ml-4 text-sm">
                    <label htmlFor="aceiteLgpd" className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                       Termo de Privacidade (LGPD) <ShieldCheck className="w-4 h-4 text-alta-green" />
                    </label>
                    <p className="text-gray-500 mt-1 leading-relaxed">Confirmo a veracidade das informações e concordo com a coleta e uso dos meus dados pela organização do evento, exclusivamente para fins operacionais de credenciamento e comunicação, conforme a Lei nº 13.709/2018.</p>
                  </div>
                </div>

                {erro && (
                  <div className="mt-6 flex items-center p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}
                
                {sucesso && (
                  <div className="mt-6 flex items-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Cadastro realizado com sucesso! Redirecionando...</span>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isLoading || sucesso || !formData.categoria || !formData.aceiteLgpd}
                    className="relative group overflow-hidden pl-6 pr-4 py-4 rounded-2xl bg-alta-green text-white font-bold flex items-center gap-3 shadow-[0_8px_20px_-6px_rgba(16,145,77,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(16,145,77,0.6)] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                    <span className="relative">
                      {isLoading ? 'Enviando...' : 'Concluir Inscrição'}
                    </span>
                    <div className="relative bg-white/20 rounded-xl p-1.5 transition-transform duration-300 group-hover:translate-x-1">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© 2026 Hackathon Agrotech. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
