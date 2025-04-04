// TableRow.tsx atualizado: checkbox com onChange e texto normal na coluna TJSP

import { useState } from 'react';
import { toast } from 'sonner';

interface Registro {
  id: string;
  assistente: string;
  reu: string;
  processo_tjsp: string;
  processo_superior: string;
  tribunal: string;
  situacao: string;
  decisao: string;
  resumo: string;
  movimentacao: string;
  link: string;
}

interface TableRowProps {
  registro: Registro;
  onSalvar: (registro: Partial<Registro> & { id: string }) => void;
  onExcluir: (id: string) => void;
  onOpenTJSPModal: (registro: Registro) => void;
  selecionado: boolean;
  toggleSelecionado: () => void;
}

export const TableRow = ({
  registro,
  onSalvar,
  onExcluir,
  onOpenTJSPModal,
  selecionado,
  toggleSelecionado,
}: TableRowProps) => {
  const [editingField, setEditingField] = useState<keyof Registro | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const abrirEdicao = (campo: keyof Registro) => {
    setEditingField(campo);
    setEditingValue(registro[campo] || '');
  };

  const salvarEdicao = () => {
    if (!editingField) return;

    const atualizado = {
      id: registro.id,
      [editingField]: editingValue,
    };

    onSalvar(atualizado);
    toast.success('Registro atualizado');
    setEditingField(null);
    setEditingValue('');
  };

  const cancelarEdicao = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const campos = [
    'assistente',
    'reu',
    'processo_tjsp',
    'processo_superior',
    'tribunal',
    'situacao',
    'decisao',
    'resumo',
    'movimentacao',
    'link',
  ] as const;

  return (
    <tr className="odd:bg-white even:bg-gray-50">
      <td className="border px-3 py-2 text-center">
        <input type="checkbox" checked={selecionado} onChange={toggleSelecionado} />
      </td>

      {campos.map((campo) => (
        <td
          key={campo}
          className="border px-3 py-2 cursor-pointer text-sm"
          onClick={() => {
            if (campo === 'processo_tjsp') {
              onOpenTJSPModal(registro);
              return;
            }
            abrirEdicao(campo);
          }}
        >
          {editingField === campo ? (
            <input
              autoFocus
              className="w-full border rounded px-2 py-1 text-sm"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={salvarEdicao}
              onKeyDown={(e) => {
                if (e.key === 'Enter') salvarEdicao();
                if (e.key === 'Escape') cancelarEdicao();
              }}
            />
          ) : campo === 'processo_tjsp' ? (
            <span className="text-blue-700 hover:underline">
              {registro[campo] || <span className="italic text-gray-400">Editar</span>}
            </span>
          ) : (
            registro[campo] || <span className="italic text-gray-400">Editar</span>
          )}
        </td>
      ))}
    </tr>
  );
};