import React, { useState } from "react";
import {
  Typography,
  TextField,
  List,
  ListItem,
  IconButton,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

export type ScoreEntry = {
  name: string;
  time: string;
  house?: string;
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

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#282c34",
          color: "white",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent sx={{ marginTop: "1rem" }}>
        <Typography>
          Are you sure you want to delete the entry for{" "}
          <span style={{ color: "#90caf9" }}>{itemName}</span>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const getHouseColor = (house?: string) => {
  switch (house) {
    case "green":
      return "#4caf50";
    case "blue":
      return "#2196f3";
    case "yellow":
      return "#ffeb3b";
    case "red":
      return "#f44336";
    default:
      return undefined;
  }
};

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  data,
  formatTime,
  onItemDelete,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setSelectedIndex(index);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIndex !== null) {
      onItemDelete(selectedIndex);
    }
    setSelectedIndex(null);
  };

  return (
    <>
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
              paddingRight: "100px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                color: "white",
                width: "100%",
              }}
            >
              <span style={{ minWidth: "200px" }}>Name</span>
              <span style={{ minWidth: "150px" }}>Time</span>
              <span style={{ minWidth: "100px" }}>House</span>
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
                paddingRight: "100px",
              }}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => handleDeleteClick(index)}
                    edge="end"
                    aria-label="delete"
                    sx={{
                      color: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        color: "#f44336",
                      },
                    }}
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
                  gap: "2rem",
                  color: "white",
                  width: "100%",
                }}
              >
                <span style={{ minWidth: "200px" }}>{item.name}</span>
                <span style={{ minWidth: "150px", color: "#90caf9" }}>
                  {formatTime(parseInt(item.time))}
                </span>
                {item.house && (
                  <span
                    style={{
                      minWidth: "100px",
                      color: getHouseColor(item.house),
                      textTransform: "capitalize",
                    }}
                  >
                    {item.house}
                  </span>
                )}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedIndex(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedIndex !== null ? data[selectedIndex].name : ""}
      />
    </>
  );
};
