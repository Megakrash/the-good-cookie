import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {
  ListItemButton,
  List,
  Box,
  FormGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { MIDDLEWARE_URL } from "@/api/configApi";
import { FeatureType, SuggestionType } from "@/types/GpsTypes";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorLightGrey } = colors;

type GpsAndRadiusProps = {
  setLat: (lat: number) => void;
  setLong: (long: number) => void;
  setRadius: (radius: number) => void;
  radius: number;
};

function GpsAndRadius(props: GpsAndRadiusProps): React.ReactNode {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (newValue.length >= 4) {
      axios(`${MIDDLEWARE_URL}search-address?q=${newValue}`)
        .then((res) => {
          if (res.data && res.data.features) {
            setSuggestions(
              res.data.features.map((feature: FeatureType) => ({
                label: `${feature.properties.postcode} - ${feature.properties.city}`,
                postcode: feature.properties.postcode,
                city: feature.properties.city,
                coordinates: feature.geometry.coordinates,
              })),
            );
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des adresses:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionType) => {
    setInputValue(suggestion.label);
    props.setLong(suggestion.coordinates[0]);
    props.setLat(suggestion.coordinates[1]);
    setSuggestions([]);
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setRadius(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        id="location"
        size="small"
        sx={{ backgroundColor: colorLightGrey, borderRadius: "5px" }}
        label="Où ? (CP ou ville)"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        required
      />
      {suggestions.length > 0 && (
        <List>
          {suggestions.map((suggestion, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.label}
            </ListItemButton>
          ))}
        </List>
      )}
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="bottom"
          control={
            <Radio
              value="30"
              checked={props.radius === 30}
              size="small"
              onChange={handleRadiusChange}
            />
          }
          label="30Km"
          labelPlacement="bottom"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "12px",
            },
          }}
        />
        <FormControlLabel
          value="bottom"
          control={
            <Radio
              value="150"
              checked={props.radius === 150}
              size="small"
              onChange={handleRadiusChange}
            />
          }
          label="150Km"
          labelPlacement="bottom"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "12px",
            },
          }}
        />
        <FormControlLabel
          value="bottom"
          control={
            <Radio
              value="1500"
              checked={props.radius === 1500}
              size="small"
              onChange={handleRadiusChange}
            />
          }
          label="France"
          labelPlacement="bottom"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "12px",
            },
          }}
        />
      </FormGroup>
    </Box>
  );
}

export default GpsAndRadius;
