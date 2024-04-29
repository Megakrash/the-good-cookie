export type StepSignUpFormProps = {
  email: string;
  setEmail: (email: string) => void;
  profil: string;
  setProfil: (profil: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  nickName: string;
  setNickName: (nickName: string) => void;
  picture: File | null;
  setPicture: (picture: File) => void;
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  password: string;
  setPassword: (password: string) => void;
  currentStep: string;
  setCurrentStep: (currentStep: string) => void;
};

// User form data types graphql to signup
export type UserFormData = {
  email: string;
  profil: string;
  gender: string;
  firstName: string;
  lastName: string;
  nickName: string;
  password: string;
  pictureId?: number;
  adress?: string;
  zipCode?: string;
  city?: string;
  coordinates?: [number, number];
  phoneNumber?: string;
};

export type UserTypes = {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  picture: {
    id: number;
    filename: string;
  };
  adress?: string;
  zipCode: string;
  city: string;
  coordinates: [number, number];
  phoneNumber?: string;
  registrationDate: string;
  role: string;
};

export type UserContextTypes = {
  id: string;
  nickName: string;
  picture: {
    id: number;
    path: string;
  };
};
