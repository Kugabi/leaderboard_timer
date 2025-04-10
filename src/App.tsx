import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, Typography, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  StyledTextField,
  LeaderboardList,
  ScoreEntry,
} from "./components/LeaderboardComponents";

type InfoMessage = {
  severity: "success" | "info" | "warning" | "error";
  message: string;
};

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [teamName, setTeamName] = useState<string>("");
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
    if (!data) return;
    newData.sort((a, b) => Number(a.time) - Number(b.time));
    const jsonData = JSON.stringify(newData);
    localStorage.setItem("data", jsonData);
    setData(newData);
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
    };
    const newData = [...data, entry];
    // setData(newData);
    updateData(newData);
    resetTimer();
  };

  const deleteItem = (index: number) => {
    if (data === null) return;
    console.log("removing at", index, "from:", data);
    let newData = data;
    newData.splice(index, 1);
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

  return (
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
          }}
        />

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
          <Button variant="contained" color="secondary" onClick={saveTime}>
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
  );
}

export default App;
