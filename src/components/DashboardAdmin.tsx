import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, Map, Leaf, Filter, Printer } from 'lucide-react';

const MOCK_STATS = {
  total: 1250,
  validados: 890,
  pendentes: 360,
  carbono: '450 kg' // CO2 equivalent
};

const DATA_ESTADOS = [
  { estado: 'SP', visitantes: 450 },
  { estado: 'MG', visitantes: 320 },
  { estado: 'PR', visitantes: 150 },
  { estado: 'GO', visitantes: 110 },
  { estado: 'Outros', visitantes: 220 }
];

const TOP_MUNICIPIOS = [
  { nome: 'São Paulo', qtde: 210 },
  { nome: 'Campinas', qtde: 145 },
  { nome: 'Ribeirão Preto', qtde: 120 },
  { nome: 'Franca', qtde: 90 },
  { nome: 'Uberaba', qtde: 85 },
];

const CATEGORIAS_DATA = {
  Todos: { total: 1250, percent: 100 },
  Visitante: { total: 850, percent: 68 },
  Expositor: { total: 200, percent: 16 },
  Cafeicultor: { total: 150, percent: 12 },
  Imprensa: { total: 50, percent: 4 }
};

type CategoriaKeys = keyof typeof CATEGORIAS_DATA;

export default function DashboardAdmin() {
  const [catFiltro, setCatFiltro] = useState<CategoriaKeys>('Todos');

  const handlePrint = () => {
    window.print();
  };

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
            <p className="text-3xl font-bold text-gray-900 mt-1">{MOCK_STATS.total}</p>
          </div>
          <div className="bg-alta-gray/20 p-4 rounded-2xl text-alta-gray shadow-inner">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Acessos Validados</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{MOCK_STATS.validados}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-2xl text-green-600 shadow-inner">
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Acessos Pendentes</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{MOCK_STATS.pendentes}</p>
          </div>
          <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 shadow-inner">
            <UserX className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-alta-green/20 flex items-center justify-between transition-transform hover:-translate-y-1">
          <div>
            <p className="text-sm font-medium text-alta-green">Carbono Emitido</p>
            <p className="text-3xl font-bold text-alta-green mt-1">{MOCK_STATS.carbono}</p>
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
                  {CATEGORIAS_DATA[catFiltro].total}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-alta-green h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${CATEGORIAS_DATA[catFiltro].percent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{CATEGORIAS_DATA[catFiltro].percent}%</span>
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
              <BarChart data={DATA_ESTADOS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
           {TOP_MUNICIPIOS.map((mun, idx) => (
             <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-alta-gray/10 to-white border border-gray-100 hover:shadow-md transition-all">
               <span className="text-2xl font-black text-alta-pink mb-1">{mun.qtde}</span>
               <span className="font-medium text-gray-700 text-center">{mun.nome}</span>
               <div className="w-8 h-1 bg-alta-pink/30 rounded-full mt-3"></div>
             </div>
           ))}
         </div>
      </div>

    </div>
  );
}
