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
  index: number;
  onSalvar: (registro: Partial<Registro> & { id: string }) => void;
  onExcluir: (id: string) => void;
  onOpenTJSPModal: (registro: Registro) => void;
  onEditarCampo: (registro: Registro, campo: keyof Registro) => void;
  selecionado: boolean;
  toggleSelecionado: () => void;
}

export const TableRow = ({
  registro,
  index,
  onSalvar,
  onExcluir,
  onOpenTJSPModal,
  onEditarCampo,
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

    const campoFormatado: { [key in keyof Registro]?: { label: string; color: string; emoji: string } } = {
      assistente: { label: 'Assistente', color: 'text-blue-600', emoji: '🧑‍💼' },
      reu: { label: 'Réu', color: 'text-red-600', emoji: '⚖️' },
      processo_tjsp: { label: 'TJSP', color: 'text-purple-600', emoji: '📄' },
      processo_superior: { label: 'Superior', color: 'text-purple-500', emoji: '📁' },
      tribunal: { label: 'Tribunal', color: 'text-indigo-600', emoji: '🏛️' },
      situacao: { label: 'Situação', color: 'text-yellow-600', emoji: '📌' },
      decisao: { label: 'Decisão', color: 'text-green-600', emoji: '✅' },
      resumo: { label: 'Resumo', color: 'text-gray-700', emoji: '📝' },
      movimentacao: { label: 'Movimentação', color: 'text-orange-600', emoji: '📦' },
      link: { label: 'Link', color: 'text-cyan-600', emoji: '🔗' },
    };

    const info = campoFormatado[editingField] || { label: 'Campo', color: 'text-green-600', emoji: '✅' };

    toast.success(
      <span>
        {info.emoji} Registro de <span className={`${info.color} font-semibold`}>{info.label}</span> atualizado com sucesso
      </span>
    );

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

      <td className="border px-3 py-2 text-center text-sm font-mono">{index + 1}</td>

      {campos.map((campo) => (
        <td
          key={campo}
          className="border px-3 py-2 cursor-pointer text-sm"
          onClick={() => {
            if (campo === 'processo_tjsp') {
              onOpenTJSPModal(registro);
            } else if (['decisao', 'resumo', 'movimentacao'].includes(campo)) {
              onEditarCampo(registro, campo);
            } else if (!['tribunal', 'situacao'].includes(campo)) {
              abrirEdicao(campo);
            }
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
