import { Button } from '../common/Button';

interface Props {
  onClick: () => void;
}

export const AddProcessosButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      ➕ Adicionar Processos
    </Button>
  );
};
