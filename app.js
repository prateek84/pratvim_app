const chats = [
  {
    id: "sky",
    title: "Why is the sky blue?",
    preview: "Why is the sky blue?",
    tag: "Science",
    date: "May 23, 2026",
    time: "2h ago",
    status: "Active",
    paused: false,
    pinned: true,
    messages: [
      { role: "kid", text: "Why is the sky blue?", time: "18:10" },
      {
        role: "ai",
        text: "The sky looks blue because tiny air particles scatter blue light from the sun more than other colors.",
        time: "18:12"
      }
    ]
  },
  {
    id: "plants",
    title: "How do plants grow?",
    preview: "How do plants grow?",
    tag: "Science",
    date: "May 23, 2026",
    time: "5h ago",
    status: "Paused",
    paused: true,
    pinned: false,
    messages: [
      { role: "kid", text: "How do plants grow?", time: "15:44" },
      {
        role: "ai",
        text: "Plants use sunlight, water, air, and nutrients from soil. Their leaves help make food.",
        time: "15:46"
      }
    ]
  },
  {
    id: "gravity",
    title: "What is gravity?",
    preview: "What is gravity?",
    tag: "Science",
    date: "May 22, 2026",
    time: "1d ago",
    status: "Closed",
    paused: false,
    pinned: false,
    messages: [
      { role: "kid", text: "What is gravity?", time: "09:28" },
      { role: "ai", text: "Gravity is a pull that keeps things on Earth and helps planets move around the sun.", time: "09:30" }
    ]
  },
  {
    id: "animals",
    title: "How do animals sleep?",
    preview: "How do animals sleep?",
    tag: "General",
    date: "May 21, 2026",
    time: "2d ago",
    status: "Active",
    paused: false,
    pinned: false,
    messages: [
      { role: "kid", text: "How do animals sleep?", time: "17:02" },
      { role: "ai", text: "Animals sleep in many ways. Some curl up, some stand, and some rest lightly.", time: "17:05" }
    ]
  },
  {
    id: "water",
    title: "Why drink water?",
    preview: "Why do we need to drink water?",
    tag: "Health",
    date: "May 20, 2026",
    time: "3d ago",
    status: "Active",
    paused: false,
    pinned: true,
    messages: [
      { role: "kid", text: "Why do we need to drink water?", time: "13:18" },
      { role: "ai", text: "Water helps your body think, move, stay cool, and carry nutrients.", time: "13:20" }
    ]
  }
];

const onboardingSlides = [
  {
    title: "Ask safely",
    text: "Type, speak, or upload a picture when you want to learn something new.",
    visualType: "ask"
  },
  {
    title: "Learn in simple words",
    text: "Get clear answers, easy examples, and helpful follow-up ideas made for kids.",
    visualType: "learn"
  },
  {
    title: "Explore with confidence",
    text: "If a topic is not right for kids, Safe SearchAI helps you ask a safer question.",
    visualType: "safe"
  }
];

const parentOnboardingSlides = [
  {
    title: "Welcome, Parents",
    text: "Create a safe space where each child can ask, learn, and explore with confidence.",
    features: ["Kid profiles", "Private PINs"],
    visualType: "setup"
  },
  {
    title: "Safe voice and text chat",
    text: "Set up safe voice, text, and image search with age-aware answers for your kids.",
    features: ["Voice chat", "Text chat"],
    visualType: "chat"
  },
  {
    title: "Stay informed",
    text: "Review kid-wise reports, screen time, streaks, and safety activity from parent mode.",
    features: ["Kid reports", "Safety alerts"],
    visualType: "reports"
  }
];

let activeChatId = "sky";
let onboardingIndex = 0;
let parentOnboardingIndex = 0;
let elapsedSeconds = 30;
let timerLimitReached = false;
const TIMER_LIMIT_SECONDS = 4 * 60 * 60;
let loginMode = "child";
let parentAction = "login";
let editingKidIndex = null;
let activeReportKidIndex = 0;
const kidProfiles = [
  {
    name: "Ravin",
    age: "9",
    gender: "Boy",
    pin: "1234",
    streak: 4,
    lastLogin: "Today",
    dailyMinutes: 82,
    alerts: 1,
    weeklyMinutes: [42, 58, 34, 76, 64, 82, 51],
    alertBreakdown: [
      { label: "Unsafe topic", value: 1 },
      { label: "Timer complete", value: 2 },
      { label: "Parent review", value: 0 }
    ],
    topics: [
      { label: "Science", value: 45 },
      { label: "Health", value: 24 },
      { label: "General", value: 31 }
    ],
    modes: [
      { label: "Text", value: 12 },
      { label: "Voice", value: 4 },
      { label: "Image", value: 2 }
    ]
  },
  {
    name: "Maya",
    age: "7",
    gender: "Girl",
    pin: "2468",
    streak: 2,
    lastLogin: "Yesterday",
    dailyMinutes: 36,
    alerts: 0,
    weeklyMinutes: [24, 31, 18, 36, 22, 14, 0],
    alertBreakdown: [
      { label: "Unsafe topic", value: 0 },
      { label: "Timer complete", value: 1 },
      { label: "Parent review", value: 0 }
    ],
    topics: [
      { label: "Science", value: 30 },
      { label: "Reading", value: 42 },
      { label: "General", value: 28 }
    ],
    modes: [
      { label: "Text", value: 7 },
      { label: "Voice", value: 3 },
      { label: "Image", value: 1 }
    ]
  }
];

const phoneDevice = document.querySelector("#phoneDevice");
const currentSize = document.querySelector("#currentSize");
const screenButtons = document.querySelectorAll("[data-screen]");
const loginModeButtons = document.querySelectorAll("[data-login-mode]");
const demoButtons = document.querySelectorAll("[data-demo]");
const navButtons = document.querySelectorAll(".nav-btn");
const sizeButtons = document.querySelectorAll(".size-btn");
const screens = document.querySelectorAll(".app-screen");
const onboardingNext = document.querySelector("#onboardingNext");
const onboardingStep = document.querySelector("#onboardingStep");
const onboardingTitle = document.querySelector("#onboardingTitle");
const onboardingText = document.querySelector("#onboardingText");
const kidOnboardingVisual = document.querySelector("#kidOnboardingVisual");
const dots = document.querySelectorAll("#onboardingDots span");
const parentOnboardingNext = document.querySelector("#parentOnboardingNext");
const parentOnboardingStep = document.querySelector("#parentOnboardingStep");
const parentOnboardingTitle = document.querySelector("#parentOnboardingTitle");
const parentOnboardingText = document.querySelector("#parentOnboardingText");
const parentOnboardingFeatures = document.querySelector("#parentOnboardingFeatures");
const parentOnboardingVisual = document.querySelector("#parentOnboardingVisual");
const parentOnboardingDots = document.querySelectorAll("#parentOnboardingDots span");
const homePinnedList = document.querySelector("#homePinnedList");
const homeCategoryList = document.querySelector("#homeCategoryList");
const homeNewChat = document.querySelector("#homeNewChat");
const categorySelect = document.querySelector("#categorySelect");
const historyList = document.querySelector("#historyList");
const messageArea = document.querySelector("#messageArea");
const chatNameTop = document.querySelector("#chatNameTop");
const pinCurrentBtn = document.querySelector("#pinCurrentBtn");
const pauseChatBtn = document.querySelector("#pauseChatBtn");
const closeChatBtn = document.querySelector("#closeChatBtn");
const pausedBanner = document.querySelector("#pausedBanner");
const composer = document.querySelector("#composer");
const chatInput = document.querySelector("#chatInput");
const imageInput = document.querySelector("#imageInput");
const imageUploadBtn = document.querySelector("#imageUploadBtn");
const imageModal = document.querySelector("#imageModal");
const imageClose = document.querySelector("#imageClose");
const chooseImageBtn = document.querySelector("#chooseImageBtn");
const sampleImageBtn = document.querySelector("#sampleImageBtn");
const imageModalText = document.querySelector("#imageModalText");
const imagePreviewBox = document.querySelector("#imagePreviewBox");
const imageResult = document.querySelector("#imageResult");
const micBtn = document.querySelector("#micBtn");
const voiceModal = document.querySelector("#voiceModal");
const voiceClose = document.querySelector("#voiceClose");
const cancelVoiceBtn = document.querySelector("#cancelVoiceBtn");
const finishVoiceBtn = document.querySelector("#finishVoiceBtn");
const voiceTitle = document.querySelector("#voiceTitle");
const voiceText = document.querySelector("#voiceText");
const voiceResult = document.querySelector("#voiceResult");
const avatarModal = document.querySelector("#avatarModal");
const avatarInput = document.querySelector("#avatarInput");
const avatarClose = document.querySelector("#avatarClose");
const chooseAvatarBtn = document.querySelector("#chooseAvatarBtn");
const resetAvatarBtn = document.querySelector("#resetAvatarBtn");
const avatarTriggers = document.querySelectorAll(".avatar-trigger");
const avatarImages = document.querySelectorAll(".avatar-image");
const parentAlert = document.querySelector("#parentAlert");
const alertBackBtn = document.querySelector("#alertBackBtn");
const alertReviewed = document.querySelector("#alertReviewed");
const alertCloseChatBtn = document.querySelector("#alertCloseChatBtn");
const alertQuestion = document.querySelector("#alertQuestion");
const alertReason = document.querySelector("#alertReason");
const chatTimer = document.querySelector("#chatTimer");
const chatTimerRing = document.querySelector("#chatTimerRing");
const chatTopicLine = document.querySelector("#chatTopicLine");
const chatHeroQuestion = document.querySelector("#chatHeroQuestion");
const chatHeroSummary = document.querySelector("#chatHeroSummary");
const loginTitle = document.querySelector("#loginTitle");
const loginSubtitle = document.querySelector("#loginSubtitle");
const loginProfileName = document.querySelector("#loginProfileName");
const loginContinueBtn = document.querySelector("#loginContinueBtn");
const pinInput = document.querySelector("#pinInput");
const parentLoginOptions = document.querySelector("#parentLoginOptions");
const parentRegisterForm = document.querySelector("#parentRegisterForm");
const parentEmailInput = document.querySelector("#parentEmailInput");
const confirmEmailText = document.querySelector("#confirmEmailText");
const confirmEmailBtn = document.querySelector("#confirmEmailBtn");
const resendEmailBtn = document.querySelector("#resendEmailBtn");
const kidRegisterForm = document.querySelector("#kidRegisterForm");
const kidNameInput = document.querySelector("#kidNameInput");
const kidAgeInput = document.querySelector("#kidAgeInput");
const kidGenderInput = document.querySelector("#kidGenderInput");
const kidPinInput = document.querySelector("#kidPinInput");
const kidProfileList = document.querySelector("#kidProfileList");
const kidCountLabel = document.querySelector("#kidCountLabel");
const addKidBtn = document.querySelector("#addKidBtn");
const finishKidSetupBtn = document.querySelector("#finishKidSetupBtn");
const parentKidsList = document.querySelector("#parentKidsList");
const parentKidCount = document.querySelector("#parentKidCount");
const registerKidFromParent = document.querySelector("#registerKidFromParent");
const dashboardRegisterKid = document.querySelector("#dashboardRegisterKid");
const overallStreak = document.querySelector("#overallStreak");
const dailyTimeTotal = document.querySelector("#dailyTimeTotal");
const alertTotal = document.querySelector("#alertTotal");
const dailyTimeChart = document.querySelector("#dailyTimeChart");
const alertReportChart = document.querySelector("#alertReportChart");
const kidReportSelect = document.querySelector("#kidReportSelect");
const selectedKidLabel = document.querySelector("#selectedKidLabel");
const selectedKidSummary = document.querySelector("#selectedKidSummary");
const streakSummaryGrid = document.querySelector("#streakSummaryGrid");
const weeklyTrendChart = document.querySelector("#weeklyTrendChart");
const modeReportGrid = document.querySelector("#modeReportGrid");

function activeChat() {
  return chats.find((chat) => chat.id === activeChatId);
}

function truncate(text, size = 28) {
  return text.length > size ? `${text.slice(0, size - 3)}...` : text;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function todayLabel() {
  return new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

function setLoginMode(mode, openLogin = false, action = "login") {
  loginMode = mode;
  parentAction = mode === "parent" ? action : "login";
  if (openLogin && mode === "parent" && action === "register") {
    showScreen("parent-register");
    return;
  }
  const isParent = mode === "parent";
  const isParentRegister = isParent && parentAction === "register";
  loginModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.loginMode === mode);
  });
  loginTitle.textContent = isParentRegister ? "Register parent" : isParent ? "Parent login" : "Welcome back, Ravin";
  loginSubtitle.textContent = isParentRegister
    ? "Create a parent PIN to manage safety settings, alerts, and screen time."
    : isParent
    ? "Review safety settings, alerts, screen time, and saved learning activity."
    : "Choose your profile and enter your PIN to start learning.";
  loginProfileName.textContent = isParent ? "Parent account" : "Ravin";
  pinInput.value = isParentRegister ? "" : isParent ? "0000" : "1234";
  parentLoginOptions?.classList.toggle("is-hidden", !isParent);
  loginContinueBtn.textContent = isParentRegister ? "Create Parent Account" : isParent ? "Open Parent View" : "Open App";
  loginContinueBtn.dataset.screen = isParent ? "parent-dashboard" : "onboarding";
  if (openLogin) showScreen("login");
}

function renderKidProfiles() {
  if (!kidProfileList) return;
  kidProfileList.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
        <article class="kid-profile-chip">
          <div>
            <strong>${kid.name}</strong>
            <span>${kid.age} years | ${kid.gender} | PIN ${kid.pin}</span>
          </div>
          <button type="button" data-remove-kid="${index}" aria-label="Remove ${kid.name}">Remove</button>
        </article>
      `
        )
        .join("")
    : `<div class="empty-card">No kid profiles added yet.</div>`;

  const nextNumber = Math.min(kidProfiles.length + 1, 4);
  kidCountLabel.textContent = editingKidIndex === null ? (kidProfiles.length >= 4 ? "4 of 4 kids" : `${nextNumber} of 4 kids`) : "Editing kid";
  addKidBtn.disabled = kidProfiles.length >= 4 && editingKidIndex === null;
  addKidBtn.textContent = editingKidIndex === null ? (kidProfiles.length >= 4 ? "Maximum 4 Kids Added" : "Add Kid") : "Update Kid";

  document.querySelectorAll("[data-remove-kid]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeKid);
      kidProfiles.splice(index, 1);
      renderKidProfiles();
    });
  });
}

function resetKidForm() {
  const next = kidProfiles.length + 1;
  editingKidIndex = null;
  kidNameInput.value = next === 1 ? "Ravin" : "";
  kidAgeInput.value = "";
  kidGenderInput.value = "Boy";
  kidPinInput.value = "";
  renderKidProfiles();
}

function openKidRegister(index = null) {
  editingKidIndex = index;
  if (index === null) {
    kidNameInput.value = "";
    kidAgeInput.value = "";
    kidGenderInput.value = "Boy";
    kidPinInput.value = "";
  } else {
    const kid = kidProfiles[index];
    kidNameInput.value = kid.name;
    kidAgeInput.value = kid.age;
    kidGenderInput.value = kid.gender;
    kidPinInput.value = kid.pin;
  }
  renderKidProfiles();
  showScreen("kid-register");
}

function addKidProfile() {
  if (kidProfiles.length >= 4 && editingKidIndex === null) return;
  const name = kidNameInput.value.trim() || `Kid ${kidProfiles.length + 1}`;
  const age = kidAgeInput.value.trim() || "8";
  const gender = kidGenderInput.value;
  const pin = kidPinInput.value.trim() || "1234";
  if (editingKidIndex === null) {
    kidProfiles.push({
      name,
      age,
      gender,
      pin,
      streak: 0,
      lastLogin: "Not logged in yet",
      dailyMinutes: 0,
      alerts: 0,
      weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
      alertBreakdown: [
        { label: "Unsafe topic", value: 0 },
        { label: "Timer complete", value: 0 },
        { label: "Parent review", value: 0 }
      ],
      topics: [
        { label: "Science", value: 0 },
        { label: "Health", value: 0 },
        { label: "General", value: 0 }
      ],
      modes: [
        { label: "Text", value: 0 },
        { label: "Voice", value: 0 },
        { label: "Image", value: 0 }
      ]
    });
  } else {
    kidProfiles[editingKidIndex] = { ...kidProfiles[editingKidIndex], name, age, gender, pin };
  }
  editingKidIndex = null;
  showScreen("parent-dashboard");
}

function renderParentKids() {
  if (!parentKidsList) return;
  parentKidCount.textContent = String(kidProfiles.length);
  parentKidsList.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
            <article class="parent-kid-card">
              <div class="parent-kid-avatar">${kid.name.slice(0, 1).toUpperCase()}</div>
              <div>
                <strong>${kid.name}</strong>
                <span>${kid.age} years | ${kid.gender} | PIN ${kid.pin}</span>
                <p>${kid.streak || 0}-day login streak | ${kid.lastLogin || "Not logged in yet"}</p>
              </div>
              <div class="parent-kid-actions">
                <button type="button" data-edit-parent-kid="${index}">Edit</button>
                <button type="button" data-delete-parent-kid="${index}">Delete</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-card">No kids registered yet. Use Register Kid to add a child profile.</div>`;

  document.querySelectorAll("[data-edit-parent-kid]").forEach((button) => {
    button.addEventListener("click", () => openKidRegister(Number(button.dataset.editParentKid)));
  });
  document.querySelectorAll("[data-delete-parent-kid]").forEach((button) => {
    button.addEventListener("click", () => {
      kidProfiles.splice(Number(button.dataset.deleteParentKid), 1);
      activeReportKidIndex = Math.max(0, Math.min(activeReportKidIndex, kidProfiles.length - 1));
      renderParentKids();
    });
  });
}

function minutesLabel(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function renderParentAnalytics() {
  if (!dailyTimeChart) return;
  activeReportKidIndex = Math.max(0, Math.min(activeReportKidIndex, kidProfiles.length - 1));
  const kid = kidProfiles[activeReportKidIndex];
  kidReportSelect.innerHTML = kidProfiles.length
    ? kidProfiles
        .map((profile, index) => `<option value="${index}" ${index === activeReportKidIndex ? "selected" : ""}>${profile.name}</option>`)
        .join("")
    : `<option value="">No kids registered</option>`;
  kidReportSelect.disabled = !kidProfiles.length;

  if (!kid) {
    overallStreak.textContent = "No kid selected";
    selectedKidLabel.textContent = "Reports";
    selectedKidSummary.textContent = "Register a kid to view safety and learning reports.";
    streakSummaryGrid.innerHTML = "";
    dailyTimeTotal.textContent = "0m";
    alertTotal.textContent = "0";
    dailyTimeChart.innerHTML = `<div class="empty-card">No kid reports yet.</div>`;
    alertReportChart.innerHTML = "";
    weeklyTrendChart.innerHTML = "";
    modeReportGrid.innerHTML = "";
    return;
  }

  const alertTypes = kid.alertBreakdown || [];
  const maxAlerts = Math.max(1, ...alertTypes.map((item) => item.value));
  const maxWeekMinutes = Math.max(60, ...(kid.weeklyMinutes || [0]));
  const totalModes = Math.max(1, (kid.modes || []).reduce((sum, item) => sum + item.value, 0));

  selectedKidLabel.textContent = `${kid.name} report`;
  selectedKidSummary.textContent = `${kid.name} has ${minutesLabel(kid.dailyMinutes || 0)} app time today and a ${kid.streak || 0}-day learning streak.`;
  overallStreak.textContent = `${kid.streak || 0}-day streak`;
  streakSummaryGrid.innerHTML = `
    <article class="selected-streak-card">
      <strong>${kid.streak || 0}</strong>
      <span>${kid.name} day streak</span>
      <small>Last login: ${kid.lastLogin || "Not logged in yet"}</small>
    </article>
  `;
  dailyTimeTotal.textContent = minutesLabel(kid.dailyMinutes || 0);
  alertTotal.textContent = String(kid.alerts || 0);

  const width = Math.max(8, Math.round(((kid.dailyMinutes || 0) / 240) * 100));
  dailyTimeChart.innerHTML = `
    <div class="metric-row">
      <div><strong>${kid.name}</strong><span>${minutesLabel(kid.dailyMinutes || 0)} today / 4h limit</span></div>
      <div class="metric-bar"><span style="width:${Math.min(width, 100)}%"></span></div>
    </div>
  `;

  alertReportChart.innerHTML = alertTypes
    .map((item) => {
      const height = Math.max(8, Math.round((item.value / maxAlerts) * 100));
      return `
        <div class="alert-bar">
          <div><span style="height:${height}%"></span></div>
          <strong>${item.value}</strong>
          <small>${item.label}</small>
        </div>
      `;
    })
    .join("");

  weeklyTrendChart.innerHTML = (kid.weeklyMinutes || [])
    .map((minutes, index) => {
      const height = Math.max(8, Math.round((minutes / maxWeekMinutes) * 100));
      const days = ["M", "T", "W", "T", "F", "S", "S"];
      return `
        <div class="week-bar">
          <div><span style="height:${height}%"></span></div>
          <small>${days[index]}</small>
        </div>
      `;
    })
    .join("");

  modeReportGrid.innerHTML = (kid.modes || [])
    .map((mode) => {
      const percent = Math.round((mode.value / totalModes) * 100);
      return `<article><strong>${mode.value}</strong><span>${mode.label}</span><small>${percent}% of asks</small></article>`;
    })
    .join("");
}

function showScreen(name) {
  closeImageModal();
  closeVoiceModal();
  closeAvatarModal();
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.view === name));
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.screen === name));
  if (name === "home") renderHome();
  if (name === "chat") renderChat();
  if (name === "parent-dashboard") renderParentKids();
  if (name === "parent-analytics") renderParentAnalytics();
  if (name === "parent-onboarding") renderParentOnboarding();
  if (name === "kid-register") renderKidProfiles();
  if (name === "parent-alert") {
    alertQuestion.textContent = alertQuestion.textContent || "Current chat";
    alertReason.textContent = alertReason.textContent || "Screen time limit reached";
  }
}

function setActiveDemoButton(demoName) {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.demo === demoName);
  });
}

function openDemoState(name) {
  activeChatId = "sky";
  activeChat().paused = false;
  activeChat().status = "Active";
  showScreen("chat");
  setActiveDemoButton(name);
  if (name === "image") showImageModal();
  if (name === "voice") showVoiceModal();
  if (name === "parent") {
    activeChat().messages.push({
      role: "blocked",
      text: "I can't help with that topic here. Please ask a parent or try a safer learning question.",
      time: nowLabel()
    });
    renderChat();
  }
}

function renderOnboarding() {
  const slide = onboardingSlides[onboardingIndex];
  onboardingStep.textContent = `${onboardingIndex + 1} of ${onboardingSlides.length}`;
  onboardingTitle.textContent = slide.title;
  onboardingText.textContent = slide.text;
  if (kidOnboardingVisual) {
    kidOnboardingVisual.classList.remove("ask", "learn", "safe");
    kidOnboardingVisual.classList.add(slide.visualType);
  }
  onboardingNext.textContent = onboardingIndex === onboardingSlides.length - 1 ? "Continue" : "Next";
  dots.forEach((dot, index) => dot.classList.toggle("is-active", index === onboardingIndex));
}

function renderParentOnboarding() {
  const slide = parentOnboardingSlides[parentOnboardingIndex];
  parentOnboardingStep.textContent = `${parentOnboardingIndex + 1} of ${parentOnboardingSlides.length}`;
  parentOnboardingTitle.textContent = slide.title;
  parentOnboardingText.textContent = slide.text;
  parentOnboardingFeatures.innerHTML = slide.features.map((feature) => `<span>${feature}</span>`).join("");
  if (parentOnboardingVisual) {
    parentOnboardingVisual.classList.remove("setup", "chat", "reports");
    parentOnboardingVisual.classList.add(slide.visualType);
  }
  parentOnboardingNext.textContent = parentOnboardingIndex === parentOnboardingSlides.length - 1 ? "Open Parent Home" : "Next";
  parentOnboardingDots.forEach((dot, index) => dot.classList.toggle("is-active", index === parentOnboardingIndex));
}

function sortedChats() {
  const selected = categorySelect?.value || "All";
  const filtered = selected === "All" ? chats : chats.filter((chat) => chat.tag === selected);
  return filtered.slice().sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

function chatStatus(chat) {
  if (chat.status === "Closed") return "Closed";
  if (chat.paused) return "Paused";
  return "Active";
}

function chatCard(chat, className, dataName) {
  return `
    <button class="${className} ${chat.pinned ? "is-pinned" : ""}" ${dataName}="${chat.id}" type="button">
      <strong>${truncate(chat.title || "Learning Chat", 24)}</strong>
      <span class="tag">${chat.tag}</span>
      <p>${chat.preview}</p>
      <small>${chat.date} | ${chatStatus(chat)}${chat.pinned ? " | Pinned" : ""}</small>
    </button>
  `;
}

function bindOpenChatButtons(selector, datasetKey) {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", () => {
      activeChatId = button.dataset[datasetKey];
      showScreen("chat");
    });
  });
}

function renderHome() {
  const pinnedChats = chats.filter((chat) => chat.pinned);
  homePinnedList.innerHTML =
    pinnedChats.map((chat) => chatCard(chat, "recent-card", "data-open-chat")).join("") ||
    `<div class="empty-card">No pinned chats yet.</div>`;

  const grouped = chats.reduce((groups, chat) => {
    const key = chat.tag;
    groups[key] = groups[key] || [];
    groups[key].push(chat);
    return groups;
  }, {});

  homeCategoryList.innerHTML = Object.entries(grouped)
    .map(
      ([category, categoryChats]) => `
        <article class="category-group">
          <div class="category-title">
            <strong>${category}</strong>
            <span>${categoryChats.length} chat${categoryChats.length === 1 ? "" : "s"}</span>
          </div>
          <div class="category-chat-stack">
            ${categoryChats.map((chat) => chatCard(chat, "category-chat-card", "data-category-chat")).join("")}
          </div>
        </article>
      `
    )
    .join("");

  bindOpenChatButtons("[data-open-chat]", "openChat");
  bindOpenChatButtons("[data-category-chat]", "categoryChat");
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = sortedChats()
    .map(
      (chat) => `
        <button class="history-card ${chat.id === activeChatId ? "is-active" : ""} ${chat.pinned ? "is-pinned" : ""}" data-history-chat="${chat.id}" type="button">
          <strong>${truncate(chat.title || "Learning Chat", 23)}</strong>
          <span class="tag">${chat.tag}</span>
          <p>${chat.preview}</p>
          <small>${chat.date} | ${chatStatus(chat)}</small>
        </button>
      `
    )
    .join("");

  document.querySelectorAll("[data-history-chat]").forEach((button) => {
    button.addEventListener("click", () => {
      activeChatId = button.dataset.historyChat;
      renderChat();
    });
  });
}

function renderMessages() {
  const chat = activeChat();
  messageArea.innerHTML = chat.messages
    .map(
      (message) => `
        <article class="chat-message ${message.role}">
          <div class="avatar">${message.role === "kid" ? "" : message.role === "blocked" ? "!" : "AI"}</div>
          <div class="bubble">
            <p>${message.text}</p>
            <time>${message.time}</time>
          </div>
        </article>
      `
    )
    .join("");
  messageArea.scrollTop = messageArea.scrollHeight;
}

function renderChat() {
  const chat = activeChat();
  if (chatTopicLine) chatTopicLine.textContent = `${chat.tag} - Safe learning - Follow-up`;
  if (chatHeroQuestion) chatHeroQuestion.textContent = chat.title || "Ask a new question";
  if (chatHeroSummary) chatHeroSummary.textContent = chat.preview || "Type, speak, or upload an image to start a calm learning chat.";
  if (chatNameTop) chatNameTop.textContent = chat.title === "New Chat" ? "" : chat.title;
  if (pinCurrentBtn) {
    pinCurrentBtn.textContent = chat.pinned ? "Pinned" : "Pin Chat";
    pinCurrentBtn.classList.toggle("is-on", chat.pinned);
  }
  if (pauseChatBtn) {
    pauseChatBtn.textContent = chat.paused ? "▶" : "Ⅱ";
    pauseChatBtn.setAttribute("aria-label", chat.paused ? "Resume chat" : "Pause chat");
    pauseChatBtn.setAttribute("title", chat.paused ? "Resume chat" : "Pause chat");
    pauseChatBtn.classList.toggle("is-on", chat.paused);
  }
  pausedBanner.classList.toggle("is-hidden", !chat.paused);
  composer.classList.toggle("is-paused", chat.paused);
  chatInput.disabled = chat.paused;
  imageUploadBtn.disabled = chat.paused;
  micBtn.disabled = chat.paused;
  renderHistory();
  renderMessages();
}

function createNewChat() {
  const id = `chat-${Date.now()}`;
  chats.unshift({
    id,
    title: "",
    preview: "Ask a new question",
    tag: "General",
    date: todayLabel(),
    time: "Just now",
    status: "Active",
    paused: false,
    pinned: false,
    messages: [
      {
        role: "ai",
        text: "Hi Ravin. You can type, upload a picture, or tap the microphone to ask a question.",
        time: nowLabel()
      }
    ]
  });
  activeChatId = id;
  showScreen("chat");
}

function pauseChatForTimer() {
  const chat = activeChat();
  if (timerLimitReached) return;
  timerLimitReached = true;
  chat.paused = true;
  chat.status = "Paused";
  pausedBanner.querySelector("strong").textContent = "Screen time is complete";
  pausedBanner.querySelector("span").textContent = "Your chat is saved. Take a break and come back when a parent says it is okay.";
  renderChat();
  alertQuestion.textContent = chat.title || "Current learning chat";
  alertReason.textContent = "Screen time limit reached";
  showScreen("parent-alert");
}

function answerFor(question) {
  const lower = question.toLowerCase();
  if (lower.includes("rocket")) return "Rockets fly by pushing hot gas downward very fast. That push lifts the rocket upward.";
  if (lower.includes("sky")) return "The sky looks blue because air scatters blue sunlight more than other colors.";
  if (lower.includes("plant")) return "Plants grow with sunlight, water, air, and nutrients from soil.";
  if (lower.includes("gravity")) return "Gravity is a force that pulls things together, like keeping us on Earth.";
  if (lower.includes("water")) return "Water helps your body stay cool, think clearly, and carry nutrients.";
  return "Good question. Here is a simple way to think about it: start with the main idea, then look at one small example.";
}

function unsafeReasonFor(question) {
  const lower = question.toLowerCase();
  const riskyWords = ["kill", "weapon", "bomb", "hurt", "suicide", "hack", "steal", "drugs"];
  const matched = riskyWords.find((word) => lower.includes(word));
  if (!matched) return "";
  if (["suicide", "hurt", "kill"].includes(matched)) return "Harm-related content";
  if (["weapon", "bomb"].includes(matched)) return "Dangerous instructions";
  if (["hack", "steal"].includes(matched)) return "Unsafe or illegal activity";
  return "Age-inappropriate content";
}

function sendQuestion(text) {
  const chat = activeChat();
  if (chat.paused) return;
  const time = nowLabel();
  chat.messages.push({ role: "kid", text, time });
  chat.preview = text;
  chat.time = "Just now";
  chat.date = todayLabel();
  chat.status = "Active";
  if (!chat.title) chat.title = truncate(text, 30);

  const unsafeReason = unsafeReasonFor(text);
  if (unsafeReason) {
    chat.messages.push({
      role: "blocked",
      text: "I can't help with that topic here. Please ask a parent or try a safer learning question.",
      time
    });
    renderChat();
    return;
  }

  chat.messages.push({ role: "ai", text: answerFor(text), time });
  renderChat();
}

function showImageModal() {
  if (activeChat().paused) return;
  imageModal.classList.remove("is-hidden");
  imageModalText.textContent = "Choose a picture and I will explain it in simple words.";
  imagePreviewBox.textContent = "";
  imageResult.classList.add("is-hidden");
  imageResult.textContent = "";
}

function closeImageModal() {
  imageModal.classList.add("is-hidden");
}

function finishImageAnalysis(fileName) {
  imageModalText.textContent = "Fetching image details...";
  imagePreviewBox.textContent = "";
  imageResult.classList.add("is-hidden");
  imageResult.textContent = "";

  window.setTimeout(() => {
    const result = `I reviewed ${fileName}. It appears to be a learning image. I can describe what is visible, name important objects, and explain it in kid-friendly words.`;
    activeChat().messages.push({ role: "ai", text: `Image result: ${result}`, time: nowLabel() });
    renderChat();
  }, 800);
}

function showVoiceModal() {
  if (activeChat().paused) return;
  voiceModal.classList.remove("is-hidden");
  micBtn.classList.add("is-recording");
  voiceModal.querySelector(".record-orb").classList.remove("is-hidden");
  voiceModal.querySelector(".wave").classList.remove("is-hidden");
  voiceTitle.textContent = "Voice recording";
  voiceText.textContent = "Recording is in progress. Speak your question clearly.";
  voiceResult.classList.add("is-hidden");
  voiceResult.textContent = "";
}

function closeVoiceModal() {
  voiceModal.classList.add("is-hidden");
  micBtn.classList.remove("is-recording");
}

function showAvatarModal() {
  avatarModal.classList.remove("is-hidden");
}

function closeAvatarModal() {
  avatarModal.classList.add("is-hidden");
}

function applyAvatar(src) {
  avatarImages.forEach((image) => {
    image.src = src;
  });
}

function resetAvatar() {
  applyAvatar("ravin.jpg");
  avatarInput.value = "";
}

function finishVoice() {
  voiceTitle.textContent = "Thank you";
  voiceText.textContent = "Your voice has been recorded.";
  voiceModal.querySelector(".record-orb").classList.add("is-hidden");
  voiceModal.querySelector(".wave").classList.add("is-hidden");
  voiceResult.classList.add("is-hidden");
  voiceResult.textContent = "";
  micBtn.classList.remove("is-recording");
}

function showParentAlert(question, reason) {
  alertQuestion.textContent = question;
  alertReason.textContent = reason;
  showScreen("parent-alert");
}

function closeParentAlert(addReviewedMessage = false) {
  if (addReviewedMessage) {
    activeChat().messages.push({
      role: "ai",
      text: "A parent reviewed the alert. You can continue with a safe learning question.",
      time: nowLabel()
    });
    renderChat();
  }
  showScreen("chat");
}

function closeActiveChat() {
  const chat = activeChat();
  chat.paused = false;
  chat.status = "Closed";
  chat.time = "Just now";
  chat.date = todayLabel();
  chat.messages.push({
    role: "ai",
    text: "This chat was closed and saved in previous chats. You can open it again from Home anytime.",
    time: nowLabel()
  });
  showScreen("home");
}

function updateTimer() {
  const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  const label = `${hours}:${minutes}:${seconds} / 4h`;
  const progress = Math.min(100, (elapsedSeconds / TIMER_LIMIT_SECONDS) * 100);
  chatTimer.textContent = label;
  if (chatTimerRing) chatTimerRing.style.setProperty("--timer-progress", `${progress}%`);
  if (elapsedSeconds >= TIMER_LIMIT_SECONDS) pauseChatForTimer();
}

screenButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

loginModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLoginMode(button.dataset.loginMode, !button.closest(".login-mode-tabs"), button.dataset.parentAction || "login");
  });
});

parentRegisterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (confirmEmailText) confirmEmailText.textContent = parentEmailInput?.value || "parent@example.com";
  showScreen("parent-email-confirm");
});

confirmEmailBtn?.addEventListener("click", () => {
  parentOnboardingIndex = 0;
  renderParentOnboarding();
  showScreen("parent-onboarding");
});

resendEmailBtn?.addEventListener("click", () => {
  if (confirmEmailText) confirmEmailText.textContent = parentEmailInput?.value || "parent@example.com";
});

kidRegisterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addKidProfile();
});

finishKidSetupBtn?.addEventListener("click", () => {
  editingKidIndex = null;
  showScreen("parent-dashboard");
});

registerKidFromParent?.addEventListener("click", () => openKidRegister());
dashboardRegisterKid?.addEventListener("click", () => openKidRegister());
kidReportSelect?.addEventListener("change", () => {
  activeReportKidIndex = Number(kidReportSelect.value || 0);
  renderParentAnalytics();
});

demoButtons.forEach((button) => {
  button.addEventListener("click", () => openDemoState(button.dataset.demo));
});

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.style.setProperty("--app-width", `${button.dataset.width}px`);
    document.documentElement.style.setProperty("--app-height", `${button.dataset.height}px`);
    currentSize.textContent = `${button.dataset.width} x ${button.dataset.height}`;
    sizeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

onboardingNext.addEventListener("click", () => {
  if (onboardingIndex === onboardingSlides.length - 1) {
    showScreen("home");
    return;
  }
  onboardingIndex += 1;
  renderOnboarding();
});

parentOnboardingNext?.addEventListener("click", () => {
  if (parentOnboardingIndex === parentOnboardingSlides.length - 1) {
    showScreen("parent-dashboard");
    return;
  }
  parentOnboardingIndex += 1;
  renderParentOnboarding();
});

homeNewChat.addEventListener("click", createNewChat);
categorySelect?.addEventListener("change", renderHistory);

pinCurrentBtn?.addEventListener("click", () => {
  const chat = activeChat();
  chat.pinned = !chat.pinned;
  renderChat();
});

pauseChatBtn?.addEventListener("click", () => {
  const chat = activeChat();
  chat.paused = !chat.paused;
  chat.status = chat.paused ? "Paused" : "Active";
  chat.time = "Just now";
  chat.date = todayLabel();
  pausedBanner.querySelector("strong").textContent = "Chat paused";
  pausedBanner.querySelector("span").textContent = "Tap Resume to continue this conversation.";
  renderChat();
});

closeChatBtn?.addEventListener("click", () => {
  closeActiveChat();
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  chatInput.value = "";
  sendQuestion(value);
});

imageUploadBtn.addEventListener("click", showImageModal);
imageClose.addEventListener("click", closeImageModal);
chooseImageBtn.addEventListener("click", () => imageInput.click());
sampleImageBtn.addEventListener("click", () => finishImageAnalysis("sample learning picture"));
imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (file) finishImageAnalysis(file.name);
});

micBtn.addEventListener("click", showVoiceModal);
voiceClose.addEventListener("click", closeVoiceModal);
cancelVoiceBtn.addEventListener("click", closeVoiceModal);
finishVoiceBtn.addEventListener("click", finishVoice);

avatarTriggers.forEach((button) => {
  button.addEventListener("click", showAvatarModal);
});
avatarClose.addEventListener("click", closeAvatarModal);
chooseAvatarBtn.addEventListener("click", () => avatarInput.click());
resetAvatarBtn.addEventListener("click", resetAvatar);
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    applyAvatar(reader.result);
    closeAvatarModal();
  });
  reader.readAsDataURL(file);
});

alertBackBtn.addEventListener("click", () => closeParentAlert(false));
alertReviewed.addEventListener("click", () => closeParentAlert(true));
alertCloseChatBtn.addEventListener("click", closeActiveChat);

setInterval(() => {
  elapsedSeconds += 1;
  updateTimer();
}, 1000);

renderOnboarding();
renderParentOnboarding();
setLoginMode("child");
renderKidProfiles();
renderParentKids();
renderParentAnalytics();
renderHome();
renderChat();
updateTimer();

window.kidsSafeDemo = {
  showScreen,
  openDemoState,
  completeTimer() {
    elapsedSeconds = TIMER_LIMIT_SECONDS;
    updateTimer();
  }
};
