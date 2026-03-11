import { useState } from 'react';
import { QrCode, KeyRound, Search, ShieldCheck, LogOut, Loader2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';

export default function HomeFuncionario() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [cpfBusca, setCpfBusca] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const [loadingBusca, setLoadingBusca] = useState(false);
  const [participanteSelecionado, setParticipanteSelecionado] = useState<any>(null);

  const handleSimulateScan = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => setScanStatus('idle'), 3000);
    }, 1500);
  };

  const handleLiberarManual = () => {
    if (token) {
      alert(`Acesso liberado para o TOKEN: ${token}`);
      setToken('');
    }
  };

  const handlePesquisaCPF = async () => {
    if (!cpfBusca) return;
    setLoadingBusca(true);
    setParticipanteSelecionado(null);
    try {
      const response = await fetchWithAuth('/api/v1/credenciados');
      if (!response.ok) throw new Error('Falha ao buscar usuários');
      const data = await response.json();
      
      const credenciados = data.credenciados || [];
      const cpfNumeros = cpfBusca.replace(/\D/g, '');
      
      const found = credenciados.find((c: any) => {
         const dbCpf = (c.cpf || '').replace(/\D/g, '');
         return dbCpf === cpfNumeros;
      });

      if (found) {
        setParticipanteSelecionado(found);
      } else {
        alert('Participante não encontrado com este CPF.');
      }
    } catch(e) {
      console.error(e);
      alert('Erro na pesquisa do CPF');
    } finally {
      setLoadingBusca(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-alta-green rounded-b-[3rem] -z-10 shadow-lg"></div>

      {/* Header */}
      <header className="px-6 py-6 sm:px-10 flex justify-between items-center text-white z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white/80" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-white/80 text-sm">Controle de Acessos</p>
          </div>
        </div>
        <button onClick={() => navigate('/funcionario/login')} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Action 1: QR Code Scanner */}
          <div className="glass-effect rounded-3xl p-6 md:col-span-1 shadow-xl border border-gray-100/50 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 rounded-full mb-4 transition-colors duration-500 ${scanStatus === 'success' ? 'bg-alta-green/20 text-alta-green' : scanStatus === 'scanning' ? 'bg-alta-orange/10 text-alta-orange animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
              <QrCode className="w-12 h-12" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Ler QR Code</h2>
            <p className="text-sm text-gray-500 mb-6">Aponte a câmera para o crachá ou app do participante.</p>
            <button 
              onClick={handleSimulateScan}
              disabled={scanStatus !== 'idle'}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all shadow-md ${scanStatus === 'success' ? 'bg-alta-green' : 'bg-alta-orange hover:bg-alta-orange/90 hover:shadow-lg'}`}
            >
              {scanStatus === 'idle' && 'Ativar Câmera'}
              {scanStatus === 'scanning' && 'Escaneando...'}
              {scanStatus === 'success' && 'Acesso Liberado!'}
            </button>
          </div>

          {/* Manual Entry Actions */}
          <div className="md:col-span-2 space-y-6 flex flex-col justify-center">
            
            {/* Action 2: Token Input */}
            <div className="glass-effect rounded-3xl p-6 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-alta-pink/10 p-2 rounded-lg text-alta-pink">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Inserir Token Manual</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Caso o QR Code falhe, digite o código de 6 dígitos gerado no app do participante.</p>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="Ex: A7X9P2"
                  className="glass-input flex-1 px-4 py-3 rounded-xl text-lg font-mono tracking-widest uppercase placeholder-gray-400"
                />
                <button 
                  onClick={() => handleLiberarManual()}
                  className="bg-alta-pink hover:bg-alta-pink/90 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-alta-pink/30 transition-all hover:scale-105 active:scale-95"
                >
                   Validar
                </button>
              </div>
            </div>

            {/* Action 3: CPF Search */}
            <div className="glass-effect rounded-3xl p-6 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-alta-green/10 p-2 rounded-lg text-alta-green">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Pesquisa por CPF</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Busque o participante na base de dados caso não possua o dispositivo celular.</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={cpfBusca}
                      onChange={(e) => setCpfBusca(e.target.value)}
                      placeholder="000.000.000-00"
                      className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-base"
                      onKeyDown={(e) => e.key === 'Enter' && handlePesquisaCPF()}
                    />
                  </div>
                  <button 
                    onClick={handlePesquisaCPF}
                    disabled={loadingBusca}
                    className="bg-alta-green hover:bg-alta-green/90 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md shadow-alta-green/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap disabled:opacity-75 disabled:hover:scale-100"
                  >
                    {loadingBusca ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} 
                    <span className="hidden sm:inline">Pesquisar</span>
                  </button>
                </div>

                {participanteSelecionado && (
                  <div className="mt-4 p-4 bg-alta-green/5 border border-alta-green/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="font-bold text-gray-800">{participanteSelecionado.nome_completo}</p>
                          <p className="text-sm text-gray-500">Categoria: {participanteSelecionado.tipo_categoria}</p>
                       </div>
                       <button
                         onClick={() => navigate('/funcionario/credencial', { state: { participante: participanteSelecionado } })}
                         className="flex items-center gap-2 bg-alta-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-alta-green/90 transition-colors shadow-sm"
                       >
                         <Printer className="w-4 h-4" /> Gerar Credencial
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
