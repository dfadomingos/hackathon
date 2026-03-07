import { useState, useEffect } from 'react';
import { Search, Eye, Filter, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../lib/api';

export default function ListaParticipantes() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBuscar] = useState('');

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const [resColab, resCred] = await Promise.all([
          fetchWithAuth('/api/v1/user/colaboradores'),
          fetchWithAuth('/api/v1/credenciado')
        ]);

        if (!resColab.ok || !resCred.ok) {
          throw new Error('Falha ao obter dados das APIs.');
        }

        const dataColab = await resColab.json();
        const dataCred = await resCred.json();
        
        // Formatar Colaboradores
        const colabArray = dataColab.colaboradores || dataColab.items || dataColab.users || (Array.isArray(dataColab) ? dataColab : []);
        const formatadosColab = colabArray
          .filter((u: any) => u.login !== 'hugomendes@gmail.com')
          .map((u: any) => ({
            id: u.id || u.cpf || u.login,
            nome: u.nome,
            login: u.login,
            tipo: u.tipo || "Não definido",
            funcao: u.funcao,
            empresa: u.empresa || u.nome_empresa,
            cpf: u.cpf
          }));

        // Formatar Credenciados
        const credArray = dataCred.credenciados || dataCred.items || dataCred.users || (Array.isArray(dataCred) ? dataCred : []);
        const formatadosCred = credArray.map((p: any) => ({
          id: p.id || p.cpf || p.email,
          nome: p.nome_completo,
          login: p.email, // using email as sub-label
          tipo: p.tipo_categoria,
          funcao: "Inscrito",
          empresa: p.nome_empresa,
          cpf: p.cpf
        }));
        
        setUsuarios([...formatadosColab, ...formatadosCred]);
      } catch (err: any) {
        console.error('Erro ao carregar usuários:', err);
        setErro(err.message || 'Não foi possível carregar a lista de participantes.');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarUsuarios();
  }, []);

  const participantesFiltrados = usuarios.filter(p => {
    const matchCategoria = categoriaFiltro === 'Todas' || p.tipo === categoriaFiltro || p.funcao === categoriaFiltro;
    const descBusca = busca.toLowerCase();
    const matchBusca = p.nome?.toLowerCase().includes(descBusca) || p.login?.toLowerCase().includes(descBusca) || p.cpf?.includes(descBusca);
    return matchCategoria && matchBusca;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              value={busca}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar por nome, email ou CPF..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-alta-green focus:border-alta-green outline-none transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
               <Filter className="w-4 h-4" />
            </div>
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:ring-2 focus:ring-alta-green focus:border-alta-green outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="Todas">Todas as Categorias</option>
              <option value="Visitante">Visitante</option>
              <option value="Expositor">Expositor</option>
              <option value="Cafeicultor">Cafeicultor</option>
              <option value="Imprensa">Imprensa</option>
              <option value="Comissão Organizadora">Comissão Organizadora</option>
              <option value="Colaborador Terceirizado">Colaborador Terceirizado</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Participante</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin text-alta-green" />
                       Carregando participantes...
                    </div>
                  </td>
                </tr>
              ) : erro ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-500 font-medium">
                    {erro}
                  </td>
                </tr>
              ) : participantesFiltrados.length > 0 ? (
                 participantesFiltrados.map((p) => (
                  <tr key={p.id || p.cpf || p.login || Math.random()} className="hover:bg-alta-green/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{p.nome}</div>
                      <div className="text-sm text-gray-500">{p.login}</div>
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-1 items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {p.tipo || "Não definido"}
                      </span>
                      {p.funcao && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-alta-green/10 text-alta-green">
                          {p.funcao}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                        {p.empresa || 'Validado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-alta-green hover:bg-alta-green/10 rounded-lg transition-colors" title="Visualizar Detalhes">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nenhum participante encontrado nesta categoria ou termo de busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Mostrando 1 a 5 de 1250 registros</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 border border-alta-green text-white rounded bg-alta-green">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">Próxima</button>
          </div>
        </div>

      </div>
    </div>
  );
}
