
import React, { useState } from 'react';
import { FormData } from '../types';
import { generateGreetingMessage, transformImageToIllustration, editImageWithPrompt } from '../services/geminiService';
import { resizeImage } from '../services/imageService';

interface StepDesignProps {
  data: FormData;
  updateData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepDesign: React.FC<StepDesignProps> = ({ data, updateData, onNext, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const handleAiText = async () => {
    setIsGenerating(true);
    try {
      const text = await generateGreetingMessage(data);
      updateData({ customMessage: text });
    } catch (e) {
      console.error(e);
      alert("挨拶文の生成に失敗しました。APIキーが正しく設定されているか確認してください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await resizeImage(file);
        updateData({ originalImage: base64, processedImage: null });
        setEditPrompt(""); // Reset prompt on new image
      } catch (err) {
        alert("画像の読み込みに失敗しました。");
      }
    }
  };

  const handleTransform = async () => {
    if (!data.originalImage) return;
    setIsGenerating(true);
    try {
      const processed = await transformImageToIllustration(data.originalImage, data.illustrationStyle);
      updateData({ processedImage: processed });
    } catch (e) {
      console.error(e);
      alert("イラスト変換に失敗しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiEdit = async () => {
    const targetImage = data.processedImage || data.originalImage;
    if (!targetImage || !editPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const processed = await editImageWithPrompt(targetImage, editPrompt);
      updateData({ processedImage: processed });
      setEditPrompt(""); 
    } catch (e) {
      console.error(e);
      alert("画像の編集に失敗しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine aspect ratio based on paper size
  // Postcard (100x148) ratio ~ 0.675 -> 1.48
  // A4 (210x297) ratio ~ 0.707 -> 1.414
  const aspectRatioStyle = data.paperSize === 'a4' ? { aspectRatio: '1 / 1.414' } : { aspectRatio: '1 / 1.48' };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
            <span className="text-green-600 text-xl">✍️</span> 1. 挨拶文を生成
          </h2>
          <p className="text-sm text-gray-600 mb-4">AIがあなたの趣味や新居に合わせて、温かい文章を提案します。</p>
          <button 
            onClick={handleAiText} 
            disabled={isGenerating} 
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-lg mb-4 font-bold shadow-md hover:shadow-green-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span className="animate-spin">🌀</span>
            ) : (
              "✨ AIで挨拶文を自動生成する"
            )}
          </button>
          <textarea 
            value={data.customMessage} 
            onChange={(e) => updateData({ customMessage: e.target.value })} 
            className="w-full border-gray-300 border h-48 p-4 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-gray-700 leading-relaxed text-sm bg-gray-50"
            placeholder="ここにAIが作成した文章が表示されます。自由に修正も可能です。"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
            <span className="text-red-600 text-xl">📸</span> 2. 写真を加工・編集
          </h2>
          <p className="text-sm text-gray-600 mb-4">写真をアップロードして、イラスト化したり、AIに指示して自由に編集できます。</p>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-red-50 transition bg-white group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-2xl mb-1 group-hover:scale-110 transition">📷</span>
                <p className="text-xs text-gray-500 font-bold">写真をアップロード</p>
              </div>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
            
            {data.originalImage && (
              <div className="space-y-4">
                {/* Style Transfer Section */}
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                    <span>🎨</span> スタイル変換（プライバシー保護）
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['standard', 'casual', 'simple', 'luxury'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateData({ illustrationStyle: style })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                          data.illustrationStyle === style 
                            ? 'bg-red-600 text-white border-red-600 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleTransform} 
                    disabled={isGenerating} 
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? "変換中..." : "イラスト風に変換"}
                  </button>
                </div>

                {/* Free Edit Section */}
                <div className="p-4 bg-gray-100 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                    <span>🪄</span> AIで自由に編集
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="例: 背景を消して、レトロなフィルターをかけて"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 outline-none bg-white"
                      disabled={isGenerating}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
                    />
                    <button
                      onClick={handleAiEdit}
                      disabled={isGenerating || !editPrompt.trim()}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-gray-800 transition-all disabled:opacity-50 whitespace-nowrap text-sm"
                    >
                      実行
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    ※現在の画像（加工済みならその画像）に対して編集を行います。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center lg:sticky lg:top-24 h-fit">
        <h2 className="font-bold text-gray-500 text-sm mb-6 uppercase tracking-widest border-b-2 border-green-100 pb-2">
          Preview / 完成イメージ ({data.paperSize === 'a4' ? 'A4' : 'ハガキ'})
        </h2>
        
        {/* Card Preview Container */}
        <div 
          className="w-full max-w-sm bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 flex flex-col overflow-hidden relative transition-all duration-300" 
          style={{ ...aspectRatioStyle, backgroundColor: data.backgroundColor }}
        >
           <div className="flex-1 bg-gray-50 mb-8 overflow-hidden rounded-sm border border-gray-200 relative shadow-inner group">
              {data.processedImage ? (
                <>
                  <img src={data.processedImage} className="w-full h-full object-cover animate-fade-in" alt="Preview" />
                  <button 
                    onClick={() => updateData({ processedImage: null })}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="編集をリセット"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </>
              ) : data.originalImage ? (
                <div className="relative h-full">
                  <img src={data.originalImage} className="w-full h-full object-cover blur-md opacity-30" alt="Draft" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-xs font-bold text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm">イラスト加工前</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-200 bg-gray-50">
                  <span className="text-5xl mb-2 opacity-20">🏡</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase">Photo Area</span>
                </div>
              )}
           </div>

           <div className="flex-none space-y-4">
             <div className="min-h-[80px]">
               <p className="text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap text-gray-800 font-serif">
                 {data.customMessage || "こちらに挨拶文が流し込まれます。左のパネルでAI生成を行ってください。"}
               </p>
             </div>
             
             <div className="pt-4 border-t border-gray-100 flex justify-end items-end">
               <div className="text-right">
                 <p className="text-sm font-bold text-gray-900 font-serif">{data.name || "世帯主氏名"}</p>
               </div>
             </div>
           </div>

           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="flex justify-between w-full mt-10">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
            戻る
          </button>
          <button 
            onClick={onNext} 
            className="bg-green-600 text-white px-12 py-4 rounded-lg font-bold shadow-xl hover:bg-green-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            完成！印刷へ進む
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDesign;
