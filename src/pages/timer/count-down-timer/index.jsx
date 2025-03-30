import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { Play, Pause, ArrowCounterClockwise } from '@phosphor-icons/react';

// Function to format seconds into HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function CountDownTimer() {
  // State for input fields
  const [hoursInput, setHoursInput] = useState('');
  const [minutesInput, setMinutesInput] = useState('');
  const [secondsInput, setSecondsInput] = useState('');
  // State for timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Calculate total seconds from inputs
  const totalSeconds = 
    (parseInt(hoursInput) || 0) * 3600 + 
    (parseInt(minutesInput) || 0) * 60 + 
    (parseInt(secondsInput) || 0);

  // Determine display time: show timeLeft when running or paused, otherwise show input time
  const displayTime = isRunning || timeLeft > 0 ? formatTime(timeLeft) : formatTime(totalSeconds);

  // Handle countdown logic with useEffect
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      // Cleanup interval on unmount or when isRunning changes
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // Start or pause the timer
  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false); // Pause
    } else {
      if (timeLeft === 0) {
        setTimeLeft(totalSeconds); // Set initial time only if timer hasn't started
      }
      setIsRunning(true); // Start or resume
    }
  };

  // Reset the timer
  const handleReset = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setHoursInput('');
    setMinutesInput('');
    setSecondsInput('');
  };

  // Disable inputs when timer is running or paused
  const inputsDisabled = isRunning || timeLeft > 0;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2, 
        padding: 4,
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Countdown Timer
      </Typography>

      {/* Time Display */}
      <Box 
        sx={{ 
          backgroundColor: 'grey.100', 
          padding: 3, 
          borderRadius: 2, 
          boxShadow: 1 
        }}
      >
        <Typography 
          variant="h1" 
          color={timeLeft === 0 && !isRunning ? 'error' : 'primary'}
          sx={{ fontFamily: 'monospace' }}
        >
          {displayTime}
        </Typography>
      </Box>

      {/* Input Fields */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Hours"
          type="number"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
          disabled={inputsDisabled}
          inputProps={{ min: 0, step: 1 }}
          sx={{ width: 100 }}
        />
        <TextField
          label="Minutes"
          type="number"
          value={minutesInput}
          onChange={(e) => setMinutesInput(e.target.value)}
          disabled={inputsDisabled}
          inputProps={{ min: 0, step: 1 }}
          sx={{ width: 100 }}
        />
        <TextField
          label="Seconds"
          type="number"
          value={secondsInput}
          onChange={(e) => setSecondsInput(e.target.value)}
          disabled={inputsDisabled}
          inputProps={{ min: 0, step: 1 }}
          sx={{ width: 100 }}
        />
      </Box>

      {/* Control Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton 
          onClick={handleStartPause} 
          color="primary"
          sx={{ 
            backgroundColor: 'primary.light', 
            '&:hover': { backgroundColor: 'primary.main' } 
          }}
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </IconButton>
        <IconButton 
          onClick={handleReset} 
          color="secondary"
          sx={{ 
            backgroundColor: 'secondary.light', 
            '&:hover': { backgroundColor: 'secondary.main' } 
          }}
        >
          <ArrowCounterClockwise size={32} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default CountDownTimer;