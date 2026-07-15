(() => {
  "use strict";

  const BREAK_SECONDS = 5 * 60;
  const ALERT_DURATION_MS = 2000;
  const PREVIEW_DURATION_MS = 2200;
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
  const alertSoundSelect = document.getElementById("alert-sound");
  const focusSoundSelect = document.getElementById("focus-sound");

  const decreaseButton = document.getElementById("decrease-button");
  const increaseButton = document.getElementById("increase-button");
  const previewAlertButton = document.getElementById("preview-alert-button");
  const previewFocusButton = document.getElementById("preview-focus-button");
  const startButton = document.getElementById("start-button");

  const phaseLabel = document.getElementById("phase-label");
  const timeDisplay = document.getElementById("time-display");
  const checkMessage = document.getElementById("check-message");
  const cycleDisplay = document.getElementById("cycle-display");

  const runningControls = document.getElementById("running-controls");
  const pausedControls = document.getElementById("paused-controls");
  const alertControls = document.getElementById("alert-controls");
  const pauseButton = document.getElementById("pause-button");
  const resumeButton = document.getElementById("resume-button");
  const resetButton = document.getElementById("reset-button");

  let focusSeconds = 25 * 60;
  let remainingSeconds = focusSeconds;
  let endTime = null;
  let intervalId = null;
  let alertTimeoutId = null;
  let previewTimeoutId = null;
  let phase = "focus";
  let cycle = 1;
  let isPaused = false;
  let messageIndex = 0;

  let audioContext = null;
  let activeAudioNodes = [];
  let focusTickIntervalId = null;

  function getAudioContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function registerAudioNode(node) {
    activeAudioNodes.push(node);
    return node;
  }

  function stopAllAudio() {
    if (focusTickIntervalId !== null) {
      window.clearInterval(focusTickIntervalId);
      focusTickIntervalId = null;
    }

    for (const node of activeAudioNodes) {
      try {
        if (typeof node.stop === "function") {
          node.stop();
        }
      } catch (_) {
        // すでに停止済みのノードは無視します。
      }

      try {
        node.disconnect();
      } catch (_) {
        // 切断済みのノードは無視します。
      }
    }

    activeAudioNodes = [];
  }

  function createGain(value) {
    const context = getAudioContext();
    const gain = registerAudioNode(context.createGain());
    gain.gain.value = value;
    gain.connect(context.destination);
    return gain;
  }

  function playTone(frequency, durationSeconds, options = {}) {
    const context = getAudioContext();
    const oscillator = registerAudioNode(context.createOscillator());
    const gain = registerAudioNode(context.createGain());

    oscillator.type = options.type || "sine";
    oscillator.frequency.value = frequency;

    const now = context.currentTime;
    const volume = options.volume ?? 0.12;
    const attack = options.attack ?? 0.01;
    const release = options.release ?? 0.08;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.setValueAtTime(volume, Math.max(now + attack, now + durationSeconds - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + durationSeconds);
  }

  function playAlertSound(type) {
    stopAllAudio();

    if (type === "bell") {
      playTone(784, 0.45, { type: "sine", volume: 0.18, release: 0.3 });
      window.setTimeout(() => playTone(659, 0.45, { type: "sine", volume: 0.16, release: 0.3 }), 520);
      window.setTimeout(() => playTone(784, 0.55, { type: "sine", volume: 0.18, release: 0.35 }), 1050);
      return;
    }

    if (type === "digital") {
      playTone(880, 0.18, { type: "square", volume: 0.07, release: 0.04 });
      window.setTimeout(() => playTone(880, 0.18, { type: "square", volume: 0.07, release: 0.04 }), 330);
      window.setTimeout(() => playTone(1047, 0.35, { type: "square", volume: 0.06, release: 0.08 }), 680);
      return;
    }

    playTone(523, 0.55, { type: "sine", volume: 0.12, release: 0.35 });
    window.setTimeout(() => playTone(659, 0.65, { type: "sine", volume: 0.11, release: 0.4 }), 350);
    window.setTimeout(() => playTone(784, 0.75, { type: "sine", volume: 0.09, release: 0.5 }), 700);
  }

  function createNoiseBuffer(seconds = 2) {
    const context = getAudioContext();
    const frameCount = Math.floor(context.sampleRate * seconds);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  function playWhiteNoise(volume = 0.025) {
    const context = getAudioContext();
    const source = registerAudioNode(context.createBufferSource());
    const gain = registerAudioNode(context.createGain());

    source.buffer = createNoiseBuffer(2);
    source.loop = true;
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(context.destination);
    source.start();
  }

  function playRainNoise() {
    const context = getAudioContext();
    const source = registerAudioNode(context.createBufferSource());
    const highpass = registerAudioNode(context.createBiquadFilter());
    const lowpass = registerAudioNode(context.createBiquadFilter());
    const gain = registerAudioNode(context.createGain());

    source.buffer = createNoiseBuffer(2);
    source.loop = true;

    highpass.type = "highpass";
    highpass.frequency.value = 500;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 5200;
    gain.gain.value = 0.035;

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(context.destination);
    source.start();
  }

  function playSoftTickOnce() {
    playTone(1200, 0.035, {
      type: "sine",
      volume: 0.018,
      attack: 0.002,
      release: 0.02
    });
  }

  function startFocusSound(type) {
    stopAllAudio();

    if (type === "none") {
      return;
    }

    if (type === "soft-tick") {
      playSoftTickOnce();
      focusTickIntervalId = window.setInterval(playSoftTickOnce, 1000);
      return;
    }

    if (type === "white-noise") {
      playWhiteNoise();
      return;
    }

    if (type === "rain") {
      playRainNoise();
    }
  }

  function stopPreviewTimer() {
    if (previewTimeoutId !== null) {
      window.clearTimeout(previewTimeoutId);
      previewTimeoutId = null;
    }
  }

  function previewAlert() {
    stopPreviewTimer();
    playAlertSound(alertSoundSelect.value);

    previewTimeoutId = window.setTimeout(() => {
      stopAllAudio();
      previewTimeoutId = null;
    }, PREVIEW_DURATION_MS);
  }

  function previewFocus() {
    stopPreviewTimer();
    startFocusSound(focusSoundSelect.value);

    previewTimeoutId = window.setTimeout(() => {
      stopAllAudio();
      previewTimeoutId = null;
    }, PREVIEW_DURATION_MS);
  }

  function clampFocusMinutes(value) {
    const number = Number.parseInt(value, 10);

    if (Number.isNaN(number)) {
      return 25;
    }

    return Math.min(MAX_FOCUS_MINUTES, Math.max(MIN_FOCUS_MINUTES, number));
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
    if (phase === "alert") {
      phaseLabel.textContent = "集中時間終了";
      timeDisplay.textContent = "00:00";
      checkMessage.textContent = "音が止まったら、5分休憩を始めます。";
      cycleDisplay.textContent = `${cycle}セット目`;
      return;
    }

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
    alertControls.classList.add("hidden");
  }

  function showPausedControls() {
    runningControls.classList.add("hidden");
    pausedControls.classList.remove("hidden");
    alertControls.classList.add("hidden");
  }

  function showAlertControls() {
    runningControls.classList.add("hidden");
    pausedControls.classList.add("hidden");
    alertControls.classList.remove("hidden");
  }

  function stopInterval() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function stopAlertTimeout() {
    if (alertTimeoutId !== null) {
      window.clearTimeout(alertTimeoutId);
      alertTimeoutId = null;
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
    stopAlertTimeout();

    remainingSeconds = seconds;
    endTime = Date.now() + remainingSeconds * 1000;
    isPaused = false;

    showRunningControls();

    if (phase === "focus") {
      startFocusSound(focusSoundSelect.value);
    } else {
      stopAllAudio();
    }

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
      beginAlert();
      return;
    }

    phase = "focus";
    cycle += 1;
    beginCountdown(focusSeconds);
  }

  function beginAlert() {
    stopAllAudio();
    phase = "alert";
    remainingSeconds = 0;
    endTime = null;
    isPaused = false;

    showAlertControls();
    updateDisplay();
    playAlertSound(alertSoundSelect.value);

    alertTimeoutId = window.setTimeout(() => {
      stopAllAudio();
      alertTimeoutId = null;
      phase = "break";
      beginCountdown(BREAK_SECONDS);
    }, ALERT_DURATION_MS);
  }

  function startTimer() {
    stopPreviewTimer();
    stopAllAudio();

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
    if (isPaused || phase === "alert") {
      return;
    }

    remainingSeconds = calculateRemainingSeconds();
    isPaused = true;
    endTime = null;

    stopInterval();
    stopAllAudio();
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
    stopAlertTimeout();
    stopPreviewTimer();
    stopAllAudio();

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

  previewAlertButton.addEventListener("click", previewAlert);
  previewFocusButton.addEventListener("click", previewFocus);
  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resumeButton.addEventListener("click", resumeTimer);
  resetButton.addEventListener("click", resetTimer);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPreviewTimer();
    }
  });

  updateDisplay();
})();
