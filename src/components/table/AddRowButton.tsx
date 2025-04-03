import { Button } from '../common/Button';

interface Props {
  onClick: () => void;
}

export const AddRowButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      ➕ Adicionar Linha
    </Button>
  );
};
