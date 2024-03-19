import React, { FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { mutationCreateUser } from '@/components/graphql/Users';
import { UserFormData } from '@/types/UserTypes';
import { API_URL, RECAPTCHA_SITE_KEY } from '@/api/configApi';
import { useMutation } from '@apollo/client';
import router from 'next/router';
import { DownloadInput } from '@/styles/MuiStyled';
import SendIcon from '@mui/icons-material/Send';
import UserPhone from '../components/UserPhone';
import UserEmail from '../components/UserEmail';
import UserZipCity from '../components/UserZipCity';
import UserPassword from '../components/UserPassword';
import UserName from '../components/UserName';
import StepForm from './StepForm';
import { VariablesColors } from '@/styles/Variables.colors';
import StepWelcome from './StepWelcome';
import StepSubmit from './StepSubmit';

const colors = new VariablesColors();
const { color2, color5, errorColor } = colors;

function SignUp(): React.ReactNode {
  // ReCaptcha
  const [recaptcha, setRecaptcha] = useState(false);
  const captchaRef = useRef(null);
  const handleCaptchaChange = (value: string | null) => {
    setRecaptcha(!!value);
  };

  // Form
  const [profil, setProfil] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const hidenPassword = (): string => {
    const length = password.length;
    const hidenPassword = '*'.repeat(length);
    return hidenPassword;
  };
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  // FORM STEPS
  const [currentStep, setCurrentStep] = useState<string>('email');
  const formSteps = [
    {
      step: 'email',
      title: 'Votre adresse email',
      data: email,
    },
    {
      step: 'profil',
      title: 'Votre profil',
      data: profil,
    },
    { step: 'firstName', title: 'Votre prénom', data: firstName },
    { step: 'lastName', title: 'Votre nom', data: lastName },
    {
      step: 'phoneNumber',
      title: 'Votre numéro de téléphone',
      data: phoneNumber,
    },
    { step: 'password', title: 'Votre mot de passe', data: password },
  ];

  // SUBMIT
  const [doCreate, loading] = useMutation(mutationCreateUser);
  async function onSubmit() {
    const dataFile = new FormData();
    dataFile.append('title', nickName);
    dataFile.append('file', picture);

    try {
      let pictureId: number | null = null;
      if (picture) {
        const uploadResponse = await axios.post(`${API_URL}picture`, dataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        pictureId = uploadResponse.data.id;
      }

      const data: UserFormData = {
        firstName,
        lastName,
        nickName,
        email,
        password,
        pictureId,
        zipCode,
        city,
        coordinates,
        isVerified: false,
        role: 'USER',
        ...(phoneNumber !== '' && { phoneNumber }),
      };

      const result = await doCreate({
        variables: {
          data,
        },
      });
      if ('id' in result.data?.item) {
        toast(
          `Bienvenue ${result.data?.item.nickName} ! Un email de confirmation vous a été envoyé.`,
        );
        setTimeout(() => {
          router.replace(`/`);
        }, 2000);
      } else {
        toast('Erreur pendant la création de votre compte');
      }
    } catch (error) {
      toast('Erreur pendant la création de votre compte');
      console.error('error', error);
    }
  }
  return (
    // <Card className="userForm">
    //   <Toaster
    //     toastOptions={{
    //       style: {
    //         background: '#ff8a00',
    //         color: '#fff',
    //       },
    //     }}
    //   />
    //   <Typography variant="h4" gutterBottom>
    //     Création de votre Cookie compte
    //   </Typography>
    //   <FormControl
    //     className="userForm_control"
    //     component="form"
    //     autoComplete="off"
    //     onSubmit={onSubmit}
    //   >
    //     <UserName
    //       userName={firstName}
    //       setUserName={setFirstName}
    //       type={'firstName'}
    //     />
    //     <UserName
    //       userName={lastName}
    //       setUserName={setLastName}
    //       type={'lastName'}
    //     />
    //     <Box className="userForm_control_box">
    //       <TextField
    //         fullWidth
    //         id="pseudo"
    //         size="small"
    //         label="Pseudo"
    //         variant="outlined"
    //         value={nickName || ''}
    //         onChange={(e) => setNickName(e.target.value)}
    //         required
    //       />
    //       <UserEmail email={email} setEmail={setEmail} />
    //     </Box>
    //     <UserPassword password={password} setPassword={setPassword} />
    //     <Box className="userForm_control_box">
    //       <UserZipCity
    //         zipCode={zipCode}
    //         setCity={setCity}
    //         setZipCode={setZipCode}
    //         setCoordinates={setCoordinates}
    //       />
    //       <UserPhone
    //         phoneNumber={phoneNumber}
    //         setPhoneNumber={setPhoneNumber}
    //       />
    //     </Box>
    //     {previewUrl && (
    //       <CardMedia
    //         sx={{
    //           width: '200px',
    //           height: '200px',
    //           margin: 'auto',
    //           objectFit: 'cover',
    //           borderRadius: '5px',
    //         }}
    //         image={previewUrl}
    //       />
    //     )}
    //     <Button
    //       component="label"
    //       variant="contained"
    //       startIcon={<CloudUploadIcon />}
    //     >
    //       Télécharger une image de profil
    //       <DownloadInput
    //         type="file"
    //         accept=".jpg, .png, .webp"
    //         onChange={handleFileSelection}
    //       />
    //     </Button>
    //     <ReCAPTCHA
    //       sitekey={RECAPTCHA_SITE_KEY}
    //       ref={captchaRef}
    //       onChange={handleCaptchaChange}
    //     />

    //     <Button
    //       variant="contained"
    //       size="large"
    //       type="submit"
    //       disabled={!recaptcha && true}
    //       endIcon={<SendIcon />}
    //     >
    //       Créer mon Cookie compte
    //     </Button>

    //     <Box className="userForm_control_boxConnect">
    //       <Typography variant="subtitle2" gutterBottom>
    //         Déjà inscrit ?
    //       </Typography>
    //       <Link variant="body2" href="/signin">
    //         Connectez-vous
    //       </Link>
    //     </Box>
    //   </FormControl>
    // </Card>
    <>
      {currentStep === 'welcome' ? (
        <StepWelcome email={email} />
      ) : (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Toaster />
          <Grid
            item
            xs={6}
            sm={4}
            md={3.5}
            lg={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: color5,
              height: '89vh',
              padding: '1%',
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              marginBottom={'25px'}
              gutterBottom
            >
              Vos informations
            </Typography>
            {formSteps.map((el) => (
              <Box key={el.step} sx={{ marginBottom: '25px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  {el.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {el.step === 'password' ? (
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      {!el.data ? '-' : hidenPassword()}
                    </Typography>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      {el.data ? el.data : '-'}
                    </Typography>
                  )}
                  {el.data && el.step !== currentStep && (
                    <Button onClick={() => setCurrentStep(el.step)}>
                      Modifier
                    </Button>
                  )}
                </Box>
                <Divider />
              </Box>
            ))}
          </Grid>
          <Grid item xs={6} sm={6} md={8.5}>
            {currentStep === 'submit' ? (
              <StepSubmit onSubmit={onSubmit} loading={loading.loading} />
            ) : (
              <StepForm
                email={email}
                setEmail={setEmail}
                profil={profil}
                setProfil={setProfil}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                password={password}
                setPassword={setPassword}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default SignUp;
