import { useState } from 'react';
import { useTableData, Registro } from '../hooks/useTableData';
import { AddProcessosButton } from '../components/table/AddProcessosButton';
import { AddProcessosModal } from '../components/modals/AddProcessosModal';
import { DataTable } from '../components/table/DataTable';
import { supabase } from '../services/supabaseClient';
import { TJSPModal } from '../components/modals/TJSPModal';
import { CellModal } from '../components/table/CellModal';

export const Home = () => {
  const { registros, setRegistros, addRegistro, addMultiplosProcessos, fetchRegistros } = useTableData();
  const [tempRows, setTempRows] = useState<Registro[]>([]);
  const [showProcessosModal, setShowProcessosModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtroTribunal, setFiltroTribunal] = useState('');
  const [filtroAssessor, setFiltroAssessor] = useState('');
  const [registroTJSP, setRegistroTJSP] = useState<Registro | null>(null);
  const [showTJSPModal, setShowTJSPModal] = useState(false);

  const [modalCampo, setModalCampo] = useState<keyof Registro | null>(null);
  const [modalValor, setModalValor] = useState('');
  const [registroEditando, setRegistroEditando] = useState<Registro | null>(null);

  const determinarSituacao = (movimentacao: string) => {
    if (!movimentacao) return '';
    const texto = movimentacao.toLowerCase();
    if (texto.includes('baixa')) return 'Baixa';
    if (texto.includes('trânsito')) return 'Trânsito';
    return 'Em Trâmite';
  };

  const abrirModalEdicao = (registro: Registro, campo: keyof Registro) => {
    setRegistroEditando(registro);
    setModalCampo(campo);
    setModalValor(registro[campo] || '');
  };

  const salvarModal = (novoValor: string) => {
    if (!registroEditando || !modalCampo) return;

    const atualizado: Registro = {
      ...registroEditando,
      [modalCampo]: novoValor,
    };

    if (modalCampo === 'movimentacao') {
      atualizado.situacao = determinarSituacao(novoValor);
    }

    handleSalvar(atualizado);
    setModalCampo(null);
    setRegistroEditando(null);
    setModalValor('');
  };

  const handleExcluirSelecionados = async () => {
    const idsValidos = selectedIds.filter((id) => !id.startsWith('temp-'));
    const idsTemporarios = selectedIds.filter((id) => id.startsWith('temp-'));

    if (idsValidos.length > 0) {
      const { error } = await supabase
        .from('registros_processos')
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
      const { data, error } = await addRegistro(semId as Omit<Registro, 'id'>);
      if (!error && data && data.length > 0) {
        const novoRegistro = data[0];

        setTempRows((prev) => prev.filter((r) => r.id !== id));

        setRegistros((prev) => [novoRegistro, ...prev.filter((r) => r.id !== novoRegistro.id)]);

        return novoRegistro;
      }
    } else {
      const { error } = await supabase
        .from('registros_processos')
        .update(row)
        .eq('id', row.id);

      if (!error) {
        setRegistros((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, ...row } : r))
        );
      }
      return row as Registro;
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

  const handleSalvarDetalhes = ({ id, numero, decisao, movimentacao }: {
    id?: string;
    numero?: string;
    decisao: string;
    movimentacao: string;
  }) => {
    if (!registroTJSP) return;
  
    const novaMovimentacao = movimentacao || registroTJSP.movimentacao;
    const novaSituacao = determinarSituacao(novaMovimentacao);
  
    const atualizado = {
      ...registroTJSP,
      id: id || registroTJSP.id, // agora garante que é o id real
      processo_tjsp: numero ?? registroTJSP.processo_tjsp,
      decisao: decisao || registroTJSP.decisao,
      movimentacao: novaMovimentacao,
      situacao: novaSituacao,
    };
  
    handleSalvar(atualizado);
  };
  

  const handleSalvarRegistroTemp = async (registro: Registro): Promise<Registro> => {
    const resultado = await handleSalvar(registro);
    const atualizado = typeof resultado === 'object' ? resultado : registro;
    setRegistroTJSP(atualizado);
    setRegistros((prev) => [atualizado, ...prev.filter((r) => r.id !== atualizado.id)]);
    return atualizado;
    
  };

  return (
    <div className="p-4 w-full">
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 items-center justify-center w-full">
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

      <DataTable
        registros={registrosFiltrados}
        onSalvar={handleSalvar}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onOpenTJSPModal={openTJSPModal}
        onEditarCampo={abrirModalEdicao}
      />

      {showTJSPModal && registroTJSP && (
        <TJSPModal
          registro={registroTJSP}
          onClose={() => setShowTJSPModal(false)}
          onSaveDetails={handleSalvarDetalhes}
          onSaveRegistroTemp={handleSalvarRegistroTemp}
        />
      )}

      {showProcessosModal && (
        <AddProcessosModal
          onClose={() => setShowProcessosModal(false)}
          onConfirm={async (dados) => {
            const { data, error } = await addMultiplosProcessos(
              dados,
              {
                assistente: '',
                reu: '',
                processo_superior: '',
                situacao: '',
                decisao: '',
                resumo: '',
                movimentacao: '',
                link: '',
              }
            );

            if (!error && data) {
              setRegistros((prev) => [...data, ...prev]);
            }
          }}
        />
      )}

      {modalCampo && registroEditando && (
        <CellModal
          campo={modalCampo}
          valor={modalValor}
          onClose={() => setModalCampo(null)}
          onSave={salvarModal}
        />
      )}
    </div>
  );
};
