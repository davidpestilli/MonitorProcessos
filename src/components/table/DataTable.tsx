import { useState } from 'react';
import { Registro } from '../../hooks/useTableData';
import { TableRow } from './TableRow';
import { CellModal } from './CellModal';

interface Props {
  registros: Registro[];
  onSalvar: (row: Omit<Registro, 'id'>) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenTJSPModal?: (registro: Registro) => void;
}

export const DataTable = ({ registros, onSalvar, selectedIds, setSelectedIds, onOpenTJSPModal }: Props) => {
  const [registroEditando, setRegistroEditando] = useState<Registro | null>(null);
  const [campoEditando, setCampoEditando] = useState<keyof Omit<Registro, 'id'> | null>(null);

  const handleEditar = (registro: Registro, campo: keyof Omit<Registro, 'id'>) => {
    setRegistroEditando(registro);
    setCampoEditando(campo);
  };

  return (
    <>
    <div className="w-full flex justify-center">
    <table className="border-collapse border table-auto">
        <thead className="bg-white">
          <tr>
            <th className="border px-3 py-2 text-base text-center">
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
            {[
              'Assistente',
              'Réu',
              'TJSP',
              'STF/STJ',
              'Tribunal',
              'Situação',
              'Decisão',
              'Resumo',
              'Movimentação',
              'Link',
            ].map((label) => (
              <th key={label} className="border px-3 py-2 text-base text-left bg-gray-100">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <TableRow
              key={r.id}
              registro={r}
              selecionado={selectedIds.includes(r.id)}
              onSelecionar={() =>
                setSelectedIds((prev) =>
                  prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                )
              }
              onEditar={handleEditar}
              onSalvar={onSalvar}
              onOpenTJSPModal={onOpenTJSPModal}
            />
          ))}
        </tbody>
      </table>
      </div>
      {registroEditando && campoEditando && (
        <CellModal
          campo={campoEditando}
          valor={registroEditando[campoEditando] ?? ''}
          onClose={() => {
            setCampoEditando(null);
            setRegistroEditando(null);
          }}
          onSave={(novoValor) => {
            const atualizado = {
              ...registroEditando,
              [campoEditando]: novoValor,
            };
            onSalvar(atualizado);
            setCampoEditando(null);
            setRegistroEditando(null);
          }}
        />
      )}
    </>
  );
  
};
