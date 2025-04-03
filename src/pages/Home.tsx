import { useState } from 'react';
import { useTableData, Registro } from '../hooks/useTableData';
import { AddRowButton } from '../components/table/AddRowButton';
import { AddProcessosButton } from '../components/table/AddProcessosButton';
import { AddProcessosModal } from '../components/modals/AddProcessosModal';
import { DataTable } from '../components/table/DataTable';
import { supabase } from '../services/supabaseClient';
import { TJSPModal } from '../components/modals/TJSPModal';

export const Home = () => {
  const { registros, addRegistro, addMultiplosProcessos, fetchRegistros } = useTableData();
  const [tempRows, setTempRows] = useState<Registro[]>([]);
  const [showProcessosModal, setShowProcessosModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroTribunal, setFiltroTribunal] = useState('');
  const [filtroAssessor, setFiltroAssessor] = useState('');
  const [registroTJSP, setRegistroTJSP] = useState<Registro | null>(null);
  const [showTJSPModal, setShowTJSPModal] = useState(false);
  

  const handleExcluirSelecionados = async () => {
    const idsValidos = selectedIds.filter((id) => !id.startsWith('temp-'));
    const idsTemporarios = selectedIds.filter((id) => id.startsWith('temp-'));

    if (idsValidos.length > 0) {
      const { error } = await supabase
        .from('registros')
        .delete()
        .in('id', idsValidos);

      if (!error) {
        fetchRegistros();
      }
    }

    setTempRows((prev) => prev.filter((r) => !idsTemporarios.includes(r.id)));
    setSelectedIds([]);
  };

  const handleAddEmptyRow = () => {
    const tempId = 'temp-' + Math.random().toString(36).substring(2, 9);
    setTempRows((prev) => [
      ...prev,
      {
        id: tempId,
        assistente: '',
        reu: '',
        processo_tjsp: '',
        processo_superior: '',
        tribunal: '',
        situacao: '',
        decisao: '',
        resumo: '',
        movimentacao: '',
        link: '',
      },
    ]);
  };

  const handleSalvar = async (row: Partial<Registro> & { id?: string }) => {
    if (!row.id) return;
  
    const isTemp = row.id.startsWith('temp-');
  
    if (isTemp) {
      const { id, ...semId } = row;
      const { error } = await addRegistro(semId as Omit<Registro, 'id'>);
      if (!error) {
        setTempRows((prev) => prev.filter((r) => r.id !== id));
        await fetchRegistros();
      }
    } else {
      const { error } = await supabase
        .from('registros')
        .update(row)
        .eq('id', row.id);
  
      if (!error) {
        await fetchRegistros();
      }
    }
  };
  

  const registrosFiltrados = [...tempRows, ...registros].filter((r) => {
    const tribunalOk = filtroTribunal ? r.tribunal === filtroTribunal : true;
    const assessorOk = filtroAssessor ? r.assistente === filtroAssessor : true;
    return tribunalOk && assessorOk;
  });

  const openTJSPModal = (registro: Registro) => {
    setRegistroTJSP(registro);
    setShowTJSPModal(true);
  };
  

  return (
    <div className="p-4 w-full">
      {/* Filtros e botões à esquerda */}
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 items-center justify-center w-full">
        <AddRowButton onClick={handleAddEmptyRow} />
        <AddProcessosButton onClick={() => setShowProcessosModal(true)} />
  
        <select
          className="border px-4 py-2 rounded text-base min-w-[150px]"
          value={filtroTribunal}
          onChange={(e) => setFiltroTribunal(e.target.value)}
        >
          <option value="">Todos os Tribunais</option>
          {[...new Set(registros.map((r) => r.tribunal).filter(Boolean))].map((tribunal) => (
            <option key={tribunal} value={tribunal}>{tribunal}</option>
          ))}
        </select>
  
        <select
          className="border px-4 py-2 rounded text-base min-w-[150px]"
          value={filtroAssessor}
          onChange={(e) => setFiltroAssessor(e.target.value)}
        >
          <option value="">Todos os Assessores</option>
          {[...new Set(registros.map((r) => r.assistente).filter(Boolean))].map((assessor) => (
            <option key={assessor} value={assessor}>{assessor}</option>
          ))}
        </select>
  
        {selectedIds.length > 0 && (
          <button
            onClick={handleExcluirSelecionados}
            className="px-4 py-2 bg-red-600 text-white text-base rounded hover:bg-red-700"
          >
            Excluir {selectedIds.length} linha(s)
          </button>
        )}
      </div>
  
      {/* Tabela alinhada ao mesmo bloco */}
      <DataTable
        registros={registrosFiltrados}
        onSalvar={handleSalvar}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onOpenTJSPModal={openTJSPModal}
      />


{showTJSPModal && registroTJSP && (
  <TJSPModal
    registroId={registroTJSP.id}
    onClose={() => setShowTJSPModal(false)}
    onSaveDetails={({ decisao, movimentacao }) => {
      const atualizado = {
        ...registroTJSP,
        decisao,
        movimentacao,
      };
      handleSalvar(atualizado);
      setShowTJSPModal(false);
    }}
  />
)}


  
      {showProcessosModal && (
        <AddProcessosModal
          onClose={() => setShowProcessosModal(false)}
          onConfirm={(numeros) => {
            addMultiplosProcessos(numeros, {
              assistente: '',
              reu: '',
              processo_superior: '',
              tribunal: '',
              situacao: '',
              decisao: '',
              resumo: '',
              movimentacao: '',
              link: '',
            });
          }}
        />
      )}
    </div>
  );  
};