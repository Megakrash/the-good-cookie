import { AdTypes } from "./AdTypes";

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
  picture: string;
  adress?: string;
  zipCode?: string;
  city?: string;
  coordinates?: [number, number];
  phoneNumber?: string;
};
export type UserUpdateFormData = {
  profil?: string;
  gender?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  currentPassword?: string;
  newPassword?: string;
  picture?: string;
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
  picture: string;
  adress?: string;
  zipCode?: string;
  city?: string;
  coordinates?: [number, number];
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  role: string;
  gender?: string;
  profil: string;
  createdBy?: UserTypes;
  updatedBy?: UserTypes;
  ads?: AdTypes[];
};

export type UserContextTypes = {
  id: string;
  nickName: string;
  role: string;
  picture: string;
};
