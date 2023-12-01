import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { ListItemButton, List, Box } from "@mui/material";
import { API_URL } from "@/api/configApi";

type UserZipCityProps = {
  setCity: (city: string) => void;
  setZipCode: (zipCode: string) => void;
};
type SuggestionType = {
  label: string;
  postcode: string;
  city: string;
};

type FeatureType = {
  properties: {
    postcode: string;
    city: string;
  };
};

const UserZipCity = (props: UserZipCityProps): React.ReactNode => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (newValue.length >= 5) {
      axios(`${API_URL}search-address?q=${newValue}`)
        .then((res) => {
          if (res.data && res.data.features) {
            setSuggestions(
              res.data.features.map((feature: FeatureType) => ({
                label: `${feature.properties.postcode} - ${feature.properties.city}`,
                postcode: feature.properties.postcode,
                city: feature.properties.city,
              }))
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
    props.setZipCode(suggestion.postcode);
    props.setCity(suggestion.city);
    setSuggestions([]);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        label="Code postal"
        variant="outlined"
        size="small"
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
    </Box>
  );
};

export default UserZipCity;
