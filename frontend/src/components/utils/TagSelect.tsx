import React from "react";
import { useQuery } from "@apollo/client";
import { queryAllTags } from "@/graphql/tags/queryAlltags";
import { AdTag } from "@/types/AdTypes";
import { TagTypes } from "@/types/TagTypes";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorWhite } = colors;

type TagSelectProps = {
  selectedTags: AdTag[];
  setSelectedTags: (tags: AdTag[]) => void;
};

const TagSelect = (props: TagSelectProps) => {
  // Get Tags
  const { data: dataTags } = useQuery<{ items: TagTypes[] }>(queryAllTags);
  const tags = dataTags ? dataTags.items : [];

  const handleChangeTag = (event: SelectChangeEvent<string[]>) => {
    const value: string[] = event.target.value as unknown as string[];
    const selectedOptions: AdTag[] = value.map((id) => ({ id }));
    props.setSelectedTags(selectedOptions);
  };
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="tags">Tag(s)</InputLabel>
      <Select
        className="adForm_boxForm_input"
        labelId="tags-label"
        id="select-tags"
        multiple
        value={props.selectedTags.map((tag) => tag.id)}
        onChange={handleChangeTag}
        input={<OutlinedInput label="Tag" />}
        sx={{ backgroundColor: colorWhite }}
        renderValue={(selected) =>
          selected
            .map((id) => tags.find((tag) => tag.id === id)?.name || "")
            .join(", ")
        }
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {tag.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagSelect;
