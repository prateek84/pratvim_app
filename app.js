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
    text: "Type a question or upload a picture when you want to learn something new.",
    visualType: "ask"
  },
  {
    title: "Learn in simple words",
    text: "Get clear answers, easy examples, and helpful follow-up ideas made for kids.",
    visualType: "learn"
  },
  {
    title: "Choose your next adventure",
    text: "Follow what you love, from space and animals to art and inventions, and discover something new each time.",
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
    title: "Protected AI conversations",
    text: "Set up safe text and image questions with age-aware answers for your kids.",
    features: ["Protected chat", "Image questions"],
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
let pendingDeleteKidIndex = null;
let activeLoginKidIndex = 0;
let activeReportKidIndex = 0;
let activeAvatarScope = "kid";
let pendingKidAvatarSrc = "";
let pendingSetupAvatarSrc = "kid-ravin-avatar.png";
let avatarReturnScreen = "home";
const DAY_MS = 24 * 60 * 60 * 1000;
const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "monthly",
    name: "Family Monthly",
    checkoutName: "Pratvim Family Monthly",
    price: 499,
    days: 30,
    label: "Monthly",
    unit: "/month",
    renewal: "Renews every 30 days",
    badge: "",
    saving: "Flexible monthly access"
  },
  quarterly: {
    id: "quarterly",
    name: "Family Quarterly",
    checkoutName: "Pratvim Family Quarterly",
    price: 1299,
    days: 90,
    label: "Quarterly",
    unit: "/3 months",
    renewal: "Renews every 90 days",
    badge: "Popular",
    saving: "Save ₹198"
  },
  annual: {
    id: "annual",
    name: "Family Annual",
    checkoutName: "Pratvim Family Annual",
    price: 4499,
    days: 365,
    label: "Annual",
    unit: "/year",
    renewal: "Renews every 365 days",
    badge: "Best value",
    saving: "Save ₹1,489"
  }
};
let selectedPlanId = "monthly";
let activeSubscriptionPlanId = "monthly";
let subscriptionExpiresAt = new Date(Date.now() + 12 * DAY_MS);
const kidProfiles = [
  {
    name: "Ravin",
    avatar: "kid-ravin-avatar.png",
    age: "9",
    gender: "Boy",
    pin: "1234",
    streak: 4,
    lastLogin: "Recently",
    dailyMinutes: 82,
    alerts: 1,
    weeklyMinutes: [42, 58, 34, 76, 64, 82, 51],
    alertBreakdown: [
      { label: "Unsafe topic", value: 1 },
      { label: "Timer complete", value: 0 },
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
    avatar: "kid-maya-avatar.png",
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
      { label: "Timer complete", value: 0 },
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
const historyList = document.querySelector("#historyList");
const chatHistoryButton = document.querySelector("#chatHistoryButton");
const chatHistoryLayer = document.querySelector("#chatHistoryLayer");
const chatHistoryBackdrop = document.querySelector("#chatHistoryBackdrop");
const chatHistoryClose = document.querySelector("#chatHistoryClose");
const chatHistoryFilterButtons = document.querySelectorAll("[data-history-filter]");
const historyNewChatButton = document.querySelector("#historyNewChatButton");
const chatProgressStatus = document.querySelector("#chatProgressStatus");
const streakPopover = document.querySelector("#streakPopover");
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
const kidProfileForm = document.querySelector("#kidProfileForm");
const kidProfileNameInput = document.querySelector("#kidProfileNameInput");
const avatarInput = document.querySelector("#avatarInput");
const avatarClose = document.querySelector("#avatarClose");
const chooseAvatarBtn = document.querySelector("#chooseAvatarBtn");
const resetAvatarBtn = document.querySelector("#resetAvatarBtn");
const avatarTriggers = document.querySelectorAll(".avatar-trigger");
const avatarImages = document.querySelectorAll(".avatar-image");
const parentAvatarImages = document.querySelectorAll(".parent-avatar-image");
const avatarPreview = document.querySelector("#avatarPreview");
const avatarModalTitle = document.querySelector("#avatarModalTitle");
const avatarModalText = document.querySelector("#avatarModalText");
const parentProfileMenu = document.querySelector("#parentProfileMenu");
const parentProfileTriggers = document.querySelectorAll(".parent-profile-trigger");
const staticProfileTriggers = document.querySelectorAll(".static-profile-trigger");
const parentUploadAvatar = document.querySelector("#parentUploadAvatar");
const parentEditProfile = document.querySelector("#parentEditProfile");
const parentLogout = document.querySelector("#parentLogout");
const parentProfileModal = document.querySelector("#parentProfileModal");
const parentProfileForm = document.querySelector("#parentProfileForm");
const parentProfileClose = document.querySelector("#parentProfileClose");
const parentProfileCancel = document.querySelector("#parentProfileCancel");
const parentProfileEmail = document.querySelector("#parentProfileEmail");
const parentProfileMobile = document.querySelector("#parentProfileMobile");
const parentProfileImageInput = document.querySelector("#parentProfileImageInput");
const parentProfilePhotoButton = document.querySelector("#parentProfilePhotoButton");
const parentProfilePreview = document.querySelector("#parentProfilePreview");
const parentProfileSaved = document.querySelector("#parentProfileSaved");
const parentMenuEmail = document.querySelector("#parentMenuEmail");
const supportForm = document.querySelector("#supportForm");
const supportEmail = document.querySelector("#supportEmail");
const supportSuccess = document.querySelector("#supportSuccess");
const kidProfileMenu = document.querySelector("#kidProfileMenu");
const kidMenuName = document.querySelector("#kidMenuName");
const kidEditProfile = document.querySelector("#kidEditProfile");
const kidLogout = document.querySelector("#kidLogout");
const parentAlert = document.querySelector("#parentAlert");
const alertBackBtn = document.querySelector("#alertBackBtn");
const alertClose = document.querySelector("#alertClose");
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
const kidLoginPicker = document.querySelector("#kidLoginPicker");
const kidPinPanel = document.querySelector("#kidPinPanel");
const selectedKidLoginAvatar = document.querySelector("#selectedKidLoginAvatar");
const changeKidLoginBtn = document.querySelector("#changeKidLoginBtn");
const parentHomeChildSwitch = document.querySelector("#parentHomeChildSwitch");
const floatingBackButton = document.querySelector("#floatingBackButton");
const legalScreenButtons = document.querySelectorAll("[data-menu-screen]");
const parentRegisterForm = document.querySelector("#parentRegisterForm");
const parentLastNameInput = document.querySelector("#parentLastNameInput");
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
const parentOverviewAlerts = document.querySelector("#parentOverviewAlerts");
const parentOverviewAlertCount = document.querySelector("#parentOverviewAlertCount");
const registerKidFromParent = document.querySelector("#registerKidFromParent");
const subscriptionStatus = document.querySelector("#subscriptionStatus");
const subscriptionPlanName = document.querySelector("#subscriptionPlanName");
const subscriptionUntil = document.querySelector("#subscriptionUntil");
const subscriptionDaysLeft = document.querySelector("#subscriptionDaysLeft");
const managePaymentsBtn = document.querySelector("#managePaymentsBtn");
const familyPlanOptions = document.querySelector("#familyPlanOptions");
const continueToPayment = document.querySelector("#continueToPayment");
const paymentConfirmationText = document.querySelector("#paymentConfirmationText");
const paymentModal = document.querySelector("#paymentModal");
const paymentForm = document.querySelector("#paymentForm");
const paymentBack = document.querySelector("#paymentBack");
const paymentClose = document.querySelector("#paymentClose");
const paymentKidText = document.querySelector("#paymentKidText");
const checkoutPlanName = document.querySelector("#checkoutPlanName");
const checkoutPlanRenewal = document.querySelector("#checkoutPlanRenewal");
const checkoutPlanPrice = document.querySelector("#checkoutPlanPrice");
const checkoutPlanUnit = document.querySelector("#checkoutPlanUnit");
const billingParentName = document.querySelector("#billingParentName");
const billingEmail = document.querySelector("#billingEmail");
const subscriptionTerms = document.querySelector("#subscriptionTerms");
const subscriptionConsentText = document.querySelector("#subscriptionConsentText");
const paymentTotal = document.querySelector("#paymentTotal");
const paymentSubmit = document.querySelector("#paymentSubmit");
const paymentSuccess = document.querySelector("#paymentSuccess");
const cartoonAvatarGrid = document.querySelector("#cartoonAvatarGrid");
const saveCartoonAvatar = document.querySelector("#saveCartoonAvatar");
const avatarProfilePreview = document.querySelector("#avatarProfilePreview");
const kidAvatarProfileName = document.querySelector("#kidAvatarProfileName");
const parentKidDeleteModal = document.querySelector("#parentKidDeleteModal");
const parentKidDeleteMessage = document.querySelector("#parentKidDeleteMessage");
const confirmParentKidDelete = document.querySelector("#confirmParentKidDelete");
const cancelParentKidDelete = document.querySelector("#cancelParentKidDelete");
const dashboardRegisterKid = document.querySelector("#dashboardRegisterKid");
const reportHeadline = document.querySelector("#reportHeadline");
const overallStreak = document.querySelector("#overallStreak");
const dailyTimeTotal = document.querySelector("#dailyTimeTotal");
const alertTotal = document.querySelector("#alertTotal");
const dailyTimeChart = document.querySelector("#dailyTimeChart");
const alertReportChart = document.querySelector("#alertReportChart");
const kidReportSelect = document.querySelector("#kidReportSelect");
const kidReportTabs = document.querySelector("#kidReportTabs");
const selectedKidLabel = document.querySelector("#selectedKidLabel");
const selectedKidSummary = document.querySelector("#selectedKidSummary");
const streakSummaryGrid = document.querySelector("#streakSummaryGrid");
const weeklyTrendChart = document.querySelector("#weeklyTrendChart");
const modeReportGrid = document.querySelector("#modeReportGrid");
const openParentAlerts = document.querySelector("#openParentAlerts");
const alertKidTabs = document.querySelector("#alertKidTabs");
const parentAlertsTotal = document.querySelector("#parentAlertsTotal");
const parentAlertsKidName = document.querySelector("#parentAlertsKidName");
const parentAlertList = document.querySelector("#parentAlertList");

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  button.classList.remove("is-clicked");
  window.requestAnimationFrame(() => button.classList.add("is-clicked"));
  window.setTimeout(() => button.classList.remove("is-clicked"), 700);
});

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

function kidAvatar(kid, index = 0) {
  return kid?.avatar || (index % 2 ? "kid-maya-avatar.png" : "kid-ravin-avatar.png");
}

const cartoonCharacters = ["🧑‍🚀", "🧙", "🦸", "🧑‍🔬", "🧑‍🎨", "🧑‍🚒", "🧚", "🥷", "🤠", "🧑‍🍳"];
const cartoonColors = ["#dcefed", "#f2e2ef", "#e9e5fb", "#dceafa", "#f8e5d9", "#e5efe0", "#f6ebcf", "#e2e7eb", "#f2dfcf", "#e9ead8"];
const cartoonDisplayNames = ["Astro", "Merlin", "Bolt", "Nova", "Pixel", "Blaze", "Twinkle", "Shadow", "Ranger", "Sprout"];

function cartoonAvatar(index) {
  const emoji = cartoonCharacters[index % cartoonCharacters.length];
  const color = cartoonColors[index % cartoonColors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="${color}"/><circle cx="80" cy="80" r="68" fill="none" stroke="#fffefa" stroke-width="6"/><text x="80" y="104" text-anchor="middle" font-size="82">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderCartoonAvatarGrid() {
  if (!cartoonAvatarGrid) return;
  cartoonAvatarGrid.innerHTML = cartoonCharacters.map((_, index) => {
    const src = cartoonAvatar(index);
    return `<button class="cartoon-avatar-option${pendingKidAvatarSrc === src ? " is-selected" : ""}" data-cartoon-avatar="${index}" type="button" aria-label="Select cartoon avatar ${index + 1}"><img src="${src}" alt="" /></button>`;
  }).join("");
  document.querySelectorAll("[data-cartoon-avatar]").forEach((button) => {
    button.addEventListener("click", () => {
      const avatarIndex = Number(button.dataset.cartoonAvatar);
      pendingKidAvatarSrc = cartoonAvatar(avatarIndex);
      if (avatarProfilePreview) avatarProfilePreview.src = pendingKidAvatarSrc;
      if (kidAvatarProfileName) kidAvatarProfileName.value = cartoonDisplayNames[avatarIndex];
      renderCartoonAvatarGrid();
    });
  });
}

function openAvatarLibrary(returnScreen = "home", currentAvatar = "") {
  avatarReturnScreen = returnScreen;
  pendingKidAvatarSrc = currentAvatar || cartoonAvatar(0);
  const kid = kidProfiles[activeLoginKidIndex];
  if (avatarProfilePreview) avatarProfilePreview.src = pendingKidAvatarSrc;
  if (kidAvatarProfileName) kidAvatarProfileName.value = kid?.name || "";
  renderCartoonAvatarGrid();
  showScreen("avatar-library");
}

function renderKidLoginPicker() {
  if (!kidLoginPicker) return;
  kidLoginPicker.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
            <button class="kid-login-choice" data-kid-login-choice="${index}" type="button" aria-label="Login as ${kid.name}">
              <img src="${kidAvatar(kid, index)}" alt="${kid.name}" />
              <strong>${kid.name}</strong>
            </button>
          `
        )
        .join("")
    : `<div class="empty-card">A parent needs to register a child profile first.</div>`;

  document.querySelectorAll("[data-kid-login-choice]").forEach((button) => {
    button.addEventListener("click", () => selectKidForLogin(Number(button.dataset.kidLoginChoice)));
  });
}

function selectKidForLogin(index) {
  const kid = kidProfiles[index];
  if (!kid) return;
  activeLoginKidIndex = index;
  avatarImages.forEach((image) => {
    image.src = kidAvatar(kid, index);
  });
  loginProfileName.textContent = kid.name;
  const selectedAvatar = kidAvatar(kid, index);
  selectedKidLoginAvatar.src = selectedAvatar;
  selectedKidLoginAvatar.alt = `${kid.name} profile`;
  selectedKidLoginAvatar.closest(".selected-kid-login")?.style.setProperty("--selected-kid-art", `url("${selectedAvatar}")`);
  pinInput.value = "";
  kidLoginPicker.classList.add("is-hidden");
  kidPinPanel.classList.remove("is-hidden");
  loginContinueBtn.classList.remove("is-hidden");
  loginTitle.textContent = `Hi, ${kid.name}`;
  loginSubtitle.textContent = "Enter your private PIN to continue.";
  pinInput.focus();
}

function resetKidLoginSelection() {
  renderKidLoginPicker();
  kidLoginPicker?.classList.remove("is-hidden");
  kidPinPanel?.classList.add("is-hidden");
  loginContinueBtn?.classList.add("is-hidden");
  if (pinInput) pinInput.value = "";
  if (loginTitle) loginTitle.textContent = "Who is learning today?";
  if (loginSubtitle) loginSubtitle.textContent = "Choose your profile to enter your private PIN.";
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
  loginTitle.textContent = isParentRegister ? "Register parent" : isParent ? "Parent login" : "Who is learning today?";
  loginTitle.classList.toggle("is-parent-login-title", isParent);
  loginSubtitle.textContent = isParentRegister
    ? "Create a parent PIN to manage safety settings, alerts, and screen time."
    : isParent
    ? "Review safety settings, alerts, screen time, and saved learning activity."
    : "Choose your profile to enter your private PIN.";
  loginProfileName.textContent = isParent ? "Parent account" : "";
  pinInput.value = isParentRegister ? "" : isParent ? "0000" : "";
  parentLoginOptions?.classList.toggle("is-hidden", !isParent);
  kidLoginPicker?.classList.toggle("is-hidden", isParent);
  kidPinPanel?.classList.toggle("is-hidden", !isParent);
  kidPinPanel?.querySelector(".selected-kid-login")?.classList.toggle("is-hidden", isParent);
  const pinLabel = kidPinPanel?.querySelector(".input-label");
  if (pinLabel) pinLabel.textContent = isParent ? "Parent PIN" : "Private PIN";
  loginContinueBtn.textContent = isParentRegister ? "Create Parent Account" : isParent ? "Go to Parent Home" : "Start Learning";
  loginContinueBtn.classList.toggle("is-hidden", !isParent);
  if (!isParent) resetKidLoginSelection();
  if (openLogin) showScreen("login");
}

function renderKidProfiles() {
  if (!kidProfileList) return;
  kidProfileList.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
        <article class="kid-profile-chip">
          <img src="${kidAvatar(kid, index)}" alt="${kid.name}" />
          <strong>${kid.name}</strong>
        </article>
      `
        )
        .join("")
    : `<div class="empty-card">No kid profiles added yet.</div>`;

  const nextNumber = Math.min(kidProfiles.length + 1, 4);
  kidCountLabel.innerHTML =
    editingKidIndex === null
      ? `<b aria-hidden="true">${kidProfiles.length >= 4 ? "✓" : "+"}</b><span>${kidProfiles.length >= 4 ? "4 of 4" : `${nextNumber} of 4`}</span>`
      : `<b aria-hidden="true">✎</b><span>Editing</span>`;
  addKidBtn.disabled = kidProfiles.length >= 4 && editingKidIndex === null;
  addKidBtn.textContent = kidProfiles.length >= 4 && editingKidIndex === null ? "Maximum 4 Kids Added" : "Add a kid";

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
    pendingSetupAvatarSrc = cartoonAvatar(kidProfiles.length % cartoonCharacters.length);
  } else {
    const kid = kidProfiles[index];
    kidNameInput.value = kid.name;
    kidAgeInput.value = kid.age;
    kidGenderInput.value = kid.gender;
    kidPinInput.value = kid.pin;
    pendingSetupAvatarSrc = kidAvatar(kid, index);
  }
  renderKidProfiles();
  showScreen("kid-register");
}

function addKidProfile() {
  if (kidProfiles.length >= 4 && editingKidIndex === null) return;
  const name = kidNameInput.value.trim() || `Kid ${kidProfiles.length + 1}`;
  const age = kidAgeInput.value.trim() || "8";
  const gender = kidGenderInput.value || "Not specified";
  const pin = kidPinInput.value.trim() || "1234";
  if (editingKidIndex === null) {
    kidProfiles.push({
      name,
      avatar: pendingSetupAvatarSrc || cartoonAvatar(kidProfiles.length),
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
    kidProfiles[editingKidIndex] = { ...kidProfiles[editingKidIndex], name, age, gender, pin, avatar: pendingSetupAvatarSrc };
  }
  editingKidIndex = null;
  showScreen("parent-dashboard");
}

function renderParentKids() {
  if (!parentKidsList) return;
  parentKidCount.textContent = String(kidProfiles.length);
  if (parentOverviewAlertCount) {
    parentOverviewAlertCount.textContent = String(kidProfiles.reduce((total, kid) => total + (kid.alerts || 0), 0));
  }
  renderSubscriptionSummary();
  parentKidsList.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
            <article class="parent-kid-card">
              <img class="parent-kid-avatar" src="${kidAvatar(kid, index)}" alt="${kid.name}" />
              <div>
                <strong>${kid.name}</strong>
                <span>${kid.age} years | ${kid.gender}</span>
              </div>
              <div class="kid-card-menu">
                <button class="kid-meatball-button" type="button" data-kid-menu="${index}" aria-label="Open options for ${kid.name}" aria-expanded="false">•••</button>
                <div class="kid-card-menu-popover is-hidden" data-kid-menu-popover="${index}">
                  <button type="button" data-edit-parent-kid="${index}">Edit profile</button>
                  <button class="danger-option" type="button" data-delete-parent-kid="${index}">Delete profile</button>
                </div>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-card">No kids registered yet. Use Register Kid to add a child profile.</div>`;

  document.querySelectorAll("[data-edit-parent-kid]").forEach((button) => {
    button.addEventListener("click", () => openKidRegister(Number(button.dataset.editParentKid)));
  });
  document.querySelectorAll("[data-kid-menu]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const popover = document.querySelector(`[data-kid-menu-popover="${button.dataset.kidMenu}"]`);
      const willOpen = popover?.classList.contains("is-hidden");
      document.querySelectorAll(".kid-card-menu-popover").forEach((menu) => menu.classList.add("is-hidden"));
      document.querySelectorAll("[data-kid-menu]").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
      popover?.classList.toggle("is-hidden", !willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
  document.querySelectorAll("[data-delete-parent-kid]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingDeleteKidIndex = Number(button.dataset.deleteParentKid);
      const kid = kidProfiles[pendingDeleteKidIndex];
      if (parentKidDeleteMessage) {
        parentKidDeleteMessage.textContent = `Deleting ${kid.name}'s profile will permanently remove all learning activity, dashboard history, reports, safety alerts, PIN details, and saved chats. This profile cannot be recovered after deletion.`;
      }
      parentKidDeleteModal?.classList.remove("is-hidden");
    });
  });
}

function hasActiveSubscription() {
  return subscriptionExpiresAt instanceof Date && subscriptionExpiresAt.getTime() > Date.now();
}

function subscriptionDaysRemaining() {
  if (!hasActiveSubscription()) return 0;
  return Math.max(0, Math.ceil((subscriptionExpiresAt.getTime() - Date.now()) / DAY_MS));
}

function formatSubscriptionDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatRupees(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function selectedSubscriptionPlan() {
  return SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.monthly;
}

function renderPaymentPlans() {
  if (!familyPlanOptions) return;
  familyPlanOptions.innerHTML = Object.values(SUBSCRIPTION_PLANS)
    .map(
      (plan) => `
        <button class="family-plan-option${plan.id === selectedPlanId ? " is-selected" : ""}" type="button" data-plan-id="${plan.id}" aria-pressed="${plan.id === selectedPlanId}">
          <span class="plan-radio" aria-hidden="true"></span>
          <span class="plan-card-copy">
            <span class="plan-label-row"><strong>${plan.label}</strong>${plan.badge ? `<em>${plan.badge}</em>` : ""}</span>
            <small>${plan.days} days for the whole family</small>
            <b>${plan.saving}</b>
          </span>
          <span class="plan-card-price"><strong>₹${formatRupees(plan.price)}</strong><small>${plan.unit}</small></span>
        </button>
      `
    )
    .join("");
  familyPlanOptions.querySelectorAll("[data-plan-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlanId = button.dataset.planId;
      renderPaymentPlans();
      renderPaymentModal();
    });
  });
}

function renderSubscriptionSummary() {
  if (!subscriptionStatus || !subscriptionUntil || !subscriptionDaysLeft) return;
  const isActive = hasActiveSubscription();
  const activePlan = SUBSCRIPTION_PLANS[activeSubscriptionPlanId] || SUBSCRIPTION_PLANS.monthly;
  subscriptionStatus.textContent = isActive ? "Active" : "Expired";
  subscriptionStatus.classList.toggle("is-expired", !isActive);
  if (subscriptionPlanName) subscriptionPlanName.textContent = activePlan.name;
  subscriptionUntil.textContent = isActive
    ? `Valid until ${formatSubscriptionDate(subscriptionExpiresAt)}`
    : "Subscription expired";
  subscriptionDaysLeft.textContent = String(subscriptionDaysRemaining());
  managePaymentsBtn.textContent = isActive ? "View plans" : "Choose plan";
}

function renderPaymentModal() {
  const isActive = hasActiveSubscription();
  const plan = selectedSubscriptionPlan();
  paymentKidText.textContent = isActive
    ? `Your current plan is valid until ${formatSubscriptionDate(subscriptionExpiresAt)}. Renew now to add another ${plan.days} days for the whole family.`
    : "Subscribe once for this parent account and give protected chat access to up to 4 children.";
  if (checkoutPlanName) checkoutPlanName.textContent = plan.checkoutName;
  if (checkoutPlanRenewal) checkoutPlanRenewal.textContent = plan.renewal;
  if (checkoutPlanPrice) checkoutPlanPrice.textContent = `₹${formatRupees(plan.price)}`;
  if (checkoutPlanUnit) checkoutPlanUnit.textContent = plan.unit;
  if (subscriptionConsentText) subscriptionConsentText.textContent = `I agree to renew this family subscription every ${plan.days} days. I can cancel before the next renewal.`;
  paymentTotal.textContent = `₹${formatRupees(plan.price)}`;
  paymentSubmit.textContent = `${isActive ? "Renew" : "Start"} ${plan.label.toLowerCase()} subscription`;
}

function openPaymentModal() {
  paymentSuccess.classList.add("is-hidden");
  paymentSuccess.textContent = "";
  if (billingParentName) {
    const firstName = document.querySelector("#parentNameInput")?.value.trim() || "Parent";
    const lastName = parentLastNameInput?.value.trim() || "";
    billingParentName.value = `${firstName} ${lastName}`.trim();
  }
  if (billingEmail) billingEmail.value = parentEmailInput?.value || "parent@example.com";
  if (subscriptionTerms) subscriptionTerms.checked = false;
  renderPaymentPlans();
  renderPaymentModal();
  paymentModal.classList.remove("is-hidden");
}

function closePaymentModal() {
  paymentModal?.classList.add("is-hidden");
}

function minutesLabel(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function renderKidTabs(container, activeIndex, attribute) {
  if (!container) return;
  container.innerHTML = kidProfiles.length
    ? kidProfiles
        .map(
          (kid, index) => `
            <button class="${index === activeIndex ? "is-active" : ""}" type="button" ${attribute}="${index}" aria-label="View ${kid.name}">
              <img src="${kidAvatar(kid, index)}" alt="" />
              <span>${kid.name.charAt(0).toUpperCase()}</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-card">No child profiles available.</div>`;
}

function renderParentAnalytics() {
  activeReportKidIndex = Math.max(0, Math.min(activeReportKidIndex, kidProfiles.length - 1));
  const kid = kidProfiles[activeReportKidIndex];
  renderKidTabs(kidReportTabs, activeReportKidIndex, "data-report-kid");
  document.querySelectorAll("[data-report-kid]").forEach((button) => {
    button.addEventListener("click", () => {
      activeReportKidIndex = Number(button.dataset.reportKid);
      renderParentAnalytics();
    });
  });

  if (!kid) {
    if (overallStreak) overallStreak.textContent = "0";
    if (reportHeadline) reportHeadline.textContent = "No child selected";
    selectedKidLabel.textContent = "Reports";
    selectedKidSummary.textContent = "Register a kid to view safety and learning reports.";
    dailyTimeTotal.textContent = "0m";
    alertTotal.textContent = "0";
    if (modeReportGrid) modeReportGrid.innerHTML = "";
    return;
  }

  selectedKidLabel.textContent = `${kid.name}'s report`;
  selectedKidSummary.textContent = `${kid.name} has ${minutesLabel(kid.dailyMinutes || 0)} app time today and a ${kid.streak || 0}-day learning streak.`;
  if (reportHeadline) reportHeadline.textContent = `${kid.name}'s learning overview`;
  overallStreak.textContent = `${kid.streak || 0}d`;
  dailyTimeTotal.textContent = minutesLabel(kid.dailyMinutes || 0);
  alertTotal.textContent = String(kid.alerts || 0);

  if (modeReportGrid) modeReportGrid.innerHTML = "";
}

function renderParentAlerts() {
  activeReportKidIndex = Math.max(0, Math.min(activeReportKidIndex, kidProfiles.length - 1));
  const kid = kidProfiles[activeReportKidIndex];
  renderKidTabs(alertKidTabs, activeReportKidIndex, "data-alert-kid");
  document.querySelectorAll("[data-alert-kid]").forEach((button) => {
    button.addEventListener("click", () => {
      activeReportKidIndex = Number(button.dataset.alertKid);
      renderParentAlerts();
    });
  });
  if (!kid) {
    parentAlertsTotal.textContent = "0";
    parentAlertsKidName.textContent = "No child selected";
    parentAlertList.innerHTML = `<div class="empty-card">Register a child to view alerts.</div>`;
    return;
  }
  const alerts = (kid.alertBreakdown || []).filter((item) => item.value > 0);
  parentAlertsTotal.textContent = String(kid.alerts || alerts.reduce((sum, item) => sum + item.value, 0));
  parentAlertsKidName.textContent = `${kid.name}'s recent activity`;
  const alertQuestions = {
    "Unsafe topic": "How can I talk to a stranger without my parents knowing?",
    "Timer complete": "Can I keep chatting after my learning time is over?",
    "Parent review": "Why did Pratvim ask me to check with a parent?"
  };
  parentAlertList.innerHTML = alerts.length
    ? alerts
        .map(
          (item, index) => `
            <article class="parent-alert-item">
              <img class="alert-kid-thumbnail" src="${kidAvatar(kid, activeReportKidIndex)}" alt="${kid.name}" />
              <div class="alert-record-copy">
                <span>${item.label}</span>
                <strong>${alertQuestions[item.label] || "This question needs a parent review."}</strong>
                <p>${item.value} ${item.value === 1 ? "alert" : "related alerts"} recorded for ${kid.name}.</p>
                <small>${index === 0 ? "Today, 6:42 PM" : "This week"}</small>
              </div>
              <button type="button" data-close-alert="${kid.alertBreakdown.indexOf(item)}">Close alert</button>
            </article>
          `
        )
        .join("")
    : `<div class="alerts-clear-state"><strong>No alerts to review</strong><p>${kid.name}'s recent protected activity looks clear.</p></div>`;
  document.querySelectorAll("[data-close-alert]").forEach((button) => {
    button.addEventListener("click", () => {
      const alertIndex = Number(button.dataset.closeAlert);
      if (kid.alertBreakdown?.[alertIndex]) kid.alertBreakdown[alertIndex].value = 0;
      kid.alerts = (kid.alertBreakdown || []).reduce((sum, item) => sum + item.value, 0);
      renderParentAlerts();
      renderParentKids();
    });
  });
}

let currentScreenName = document.querySelector(".app-screen.is-active")?.dataset.view || "splash";
const screenHistory = [];

function showScreen(name, options = {}) {
  if (!options.fromBack && name !== currentScreenName) screenHistory.push(currentScreenName);
  currentScreenName = name;
  if (name === "parent-dashboard" || name === "parent-analytics" || name === "parent-alerts") loginMode = "parent";
  if (name === "home" || name === "chat" || name === "onboarding") loginMode = "child";
  closeParentProfileModal();
  closeParentProfileMenu();
  closeKidProfileMenu();
  closeStreakPopover();
  closeChatHistory();
  closeImageModal();
  closeVoiceModal();
  closeAvatarModal();
  closePaymentModal();
  syncStaticProfileTriggers();
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.view === name));
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.screen === name));
  floatingBackButton?.classList.toggle("is-hidden", name === "splash" || name === "login");
  if (name === "home") renderHome();
  if (name === "chat") renderChat();
  if (name === "parent-dashboard") renderParentKids();
  if (name === "parent-analytics") renderParentAnalytics();
  if (name === "parent-alerts") renderParentAlerts();
  if (name === "parent-onboarding") renderParentOnboarding();
  if (name === "kid-register") renderKidProfiles();
  if (name === "payment-plans") {
    renderPaymentPlans();
    renderPaymentModal();
  }
  if (name === "support") {
    if (supportEmail && parentProfileEmail) supportEmail.value = parentProfileEmail.value.trim();
    supportSuccess?.classList.add("is-hidden");
    supportForm?.querySelector("button[type='submit']")?.removeAttribute("disabled");
  }
  if (name === "parent-alert") {
    alertQuestion.textContent = alertQuestion.textContent || "Current chat";
    alertReason.textContent = alertReason.textContent || "Screen time limit reached";
  }
}

function showPreviousScreen() {
  const previousScreen = screenHistory.pop();
  if (previousScreen) {
    showScreen(previousScreen, { fromBack: true });
    return;
  }
  showScreen(loginMode === "parent" ? "parent-dashboard" : "home", { fromBack: true });
}

function syncStaticProfileTriggers() {
  const isParent = loginMode === "parent";
  const kid = kidProfiles[activeLoginKidIndex] || kidProfiles[0];
  const parentSource = parentAvatarImages[0]?.src || "parent-profile.svg";
  const kidSource = kid ? kidAvatar(kid, activeLoginKidIndex) : "kid-ravin-avatar.png";
  staticProfileTriggers.forEach((button) => {
    const image = button.querySelector(".static-profile-image");
    button.dataset.avatarScope = isParent ? "parent" : "kid";
    button.setAttribute("aria-label", isParent ? "Open parent profile menu" : "Open kid profile menu");
    if (image) {
      image.src = isParent ? parentSource : kidSource;
      image.alt = isParent ? "Parent profile" : `${kid?.name || "Kid"} profile`;
    }
  });
}

function setActiveDemoButton(demoName) {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.demo === demoName);
  });
}

function ensureDemoKids(count = 2) {
  while (kidProfiles.length < count) {
    const next = kidProfiles.length + 1;
    kidProfiles.push({
      name: `Kid ${next}`,
      age: String(7 + next),
      gender: next % 2 ? "Boy" : "Girl",
      pin: `${next}${next}${next}${next}`,
      streak: next,
      lastLogin: "Demo",
      dailyMinutes: next * 12,
      alerts: 0,
      weeklyMinutes: [10, 18, 24, 16, 20, 12, 8],
      alertBreakdown: [
        { label: "Unsafe topic", value: 0 },
        { label: "Timer complete", value: 0 },
        { label: "Parent review", value: 0 }
      ],
      topics: [
        { label: "Science", value: 20 },
        { label: "Health", value: 10 },
        { label: "General", value: 15 }
      ],
      modes: [
        { label: "Text", value: 4 },
        { label: "Voice", value: 2 },
        { label: "Image", value: 1 }
      ]
    });
  }
}

function openDemoState(name) {
  activeChatId = "sky";
  activeChat().paused = false;
  activeChat().status = "Active";
  setActiveDemoButton(name);
  if (name === "login-parent") {
    setLoginMode("parent", true);
    setActiveDemoButton(name);
    return;
  }
  if (name === "child-onboarding-2" || name === "child-onboarding-3") {
    onboardingIndex = name === "child-onboarding-2" ? 1 : 2;
    renderOnboarding();
    showScreen("onboarding");
    setActiveDemoButton(name);
    return;
  }
  if (name === "parent-onboarding-2" || name === "parent-onboarding-3") {
    parentOnboardingIndex = name === "parent-onboarding-2" ? 1 : 2;
    renderParentOnboarding();
    showScreen("parent-onboarding");
    setActiveDemoButton(name);
    return;
  }
  if (name === "new-chat") {
    createNewChat();
    setActiveDemoButton(name);
    return;
  }
  if (name === "kid-edit") {
    ensureDemoKids(1);
    openKidRegister(0);
    setActiveDemoButton(name);
    return;
  }
  if (name === "kid-max") {
    ensureDemoKids(4);
    openKidRegister();
    setActiveDemoButton(name);
    return;
  }
  if (name === "parent-empty" || name === "dashboard-empty") {
    kidProfiles.splice(0, kidProfiles.length);
    activeReportKidIndex = 0;
    showScreen(name === "parent-empty" ? "parent-dashboard" : "parent-analytics");
    setActiveDemoButton(name);
    return;
  }
  showScreen("chat");
  setActiveDemoButton(name);
  if (name === "paused-chat") {
    const chat = activeChat();
    chat.paused = true;
    chat.status = "Paused";
    pausedBanner.querySelector("strong").textContent = "Chat paused";
    pausedBanner.querySelector("span").textContent = "Tap Resume to continue this conversation.";
    renderChat();
  }
  if (name === "unsafe-chat") sendQuestion("How do people build a bomb?");
  if (name === "image") showImageModal();
  if (name === "image-loading") {
    showImageModal();
    imageModalText.textContent = "Fetching image details...";
    imagePreviewBox.textContent = "";
    imageResult.classList.add("is-hidden");
  }
  if (name === "image-result") {
    showImageModal();
    imageModalText.textContent = "Image details fetched.";
    imagePreviewBox.textContent = "sample learning picture";
    imageResult.textContent = "I reviewed the sample learning picture. I can describe what is visible and explain it in kid-friendly words.";
    imageResult.classList.remove("is-hidden");
  }
  if (name === "voice") showVoiceModal();
  if (name === "voice-done") {
    showVoiceModal();
    finishVoice();
  }
  if (name === "avatar") showAvatarModal();
  if (name === "timer-complete") {
    elapsedSeconds = TIMER_LIMIT_SECONDS;
    updateTimer();
    setActiveDemoButton(name);
  }
  if (name === "alert-reviewed") {
    showParentAlert(activeChat().title || "Current learning chat", "Parent review completed");
    closeParentAlert(true);
    setActiveDemoButton(name);
  }
  if (name === "closed-chat") {
    closeActiveChat();
    setActiveDemoButton(name);
  }
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
  parentOnboardingFeatures.innerHTML = slide.features
    .map((feature) => `<span><i aria-hidden="true">✓</i>${feature}</span>`)
    .join("");
  if (parentOnboardingVisual) {
    parentOnboardingVisual.classList.remove("setup", "chat", "reports");
    parentOnboardingVisual.classList.add(slide.visualType);
  }
  parentOnboardingNext.textContent = parentOnboardingIndex === parentOnboardingSlides.length - 1 ? "Open dashboard" : "Next";
  parentOnboardingDots.forEach((dot, index) => dot.classList.toggle("is-active", index === parentOnboardingIndex));
}

let chatHistoryFilter = "pinned";

function sortedChats() {
  const filtered = chatHistoryFilter === "pinned" ? chats.filter((chat) => chat.pinned) : chats;
  return filtered.slice();
}

function chatStatus(chat) {
  if (chat.status === "Closed") return "Closed";
  if (chat.paused) return "Paused";
  return "Active";
}

function chatCard(chat, className, dataName) {
  const iconType = className === "recent-card" ? "pin" : "recent";
  return `
    <button class="${className} ${chat.pinned ? "is-pinned" : ""}" ${dataName}="${chat.id}" type="button">
      <span class="home-chat-type-icon ${iconType}" aria-hidden="true"><img src="${iconType === "pin" ? "icon-pin.svg" : "icon-clock-3.svg"}" alt="" /></span>
      <span class="home-chat-copy">
        <strong>${truncate(chat.title || "Learning Chat", 24)}</strong>
        <p>${chat.preview}</p>
        <small>${chat.date}<i aria-hidden="true"></i>${chatStatus(chat)}</small>
      </span>
      <span class="home-chat-chevron" aria-hidden="true">›</span>
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
  const pinnedChats = chats.filter((chat) => chat.pinned).slice(0, 2);
  const recentChats = chats.slice(0, 2);
  homePinnedList.innerHTML =
    pinnedChats.map((chat) => chatCard(chat, "recent-card", "data-open-chat")).join("") ||
    `<div class="empty-card">No pinned chats yet.</div>`;

  homeCategoryList.innerHTML = `
    <div class="category-chat-stack">
      ${recentChats.map((chat) => chatCard(chat, "category-chat-card", "data-category-chat")).join("")}
    </div>
  `;

  bindOpenChatButtons("[data-open-chat]", "openChat");
  bindOpenChatButtons("[data-category-chat]", "categoryChat");
}

function renderHistory() {
  if (!historyList) return;
  const filteredChats = sortedChats();
  historyList.innerHTML = filteredChats.length
    ? filteredChats
        .map(
          (chat) => `
        <button class="history-card ${chat.id === activeChatId ? "is-active" : ""} ${chat.pinned ? "is-pinned" : ""}" data-history-chat="${chat.id}" type="button">
          <strong>${truncate(chat.title || "Learning Chat", 23)}</strong>
          <p>${chat.preview}</p>
          <small>${chat.date} | ${chatStatus(chat)}</small>
        </button>
      `
        )
        .join("")
    : `<div class="chat-history-empty"><strong>No pinned chats yet</strong><p>Pin a useful conversation and it will appear here.</p></div>`;

  chatHistoryFilterButtons.forEach((button) => {
    const isActive = button.dataset.historyFilter === chatHistoryFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll("[data-history-chat]").forEach((button) => {
    button.addEventListener("click", () => {
      activeChatId = button.dataset.historyChat;
      closeChatHistory();
      renderChat();
    });
  });
}

function openChatHistory() {
  renderHistory();
  chatHistoryLayer?.classList.remove("is-hidden");
  chatHistoryButton?.setAttribute("aria-expanded", "true");
}

function closeChatHistory() {
  chatHistoryLayer?.classList.add("is-hidden");
  chatHistoryButton?.setAttribute("aria-expanded", "false");
}

function closeStreakPopover() {
  streakPopover?.classList.add("is-hidden");
  chatProgressStatus?.setAttribute("aria-expanded", "false");
}

function positionStreakPopover() {
  if (!streakPopover || !chatProgressStatus) return;
  const screen = chatProgressStatus.closest(".screen-chat");
  if (!screen) return;
  const screenRect = screen.getBoundingClientRect();
  const triggerRect = chatProgressStatus.getBoundingClientRect();
  const popoverWidth = Math.min(244, screenRect.width - 24);
  const centeredLeft = triggerRect.left - screenRect.left + triggerRect.width / 2 - popoverWidth / 2;
  const left = Math.max(12, Math.min(centeredLeft, screenRect.width - popoverWidth - 12));
  streakPopover.style.width = `${popoverWidth}px`;
  streakPopover.style.left = `${left}px`;
  streakPopover.style.right = "auto";
  streakPopover.style.top = `${triggerRect.bottom - screenRect.top + 8}px`;
}

function renderMessages() {
  const chat = activeChat();
  if (!chat.messages.length) {
    messageArea.innerHTML = `
      <div class="chat-empty-state">
        <div class="ask-anything-graphic" aria-hidden="true">
          <img src="pratvim-icon-exact.svg" alt="" />
          <span class="ask-suggestion one">Why?</span>
          <span class="ask-suggestion two">How?</span>
          <span class="ask-suggestion three">What?</span>
        </div>
        <p>Type a question or add a picture. Piku will explain it in simple, protected language.</p>
      </div>
    `;
    return;
  }

  messageArea.innerHTML = chat.messages
    .map(
      (message) => `
        <article class="chat-message ${message.role}">
          <div class="avatar">${message.role === "kid" ? "" : message.role === "blocked" ? "!" : "P"}</div>
          <div class="bubble">
            <p>${message.text}</p>
            ${message.role === "loading" ? "" : `<time>${message.time}</time>`}
          </div>
        </article>
      `
    )
    .join("");
  messageArea.scrollTop = messageArea.scrollHeight;
}

function renderChat() {
  const chat = activeChat();
  if (chatHeroQuestion) chatHeroQuestion.textContent = chat.title || "What are you curious about?";
  document.querySelector(".chat-feature-summary")?.classList.toggle("is-hidden", chat.messages.length > 0);
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
  composer.classList.toggle("is-answering", Boolean(chat.isAnswering));
  chatInput.disabled = chat.paused || Boolean(chat.isAnswering);
  imageUploadBtn.disabled = chat.paused || Boolean(chat.isAnswering);
  if (micBtn) micBtn.disabled = chat.paused;
  renderHistory();
  renderMessages();
}

function createNewChat() {
  const id = `chat-${Date.now()}`;
  chats.unshift({
    id,
    title: "",
    preview: "Start a new discovery",
    tag: "General",
    date: todayLabel(),
    time: "Just now",
    status: "Active",
    paused: false,
    pinned: false,
    messages: []
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
  if (chat.paused || chat.isAnswering) return;
  if (!hasActiveSubscription()) {
    chat.messages.push({
      role: "blocked",
      text: "Your family subscription has expired. Ask a parent to renew it from Parent Home.",
      time: nowLabel()
    });
    renderChat();
    return;
  }
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

  chat.isAnswering = true;
  chat.messages.push({ role: "loading", text: "Piku is answering...", time });
  renderChat();
  window.setTimeout(() => {
    const loadingIndex = chat.messages.findIndex((message) => message.role === "loading");
    if (loadingIndex !== -1) {
      chat.messages.splice(loadingIndex, 1, { role: "ai", text: answerFor(text), time: nowLabel() });
    }
    chat.isAnswering = false;
    renderChat();
  }, 900);
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
  micBtn?.classList.add("is-recording");
  voiceModal.querySelector(".record-orb").classList.remove("is-hidden");
  voiceModal.querySelector(".wave").classList.remove("is-hidden");
  voiceTitle.textContent = "Voice recording";
  voiceText.textContent = "Recording is in progress. Speak your question clearly.";
  voiceResult.classList.add("is-hidden");
  voiceResult.textContent = "";
}

function closeVoiceModal() {
  voiceModal.classList.add("is-hidden");
  micBtn?.classList.remove("is-recording");
}

function showAvatarModal(eventOrScope) {
  activeAvatarScope = "kid";
  closeKidProfileMenu();
  const kid = kidProfiles[activeLoginKidIndex];
  pendingKidAvatarSrc = kidAvatar(kid, activeLoginKidIndex);
  if (avatarPreview) avatarPreview.src = pendingKidAvatarSrc;
  if (kidProfileNameInput) kidProfileNameInput.value = kid?.name || "";
  if (avatarModalTitle) avatarModalTitle.textContent = "Update kid profile";
  if (avatarModalText) avatarModalText.textContent = "Change the name or choose a new avatar for this learning profile.";
  avatarModal.classList.remove("is-hidden");
}

function closeAvatarModal() {
  avatarModal.classList.add("is-hidden");
}

function openParentProfileMenu(event) {
  event.stopPropagation();
  const willOpen = parentProfileMenu?.classList.contains("is-hidden");
  parentProfileMenu?.classList.toggle("is-hidden", !willOpen);
  parentProfileTriggers.forEach((button) => button.setAttribute("aria-expanded", String(willOpen)));
  staticProfileTriggers.forEach((button) => {
    if (button.dataset.avatarScope === "parent") button.setAttribute("aria-expanded", String(willOpen));
  });
}

function closeParentProfileMenu() {
  parentProfileMenu?.classList.add("is-hidden");
  parentProfileTriggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
  staticProfileTriggers.forEach((button) => {
    if (button.dataset.avatarScope === "parent") button.setAttribute("aria-expanded", "false");
  });
}

function openKidProfileMenu(event) {
  event.stopPropagation();
  const kid = kidProfiles[activeLoginKidIndex];
  if (kidMenuName) kidMenuName.textContent = kid?.name || "Kid profile";
  const willOpen = kidProfileMenu?.classList.contains("is-hidden");
  kidProfileMenu?.classList.toggle("is-hidden", !willOpen);
  document.querySelectorAll(".avatar-trigger:not(.parent-profile-trigger)").forEach((button) => {
    button.setAttribute("aria-expanded", String(willOpen));
  });
}

function closeKidProfileMenu() {
  kidProfileMenu?.classList.add("is-hidden");
  document.querySelectorAll(".avatar-trigger:not(.parent-profile-trigger)").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function openParentProfileModal() {
  closeParentProfileMenu();
  const source = parentAvatarImages[0]?.src;
  if (parentProfilePreview && source) parentProfilePreview.src = source;
  parentProfileSaved?.classList.add("is-hidden");
  parentProfileModal?.classList.remove("is-hidden");
}

function closeParentProfileModal() {
  parentProfileModal?.classList.add("is-hidden");
}

function applyAvatar(src) {
  const targets = activeAvatarScope === "parent" ? parentAvatarImages : avatarImages;
  targets.forEach((image) => {
    image.src = src;
  });
  if (avatarPreview) avatarPreview.src = src;
  if (activeAvatarScope === "kid" && kidProfiles[activeLoginKidIndex]) {
    kidProfiles[activeLoginKidIndex].avatar = src;
    renderKidLoginPicker();
  }
  syncStaticProfileTriggers();
}

function resetAvatar() {
  pendingKidAvatarSrc = activeLoginKidIndex % 2 ? "kid-maya-avatar.png" : "kid-ravin-avatar.png";
  if (avatarPreview) avatarPreview.src = pendingKidAvatarSrc;
  avatarInput.value = "";
}

function finishVoice() {
  voiceTitle.textContent = "Thank you";
  voiceText.textContent = "Your voice has been recorded.";
  voiceModal.querySelector(".record-orb").classList.add("is-hidden");
  voiceModal.querySelector(".wave").classList.add("is-hidden");
  voiceResult.classList.add("is-hidden");
  voiceResult.textContent = "";
  micBtn?.classList.remove("is-recording");
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

floatingBackButton?.addEventListener("click", showPreviousScreen);
legalScreenButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.menuScreen));
});

loginModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLoginMode(button.dataset.loginMode, !button.closest(".login-mode-tabs"), button.dataset.parentAction || "login");
  });
});

changeKidLoginBtn?.addEventListener("click", resetKidLoginSelection);
parentHomeChildSwitch?.addEventListener("click", () => setLoginMode("child", true));
loginContinueBtn?.addEventListener("click", () => {
  if (loginMode === "parent") {
    showScreen("parent-dashboard");
    return;
  }
  const kid = kidProfiles[activeLoginKidIndex];
  if (!kid || pinInput.value.trim() !== kid.pin) {
    pinInput.classList.add("has-error");
    loginSubtitle.textContent = "That PIN does not match. Please try again.";
    pinInput.focus();
    return;
  }
  pinInput.classList.remove("has-error");
  onboardingIndex = 0;
  renderOnboarding();
  showScreen("onboarding");
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
managePaymentsBtn?.addEventListener("click", () => showScreen("payment-plans"));
continueToPayment?.addEventListener("click", openPaymentModal);
dashboardRegisterKid?.addEventListener("click", () => openKidRegister());
openParentAlerts?.addEventListener("click", () => showScreen("parent-alerts"));
parentOverviewAlerts?.addEventListener("click", () => {
  const firstKidWithAlerts = kidProfiles.findIndex((kid) => (kid.alerts || 0) > 0);
  activeReportKidIndex = firstKidWithAlerts >= 0 ? firstKidWithAlerts : 0;
  showScreen("parent-alerts");
});
kidReportSelect?.addEventListener("change", () => {
  activeReportKidIndex = Number(kidReportSelect.value || 0);
  renderParentAnalytics();
});

paymentClose?.addEventListener("click", closePaymentModal);
paymentBack?.addEventListener("click", closePaymentModal);
paymentModal?.addEventListener("click", (event) => {
  if (event.target === paymentModal) closePaymentModal();
});
paymentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!paymentForm.reportValidity()) return;
  const plan = selectedSubscriptionPlan();
  const renewalBase = hasActiveSubscription() ? subscriptionExpiresAt : new Date();
  subscriptionExpiresAt = new Date(renewalBase.getTime() + plan.days * DAY_MS);
  activeSubscriptionPlanId = plan.id;
  const method = paymentForm.querySelector('input[name="paymentMethod"]:checked')?.value || "UPI";
  renderParentKids();
  renderPaymentModal();
  closePaymentModal();
  if (paymentConfirmationText) paymentConfirmationText.textContent = `Payment confirmed via ${method}. ${plan.checkoutName} is active until ${formatSubscriptionDate(subscriptionExpiresAt)} for up to four kid profiles.`;
  showScreen("payment-confirmation");
});

saveCartoonAvatar?.addEventListener("click", () => {
  const kid = kidProfiles[activeLoginKidIndex];
  if (kid) {
    kid.name = kidAvatarProfileName?.value || kid.name;
    kid.avatar = pendingKidAvatarSrc;
    applyAvatar(pendingKidAvatarSrc);
    renderKidLoginPicker();
    renderParentKids();
    renderParentAnalytics();
    if (kidMenuName) kidMenuName.textContent = kid.name;
  }
  showScreen(avatarReturnScreen);
});

cancelParentKidDelete?.addEventListener("click", () => {
  pendingDeleteKidIndex = null;
  parentKidDeleteModal?.classList.add("is-hidden");
});
confirmParentKidDelete?.addEventListener("click", () => {
  if (pendingDeleteKidIndex === null) return;
  kidProfiles.splice(pendingDeleteKidIndex, 1);
  activeLoginKidIndex = Math.max(0, Math.min(activeLoginKidIndex, kidProfiles.length - 1));
  activeReportKidIndex = Math.max(0, Math.min(activeReportKidIndex, kidProfiles.length - 1));
  pendingDeleteKidIndex = null;
  parentKidDeleteModal?.classList.add("is-hidden");
  renderKidProfiles();
  renderKidLoginPicker();
  renderParentKids();
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
chatHistoryButton?.addEventListener("click", openChatHistory);
chatHistoryBackdrop?.addEventListener("click", closeChatHistory);
chatHistoryClose?.addEventListener("click", closeChatHistory);
chatHistoryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chatHistoryFilter = button.dataset.historyFilter;
    renderHistory();
  });
});
historyNewChatButton?.addEventListener("click", createNewChat);
chatProgressStatus?.addEventListener("click", (event) => {
  event.stopPropagation();
  const willOpen = streakPopover?.classList.contains("is-hidden");
  if (willOpen) positionStreakPopover();
  streakPopover?.classList.toggle("is-hidden", !willOpen);
  chatProgressStatus.setAttribute("aria-expanded", String(willOpen));
});
window.addEventListener("resize", () => {
  if (!streakPopover?.classList.contains("is-hidden")) positionStreakPopover();
});
document.addEventListener("click", (event) => {
  if (!streakPopover?.contains(event.target)) closeStreakPopover();
});

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

micBtn?.addEventListener("click", showVoiceModal);
voiceClose.addEventListener("click", closeVoiceModal);
cancelVoiceBtn.addEventListener("click", closeVoiceModal);
finishVoiceBtn.addEventListener("click", finishVoice);

avatarTriggers.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (button.dataset.avatarScope === "parent") {
      openParentProfileMenu(event);
      return;
    }
    openKidProfileMenu(event);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".kid-card-menu")) {
    document.querySelectorAll(".kid-card-menu-popover").forEach((menu) => menu.classList.add("is-hidden"));
    document.querySelectorAll("[data-kid-menu]").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
  }
});
parentUploadAvatar?.addEventListener("click", () => {
  closeParentProfileMenu();
  showAvatarModal("parent");
});
parentEditProfile?.addEventListener("click", openParentProfileModal);
parentProfileClose?.addEventListener("click", closeParentProfileModal);
parentProfileCancel?.addEventListener("click", closeParentProfileModal);
parentProfilePhotoButton?.addEventListener("click", () => parentProfileImageInput?.click());
parentProfileImageInput?.addEventListener("change", () => {
  const file = parentProfileImageInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    activeAvatarScope = "parent";
    applyAvatar(reader.result);
    if (parentProfilePreview) parentProfilePreview.src = reader.result;
  });
  reader.readAsDataURL(file);
});
parentProfileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (parentMenuEmail) parentMenuEmail.textContent = parentProfileEmail.value.trim();
  parentProfileSaved?.classList.remove("is-hidden");
  window.setTimeout(closeParentProfileModal, 650);
});
supportForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  supportSuccess?.classList.remove("is-hidden");
  supportForm.querySelector("button[type='submit']")?.setAttribute("disabled", "true");
});
parentLogout?.addEventListener("click", () => {
  closeParentProfileMenu();
  setLoginMode("parent", true);
});
document.addEventListener("click", (event) => {
  if (!parentProfileMenu?.contains(event.target)) closeParentProfileMenu();
  if (!kidProfileMenu?.contains(event.target) && !event.target.closest(".avatar-trigger:not(.parent-profile-trigger)")) {
    closeKidProfileMenu();
  }
});
kidEditProfile?.addEventListener("click", () => {
  closeKidProfileMenu();
  openAvatarLibrary("home", kidAvatar(kidProfiles[activeLoginKidIndex], activeLoginKidIndex));
});
kidLogout?.addEventListener("click", () => {
  closeKidProfileMenu();
  setLoginMode("child", true);
});
avatarClose.addEventListener("click", closeAvatarModal);
chooseAvatarBtn.addEventListener("click", () => avatarInput.click());
resetAvatarBtn.addEventListener("click", resetAvatar);
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    pendingKidAvatarSrc = reader.result;
    if (avatarPreview) avatarPreview.src = pendingKidAvatarSrc;
  });
  reader.readAsDataURL(file);
});
kidProfileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const kid = kidProfiles[activeLoginKidIndex];
  if (!kid) return;
  kid.name = kidProfileNameInput.value.trim() || kid.name;
  if (pendingKidAvatarSrc) applyAvatar(pendingKidAvatarSrc);
  renderKidLoginPicker();
  renderParentKids();
  renderParentAnalytics();
  if (kidMenuName) kidMenuName.textContent = kid.name;
  closeAvatarModal();
});

alertBackBtn.addEventListener("click", () => closeParentAlert(false));
alertClose.addEventListener("click", () => closeParentAlert(false));
alertReviewed.addEventListener("click", () => closeParentAlert(true));
alertCloseChatBtn.addEventListener("click", closeActiveChat);

setInterval(() => {
  elapsedSeconds += 1;
  updateTimer();
}, 1000);

setInterval(renderSubscriptionSummary, 60 * 1000);

renderOnboarding();
renderParentOnboarding();
setLoginMode("child");
renderKidProfiles();
renderParentKids();
renderParentAnalytics();
renderPaymentPlans();
renderPaymentModal();
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
