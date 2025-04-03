import { useState } from 'react';

interface Props {
  onClose: () => void;
  onConfirm: (numeros: string[]) => void;
}

export const AddProcessosModal = ({ onClose, onConfirm }: Props) => {
  const [input, setInput] = useState('');

  const handleConfirm = () => {
    const numeros = input
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n !== '');
    onConfirm(numeros);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-2">Adicionar Processos</h2>
        <textarea
          rows={4}
          className="w-full border px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite os números separados por vírgula"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-1 border">Cancelar</button>
          <button onClick={handleConfirm} className="px-4 py-1 bg-blue-500 text-white">Adicionar</button>
        </div>
      </div>
    </div>
  );
};
