import { Registro } from '../types';
import { TableRow } from './TableRow';

interface DataTableProps {
  registros: Registro[];
  onSalvar: (registro: Partial<Registro> & { id: string }) => void;
  onExcluir: (id: string) => void;
  onOpenTJSPModal: (registro: Registro) => void;
  onEditarCampo: (registro: Registro, campo: keyof Registro) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export const DataTable = ({
  registros,
  onSalvar,
  onExcluir,
  onOpenTJSPModal,
  onEditarCampo,
  selectedIds,
  setSelectedIds,
}: DataTableProps) => {
  const toggleSelecionado = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-center">
              <input
                type="checkbox"
                checked={registros.every((r) => selectedIds.includes(r.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(registros.map((r) => r.id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
              />
            </th>
            <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">SEQ</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Gap</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Réu</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">TJSP</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Superior</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Tribunal</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Situação</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Decisão</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Resumo</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Movimentação</th>
            <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Link</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <TableRow
              key={registro.id}
              index={index}
              registro={registro}
              onSalvar={onSalvar}
              onExcluir={onExcluir}
              onOpenTJSPModal={onOpenTJSPModal}
              onEditarCampo={onEditarCampo}
              selecionado={selectedIds.includes(registro.id)}
              toggleSelecionado={() => toggleSelecionado(registro.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};