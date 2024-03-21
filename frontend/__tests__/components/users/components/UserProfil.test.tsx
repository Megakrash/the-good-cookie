import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfil from '@/components/users/components/UserProfil';

describe('UserProfil', () => {
  const setProfilMock = jest.fn();

  beforeEach(() => {
    render(<UserProfil profil="" setProfil={setProfilMock} />);
  });

  it('renders correctly', () => {
    expect(
      screen.getByLabelText('Je suis un professionnel'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Je suis un particulier')).toBeInTheDocument();
  });

  it('sets the profile to Pro when the corresponding button is clicked', () => {
    const proButton = screen.getByLabelText('Je suis un professionnel');
    fireEvent.click(proButton);
    expect(setProfilMock).toHaveBeenCalledWith('Pro');
  });

  it('sets the profile to Particulier when the corresponding button is clicked', () => {
    const particularButton = screen.getByLabelText('Je suis un particulier');
    fireEvent.click(particularButton);
    expect(setProfilMock).toHaveBeenCalledWith('Particulier');
  });
});
