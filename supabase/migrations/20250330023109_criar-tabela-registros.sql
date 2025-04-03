create extension if not exists "uuid-ossp";

create table registros (
  id uuid primary key default uuid_generate_v4(),
  assistente text,
  reu text,
  processo_tjsp text,
  processo_superior text,
  tribunal text,
  situacao text, -- renomeado
  decisao text,
  resumo text,
  movimentacao text,
  link text
);
