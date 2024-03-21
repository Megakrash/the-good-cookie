import React from 'react';
import { TextField } from '@mui/material';

type AdPriceProps = {
  price: number;
  setPrice: (price: number) => void;
};

function AdPrice(props: AdPriceProps): React.ReactNode {
  return (
    <TextField
      className="adForm_boxForm_input"
      id="price"
      size="small"
      label="Prix de votre annonce (€)"
      variant="outlined"
      value={props.price || ''}
      onChange={(e) =>
        props.setPrice(e.target.value === '' ? 0 : Number(e.target.value))
      }
      required
    />
  );
}

export default AdPrice;
