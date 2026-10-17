import {Still} from 'remotion';
import {Capa1, Capa2, Capa3, Capa4, Capa5, Capa6} from './Capas';
const capas = [Capa1, Capa2, Capa3, Capa4, Capa5, Capa6];
export const Root = () => (
  <>
    {capas.map((C, i) => (
      <Still key={i} id={`Capa${i + 1}`} component={C} width={1080} height={1350} />
    ))}
  </>
);
