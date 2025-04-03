import { useState } from 'react';

interface Props {
  campo: string;
  valor: string;
  onClose: () => void;
  onSave: (novoValor: string) => void;
}

export const CellModal = ({ campo, valor, onClose, onSave }: Props) => {
  const [input, setInput] = useState(valor || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Editar: {campo}</h2>
        <input
          className="w-full border px-4 py-2 text-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border text-base rounded">
            Cancelar
          </button>
          <button
            onClick={() => onSave(input)}
            className="px-4 py-2 bg-blue-600 text-white text-base rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
