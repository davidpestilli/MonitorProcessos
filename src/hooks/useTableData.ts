import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export interface Registro {
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

export const useTableData = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);

  const fetchRegistros = async () => {
    const { data, error } = await supabase.from('registros_processos').select('*');
    if (!error && data) {
      setRegistros(data);
    }
  };

  const addRegistro = async (registro: Omit<Registro, 'id'>) => {
    const { data, error } = await supabase
      .from('registros_processos')
      .insert([registro])
      .select(); // ✅ adicionado para retornar o registro inserido

    return { data, error };
  };

  const addMultiplosProcessos = async (
    numeros: string[],
    dadosComuns: Omit<Registro, 'id' | 'processo_tjsp'>
  ) => {
    const lista = numeros.filter((num) => num.length > 0);
  
    const novosRegistros = lista.map((processo) => ({
      ...dadosComuns,
      processo_tjsp: processo,
    }));
  
    const { data, error } = await supabase
      .from('registros_processos')
      .insert(novosRegistros)
      .select(); // ✅ necessário para retornar os registros criados
  
    return { data, error };
  };
  


  useEffect(() => {
    fetchRegistros();
  }, []);

  return {
    registros,
    setRegistros,
    addRegistro,
    fetchRegistros,
    addMultiplosProcessos,
  };
};