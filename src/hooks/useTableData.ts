import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export type Registro = {
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
};

export function useTableData() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    const { data, error } = await supabase
      .from('registros')
      .select('*')
      .order('id', { ascending: true }); // ✅ garante ordem
  
    if (!error && data) {
      setRegistros(data);
    }
  };
  

  const addRegistro = async (novo: Omit<Registro, 'id'>) => {
    return await supabase.from('registros').insert(novo);
  };

  const addMultiplosProcessos = async (
    numeros: string[],
    camposExtras: Partial<Omit<Registro, 'id' | 'processo_tjsp'>>
  ) => {
    const novos = numeros.map((numero) => ({
      ...camposExtras,
      processo_tjsp: numero,
    }));

    const { error } = await supabase.from('registros').insert(novos);

    if (!error) fetchRegistros();
  };

  return {
    registros,
    loading,
    error,
    fetchRegistros,
    addRegistro,
    addMultiplosProcessos,
  };
}
