import { useState } from 'react';
import { CellModal } from './CellModal';
import { Registro } from '../../hooks/useTableData';

interface Props {
  registro: Registro;
  selecionado: boolean;
  onSelecionar: () => void;
  onEditar: (registro: Registro, campo: keyof Omit<Registro, 'id'>) => void;
  onSalvar: (row: Omit<Registro, 'id'>) => void;
  onOpenTJSPModal?: (registro: Registro) => void;
}


export const TableRow = ({ registro, selecionado, onSelecionar, onEditar, onSalvar, onOpenTJSPModal }: Props) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50">
      <td className="border px-3 py-2 text-base text-center">
        <input type="checkbox" checked={selecionado} onChange={onSelecionar} />
      </td>
      {Object.entries(registro).map(([key, value]) =>
  key !== 'id' ? (
    <td
      key={key}
      className={`border px-3 py-2 text-base cursor-pointer ${
        key === 'processo_tjsp' ? 'text-blue-600 font-bold' : ''
      }`}
      onClick={() => {
        console.log('Clicou em:', key);
        if (key === 'processo_tjsp' && onOpenTJSPModal) {
          onOpenTJSPModal(registro);
        } else {
          onEditar(registro, key as keyof Omit<Registro, 'id'>);
        }
      }}
      
    >
      {value || <span className="text-gray-400 italic">[clique para editar]</span>}
    </td>
  ) : null
)}

    </tr>
  );
};

