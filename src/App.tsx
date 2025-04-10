import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Button,
  Typography,
  Stack,
  MenuItem,
  Select,
  SelectChangeEvent,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  StyledTextField,
  LeaderboardList,
  ScoreEntry,
} from "./components/LeaderboardComponents";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#282c34",
      paper: "#282c34",
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
  },
});

type InfoMessage = {
  severity: "success" | "info" | "warning" | "error";
  message: string;
};

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [teamName, setTeamName] = useState<string>("");
  const [house, setHouse] = useState<string | undefined>();
  const [infoMessage, setInfoMessage] = useState<InfoMessage | null>(null);
  const [data, setData] = useState<ScoreEntry[] | null>(null);

  useEffect(() => {
    console.log("loading scores");
    const jsonData = localStorage.getItem("data");
    const data: ScoreEntry[] = jsonData ? JSON.parse(jsonData) : [];
    data.sort((a, b) => Number(a.time) - Number(b.time));
    setData(data);
  }, []);

  const updateData = (newData: ScoreEntry[]) => {
    // if (!data) return;
    newData.sort((a, b) => Number(a.time) - Number(b.time));
    setData(newData);
    const jsonData = JSON.stringify(newData);
    localStorage.setItem("data", jsonData);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && startTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        setElapsedTime(now.getTime() - startTime.getTime());
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const startTimer = () => {
    const now = new Date();
    const adjustedStartTime = new Date(now.getTime() - elapsedTime);
    setStartTime(adjustedStartTime);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (startTime) {
      const now = new Date();
      const deltaTime = now.getTime() - startTime.getTime();
      setElapsedTime(deltaTime);
      localStorage.setItem("test", deltaTime.toString());
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
    setInfoMessage(null);
    setTeamName("");
    setHouse(undefined);
  };

  const saveTime = () => {
    if (!data) {
      setInfoMessage({ severity: "error", message: "data was null" });
      return;
    }
    if (!elapsedTime) {
      setInfoMessage({ severity: "warning", message: "Time is empty" });
      return;
    }
    if (!teamName) {
      setInfoMessage({
        severity: "warning",
        message: "You must enter a team name to save",
      });
      return;
    }
    console.log("saving entry:", teamName, elapsedTime.toString());
    setInfoMessage({ severity: "info", message: "saving Data" });
    const entry: ScoreEntry = {
      name: teamName,
      time: elapsedTime.toString(),
      house: house,
    };
    const newData = [...data, entry];
    // setData(newData);
    updateData(newData);
    resetTimer();
  };

  const deleteItem = (index: number) => {
    if (data === null) return;
    console.log("removing at", index, "from:", data);
    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    updateData(newData);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const handleHouseChange = (event: SelectChangeEvent) => {
    setHouse(event.target.value as string);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          {infoMessage && (
            <Alert
              severity={infoMessage.severity}
              style={{ position: "absolute", top: "10%", right: "5%" }}
              onClick={() => setInfoMessage(null)}
            >
              {infoMessage.message}
            </Alert>
          )}
          <Stack direction="row" spacing={2}>
            <StyledTextField
              value={teamName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTeamName(event.target.value)
              }
              label="Team Name"
              variant="outlined"
              style={{
                marginBottom: "2rem",
                width: "300px",
                height: "60px",
              }}
            />
            <Select
              value={house || ""}
              onChange={handleHouseChange}
              variant="outlined"
              sx={{
                marginBottom: "2rem",
                width: "150px",
                height: "60px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.87)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              }}
              displayEmpty
            >
              <MenuItem value="">Select House</MenuItem>
              <MenuItem value="green" sx={{ color: "#4caf50" }}>
                Green
              </MenuItem>
              <MenuItem value="blue" sx={{ color: "#2196f3" }}>
                Blue
              </MenuItem>
              <MenuItem value="yellow" sx={{ color: "#ffeb3b" }}>
                Yellow
              </MenuItem>
              <MenuItem value="red" sx={{ color: "#f44336" }}>
                Red
              </MenuItem>
            </Select>
          </Stack>
          <Typography
            variant="h2"
            style={{ fontFamily: "monospace", marginBottom: "2rem" }}
          >
            {formatTime(elapsedTime)}
          </Typography>
          <Stack direction="row" spacing={2}>
            {!isRunning ? (
              <Button variant="contained" color="primary" onClick={startTimer}>
                Start
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={stopTimer}>
                Stop
              </Button>
            )}
            <Button variant="outlined" onClick={resetTimer}>
              Reset
            </Button>
            <Button variant="contained" color="success" onClick={saveTime}>
              Save
            </Button>
          </Stack>
          {data && (
            <LeaderboardList
              data={data}
              formatTime={formatTime}
              onItemDelete={deleteItem}
            />
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
