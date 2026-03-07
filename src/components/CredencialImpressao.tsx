import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import headerBg from '../assets/header.jpg';
import bottomBg from '../assets/img1.jpg';

export default function CredencialImpressao() {
  const navigate = useNavigate();
  const location = useLocation();
  const participante = location.state?.participante;

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

            {/* Área Dinâmica via Estado do Router */}
            <div className="flex-1 w-full bg-white relative p-4 flex items-center justify-center">
               {!participante ? (
                 <div className="text-gray-400 flex flex-col items-center justify-center gap-2 print:hidden w-full">
                    <AlertCircle className="w-8 h-8 opacity-50" />
                    <p>Nenhum participante recebido. Acesse através da pesquisa.</p>
                 </div>
               ) : (
                 <>
                   {/* Lado Esquerdo */}
                   <div className="flex flex-col items-center justify-center w-1/2 text-center border-r-2 border-dashed border-gray-200 pr-6">
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                        <QRCodeSVG 
                          value={participante.token_qr_code || 'QR_ERROR'} 
                          size={150} 
                          level="H" 
                        />
                      </div>
                      <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight leading-tight line-clamp-2">
                         {participante.nome_completo || 'Nome não informado'}
                      </h2>
                      <p className="text-base text-gray-500 mt-2 font-mono tracking-[0.2em] bg-gray-50 px-4 py-1 rounded-lg">
                         {participante.token_qr_code || 'TKN-0000'}
                      </p>
                      <div className="mt-4 px-6 py-2 bg-alta-green/10 text-alta-green font-bold uppercase tracking-wider rounded-full border border-alta-green/20 shadow-sm text-sm">
                         {participante.tipo_categoria || 'Visitante'}
                      </div>
                   </div>

                   {/* Lado Direito */}
                   <div className="flex flex-col items-center justify-center w-1/2 text-center pl-6">
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                        <QRCodeSVG 
                          value={participante.token_qr_code || 'QR_ERROR'} 
                          size={150} 
                          level="H" 
                        />
                      </div>
                      <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight leading-tight line-clamp-2">
                         {participante.nome_completo || 'Nome não informado'}
                      </h2>
                      <p className="text-base text-gray-500 mt-2 font-mono tracking-[0.2em] bg-gray-50 px-4 py-1 rounded-lg">
                         {participante.token_qr_code || 'TKN-0000'}
                      </p>
                      <div className="mt-4 px-6 py-2 bg-alta-green/10 text-alta-green font-bold uppercase tracking-wider rounded-full border border-alta-green/20 shadow-sm text-sm">
                         {participante.tipo_categoria || 'Visitante'}
                      </div>
                   </div>
                 </>
               )}
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
