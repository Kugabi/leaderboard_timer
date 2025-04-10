import React from "react";
import {
  Typography,
  TextField,
  List,
  ListItem,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";

export type ScoreEntry = {
  name: string;
  time: string;
};

export const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "white",
    fontFamily: "monospace",
    fontSize: "1.2rem",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.87)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
});

interface LeaderboardListProps {
  data: ScoreEntry[];
  formatTime: (ms: number) => string;
  onItemDelete: (key: number) => void;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  data,
  formatTime,
  onItemDelete,
}) => {
  return (
    <Paper
      style={{
        maxHeight: 400,
        maxWidth: 800,
        minWidth: 800,
        overflow: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginTop: "2rem",
      }}
    >
      <List>
        <ListItem
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            "&:last-child": {
              borderBottom: "none",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              color: "white",
            }}
          >
            <span style={{ minWidth: "150px" }}>{"Name"}</span>
            <span style={{ color: "#90caf9" }}>{"Time"}</span>
          </Typography>
        </ListItem>
        {data?.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              "&:last-child": {
                borderBottom: "none",
              },
            }}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => onItemDelete(index)}
                  edge="end"
                  aria-label="delete"
                  sx={{ color: "rgba(255, 255, 255, 0.3)" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                color: "white",
              }}
            >
              <span style={{ minWidth: "150px" }}>{item.name}</span>
              <span style={{ color: "#90caf9" }}>
                {formatTime(parseInt(item.time))}
              </span>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
