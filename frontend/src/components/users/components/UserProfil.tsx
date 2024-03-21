import React from 'react';
import { CustomRadioButton } from '@/styles/MuiRadio';
import { Box } from '@mui/material';

type UserProfilProps = {
  profil: string;
  setProfil: (profil: string) => void;
};

const UserProfil = (props: UserProfilProps): React.ReactNode => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setProfil(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <CustomRadioButton
        icon="pro"
        label="Je suis un professionnel"
        checked={props.profil === 'Pro'}
        onChange={handleChange}
        value="Pro"
      />
      <CustomRadioButton
        icon="particular"
        label="Je suis un particulier"
        checked={props.profil === 'Particulier'}
        onChange={handleChange}
        value="Particulier"
      />
    </Box>
  );
};

export default UserProfil;
