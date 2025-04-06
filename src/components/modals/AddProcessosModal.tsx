import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  onConfirm: (dados: { numero: string; tribunal: string }[]) => void;
}

export const AddProcessosModal = ({ onClose, onConfirm }: Props) => {
  const [input, setInput] = useState('');
  const [tribunalSelecionado, setTribunalSelecionado] = useState<'STJ' | 'STF' | null>(null);

  const handleConfirm = () => {
    const numeros = input
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n !== '');
  

    if (!tribunalSelecionado) {
      toast.error('Selecione STJ ou STF');
      return;
    }

    const dados = numeros.map((numero) => ({
      numero,
      tribunal: tribunalSelecionado,
    }));

    onConfirm(dados);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4 text-center">Adicionar Processos</h2>

        <div className="flex gap-4 mb-4 justify-center">
          <button
            onClick={() => setTribunalSelecionado('STJ')}
            className={`px-4 py-1 rounded border text-sm ${
              tribunalSelecionado === 'STJ' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            STJ
          </button>
          <button
            onClick={() => setTribunalSelecionado('STF')}
            className={`px-4 py-1 rounded border text-sm ${
              tribunalSelecionado === 'STF' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            STF
          </button>
        </div>

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