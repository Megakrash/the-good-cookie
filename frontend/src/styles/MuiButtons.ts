import { styled } from '@mui/material';
import { VariablesColors } from './Variables.colors';

const colors = new VariablesColors();
const { color1, color2, color3, color4 } = colors;

interface ButtonsHoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GreyBtnOrangeHover = styled('button')<ButtonsHoverProps>(() => ({
  borderRadius: '10px',
  backgroundColor: color3,
  color: color1,
  fontWeight: '600',
  maxWidth: 'fit-content',
  minWidth: '160px',
  minHeight: '40px',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition:
    'background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease',
  '&:hover': {
    backgroundColor: color4,
    color: color1,
    border: `1px solid ${color1}`,
  },
  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: color3,
    color: color1,
  },
}));

export const StepFormButton = styled('button')<ButtonsHoverProps>(() => ({
  borderRadius: '10px',
  backgroundColor: color3,
  color: color1,
  fontWeight: '600',
  minWidth: '160px',
  minHeight: '40px',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition:
    'background-color 0.4s ease, color 0.4s ease, font-weight 0.4s ease',
  '&:hover': {
    backgroundColor: color4,
  },
  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: color2,
  },
}));
