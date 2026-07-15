(() => {
  "use strict";

  const BREAK_SECONDS = 5 * 60;
  const MIN_FOCUS_MINUTES = 1;
  const MAX_FOCUS_MINUTES = 120;

  const focusMessages = [
    "肩と顎の力を確認しましょう。",
    "息を止めていませんか？",
    "画面を見つめすぎていませんか？",
    "少し力を抜いても大丈夫です。"
  ];

  const breakMessages = [
    "一度、仕事から視線を外しましょう。",
    "肩を下げて、ゆっくり息を吐きましょう。",
    "目を閉じるだけでも休憩になります。",
    "何もしない時間にして大丈夫です。"
  ];

  const setupScreen = document.getElementById("setup-screen");
  const timerScreen = document.getElementById("timer-screen");
  const focusMinutesInput = document.getElementById("focus-minutes");
  const decreaseButton = document.getElementById("decrease-button");
  const increaseButton = document.getElementById("increase-button");
  const startButton = document.getElementById("start-button");

  const phaseLabel = document.getElementById("phase-label");
  const timeDisplay = document.getElementById("time-display");
  const checkMessage = document.getElementById("check-message");
  const cycleDisplay = document.getElementById("cycle-display");

  const runningControls = document.getElementById("running-controls");
  const pausedControls = document.getElementById("paused-controls");
  const pauseButton = document.getElementById("pause-button");
  const resumeButton = document.getElementById("resume-button");
  const resetButton = document.getElementById("reset-button");

  let focusSeconds = 25 * 60;
  let remainingSeconds = focusSeconds;
  let endTime = null;
  let intervalId = null;
  let phase = "focus";
  let cycle = 1;
  let isPaused = false;
  let messageIndex = 0;

  function clampFocusMinutes(value) {
    const number = Number.parseInt(value, 10);

    if (Number.isNaN(number)) {
      return 25;
    }

    return Math.min(
      MAX_FOCUS_MINUTES,
      Math.max(MIN_FOCUS_MINUTES, number)
    );
  }

  function setFocusMinutes(value) {
    focusMinutesInput.value = clampFocusMinutes(value);
  }

  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateDisplay() {
    phaseLabel.textContent =
      phase === "focus"
        ? (isPaused ? "集中時間・一時停止中" : "集中時間")
        : (isPaused ? "休憩時間・一時停止中" : "休憩時間");

    timeDisplay.textContent = formatTime(remainingSeconds);
    cycleDisplay.textContent = `${cycle}セット目`;

    const messages = phase === "focus" ? focusMessages : breakMessages;
    checkMessage.textContent = messages[messageIndex % messages.length];
  }

  function showTimerScreen() {
    setupScreen.classList.add("hidden");
    timerScreen.classList.remove("hidden");
  }

  function showSetupScreen() {
    timerScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
  }

  function showRunningControls() {
    runningControls.classList.remove("hidden");
    pausedControls.classList.add("hidden");
  }

  function showPausedControls() {
    runningControls.classList.add("hidden");
    pausedControls.classList.remove("hidden");
  }

  function stopInterval() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function calculateRemainingSeconds() {
    if (endTime === null) {
      return remainingSeconds;
    }

    return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  }

  function beginCountdown(seconds) {
    stopInterval();

    remainingSeconds = seconds;
    endTime = Date.now() + remainingSeconds * 1000;
    isPaused = false;

    showRunningControls();
    updateDisplay();

    intervalId = window.setInterval(tick, 250);
  }

  function tick() {
    remainingSeconds = calculateRemainingSeconds();
    updateDisplay();

    if (remainingSeconds <= 0) {
      moveToNextPhase();
    }
  }

  function moveToNextPhase() {
    stopInterval();
    messageIndex += 1;

    if (phase === "focus") {
      phase = "break";
      beginCountdown(BREAK_SECONDS);
      return;
    }

    phase = "focus";
    cycle += 1;
    beginCountdown(focusSeconds);
  }

  function startTimer() {
    const focusMinutes = clampFocusMinutes(focusMinutesInput.value);
    setFocusMinutes(focusMinutes);

    focusSeconds = focusMinutes * 60;
    remainingSeconds = focusSeconds;
    phase = "focus";
    cycle = 1;
    messageIndex = 0;

    showTimerScreen();
    beginCountdown(focusSeconds);
  }

  function pauseTimer() {
    if (isPaused) {
      return;
    }

    remainingSeconds = calculateRemainingSeconds();
    isPaused = true;
    endTime = null;

    stopInterval();
    showPausedControls();
    updateDisplay();
  }

  function resumeTimer() {
    if (!isPaused) {
      return;
    }

    beginCountdown(remainingSeconds);
  }

  function resetTimer() {
    stopInterval();

    phase = "focus";
    cycle = 1;
    isPaused = false;
    endTime = null;
    messageIndex = 0;

    const focusMinutes = clampFocusMinutes(focusMinutesInput.value);
    focusSeconds = focusMinutes * 60;
    remainingSeconds = focusSeconds;

    showRunningControls();
    showSetupScreen();
    updateDisplay();
  }

  decreaseButton.addEventListener("click", () => {
    setFocusMinutes(clampFocusMinutes(focusMinutesInput.value) - 1);
  });

  increaseButton.addEventListener("click", () => {
    setFocusMinutes(clampFocusMinutes(focusMinutesInput.value) + 1);
  });

  focusMinutesInput.addEventListener("change", () => {
    setFocusMinutes(focusMinutesInput.value);
  });

  focusMinutesInput.addEventListener("blur", () => {
    setFocusMinutes(focusMinutesInput.value);
  });

  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resumeButton.addEventListener("click", resumeTimer);
  resetButton.addEventListener("click", resetTimer);

  updateDisplay();
})();
