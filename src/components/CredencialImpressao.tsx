import { useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft } from 'lucide-react';
import headerBg from '../assets/header.jpg';
import bottomBg from '../assets/img1.jpg';

export default function CredencialImpressao() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-8 print:p-0 print:bg-white font-sans">
      
      {/* Botões de Ação */}
      <div className="mb-6 flex gap-4 print:hidden w-full max-w-[210mm] justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-alta-green text-white rounded-xl shadow-lg hover:bg-alta-green/90 transition-colors font-medium"
        >
          <Printer className="w-5 h-5" /> Imprimir Documento
        </button>
      </div>

      {/* Folha A4 */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl relative flex flex-col print:shadow-none mx-auto overflow-hidden">
         
         {/* Metade de Cima */}
         <div className="w-full h-1/2 border-b-2 border-dashed border-gray-300 print:border-none flex flex-col relative">
           
            {/* Header */}
            <div className="w-full flex-shrink-0">
               <img src={headerBg} alt="Header" className="w-full h-auto object-contain block" />
            </div>

            {/* Espaço em branco para ser editado depois */}
            <div className="flex-1 w-full bg-white relative p-4 flex flex-col items-center justify-center">
               {/* 
                 TODO: Aqui entrará o QR Code, Nome e Token (Conteúdo Dinâmico)
               */}
               <div className="w-full h-full border-2 border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                  Área Dinâmica (QR Code, Nome, Token, Tipo)
               </div>
            </div>

         </div>

         {/* Metade de Baixo (Imagem Inteira) */}
         <div className="w-full h-1/2 relative">
            <img 
               src={bottomBg} 
               alt="Background Bottom" 
               className="w-full h-full object-fill block"
            />
         </div>

      </div>

    </div>
  );
}
