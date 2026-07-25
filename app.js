(() => {
  "use strict";

  const BREAK_SECONDS = 5 * 60;
  const ALERT_DURATION_MS = 2000;
  const PREVIEW_DURATION_MS = 10000;
  const DIM_MODE_DELAY_MS = 15000;
  const MESSAGE_CHANGE_MS = 30000;
  const SHIFT_CHANGE_MS = 30000;
  const MIN_FOCUS_MINUTES = 1;
  const MAX_FOCUS_MINUTES = 120;

  const SETTINGS_STORAGE_KEY = "tension-check-timer-settings-v1";
  const TIMER_STORAGE_KEY = "tension-check-timer-state-v1";
  const BODY_CHECK_STORAGE_KEY = "tension-check-timer-body-check-history-v1";

  const translations = {
    ja: {
      appTitle: "過緊張チェックタイマー",
      subtitle: '集中しすぎを定期的にチェック。<br class="mobile-break">力を抜くきっかけを作るタイマーです。',
      timerSettings: "タイマー設定",
      changeTheme: "デザインテーマと言語を変更",
      focusDuration: "集中時間",
      decreaseMinute: "集中時間を1分減らす",
      increaseMinute: "集中時間を1分増やす",
      minutesUnit: "分",
      minuteHelp: "1〜120分で指定できます。休憩は5分固定です。",
      focusEndAlert: "集中終了のアラート音",
      softChime: "やわらかいチャイム",
      bell: "ベル",
      digital: "電子音",
      preview: "試聴",
      stopPreview: "停止",
      alertHelp: "集中終了時に約2秒だけ鳴ります。",
      breakEndSameSound: "休憩終了時にも同じ音を鳴らす",
      breakEndHelp: "約2秒鳴った後、次の集中時間を始めます。",
      focusSound: "集中中の音",
      silent: "無音",
      softTick: "小さな時計音",
      softBreeze: "やわらかな風音",
      gentleRain: "やさしい雨",
      cafeAmbience: "カフェの環境音",
      quietStorm: "遠い雷を含まない静かな嵐",
      focusSoundHelp: "休憩中と一時停止中は必ず無音になります。",
      start: "スタート",
      pause: "一時停止",
      reset: "リセット",
      restoreNotice: "前回のタイマーを復元しました。スタートを押すと再開します。",
      dimHint: "画面をタップすると通常表示に戻ります",
      designThemeEyebrow: "DESIGN THEME",
      designTheme: "デザインテーマ",
      close: "閉じる",
      themeDescription: "お好みの色合いを選んでください。選択内容は保存されます。",
      powderSky: "パウダースカイ",
      powderSkyDesc: "清潔感のある静かな青",
      mistyLavender: "ミスティラベンダー",
      mistyLavenderDesc: "静かで知的な紫",
      sageGreige: "セージグレージュ",
      sageGreigeDesc: "落ち着いた自然色",
      smokyRose: "スモーキーローズ",
      smokyRoseDesc: "大人かわいい上品な赤",
      languageEyebrow: "LANGUAGE",
      displayLanguage: "表示言語",
      languageNote: "選択した言語は次回も保持されます。",
      historyEyebrow: "BODY CHECK DATA",
      historyTitle: "身体チェックの記録",
      historyCount: n => `保存済み：${n}件`,
      exportCsv: "CSVでエクスポート",
      exportJson: "JSONでエクスポート",
      deleteHistory: "記録を削除",
      historyNote: "記録はこの端末内にのみ保存されます。",
      noHistory: "エクスポートできる記録がまだありません。",
      deleteConfirm: "保存されている身体チェックの記録をすべて削除します。元に戻せません。本当に削除しますか？",
      deleteComplete: "身体チェックの記録を削除しました。",
      bodyCheckEyebrow: "BODY CHECK",
      bodyCheckTitle: "身体をひとつ確認しましょう",
      skipThisTime: "今回は記録しない",
      answerBetter: "少し楽になった",
      answerNoChange: "変わらなかった",
      answerUnsure: "よく分からない",
      phaseFocus: "集中時間",
      phaseFocusPaused: "集中時間・一時停止中",
      phaseBreak: "休憩時間",
      phaseBreakPaused: "休憩時間・一時停止中",
      focusEnded: "集中時間終了",
      breakEnded: "休憩時間終了",
      afterAlertBreak: "音が止まったら、5分休憩を始めます。",
      afterAlertFocus: "音が止まったら、次の集中時間を始めます。",
      startingBreak: "まもなく休憩を開始します",
      startingFocus: "まもなく集中時間を開始します",
      cycle: n => `${n}セット目`,
      wakeLockPrefix: "画面消灯防止：",
      wakeUnsupported: "この端末では未対応",
      wakeActive: "使用中",
      wakeStopped: "停止中",
      wakeReleased: "解除されました",
      wakeUnavailable: "利用できません",
      wakeUnused: "未使用",
      focusMessages: [
        "肩と顎の力を確認しましょう。",
        "息を止めていませんか？",
        "画面を見つめすぎていませんか？",
        "少し力を抜いても大丈夫です。"
      ],
      breakMessages: [
        "一度、仕事から視線を外しましょう。",
        "肩を下げて、ゆっくり息を吐きましょう。",
        "目を閉じるだけでも休憩になります。",
        "何もしない時間にして大丈夫です。"
      ]
    },
    en: {
      appTitle: "Tension Check Timer",
      subtitle: 'Check in before focus turns into tension.<br class="mobile-break">A gentle timer to help you release and reset.',
      timerSettings: "Timer Settings",
      changeTheme: "Change design theme and language",
      focusDuration: "Focus Duration",
      decreaseMinute: "Decrease focus duration by one minute",
      increaseMinute: "Increase focus duration by one minute",
      minutesUnit: "min",
      minuteHelp: "Choose 1–120 minutes. Breaks are fixed at 5 minutes.",
      focusEndAlert: "Focus-End Alert",
      softChime: "Soft Chime",
      bell: "Bell",
      digital: "Digital Tone",
      preview: "Preview",
      stopPreview: "Stop",
      alertHelp: "Plays for about 2 seconds when focus time ends.",
      breakEndSameSound: "Play the same sound when the break ends",
      breakEndHelp: "The next focus session starts after the 2-second alert.",
      focusSound: "Sound During Focus",
      silent: "Silent",
      softTick: "Soft Clock Tick",
      softBreeze: "Gentle Breeze",
      gentleRain: "Gentle Rain",
      cafeAmbience: "Café Ambience",
      quietStorm: "Quiet Storm Without Thunder",
      focusSoundHelp: "Sound is always off during breaks and while paused.",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      restoreNotice: "Your previous timer was restored. Tap Start to resume.",
      dimHint: "Tap the screen to return to the normal view",
      designThemeEyebrow: "DESIGN THEME",
      designTheme: "Design Theme",
      close: "Close",
      themeDescription: "Choose a color palette. Your selection will be saved.",
      powderSky: "Powder Sky",
      powderSkyDesc: "Clean and quietly refined",
      mistyLavender: "Misty Lavender",
      mistyLavenderDesc: "Calm and sophisticated",
      sageGreige: "Sage Greige",
      sageGreigeDesc: "Natural and understated",
      smokyRose: "Smoky Rose",
      smokyRoseDesc: "Mature, soft, and elegant",
      languageEyebrow: "LANGUAGE",
      displayLanguage: "Display Language",
      languageNote: "Your language choice will be saved for next time.",
      historyEyebrow: "BODY CHECK DATA",
      historyTitle: "Body Check Records",
      historyCount: n => `Saved: ${n}`,
      exportCsv: "Export as CSV",
      exportJson: "Export as JSON",
      deleteHistory: "Delete Records",
      historyNote: "Records are stored only on this device.",
      noHistory: "There are no records to export yet.",
      deleteConfirm: "Delete all saved body-check records? This action cannot be undone.",
      deleteComplete: "Body-check records were deleted.",
      bodyCheckEyebrow: "BODY CHECK",
      bodyCheckTitle: "Check one area of your body",
      skipThisTime: "Do not record this time",
      answerBetter: "It feels a little easier",
      answerNoChange: "No change",
      answerUnsure: "Not sure",
      phaseFocus: "Focus Time",
      phaseFocusPaused: "Focus Time · Paused",
      phaseBreak: "Break Time",
      phaseBreakPaused: "Break Time · Paused",
      focusEnded: "Focus Complete",
      breakEnded: "Break Complete",
      afterAlertBreak: "Your 5-minute break will begin when the sound ends.",
      afterAlertFocus: "Your next focus session will begin when the sound ends.",
      startingBreak: "Break starting shortly",
      startingFocus: "Focus session starting shortly",
      cycle: n => `Set ${n}`,
      wakeLockPrefix: "Keep Screen Awake: ",
      wakeUnsupported: "Not supported",
      wakeActive: "On",
      wakeStopped: "Paused",
      wakeReleased: "Released",
      wakeUnavailable: "Unavailable",
      wakeUnused: "Off",
      focusMessages: [
        "Check your shoulders and jaw.",
        "Are you holding your breath?",
        "Let your eyes soften for a moment.",
        "It is okay to release a little tension."
      ],
      breakMessages: [
        "Look away from your work for a moment.",
        "Lower your shoulders and breathe out slowly.",
        "Even closing your eyes can be a real break.",
        "It is okay to do nothing for a few minutes."
      ]
    }
  };

  function t(key) {
    const value = translations[selectedLanguage]?.[key] ?? translations.ja[key] ?? key;
    return typeof value === "function" ? value : value;
  }

  const setupScreen = document.getElementById("setup-screen");
  const timerScreen = document.getElementById("timer-screen");
  const timerCard = document.getElementById("timer-card");
  const timerContent = document.getElementById("timer-content");
  const focusMinutesInput = document.getElementById("focus-minutes");
  const alertSoundSelect = document.getElementById("alert-sound");
  const focusSoundSelect = document.getElementById("focus-sound");
  const breakEndAlertCheckbox = document.getElementById("break-end-alert");
  const themeSettingsButton = document.getElementById("theme-settings-button");
  const themeSheet = document.getElementById("theme-sheet");
  const themeOverlay = document.getElementById("theme-overlay");
  const themeSheetClose = document.getElementById("theme-sheet-close");
  const themeOptions = [...document.querySelectorAll(".theme-option")];
  const languageOptions = [...document.querySelectorAll(".language-option")];
  const historyCount = document.getElementById("history-count");
  const exportCsvButton = document.getElementById("export-csv-button");
  const exportJsonButton = document.getElementById("export-json-button");
  const deleteHistoryButton = document.getElementById("delete-history-button");
  const bodyCheckOverlay = document.getElementById("body-check-overlay");
  const bodyCheckDialog = document.getElementById("body-check-dialog");
  const bodyCheckInstruction = document.getElementById("body-check-instruction");
  const bodyCheckQuestion = document.getElementById("body-check-question");
  const bodyCheckAnswers = document.getElementById("body-check-answers");
  const bodyCheckSkip = document.getElementById("body-check-skip");

  const decreaseButton = document.getElementById("decrease-button");
  const increaseButton = document.getElementById("increase-button");
  const previewAlertButton = document.getElementById("preview-alert-button");
  const previewFocusButton = document.getElementById("preview-focus-button");
  const startButton = document.getElementById("start-button");

  const phaseLabel = document.getElementById("phase-label");
  const timeDisplay = document.getElementById("time-display");
  const checkMessage = document.getElementById("check-message");
  const cycleDisplay = document.getElementById("cycle-display");
  const restoreNotice = document.getElementById("restore-notice");
  const wakeLockStatus = document.getElementById("wake-lock-status");

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
  let isFocusPreviewPlaying = false;
  let phase = "focus";
  let cycle = 1;
  let isPaused = false;
  let messageIndex = 0;
  let restoredFromStorage = false;
  let alertNextPhase = "break";
  let selectedTheme = "powder-sky";
  let selectedLanguage = "ja";
  let pendingBodyCheck = null;
  let pendingBodyCheckStartedAt = null;

  let audioContext = null;
  let focusAudio = null;
  let activeAudioNodes = [];
  let focusTickIntervalId = null;
  let wakeLock = null;
  let currentWakeLockStatusKey = "wakeUnused";
  let dimModeTimeoutId = null;
  let messageIntervalId = null;
  let shiftIntervalId = null;
  let shiftIndex = 0;

  const BODY_CHECK_QUESTIONS = [
    {
      id: "shoulders_release",
      bodyArea: "shoulders",
      ja: {
        instruction: "息を吐きながら、肩をすとんと落としてみましょう。",
        question: "肩の位置や重さに変化はありましたか？"
      },
      en: {
        instruction: "Breathe out and gently let your shoulders drop.",
        question: "Did their position or heaviness change?"
      }
    },
    {
      id: "jaw_release",
      bodyArea: "jaw",
      ja: {
        instruction: "上下の歯を少し離して、舌と顎をゆるめてみましょう。",
        question: "顎や口の周りに変化はありましたか？"
      },
      en: {
        instruction: "Separate your teeth slightly and relax your tongue and jaw.",
        question: "Did anything change around your jaw or mouth?"
      }
    },
    {
      id: "hands_release",
      bodyArea: "hands",
      ja: {
        instruction: "手を机やスマホから離し、指をゆっくり開いてみましょう。",
        question: "手や指が少し楽になりましたか？"
      },
      en: {
        instruction: "Move your hands away from the desk or phone and slowly open your fingers.",
        question: "Do your hands or fingers feel any easier?"
      }
    },
    {
      id: "breathing_release",
      bodyArea: "breathing",
      ja: {
        instruction: "一度だけ、無理のない範囲でゆっくり長く息を吐いてみましょう。",
        question: "呼吸のしやすさに変化はありましたか？"
      },
      en: {
        instruction: "Take one slow, comfortable breath out.",
        question: "Did breathing feel any different?"
      }
    },
    {
      id: "eyes_release",
      bodyArea: "eyes",
      ja: {
        instruction: "画面から視線を外し、目と眉間をゆるめてみましょう。",
        question: "目の周りが少し楽になりましたか？"
      },
      en: {
        instruction: "Look away from the screen and soften your eyes and brow.",
        question: "Does the area around your eyes feel any easier?"
      }
    },
    {
      id: "posture_release",
      bodyArea: "posture",
      ja: {
        instruction: "背もたれや椅子に体重を少し預けてみましょう。",
        question: "姿勢や体の重さに変化はありましたか？"
      },
      en: {
        instruction: "Let the chair or backrest support a little more of your weight.",
        question: "Did your posture or sense of weight change?"
      }
    },
    {
      id: "legs_release",
      bodyArea: "legs",
      ja: {
        instruction: "足裏を床につけ、脚の踏ん張りを少しゆるめてみましょう。",
        question: "脚や足裏に変化はありましたか？"
      },
      en: {
        instruction: "Place your feet on the floor and ease any bracing in your legs.",
        question: "Did anything change in your legs or feet?"
      }
    }
  ];

  const BODY_CHECK_ANSWERS = [
    { id: "felt_better", translationKey: "answerBetter" },
    { id: "no_change", translationKey: "answerNoChange" },
    { id: "unsure", translationKey: "answerUnsure" }
  ];

  function getBodyCheckHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(BODY_CHECK_STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveBodyCheckHistory(records) {
    localStorage.setItem(BODY_CHECK_STORAGE_KEY, JSON.stringify(records));
    updateHistoryCount();
  }

  function updateHistoryCount() {
    historyCount.textContent = t("historyCount")(getBodyCheckHistory().length);
  }

  function toLocalIsoString(date = new Date()) {
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absOffset = Math.abs(offsetMinutes);
    const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const minutes = String(absOffset % 60).padStart(2, "0");
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1);
    return `${local}${sign}${hours}:${minutes}`;
  }

  function getFocusSoundLabel(soundId, language = selectedLanguage) {
    const labels = {
      "gentle-rain-file": { ja: "やさしい雨", en: "Gentle Rain" },
      "cafe-file": { ja: "カフェの環境音", en: "Café Ambience" }
    };
    return labels[soundId]?.[language] ?? soundId;
  }

  function closeBodyCheck() {
    bodyCheckOverlay.classList.add("hidden");
    bodyCheckOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("body-check-open");
    pendingBodyCheck = null;
    pendingBodyCheckStartedAt = null;
  }

  function recordBodyCheck(answer) {
    if (!pendingBodyCheck) {
      return;
    }

    const localizedQuestion = pendingBodyCheck[selectedLanguage];
    const record = {
      recordVersion: 1,
      answeredAt: toLocalIsoString(),
      questionId: pendingBodyCheck.id,
      question: localizedQuestion.question,
      bodyArea: pendingBodyCheck.bodyArea,
      answerId: answer.id,
      answer: t(answer.translationKey),
      soundId: focusSoundSelect.value,
      sound: getFocusSoundLabel(focusSoundSelect.value),
      focusDurationMinutes: Math.round(focusSeconds / 60),
      actualFocusSeconds: focusSeconds,
      cycleNumber: cycle,
      checkTiming: "focus_end",
      language: selectedLanguage
    };

    const records = getBodyCheckHistory();
    records.push(record);
    saveBodyCheckHistory(records);
    closeBodyCheck();
  }

  function showBodyCheck() {
    const randomIndex = Math.floor(Math.random() * BODY_CHECK_QUESTIONS.length);
    pendingBodyCheck = BODY_CHECK_QUESTIONS[randomIndex];
    pendingBodyCheckStartedAt = Date.now();
    const localizedQuestion = pendingBodyCheck[selectedLanguage];
    bodyCheckInstruction.textContent = localizedQuestion.instruction;
    bodyCheckQuestion.textContent = localizedQuestion.question;
    bodyCheckAnswers.innerHTML = "";

    for (const answer of BODY_CHECK_ANSWERS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "body-check-answer";
      button.textContent = t(answer.translationKey);
      button.addEventListener("click", () => recordBodyCheck(answer), { once: true });
      bodyCheckAnswers.appendChild(button);
    }

    bodyCheckOverlay.classList.remove("hidden");
    bodyCheckOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("body-check-open");
    bodyCheckAnswers.querySelector("button")?.focus();
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBodyCheckJson() {
    const records = getBodyCheckHistory();
    if (records.length === 0) {
      window.alert(t("noHistory"));
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      `tension-check-history-${date}.json`,
      JSON.stringify(records, null, 2),
      "application/json;charset=utf-8"
    );
  }

  function exportBodyCheckCsv() {
    const records = getBodyCheckHistory();
    if (records.length === 0) {
      window.alert(t("noHistory"));
      return;
    }

    const columns = [
      "recordVersion",
      "answeredAt",
      "questionId",
      "question",
      "bodyArea",
      "answerId",
      "answer",
      "soundId",
      "sound",
      "focusDurationMinutes",
      "actualFocusSeconds",
      "cycleNumber",
      "checkTiming",
      "language"
    ];

    const rows = [
      columns.join(","),
      ...records.map(record => columns.map(column => csvEscape(record[column])).join(","))
    ];

    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      `tension-check-history-${date}.csv`,
      `\uFEFF${rows.join("\r\n")}`,
      "text/csv;charset=utf-8"
    );
  }

  function deleteBodyCheckHistory() {
    if (!window.confirm(t("deleteConfirm"))) {
      return;
    }

    localStorage.removeItem(BODY_CHECK_STORAGE_KEY);
    updateHistoryCount();
    window.alert(t("deleteComplete"));
  }

  function clearDimModeTimer() {
    if (dimModeTimeoutId !== null) {
      window.clearTimeout(dimModeTimeoutId);
      dimModeTimeoutId = null;
    }
  }

  function canUseDimMode() {
    return (
      setupScreen.classList.contains("hidden") &&
      !isPaused &&
      phase !== "alert"
    );
  }

  function enterDimMode() {
    if (!canUseDimMode()) {
      return;
    }

    document.body.classList.add("dim-mode");
  }

  function leaveDimMode() {
    document.body.classList.remove("dim-mode");
  }

  function scheduleDimMode() {
    clearDimModeTimer();
    leaveDimMode();

    if (!canUseDimMode()) {
      return;
    }

    dimModeTimeoutId = window.setTimeout(() => {
      enterDimMode();
      dimModeTimeoutId = null;
    }, DIM_MODE_DELAY_MS);
  }

  function stopMessageRotation() {
    if (messageIntervalId !== null) {
      window.clearInterval(messageIntervalId);
      messageIntervalId = null;
    }
  }

  function startMessageRotation() {
    stopMessageRotation();

    if (setupScreen.classList.contains("hidden") === false) {
      return;
    }

    messageIntervalId = window.setInterval(() => {
      if (phase === "alert") {
        return;
      }

      messageIndex += 1;
      updateDisplay();
      saveTimerState();
    }, MESSAGE_CHANGE_MS);
  }

  function applyShift() {
    timerContent.classList.remove("shift-0", "shift-1", "shift-2", "shift-3");
    timerContent.classList.add(`shift-${shiftIndex}`);
  }

  function stopShiftRotation() {
    if (shiftIntervalId !== null) {
      window.clearInterval(shiftIntervalId);
      shiftIntervalId = null;
    }
  }

  function startShiftRotation() {
    stopShiftRotation();
    applyShift();

    shiftIntervalId = window.setInterval(() => {
      if (!document.body.classList.contains("dim-mode")) {
        return;
      }

      shiftIndex = (shiftIndex + 1) % 4;
      applyShift();
    }, SHIFT_CHANGE_MS);
  }

  function resetScreenProtectionMode() {
    clearDimModeTimer();
    stopMessageRotation();
    stopShiftRotation();
    leaveDimMode();
    shiftIndex = 0;
    applyShift();
  }

  function updateWakeLockStatus(statusKey) {
    currentWakeLockStatusKey = statusKey;
    wakeLockStatus.textContent = `${t("wakeLockPrefix")}${t(statusKey)}`;
  }

  async function requestWakeLock() {
    if (!("wakeLock" in navigator)) {
      updateWakeLockStatus("wakeUnsupported");
      return;
    }

    if (document.visibilityState !== "visible") {
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request("screen");
      updateWakeLockStatus("wakeActive");

      wakeLock.addEventListener("release", () => {
        wakeLock = null;

        if (isPaused || !setupScreen.classList.contains("hidden")) {
          updateWakeLockStatus("wakeStopped");
        } else {
          updateWakeLockStatus("wakeReleased");
        }
      });
    } catch (_) {
      wakeLock = null;
      updateWakeLockStatus("wakeUnavailable");
    }
  }

  async function releaseWakeLock() {
    if (!wakeLock) {
      updateWakeLockStatus("wakeStopped");
      return;
    }

    try {
      await wakeLock.release();
    } catch (_) {
      // すでに解除されている場合は無視します。
    } finally {
      wakeLock = null;
      updateWakeLockStatus("wakeStopped");
    }
  }

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
    if (focusAudio) {
      focusAudio.pause();
      focusAudio.currentTime = 0;
      focusAudio = null;
    }

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

  function playSoftBreeze() {
    const context = getAudioContext();
    const source = registerAudioNode(context.createBufferSource());
    const lowpass = registerAudioNode(context.createBiquadFilter());
    const gain = registerAudioNode(context.createGain());

    source.buffer = createNoiseBuffer(4);
    source.loop = true;

    lowpass.type = "lowpass";
    lowpass.frequency.value = 650;
    lowpass.Q.value = 0.4;
    gain.gain.value = 0.012;

    source.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(context.destination);
    source.start();
  }

  function playGentleRain() {
    const context = getAudioContext();
    const source = registerAudioNode(context.createBufferSource());
    const highpass = registerAudioNode(context.createBiquadFilter());
    const lowpass = registerAudioNode(context.createBiquadFilter());
    const gain = registerAudioNode(context.createGain());

    source.buffer = createNoiseBuffer(4);
    source.loop = true;

    highpass.type = "highpass";
    highpass.frequency.value = 180;
    highpass.Q.value = 0.3;

    lowpass.type = "lowpass";
    lowpass.frequency.value = 1500;
    lowpass.Q.value = 0.5;

    gain.gain.value = 0.014;

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(context.destination);
    source.start();
  }

  function playQuietStorm() {
    const context = getAudioContext();
    const masterGain = registerAudioNode(context.createGain());
    masterGain.gain.value = 0.032;
    masterGain.connect(context.destination);

    const rainSource = registerAudioNode(context.createBufferSource());
    const rainHighpass = registerAudioNode(context.createBiquadFilter());
    const rainLowpass = registerAudioNode(context.createBiquadFilter());
    const rainGain = registerAudioNode(context.createGain());
    const rainLfo = registerAudioNode(context.createOscillator());
    const rainLfoGain = registerAudioNode(context.createGain());

    rainSource.buffer = createNoiseBuffer(8);
    rainSource.loop = true;
    rainHighpass.type = "highpass";
    rainHighpass.frequency.value = 900;
    rainHighpass.Q.value = 0.35;
    rainLowpass.type = "lowpass";
    rainLowpass.frequency.value = 6800;
    rainLowpass.Q.value = 0.4;
    rainGain.gain.value = 0.52;

    rainLfo.type = "sine";
    rainLfo.frequency.value = 0.08;
    rainLfoGain.gain.value = 0.09;
    rainLfo.connect(rainLfoGain);
    rainLfoGain.connect(rainGain.gain);

    rainSource.connect(rainHighpass);
    rainHighpass.connect(rainLowpass);
    rainLowpass.connect(rainGain);
    rainGain.connect(masterGain);

    const windSource = registerAudioNode(context.createBufferSource());
    const windHighpass = registerAudioNode(context.createBiquadFilter());
    const windLowpass = registerAudioNode(context.createBiquadFilter());
    const windGain = registerAudioNode(context.createGain());
    const windLfo = registerAudioNode(context.createOscillator());
    const windLfoGain = registerAudioNode(context.createGain());

    windSource.buffer = createNoiseBuffer(10);
    windSource.loop = true;
    windHighpass.type = "highpass";
    windHighpass.frequency.value = 55;
    windHighpass.Q.value = 0.35;
    windLowpass.type = "lowpass";
    windLowpass.frequency.value = 720;
    windLowpass.Q.value = 0.5;
    windGain.gain.value = 0.22;

    windLfo.type = "sine";
    windLfo.frequency.value = 0.035;
    windLfoGain.gain.value = 0.12;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windGain.gain);

    windSource.connect(windHighpass);
    windHighpass.connect(windLowpass);
    windLowpass.connect(windGain);
    windGain.connect(masterGain);

    const distantRainSource = registerAudioNode(context.createBufferSource());
    const distantRainLowpass = registerAudioNode(context.createBiquadFilter());
    const distantRainGain = registerAudioNode(context.createGain());

    distantRainSource.buffer = createNoiseBuffer(9);
    distantRainSource.loop = true;
    distantRainLowpass.type = "lowpass";
    distantRainLowpass.frequency.value = 1900;
    distantRainLowpass.Q.value = 0.3;
    distantRainGain.gain.value = 0.12;

    distantRainSource.connect(distantRainLowpass);
    distantRainLowpass.connect(distantRainGain);
    distantRainGain.connect(masterGain);

    rainSource.start();
    rainLfo.start();
    windSource.start();
    windLfo.start();
    distantRainSource.start();
  }

  function playSoftTickOnce() {
    playTone(1200, 0.035, {
      type: "sine",
      volume: 0.018,
      attack: 0.002,
      release: 0.02
    });
  }

  function playFocusAudioFile(sourcePath) {
    stopAllAudio();

    focusAudio = new Audio(sourcePath);
    focusAudio.loop = true;
    focusAudio.preload = "auto";
    focusAudio.volume = 0.28;

    const playPromise = focusAudio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        focusAudio = null;
      });
    }
  }

  function startFocusSound(type) {
    if (type === "cafe-file") {
      playFocusAudioFile("sounds/pwlpl-busy-coffee-shop-ambiance-with-crowd-chatter-481151.mp3");
      return;
    }

    playFocusAudioFile("sounds/dragon-studio-gentle-midday-rain-499668.mp3");
  }

  function stopPreviewTimer() {
    if (previewTimeoutId !== null) {
      window.clearTimeout(previewTimeoutId);
      previewTimeoutId = null;
    }

    if (isFocusPreviewPlaying) {
      isFocusPreviewPlaying = false;
      previewFocusButton.textContent = t("preview");
      previewFocusButton.setAttribute("aria-pressed", "false");
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
    if (isFocusPreviewPlaying) {
      stopPreviewTimer();
      stopAllAudio();
      return;
    }

    stopPreviewTimer();
    stopAllAudio();
    startFocusSound(focusSoundSelect.value);

    isFocusPreviewPlaying = true;
    previewFocusButton.textContent = t("stopPreview");
    previewFocusButton.setAttribute("aria-pressed", "true");

    previewTimeoutId = window.setTimeout(() => {
      stopAllAudio();
      previewTimeoutId = null;
      isFocusPreviewPlaying = false;
      previewFocusButton.textContent = t("preview");
      previewFocusButton.setAttribute("aria-pressed", "false");
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


  function applyLanguage(language, shouldRefreshDisplay = true) {
    selectedLanguage = language === "en" ? "en" : "ja";
    document.documentElement.lang = selectedLanguage;

    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }

    for (const element of document.querySelectorAll("[data-i18n-html]")) {
      element.innerHTML = t(element.dataset.i18nHtml);
    }

    for (const element of document.querySelectorAll("[data-i18n-aria]")) {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    }

    for (const option of languageOptions) {
      option.setAttribute(
        "aria-checked",
        String(option.dataset.languageValue === selectedLanguage)
      );
    }

    document.body.classList.toggle("language-en", selectedLanguage === "en");
    document.title = t("appTitle");
    if (isFocusPreviewPlaying) {
      previewFocusButton.textContent = t("stopPreview");
    }

    updateHistoryCount();

    if (shouldRefreshDisplay) {
      updateDisplay();
      updateWakeLockStatus(currentWakeLockStatusKey);
    }
  }

  function applyTheme(theme) {
    const themeMigrationMap = {
      beige: "powder-sky",
      sky: "powder-sky",
      lavender: "misty-lavender",
      mint: "sage-greige",
      pink: "smoky-rose",
      dark: "smoky-rose"
    };

    const migratedTheme = themeMigrationMap[theme] ?? theme;
    const validThemes = [
      "powder-sky",
      "misty-lavender",
      "sage-greige",
      "smoky-rose"
    ];

    selectedTheme = validThemes.includes(migratedTheme)
      ? migratedTheme
      : "powder-sky";

    document.body.dataset.theme = selectedTheme;

    for (const option of themeOptions) {
      option.setAttribute(
        "aria-checked",
        String(option.dataset.themeValue === selectedTheme)
      );
    }
  }

  function openThemeSheet() {
    leaveDimMode();
    themeOverlay.classList.remove("hidden");
    themeSheet.classList.remove("hidden");
    themeOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");
    themeSheetClose.focus();
  }

  function closeThemeSheet() {
    themeOverlay.classList.add("hidden");
    themeSheet.classList.add("hidden");
    themeOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sheet-open");
    themeSettingsButton.focus();
  }

  function saveSettings() {
    const settings = {
      focusMinutes: clampFocusMinutes(focusMinutesInput.value),
      alertSound: alertSoundSelect.value,
      focusSound: focusSoundSelect.value,
      breakEndAlert: breakEndAlertCheckbox.checked,
      theme: selectedTheme,
      language: selectedLanguage
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  function loadSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (!stored) {
        applyTheme("powder-sky");
        applyLanguage("ja", false);
        return;
      }

      const settings = JSON.parse(stored);

      setFocusMinutes(settings.focusMinutes ?? 25);

      if ([...alertSoundSelect.options].some(option => option.value === settings.alertSound)) {
        alertSoundSelect.value = settings.alertSound;
      }

      const savedFocusSound = settings.focusSound === "cafe-file"
        ? "cafe-file"
        : "gentle-rain-file";

      if ([...focusSoundSelect.options].some(option => option.value === savedFocusSound)) {
        focusSoundSelect.value = savedFocusSound;
      }

      breakEndAlertCheckbox.checked = settings.breakEndAlert !== false;
      applyTheme(settings.theme ?? "powder-sky");
      applyLanguage(settings.language ?? "ja", false);
    } catch (_) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }

  function saveTimerState() {
    if (setupScreen.classList.contains("hidden") === false) {
      return;
    }

    const state = {
      phase,
      cycle,
      focusSeconds,
      remainingSeconds: phase === "alert" ? 0 : calculateRemainingSeconds(),
      endTime,
      isPaused,
      messageIndex,
      alertNextPhase,
      savedAt: Date.now()
    };

    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  }

  function clearTimerState() {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  }

  function loadTimerState() {
    try {
      const stored = localStorage.getItem(TIMER_STORAGE_KEY);

      if (!stored) {
        return false;
      }

      const state = JSON.parse(stored);

      if (!["focus", "break", "alert"].includes(state.phase)) {
        clearTimerState();
        return false;
      }

      alertNextPhase = state.alertNextPhase === "focus" ? "focus" : "break";
      phase = state.phase === "alert" ? alertNextPhase : state.phase;
      cycle = Number.isInteger(state.cycle) && state.cycle > 0 ? state.cycle : 1;
      focusSeconds = Number.isFinite(state.focusSeconds) && state.focusSeconds > 0
        ? state.focusSeconds
        : clampFocusMinutes(focusMinutesInput.value) * 60;
      messageIndex = Number.isInteger(state.messageIndex) ? state.messageIndex : 0;

      if (state.phase === "alert" && alertNextPhase === "focus") {
        cycle += 1;
      }

      let restoredRemaining = Number.isFinite(state.remainingSeconds)
        ? Math.max(0, Math.ceil(state.remainingSeconds))
        : focusSeconds;

      if (!state.isPaused && Number.isFinite(state.endTime)) {
        restoredRemaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
      }

      if (restoredRemaining <= 0) {
        if (phase === "focus") {
          phase = "break";
          restoredRemaining = BREAK_SECONDS;
        } else {
          phase = "focus";
          cycle += 1;
          restoredRemaining = focusSeconds;
        }
      }

      remainingSeconds = restoredRemaining;
      endTime = null;
      isPaused = true;
      restoredFromStorage = true;

      showTimerScreen();
      showPausedControls();
      restoreNotice.classList.remove("hidden");
      leaveDimMode();
      startMessageRotation();
      startShiftRotation();
      updateWakeLockStatus("wakeStopped");
      updateDisplay();
      saveTimerState();

      return true;
    } catch (_) {
      clearTimerState();
      return false;
    }
  }

  function updateDisplay() {
    if (phase === "alert") {
      const movingToBreak = alertNextPhase === "break";

      phaseLabel.textContent = movingToBreak ? t("focusEnded") : t("breakEnded");
      timeDisplay.textContent = "00:00";
      checkMessage.textContent = movingToBreak
        ? t("afterAlertBreak")
        : t("afterAlertFocus");
      alertControls.textContent = movingToBreak
        ? t("startingBreak")
        : t("startingFocus");
      cycleDisplay.textContent = t("cycle")(cycle);
      return;
    }

    phaseLabel.textContent =
      phase === "focus"
        ? (isPaused ? t("phaseFocusPaused") : t("phaseFocus"))
        : (isPaused ? t("phaseBreakPaused") : t("phaseBreak"));

    timeDisplay.textContent = formatTime(remainingSeconds);
    cycleDisplay.textContent = t("cycle")(cycle);

    const messages = phase === "focus" ? t("focusMessages") : t("breakMessages");
    checkMessage.textContent = messages[messageIndex % messages.length];
  }

  function showTimerScreen() {
    setupScreen.classList.add("hidden");
    timerScreen.classList.remove("hidden");
    startMessageRotation();
    startShiftRotation();
  }

  function showSetupScreen() {
    resetScreenProtectionMode();
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
    restoredFromStorage = false;
    restoreNotice.classList.add("hidden");

    showRunningControls();
    scheduleDimMode();
    requestWakeLock();

    if (phase === "focus") {
      startFocusSound(focusSoundSelect.value);
    } else {
      stopAllAudio();
    }

    updateDisplay();
    saveTimerState();
    intervalId = window.setInterval(tick, 250);
  }

  function tick() {
    remainingSeconds = calculateRemainingSeconds();
    updateDisplay();

    if (remainingSeconds <= 0) {
      moveToNextPhase();
      return;
    }

    saveTimerState();
  }

  function moveToNextPhase() {
    stopInterval();
    messageIndex += 1;

    if (phase === "focus") {
      beginAlert("break");
      return;
    }

    if (!bodyCheckOverlay.classList.contains("hidden")) {
      closeBodyCheck();
    }

    if (breakEndAlertCheckbox.checked) {
      beginAlert("focus");
      return;
    }

    phase = "focus";
    cycle += 1;
    beginCountdown(focusSeconds);
  }

  function beginAlert(nextPhase) {
    stopAllAudio();
    alertNextPhase = nextPhase;
    phase = "alert";
    remainingSeconds = 0;
    endTime = null;
    isPaused = false;

    clearDimModeTimer();
    leaveDimMode();
    showAlertControls();
    updateDisplay();
    saveTimerState();
    playAlertSound(alertSoundSelect.value);

    alertTimeoutId = window.setTimeout(() => {
      stopAllAudio();
      alertTimeoutId = null;

      if (alertNextPhase === "break") {
        phase = "break";
        beginCountdown(BREAK_SECONDS);
        showBodyCheck();
        return;
      }

      phase = "focus";
      cycle += 1;
      beginCountdown(focusSeconds);
    }, ALERT_DURATION_MS);
  }

  function startTimer() {
    stopPreviewTimer();
    stopAllAudio();
    saveSettings();

    const focusMinutes = clampFocusMinutes(focusMinutesInput.value);
    setFocusMinutes(focusMinutes);

    focusSeconds = focusMinutes * 60;
    remainingSeconds = focusSeconds;
    phase = "focus";
    cycle = 1;
    messageIndex = 0;
    alertNextPhase = "break";
    restoredFromStorage = false;
    restoreNotice.classList.add("hidden");

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
    clearDimModeTimer();
    leaveDimMode();
    releaseWakeLock();
    showPausedControls();
    updateDisplay();
    saveTimerState();
  }

  function resumeTimer() {
    if (!isPaused) {
      return;
    }

    beginCountdown(remainingSeconds);
  }

  function resetTimer() {
    if (!bodyCheckOverlay.classList.contains("hidden")) {
      closeBodyCheck();
    }

    stopInterval();
    stopAlertTimeout();
    stopPreviewTimer();
    stopAllAudio();
    releaseWakeLock();

    phase = "focus";
    cycle = 1;
    isPaused = false;
    endTime = null;
    messageIndex = 0;
    alertNextPhase = "break";
    restoredFromStorage = false;

    const focusMinutes = clampFocusMinutes(focusMinutesInput.value);
    focusSeconds = focusMinutes * 60;
    remainingSeconds = focusSeconds;

    restoreNotice.classList.add("hidden");
    resetScreenProtectionMode();
    clearTimerState();
    showRunningControls();
    showSetupScreen();
    updateDisplay();
  }

  exportCsvButton.addEventListener("click", exportBodyCheckCsv);
  exportJsonButton.addEventListener("click", exportBodyCheckJson);
  deleteHistoryButton.addEventListener("click", deleteBodyCheckHistory);
  bodyCheckSkip.addEventListener("click", closeBodyCheck);

  decreaseButton.addEventListener("click", () => {
    setFocusMinutes(clampFocusMinutes(focusMinutesInput.value) - 1);
    saveSettings();
  });

  increaseButton.addEventListener("click", () => {
    setFocusMinutes(clampFocusMinutes(focusMinutesInput.value) + 1);
    saveSettings();
  });

  focusMinutesInput.addEventListener("change", () => {
    setFocusMinutes(focusMinutesInput.value);
    saveSettings();
  });

  focusMinutesInput.addEventListener("blur", () => {
    setFocusMinutes(focusMinutesInput.value);
    saveSettings();
  });

  alertSoundSelect.addEventListener("change", saveSettings);
  focusSoundSelect.addEventListener("change", () => {
    stopPreviewTimer();
    stopAllAudio();
    saveSettings();
  });
  breakEndAlertCheckbox.addEventListener("change", saveSettings);

  timerCard.addEventListener("click", event => {
    if (event.target.closest("button")) {
      return;
    }

    if (!setupScreen.classList.contains("hidden")) {
      return;
    }

    scheduleDimMode();
  });

  themeSettingsButton.addEventListener("click", openThemeSheet);
  themeSheetClose.addEventListener("click", closeThemeSheet);
  themeOverlay.addEventListener("click", closeThemeSheet);

  for (const option of themeOptions) {
    option.addEventListener("click", () => {
      applyTheme(option.dataset.themeValue);
      saveSettings();
    });
  }

  for (const option of languageOptions) {
    option.addEventListener("click", () => {
      applyLanguage(option.dataset.languageValue);
      saveSettings();
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !themeSheet.classList.contains("hidden")) {
      closeThemeSheet();
    }
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
      saveTimerState();
      return;
    }

    if (!isPaused && setupScreen.classList.contains("hidden") && phase !== "alert") {
      scheduleDimMode();
      requestWakeLock();
    }
  });

  window.addEventListener("pagehide", saveTimerState);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // オフライン機能が使えなくても、タイマー本体はそのまま利用できます。
      });
    });
  }

  updateWakeLockStatus("wakeUnused");
  loadSettings();
  updateHistoryCount();
  applyLanguage(selectedLanguage, false);

  focusSeconds = clampFocusMinutes(focusMinutesInput.value) * 60;
  remainingSeconds = focusSeconds;

  if (!loadTimerState()) {
    updateDisplay();
  }
})();
