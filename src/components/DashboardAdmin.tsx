import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, Map, Leaf, Filter, Printer, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../lib/api';

type CategoriaKeys = 'Todos' | 'Visitante' | 'Expositor' | 'Cafeicultor' | 'Imprensa' | 'Comissão Organizadora' | 'Colaborador Terceirizado' | string;

export default function DashboardAdmin() {
  const [catFiltro, setCatFiltro] = useState<CategoriaKeys>('Todos');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({ total: 0, validados: 0, pendentes: 0, carbono: '450 kg' });
  const [dataEstados, setDataEstados] = useState<any[]>([]);
  const [topMunicipios, setTopMunicipios] = useState<any[]>([]);
  const [categoriasData, setCategoriasData] = useState<Record<string, { total: number, percent: number }>>({
     Todos: { total: 0, percent: 100 }
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [resColab, resCred] = await Promise.all([
          fetchWithAuth('/api/v1/user/colaboradores'),
          fetchWithAuth('/api/v1/credenciado')
        ]);

        if (!resColab.ok || !resCred.ok) throw new Error('Failed to fetch stats');

        const [dataColab, dataCred] = await Promise.all([resColab.json(), resCred.json()]);

        const colabArray = dataColab.colaboradores || dataColab.items || (Array.isArray(dataColab) ? dataColab : []);
        const credArray = dataCred.credenciados || dataCred.items || (Array.isArray(dataCred) ? dataCred : []);

        // Filter original admin out of counting
        const validColabs = colabArray.filter((u: any) => u.login !== 'hugomendes@gmail.com');
        const todos = [...validColabs, ...credArray];

        // Process Stats
        const total = todos.length;
        setStats({
          total,
          validados: total, // Assuming all registered via API are verified
          pendentes: 0,
          carbono: '450 kg' // Requested to keep mock value
        });

        // Process Categories
        const catCounts: Record<string, number> = {};
        todos.forEach(u => {
           let cat = (u.tipo_categoria || u.tipo || 'Desconhecido').toString().trim();
           // Normalize capitalization if needed
           if (cat.toLowerCase() === 'visitante') cat = 'Visitante';
           if (cat.toLowerCase() === 'expositor') cat = 'Expositor';
           if (cat.toLowerCase() === 'cafeicultor') cat = 'Cafeicultor';
           if (cat.toLowerCase() === 'imprensa') cat = 'Imprensa';
           
           catCounts[cat] = (catCounts[cat] || 0) + 1;
        });

        const newCatData: Record<string, { total: number, percent: number }> = {
            Todos: { total, percent: 100 }
        };
        for (const [cat, count] of Object.entries(catCounts)) {
            newCatData[cat] = {
               total: count,
               percent: total > 0 ? Math.round((count / total) * 100) : 0
            };
        }
        
        // Add fallbacks to prevent undefined keys crashes in UI
        if (!newCatData['Visitante']) newCatData['Visitante'] = { total: 0, percent: 0 };
        if (!newCatData['Expositor']) newCatData['Expositor'] = { total: 0, percent: 0 };
        if (!newCatData['Cafeicultor']) newCatData['Cafeicultor'] = { total: 0, percent: 0 };
        if (!newCatData['Imprensa']) newCatData['Imprensa'] = { total: 0, percent: 0 };

        setCategoriasData(newCatData);

        // Process Estados (mainly credenciados have UF)
        const estadoCounts: Record<string, number> = {};
        credArray.forEach((c: any) => {
            const uf = (c.uf || 'Outros').toUpperCase();
            estadoCounts[uf] = (estadoCounts[uf] || 0) + 1;
        });
        
        const estadosArray = Object.entries(estadoCounts)
           .map(([estado, visitantes]) => ({ estado, visitantes }))
           .sort((a, b) => b.visitantes - a.visitantes)
           .slice(0, 7); // Top 7 States
        setDataEstados(estadosArray);

        // Process Municipios
        const munCounts: Record<string, number> = {};
        credArray.forEach((c: any) => {
            if (c.municipio) {
               munCounts[c.municipio] = (munCounts[c.municipio] || 0) + 1;
            }
        });

        const topMuns = Object.entries(munCounts)
           .map(([nome, qtde]) => ({ nome, qtde }))
           .sort((a, b) => b.qtde - a.qtde)
           .slice(0, 5); // top 5
        setTopMunicipios(topMuns);

      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-in fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-alta-green mb-4" />
        <p className="text-gray-500 font-medium">Carregando métricas em tempo real...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center print:hidden border-b border-gray-200/50 pb-6 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Métricas e Resultados</h2>
          <p className="text-sm text-gray-500">Acompanhamento em tempo real</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-alta-green hover:bg-alta-green/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Printer className="w-4 h-4" />
          Gerar Relatório PDF
        </button>
      </div>
      
      {/* Resumo de Participantes e Carbono */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Cadastrados</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-alta-gray/20 p-4 rounded-2xl text-alta-gray shadow-inner">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Acessos Validados</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.validados}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-2xl text-green-600 shadow-inner">
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Acessos Pendentes</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pendentes}</p>
          </div>
          <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 shadow-inner">
            <UserX className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-alta-green/20 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-sm font-medium text-alta-green">Carbono Emitido</p>
            <p className="text-3xl font-bold text-alta-green mt-1">{stats.carbono}</p>
            <p className="text-xs text-alta-green/70 mt-1">Estimativa de deslocamento</p>
          </div>
          <div className="bg-alta-green/10 p-4 rounded-2xl text-alta-green shadow-inner relative">
             <Leaf className="w-6 h-6 sm:w-8 sm:h-8" />
             <div className="absolute top-0 right-0 w-3 h-3 bg-alta-green rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel de Categorias */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <Filter className="w-5 h-5 text-indigo-500" />
                 Por Categoria
               </h3>
               {/* Dropdown / Filtro */}
               <select 
                 className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={catFiltro}
                 onChange={(e) => setCatFiltro(e.target.value as CategoriaKeys)}
               >
                 <option value="Todos">Todos</option>
                 <option value="Visitante">Visitante</option>
                 <option value="Expositor">Expositor</option>
                 <option value="Cafeicultor">Cafeicultor</option>
                 <option value="Imprensa">Imprensa</option>
               </select>
             </div>
             
              <div className="mt-8 animate-in zoom-in-95 duration-300">
                <p className="text-gray-500 text-sm font-medium mb-2">Total de {catFiltro === 'Todos' ? 'Participantes' : catFiltro + 's'}</p>
                <p className="text-5xl font-black text-alta-green">
                  {categoriasData[catFiltro]?.total || 0}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-alta-green h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${categoriasData[catFiltro]?.percent || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{categoriasData[catFiltro]?.percent || 0}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">da parcela total do evento</p>
             </div>
           </div>
        </div>

        {/* Gráfico de Estados */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-alta-orange" /> Origem por Estado (UF)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataEstados.length > 0 ? dataEstados : [{estado: 'N/A', visitantes: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="estado" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(16, 145, 77, 0.05)'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visitantes" fill="var(--color-alta-green)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Municípios Full Width */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100">
         <h3 className="text-lg font-bold text-gray-800 mb-6">Top Municípios Representados</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {topMunicipios.length > 0 ? topMunicipios.map((mun, idx) => (
             <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-alta-gray/10 to-white border border-gray-100 hover:shadow-md transition-all">
               <span className="text-2xl font-black text-alta-pink mb-1">{mun.qtde}</span>
               <span className="font-medium text-gray-700 text-center">{mun.nome}</span>
               <div className="w-8 h-1 bg-alta-pink/30 rounded-full mt-3"></div>
             </div>
           )) : (
             <div className="col-span-full py-8 text-center text-gray-500">
                Nenhum município registrado ainda.
             </div>
           )}
         </div>
      </div>

    </div>
  );
}
