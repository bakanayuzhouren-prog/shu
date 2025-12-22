
import React from 'react';
import { FormData } from '../types';

interface StepPrintProps {
  data: FormData;
  onBack: () => void;
}

const StepPrint: React.FC<StepPrintProps> = ({ data, onBack }) => {
  // Dimensions in mm
  // A4: 210 x 297
  // Postcard (Hagaki): 100 x 148
  const isA4 = data.paperSize === 'a4';
  const width = isA4 ? '210mm' : '100mm';
  const height = isA4 ? '297mm' : '148mm';
  
  // Adjust padding for smaller sizes
  const paddingClass = isA4 ? 'p-12' : 'p-6';
  const titleClass = isA4 ? 'text-2xl mb-6' : 'text-lg mb-3';
  const textClass = isA4 ? 'text-lg leading-loose' : 'text-xs leading-relaxed';
  const imageContainerHeight = isA4 ? 'h-80 mb-8' : 'h-40 mb-4';

  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center animate-fade-in">
      <div className="no-print text-gray-600 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm">
        {isA4 ? 'A4サイズ (210×297mm) でプレビュー中' : 'ハガキサイズ (100×148mm) でプレビュー中'}
      </div>
      
      <div 
        className={`bg-white shadow-2xl inline-block print-area text-left flex flex-col ${paddingClass}`} 
        style={{ width: width, minHeight: height, backgroundColor: data.backgroundColor }}
      >
         <div className={`${imageContainerHeight} bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100`}>
            {data.processedImage && <img src={data.processedImage} className="w-full h-full object-cover" />}
         </div>
         <div className="flex-1">
            <h2 className={`${titleClass} font-serif font-bold text-gray-900`}>{data.name} より</h2>
            <p className={`${textClass} font-serif whitespace-pre-wrap text-gray-800`}>{data.customMessage}</p>
         </div>
         <div className={`mt-auto pt-4 border-t border-gray-100 flex justify-end items-end ${isA4 ? 'text-sm' : 'text-[8px]'}`}>
             {/* Address removed as requested */}
         </div>
      </div>
      
      <div className="no-print space-x-4">
        <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition">デザインに戻る</button>
        <button onClick={() => window.print()} className="px-10 py-3 bg-green-600 text-white rounded-lg font-bold text-xl shadow-lg hover:bg-green-700 transition">🖨️ 印刷 / PDF保存</button>
      </div>
    </div>
  );
};

export default StepPrint;
