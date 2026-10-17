import {Still} from 'remotion';
import {Capa1, Capa2, Capa3, Capa4, Capa5, Capa6, Capa7, Capa8, Capa9, Capa10, Capa11, Capa12} from './Capas';
const capas = [Capa1, Capa2, Capa3, Capa4, Capa5, Capa6, Capa7, Capa8, Capa9, Capa10, Capa11, Capa12];
export const Root = () => (
  <>
    {capas.map((C, i) => (
      <Still key={i} id={`Capa${i + 1}`} component={C} width={1080} height={1350} />
    ))}
  </>
);
