import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { CellModal } from '../table/CellModal';

interface TJSPRegistro {
  id: number;
  data: string;
  decisao: string;
  movimentacao: string;
}

interface TJSPModalProps {
  registroId: number;
  onClose: () => void;
  onSaveDetails: (detail: { decisao: string; movimentacao: string }) => void;
}

export const TJSPModal = ({ registroId, onClose, onSaveDetails }: TJSPModalProps) => {
  const [rows, setRows] = useState<TJSPRegistro[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<TJSPRegistro | null>(null);
  const [editingField, setEditingField] = useState<keyof Omit<TJSPRegistro, 'id'> | null>(null);

  const fetchDetalhes = async () => {
    if (!registroId) return;

    const { data, error } = await supabase
      .from('tjsp_detalhes')
      .select('*')
      .eq('registro_id', registroId)
      .order('data', { ascending: false });

    if (!error && data) setRows(data);
  };

  useEffect(() => {
    fetchDetalhes();
  }, [registroId]);

  const handleAddRow = async () => {
    if (!registroId) return;

    const { error } = await supabase.from('tjsp_detalhes').insert([
      {
        registro_id: registroId,
        decisao: '',
        movimentacao: '',
      },
    ]);
    if (!error) fetchDetalhes();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from('tjsp_detalhes')
      .delete()
      .in('id', selectedIds);

    if (!error) {
      setSelectedIds([]);
      fetchDetalhes();
    }
  };

  const handleCellEdit = (row: TJSPRegistro, field: keyof Omit<TJSPRegistro, 'id'>) => {
    setEditingRow(row);
    setEditingField(field);
  };

  const handleSaveCell = async (newValue: string) => {
    if (!editingRow || !editingField) return;

    const { error } = await supabase
      .from('tjsp_detalhes')
      .update({ [editingField]: newValue })
      .eq('id', editingRow.id);

    if (!error) {
      setEditingRow(null);
      setEditingField(null);
      fetchDetalhes();
    }
  };

  const getLatestDetail = () => {
    if (rows.length === 0) return { decisao: '', movimentacao: '' };

    const sorted = [...rows].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    return {
      decisao: sorted[0].decisao || '',
      movimentacao: sorted[0].movimentacao || '',
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">TJSP Detalhes</h2>
          <button onClick={onClose} className="text-red-500">Fechar</button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Adicionar Linha
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Excluir {selectedIds.length} linha(s)
            </button>
          )}
        </div>

        <table className="w-full border-collapse border table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Selecionar</th>
              <th className="border px-3 py-2 text-left">Data</th>
              <th className="border px-3 py-2 text-left">Decisão</th>
              <th className="border px-3 py-2 text-left">Movimentação</th>
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
                <td
                  className="border px-3 py-2 cursor-pointer"
                  onClick={() => handleCellEdit(row, 'data')}
                >
                  {row.data || <span className="text-gray-400 italic">Editar</span>}
                </td>
                <td
                  className="border px-3 py-2 cursor-pointer"
                  onClick={() => handleCellEdit(row, 'decisao')}
                >
                  {row.decisao || <span className="text-gray-400 italic">Editar</span>}
                </td>
                <td
                  className="border px-3 py-2 cursor-pointer"
                  onClick={() => handleCellEdit(row, 'movimentacao')}
                >
                  {row.movimentacao || <span className="text-gray-400 italic">Editar</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const latestDetail = getLatestDetail();
              onSaveDetails(latestDetail);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Salvar Detalhes
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
      </div>
    </div>
  );
};
