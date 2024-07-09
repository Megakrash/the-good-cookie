import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Grid, Typography } from "@mui/material";
import { StepFormButton } from "@/styles/MuiButtons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { VariablesColors } from "@/styles/Variables.colors";
import CircularProgress from "@mui/material/CircularProgress";

const colors = new VariablesColors();
const { colorOrange } = colors;

type StepSubmitProps = {
  onSubmit: () => void;
  loading: boolean;
};

const StepSubmit = (props: StepSubmitProps): React.ReactNode => {
  // ReCaptcha
  const [recaptcha, setRecaptcha] = useState(false);
  const captchaRef = useRef(null);
  const handleCaptchaChange = (value: string | null) => {
    setRecaptcha(!!value);
  };
  return (
    <Grid
      container
      item
      xs={11}
      sm={10}
      md={5}
      lg={3.5}
      sx={{
        display: "flex",
        margin: "auto",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 50, color: colorOrange }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Tout est ok ?
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {`Si c'est bon pour vous, c'est bon pour nous !`}
      </Typography>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        ref={captchaRef}
        onChange={handleCaptchaChange}
      />
      <StepFormButton
        sx={{ width: "100% ", marginTop: "10px" }}
        disabled={!recaptcha || props.loading}
        onClick={props.onSubmit}
      >
        {props.loading ? (
          <CircularProgress size={24} />
        ) : (
          "Valider mon inscription"
        )}
      </StepFormButton>
    </Grid>
  );
};

export default StepSubmit;
