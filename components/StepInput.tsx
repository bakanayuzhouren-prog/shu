
import React from 'react';
import { FormData } from '../types';
import AddressInput from './AddressInput';

interface StepInputProps {
  data: FormData;
  updateData: (partial: Partial<FormData>) => void;
  onNext: () => void;
}

const StepInput: React.FC<StepInputProps> = ({ data, updateData, onNext }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-blue-800">1. 基本情報の入力</h2>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-sm font-bold text-gray-600">作成サイズ:</span>
            <select
              value={data.paperSize || 'postcard'}
              onChange={(e) => updateData({ paperSize: e.target.value as 'a4' | 'postcard' })}
              className="bg-transparent text-sm font-bold text-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="postcard">ハガキ (100×148mm)</option>
              <option value="a4">A4 (210×297mm)</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">世帯主のお名前</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={(e) => updateData({ name: e.target.value })} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="山田 太郎" 
            />
          </div>
          
          <AddressInput 
            label="新居の住所" 
            value={data.newAddress} 
            onChange={(val) => updateData({ newAddress: val })} 
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">新しい生活の楽しみや趣味</label>
            <textarea 
              value={data.hobbies} 
              onChange={(e) => updateData({ hobbies: e.target.value })} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition h-24" 
              placeholder="広い庭でのBBQ、ガーデニング、DIYなど..." 
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          次へ進む（デザイン作成）
        </button>
      </div>
    </div>
  );
};

export default StepInput;
