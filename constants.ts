import { WheelSector, WheelSectorType } from './types';

export const WHEEL_SECTORS: WheelSector[] = [
  { label: '100', value: 100, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: 'PERDEU TUDO', value: 0, type: WheelSectorType.BANKRUPT, color: '#1E1E1E', textColor: '#FFFFFF' },
  { label: '200', value: 200, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: '400', value: 400, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: 'PASSA A VEZ', value: 0, type: WheelSectorType.PASS, color: '#F40009', textColor: '#FFFFFF' }, // Styled slightly diff
  { label: '500', value: 500, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: '1000', value: 1000, type: WheelSectorType.POINT, color: '#1E1E1E', textColor: '#FFFFFF' },
  { label: '300', value: 300, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: '250', value: 250, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: 'PERDEU TUDO', value: 0, type: WheelSectorType.BANKRUPT, color: '#1E1E1E', textColor: '#FFFFFF' },
  { label: '150', value: 150, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
  { label: '800', value: 800, type: WheelSectorType.POINT, color: '#FFFFFF', textColor: '#F40009' },
];

export const INITIAL_PUZZLES = [
  { id: '1', category: 'BEBIDAS', phrase: 'COCA COLA GELADA' },
  { id: '2', category: 'FILMES', phrase: 'VINGADORES ULTIMATO' },
  { id: '3', category: 'DITADO POPULAR', phrase: 'QUEM RI POR ULTIMO RI MELHOR' }
];
