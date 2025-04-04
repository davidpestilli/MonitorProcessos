// Código do TJSPModal.tsx com número separado em estado permanente

import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { CellModal } from '../table/CellModal';
import { toast } from 'sonner';
import { Plus, Hash, Trash2, Save, X } from 'lucide-react';

interface TJSPRegistro {
  id: string;
  data: string;
  decisao: string;
  movimentacao: string;
  isNew?: boolean;
}

interface TJSPModalProps {
  registroId: string;
  onClose: () => void;
  onSaveDetails: (detail: { decisao: string; movimentacao: string; numero?: string }) => void;
}

export const TJSPModal = ({ registroId, onClose, onSaveDetails }: TJSPModalProps) => {
  const [rows, setRows] = useState<TJSPRegistro[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRow, setEditingRow] = useState<TJSPRegistro | null>(null);
  const [editingField, setEditingField] = useState<keyof Omit<TJSPRegistro, 'id' | 'isNew'> | null>(null);
  const [showNumeroModal, setShowNumeroModal] = useState(false);
  const [numeroInput, setNumeroInput] = useState('');
  const [numeroSalvo, setNumeroSalvo] = useState('');

  const fetchDetalhes = async () => {
    const { data, error } = await supabase
      .from('detalhes_tjsp')
      .select('*')
      .eq('registro_id', registroId)
      .order('data', { ascending: false });

    if (!error && data) {
      const comIdsString = data.map((d: any) => ({ ...d, id: String(d.id) }));
      setRows(comIdsString);
    }
  };

  useEffect(() => {
    fetchDetalhes();
  }, [registroId]);

  const handleAddRow = () => {
    const tempId = 'temp-' + Math.random().toString(36).substring(2, 9);
    setRows((prev) => [
      {
        id: tempId,
        data: new Date().toISOString().split('T')[0],
        decisao: '',
        movimentacao: '',
        isNew: true,
      },
      ...prev,
    ]);
  };

  const handleDeleteSelected = () => {
    setRows((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    toast.success('Linhas excluídas');
  };

  const handleCellEdit = (row: TJSPRegistro, field: keyof Omit<TJSPRegistro, 'id' | 'isNew'>) => {
    setEditingRow(row);
    setEditingField(field);
  };

  const handleSaveCell = (newValue: string) => {
    if (!editingRow || !editingField) return;

    setRows((prev) =>
      prev.map((r) => (r.id === editingRow.id ? { ...r, [editingField]: newValue } : r))
    );
    setEditingRow(null);
    setEditingField(null);
  };

  const getLatestDetail = () => {
    if (rows.length === 0) return { decisao: '', movimentacao: '', ...(numeroSalvo ? { numero: numeroSalvo } : {}) };

    const sorted = [...rows].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    return {
      decisao: sorted[0].decisao || '',
      movimentacao: sorted[0].movimentacao || '',
      ...(numeroSalvo ? { numero: numeroSalvo } : {}),
    };
  };

  const handleSalvarTodos = async () => {
    const novos = rows.filter((r) => r.isNew);

    if (novos.length > 0) {
      const payload = novos.map((r) => ({
        registro_id: registroId,
        data: r.data,
        decisao: r.decisao,
        movimentacao: r.movimentacao,
      }));

      const { error } = await supabase.from('detalhes_tjsp').insert(payload);
      if (error) {
        toast.error('Erro ao salvar os detalhes.');
        return;
      }
    }

    toast.success('Detalhes salvos com sucesso');
    onSaveDetails(getLatestDetail());
    onClose();
  };

  const handleSalvarNumero = () => {
    setNumeroSalvo(numeroInput);
    setShowNumeroModal(false);
    setNumeroInput('');
    toast.success('Número atualizado');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800">TJSP Detalhes</h2>
          <button onClick={onClose} className="text-red-500 text-sm hover:underline flex items-center gap-1">
            <X size={16} /> Fechar
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-6">
          <button onClick={handleAddRow} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={16} /> Adicionar Linha
          </button>
          <button onClick={() => setShowNumeroModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2">
            <Hash size={16} /> Número
          </button>
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteSelected} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition flex items-center gap-2">
              <Trash2 size={16} /> Excluir {selectedIds.length} linha(s)
            </button>
          )}
        </div>

        <div className="mt-8">
          <table className="w-full border-collapse border table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">✓</th>
                <th className="border px-3 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide uppercase">Data</th>
                <th className="border px-3 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide uppercase">Decisão</th>
                <th className="border px-3 py-2 text-left text-sm font-semibold text-gray-700 tracking-wide uppercase">Movimentação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id]
                        )
                      }
                    />
                  </td>
                  <td className="border px-3 py-2 cursor-pointer" onClick={() => handleCellEdit(row, 'data')}>
                    {row.data || <span className="text-sm italic text-gray-500">Editar</span>}
                  </td>
                  <td className="border px-3 py-2 cursor-pointer" onClick={() => handleCellEdit(row, 'decisao')}>
                    {row.decisao || <span className="text-sm italic text-gray-500">Editar</span>}
                  </td>
                  <td className="border px-3 py-2 cursor-pointer" onClick={() => handleCellEdit(row, 'movimentacao')}>
                    {row.movimentacao || <span className="text-sm italic text-gray-500">Editar</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleSalvarTodos} className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
            <Save size={16} /> Salvar Detalhes
          </button>
        </div>

        {editingRow && editingField && (
          <CellModal
            campo={editingField}
            valor={editingRow[editingField] || ''}
            onClose={() => {
              setEditingRow(null);
              setEditingField(null);
            }}
            onSave={handleSaveCell}
          />
        )}

        {showNumeroModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[500px] pt-4 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Número</h2>
              <input
                className="w-full border px-4 py-2 text-base text-gray-800"
                value={numeroInput}
                onChange={(e) => setNumeroInput(e.target.value)}
              />
              <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setShowNumeroModal(false)} className="px-4 py-2 border text-base rounded text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleSalvarNumero} className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
