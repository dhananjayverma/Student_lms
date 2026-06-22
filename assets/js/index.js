const authSessionKey = "cuims-authenticated";
const isAuthenticated = localStorage.getItem(authSessionKey) === "true";
const dashboardThemeKey = "dashboard-theme";
const dashboardTextColorKey = "dashboard-text-color";
const dashboardAccentColorKey = "dashboard-accent-color";
const dashboardBgColorKey = "dashboard-bg-color";
const dashboardTextSizeKey = "dashboard-text-size";
const dashboardHighlightKey = "dashboard-highlight";
const dashboardHideTextKey = "dashboard-hide-text";
const dashboardDensityKey = "dashboard-density";
const dashboardPanelStyleKey = "dashboard-panel-style";
const dashboardGrayscaleKey = "dashboard-grayscale";
const dashboardMotionKey = "dashboard-motion";
const dashboardThemes = [
  "light",
  "dark",
  "glass",
  "neon",
  "focus",
  "aurora",
  "ocean",
  "forest",
  "sunset",
  "rose",
  "graphite",
  "mint",
  "lavender",
  "cyberpunk",
  "steel"
];

if (!isAuthenticated) {
  window.location.href = "login.html";
}

const hour = new Date().getHours();
const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";
const greetingNode = document.querySelector(".hero-copy > span");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar-menu");
const sidebarToggleButton = document.querySelector(".sidebar-toggle-button");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
const themeToggleButtons = document.querySelectorAll(".theme-toggle-button, .drawer-theme-toggle");
const themeChoiceButtons = document.querySelectorAll("[data-theme-value]");
const quickPanel = document.querySelector("[data-quick-panel]");
const quickToggle = document.querySelector("[data-quick-toggle]");
const quickMenu = document.querySelector("[data-quick-menu]");
const shell = document.querySelector(".shell");
const mobileSidebarQuery = window.matchMedia("(max-width: 980px)");
const desktopDashboardQuery = window.matchMedia("(min-width: 1181px)");

document.querySelectorAll("[data-logout]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem(authSessionKey);
    localStorage.removeItem("cuims-user");
    window.location.href = "login.html";
  });
});

if (greetingNode) {
  greetingNode.textContent = greeting;
}

const setTheme = (theme) => {
  const selectedTheme = dashboardThemes.includes(theme) ? theme : "light";
  const isDark = selectedTheme === "dark" || selectedTheme === "neon" || selectedTheme === "graphite" || selectedTheme === "cyberpunk";

  document.body.classList.toggle("dark-theme", isDark);
  dashboardThemes
    .filter((themeName) => themeName !== "light" && themeName !== "dark")
    .forEach((themeName) => {
      document.body.classList.toggle(`theme-${themeName}`, selectedTheme === themeName);
    });
  themeToggleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
  themeChoiceButtons.forEach((button) => {
    const isActive = button.dataset.themeValue === selectedTheme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const isValidHexColor = (color) => /^#[0-9a-f]{6}$/i.test(color || "");

const applyDashboardColors = () => {
  const textColor = localStorage.getItem(dashboardTextColorKey);
  const accentColor = localStorage.getItem(dashboardAccentColorKey);
  const bgColor = localStorage.getItem(dashboardBgColorKey);

  if (isValidHexColor(textColor)) {
    document.body.style.setProperty("--ink", textColor);
  } else {
    document.body.style.removeProperty("--ink");
  }

  if (isValidHexColor(accentColor)) {
    document.body.style.setProperty("--blue", accentColor);
  } else {
    document.body.style.removeProperty("--blue");
  }

  if (isValidHexColor(bgColor)) {
    document.body.style.setProperty("--dashboard-custom-bg", bgColor);
    document.body.classList.add("quick-custom-bg");
  } else {
    document.body.style.removeProperty("--dashboard-custom-bg");
    document.body.classList.remove("quick-custom-bg");
  }
};

const applyQuickDisplaySettings = () => {
  const textSize = localStorage.getItem(dashboardTextSizeKey);
  const density = localStorage.getItem(dashboardDensityKey);
  const panelStyle = localStorage.getItem(dashboardPanelStyleKey);
  const isHighlighted = localStorage.getItem(dashboardHighlightKey) === "true";
  const isTextHidden = localStorage.getItem(dashboardHideTextKey) === "true";
  const isGrayscale = localStorage.getItem(dashboardGrayscaleKey) === "true";
  const isCalm = localStorage.getItem(dashboardMotionKey) === "true";

  if (textSize === "small") {
    document.documentElement.style.fontSize = "14.5px";
  } else if (textSize === "large") {
    document.documentElement.style.fontSize = "17px";
  } else {
    document.documentElement.style.removeProperty("font-size");
  }

  document.body.classList.toggle("quick-text-small", textSize === "small");
  document.body.classList.toggle("quick-text-large", textSize === "large");
  document.body.classList.toggle("quick-density-compact", density === "compact");
  document.body.classList.toggle("quick-density-relaxed", density === "relaxed");
  document.body.classList.toggle("quick-panel-soft", panelStyle === "soft");
  document.body.classList.toggle("quick-panel-sharp", panelStyle === "sharp");
  document.body.classList.toggle("quick-highlight", isHighlighted);
  document.body.classList.toggle("quick-hide-text", isTextHidden);
  document.body.classList.toggle("quick-grayscale", isGrayscale);
  document.body.classList.toggle("quick-calm-motion", isCalm);
};

const syncAccountSettingsControls = (root = document) => {
  const savedTheme = localStorage.getItem(dashboardThemeKey);
  const currentTheme = dashboardThemes.includes(savedTheme)
    ? savedTheme
    : (document.body.classList.contains("dark-theme") ? "dark" : "light");
  const themeSelect = root.querySelector("[data-settings-theme-select]");
  const textInput = root.querySelector("[data-settings-text-color]");
  const accentInput = root.querySelector("[data-settings-accent-color]");
  const savedTextColor = localStorage.getItem(dashboardTextColorKey);
  const savedAccentColor = localStorage.getItem(dashboardAccentColorKey);

  if (themeSelect) {
    themeSelect.value = currentTheme;
  }

  root.querySelectorAll("[data-settings-theme]").forEach((button) => {
    const isActive = button.dataset.settingsTheme === currentTheme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (textInput) {
    textInput.value = isValidHexColor(savedTextColor)
      ? savedTextColor
      : (currentTheme === "dark" || currentTheme === "neon" || currentTheme === "graphite" ? "#edf4ff" : "#07154f");
  }

  if (accentInput) {
    accentInput.value = isValidHexColor(savedAccentColor) ? savedAccentColor : "#1e62ff";
  }
};

const syncQuickControls = () => {
  if (!quickPanel) return;
  const savedTheme = localStorage.getItem(dashboardThemeKey);
  const currentTheme = dashboardThemes.includes(savedTheme)
    ? savedTheme
    : (document.body.classList.contains("dark-theme") ? "dark" : "light");
  const savedTextColor = localStorage.getItem(dashboardTextColorKey);
  const savedAccentColor = localStorage.getItem(dashboardAccentColorKey);
  const savedBgColor = localStorage.getItem(dashboardBgColorKey);
  const textSize = localStorage.getItem(dashboardTextSizeKey) || "normal";
  const density = localStorage.getItem(dashboardDensityKey) || "normal";
  const panelStyle = localStorage.getItem(dashboardPanelStyleKey) || "normal";
  const isHighlighted = localStorage.getItem(dashboardHighlightKey) === "true";
  const isTextHidden = localStorage.getItem(dashboardHideTextKey) === "true";
  const isGrayscale = localStorage.getItem(dashboardGrayscaleKey) === "true";
  const isCalm = localStorage.getItem(dashboardMotionKey) === "true";

  quickPanel.querySelectorAll("[data-quick-theme]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickTheme === currentTheme);
  });

  quickPanel.querySelectorAll("[data-quick-text-color]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickTextColor === savedTextColor);
  });

  quickPanel.querySelectorAll("[data-quick-bg-color]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickBgColor === savedBgColor);
  });

  quickPanel.querySelectorAll("[data-quick-accent-color]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickAccentColor === savedAccentColor);
  });

  quickPanel.querySelectorAll("[data-quick-text-size]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickTextSize === textSize);
  });

  quickPanel.querySelectorAll("[data-quick-density]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickDensity === density);
  });

  quickPanel.querySelectorAll("[data-quick-panel-style]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quickPanelStyle === panelStyle);
  });

  const textPicker = quickPanel.querySelector("[data-quick-text-picker]");
  const bgPicker = quickPanel.querySelector("[data-quick-bg-picker]");
  const accentPicker = quickPanel.querySelector("[data-quick-accent-picker]");
  const highlightButton = quickPanel.querySelector("[data-quick-highlight]");
  const hideTextButton = quickPanel.querySelector("[data-quick-hide-text]");
  const grayscaleButton = quickPanel.querySelector("[data-quick-grayscale]");
  const motionButton = quickPanel.querySelector("[data-quick-motion]");

  if (textPicker) {
    textPicker.value = isValidHexColor(savedTextColor) ? savedTextColor : "#07154f";
  }

  if (bgPicker) {
    bgPicker.value = isValidHexColor(savedBgColor) ? savedBgColor : "#f8fbff";
  }

  if (accentPicker) {
    accentPicker.value = isValidHexColor(savedAccentColor) ? savedAccentColor : "#1e62ff";
  }

  highlightButton?.classList.toggle("active", isHighlighted);
  hideTextButton?.classList.toggle("active", isTextHidden);
  grayscaleButton?.classList.toggle("active", isGrayscale);
  motionButton?.classList.toggle("active", isCalm);
};

const savedTheme = localStorage.getItem(dashboardThemeKey);
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(dashboardThemes.includes(savedTheme) ? savedTheme : (prefersDarkTheme ? "dark" : "light"));
applyDashboardColors();
applyQuickDisplaySettings();
syncQuickControls();

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem(dashboardThemeKey, nextTheme);
    setTheme(nextTheme);
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  });
});

themeChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = dashboardThemes.includes(button.dataset.themeValue) ? button.dataset.themeValue : "light";
    localStorage.setItem(dashboardThemeKey, nextTheme);
    setTheme(nextTheme);
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  });
});

quickToggle?.addEventListener("click", () => {
  const isOpen = !quickPanel?.classList.contains("is-open");
  quickPanel?.classList.toggle("is-open", isOpen);
  quickToggle.setAttribute("aria-expanded", String(isOpen));
  quickToggle.setAttribute("aria-label", isOpen ? "Close quick display controls" : "Open quick display controls");
});

// Close button inside the panel header
quickMenu?.addEventListener("click", (event) => {
  if (event.target.closest("[data-quick-close]")) {
    quickPanel?.classList.remove("is-open");
    quickToggle?.setAttribute("aria-expanded", "false");
    quickToggle?.setAttribute("aria-label", "Open quick display controls");
  }
}, { capture: true });

document.addEventListener("click", (event) => {
  if (!quickPanel?.classList.contains("is-open")) return;
  if (event.target.closest("[data-quick-panel]")) return;
  quickPanel.classList.remove("is-open");
  quickToggle?.setAttribute("aria-expanded", "false");
  quickToggle?.setAttribute("aria-label", "Open quick display controls");
});

quickMenu?.addEventListener("click", (event) => {
  const themeButton = event.target.closest("[data-quick-theme]");
  if (themeButton) {
    const nextTheme = dashboardThemes.includes(themeButton.dataset.quickTheme) ? themeButton.dataset.quickTheme : "light";
    localStorage.setItem(dashboardThemeKey, nextTheme);
    setTheme(nextTheme);
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  }

  const textButton = event.target.closest("[data-quick-text-color]");
  if (textButton) {
    const color = textButton.dataset.quickTextColor;
    if (isValidHexColor(color)) {
      localStorage.setItem(dashboardTextColorKey, color);
      applyDashboardColors();
      syncAccountSettingsControls(modalBody || document);
      syncQuickControls();
    }
  }

  const bgButton = event.target.closest("[data-quick-bg-color]");
  if (bgButton) {
    const color = bgButton.dataset.quickBgColor;
    if (isValidHexColor(color)) {
      localStorage.setItem(dashboardBgColorKey, color);
      applyDashboardColors();
      syncQuickControls();
    }
  }

  const accentButton = event.target.closest("[data-quick-accent-color]");
  if (accentButton) {
    const color = accentButton.dataset.quickAccentColor;
    if (isValidHexColor(color)) {
      localStorage.setItem(dashboardAccentColorKey, color);
      applyDashboardColors();
      syncAccountSettingsControls(modalBody || document);
      syncQuickControls();
    }
  }

  const textSizeButton = event.target.closest("[data-quick-text-size]");
  if (textSizeButton) {
    const nextSize = ["small", "normal", "large"].includes(textSizeButton.dataset.quickTextSize)
      ? textSizeButton.dataset.quickTextSize
      : "normal";
    if (nextSize === "normal") {
      localStorage.removeItem(dashboardTextSizeKey);
    } else {
      localStorage.setItem(dashboardTextSizeKey, nextSize);
    }
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  const densityButton = event.target.closest("[data-quick-density]");
  if (densityButton) {
    const nextDensity = ["compact", "normal", "relaxed"].includes(densityButton.dataset.quickDensity)
      ? densityButton.dataset.quickDensity
      : "normal";
    if (nextDensity === "normal") {
      localStorage.removeItem(dashboardDensityKey);
    } else {
      localStorage.setItem(dashboardDensityKey, nextDensity);
    }
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  const panelStyleButton = event.target.closest("[data-quick-panel-style]");
  if (panelStyleButton) {
    const nextStyle = ["normal", "soft", "sharp"].includes(panelStyleButton.dataset.quickPanelStyle)
      ? panelStyleButton.dataset.quickPanelStyle
      : "normal";
    if (nextStyle === "normal") {
      localStorage.removeItem(dashboardPanelStyleKey);
    } else {
      localStorage.setItem(dashboardPanelStyleKey, nextStyle);
    }
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  if (event.target.closest("[data-quick-highlight]")) {
    const nextValue = localStorage.getItem(dashboardHighlightKey) !== "true";
    localStorage.setItem(dashboardHighlightKey, String(nextValue));
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  if (event.target.closest("[data-quick-hide-text]")) {
    const nextValue = localStorage.getItem(dashboardHideTextKey) !== "true";
    localStorage.setItem(dashboardHideTextKey, String(nextValue));
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  if (event.target.closest("[data-quick-grayscale]")) {
    const nextValue = localStorage.getItem(dashboardGrayscaleKey) !== "true";
    localStorage.setItem(dashboardGrayscaleKey, String(nextValue));
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  if (event.target.closest("[data-quick-motion]")) {
    const nextValue = localStorage.getItem(dashboardMotionKey) !== "true";
    localStorage.setItem(dashboardMotionKey, String(nextValue));
    applyQuickDisplaySettings();
    syncQuickControls();
  }

  if (event.target.closest("[data-quick-reset]")) {
    localStorage.removeItem(dashboardThemeKey);
    localStorage.removeItem(dashboardTextColorKey);
    localStorage.removeItem(dashboardAccentColorKey);
    localStorage.removeItem(dashboardBgColorKey);
    localStorage.removeItem(dashboardTextSizeKey);
    localStorage.removeItem(dashboardHighlightKey);
    localStorage.removeItem(dashboardHideTextKey);
    localStorage.removeItem(dashboardDensityKey);
    localStorage.removeItem(dashboardPanelStyleKey);
    localStorage.removeItem(dashboardGrayscaleKey);
    localStorage.removeItem(dashboardMotionKey);
    setTheme(prefersDarkTheme ? "dark" : "light");
    applyDashboardColors();
    applyQuickDisplaySettings();
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  }
});

quickMenu?.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-quick-text-picker]") && isValidHexColor(target.value)) {
    localStorage.setItem(dashboardTextColorKey, target.value);
    applyDashboardColors();
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  }

  if (target.matches("[data-quick-bg-picker]") && isValidHexColor(target.value)) {
    localStorage.setItem(dashboardBgColorKey, target.value);
    applyDashboardColors();
    syncQuickControls();
  }

  if (target.matches("[data-quick-accent-picker]") && isValidHexColor(target.value)) {
    localStorage.setItem(dashboardAccentColorKey, target.value);
    applyDashboardColors();
    syncAccountSettingsControls(modalBody || document);
    syncQuickControls();
  }
});

const currentDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
}).format(new Date());

document.querySelectorAll(".nav-date").forEach((node) => {
  node.textContent = currentDate;
});

const setSidebarToggleState = () => {
  const isMobile = mobileSidebarQuery.matches;
  const isDrawerOpen = document.body.classList.contains("nav-drawer-open");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");

  if (isMobile) {
    sidebarToggleButton?.setAttribute("aria-pressed", String(isDrawerOpen));
    sidebarToggleButton?.setAttribute("aria-label", isDrawerOpen ? "Close navigation drawer" : "Open navigation drawer");
    sidebar?.setAttribute("aria-hidden", String(!isDrawerOpen));
    return;
  }

  document.body.classList.remove("nav-drawer-open");
  sidebarToggleButton?.setAttribute("aria-pressed", String(isCollapsed));
  sidebarToggleButton?.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Shrink sidebar");
  sidebar?.removeAttribute("aria-hidden");
};

const closeSidebarDrawer = () => {
  document.body.classList.remove("nav-drawer-open");
  setSidebarToggleState();
};

if (sidebar && sidebarMenu) {
  sidebar.addEventListener("wheel", (event) => {
    const privateScroller = event.target.closest(".menu-submenu-inner");
    const canScrollSubmenu = privateScroller && privateScroller.scrollHeight > privateScroller.clientHeight;

    if (canScrollSubmenu) {
      event.preventDefault();
      event.stopPropagation();
      privateScroller.scrollTop += event.deltaY;
      return;
    }

    if (sidebarMenu.scrollHeight <= sidebarMenu.clientHeight) return;

    event.preventDefault();
    event.stopPropagation();
    sidebarMenu.scrollTop += event.deltaY;
  }, { passive: false });

  const sidebarLinks = sidebarMenu.querySelectorAll("a:not(.menu-toggle)");
  sidebarLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      // Prevent jumping to top if href is "#"
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
      }

      // Remove active class from all links
      sidebarLinks.forEach(l => l.classList.remove("active"));

      // Add active class to the clicked link
      link.classList.add("active");

      if (mobileSidebarQuery.matches) {
        closeSidebarDrawer();
      }
    });
  });

  const menuToggles = sidebarMenu.querySelectorAll(".menu-toggle");
  menuToggles.forEach(toggle => {
    const parentGroup = toggle.closest(".menu-group");
    toggle.setAttribute("aria-expanded", String(parentGroup?.classList.contains("expanded")));

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parentGroup = toggle.closest(".menu-group");
      const isExpanded = parentGroup.classList.toggle("expanded");
      toggle.setAttribute("aria-expanded", String(isExpanded));
    });
  });
}

if (sidebarToggleButton) {
  sidebarToggleButton.addEventListener("click", () => {
    if (mobileSidebarQuery.matches) {
      const isOpen = document.body.classList.toggle("nav-drawer-open");
      sidebarToggleButton.setAttribute("aria-pressed", String(isOpen));
      sidebarToggleButton.setAttribute("aria-label", isOpen ? "Close navigation drawer" : "Open navigation drawer");
      sidebar?.setAttribute("aria-hidden", String(!isOpen));
      return;
    }

    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    sidebarToggleButton.setAttribute("aria-pressed", String(isCollapsed));
    sidebarToggleButton.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Shrink sidebar");
  });
}

document.querySelectorAll("[data-sidebar-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeSidebarDrawer);
});
mobileSidebarQuery.addEventListener("change", setSidebarToggleState);
setSidebarToggleState();

const updateNavbarSurface = () => {
  const scrollTop = mobileSidebarQuery.matches
    ? window.scrollY
    : shell?.scrollTop || 0;

  document.body.classList.toggle("navbar-scrolled", scrollTop > 12);
};

shell?.addEventListener("scroll", updateNavbarSurface, { passive: true });
window.addEventListener("scroll", updateNavbarSurface, { passive: true });
mobileSidebarQuery.addEventListener("change", updateNavbarSurface);
updateNavbarSurface();

const profileMenuWrappers = document.querySelectorAll(".profile-trigger-wrapper");

const closeProfileMenus = (except = null) => {
  profileMenuWrappers.forEach((wrapper) => {
    if (wrapper === except) return;
    const trigger = wrapper.querySelector(".profile-menu-trigger");
    const menu = wrapper.querySelector(".profile-menu");
    if (!trigger || !menu) return;
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  });
};

profileMenuWrappers.forEach((wrapper) => {
  const trigger = wrapper.querySelector(".profile-menu-trigger");
  const menu = wrapper.querySelector(".profile-menu");
  if (!trigger || !menu) return;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = menu.hidden;
    closeProfileMenus(wrapper);
    menu.hidden = !shouldOpen;
    trigger.setAttribute("aria-expanded", String(shouldOpen));
  });

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link?.getAttribute("href") === "#") {
      event.preventDefault();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-trigger-wrapper")) {
    closeProfileMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProfileMenus();
  }
});

const dashboardGrid = document.querySelector(".dashboard-grid");
const dashboardMain = document.querySelector(".dashboard-main");
const supportStack = document.querySelector(".support-stack");
const announcementsLayout = document.querySelector(".announcements-layout");
const layoutAnnouncementsMain = announcementsLayout?.querySelector(".announcements-main");
const layoutAnnouncementsPanel = announcementsLayout?.querySelector(".announcements-panel");
const layoutAnnouncementWidgets = announcementsLayout?.querySelector(".announcement-widgets-left");
const layoutAnnouncementsSidebar = announcementsLayout?.querySelector(".announcements-sidebar");

const updateDashboardColumns = () => {
  if (!dashboardGrid || !dashboardMain || !supportStack || !announcementsLayout ||
    !layoutAnnouncementsMain || !layoutAnnouncementsPanel || !layoutAnnouncementsSidebar) return;

  if (desktopDashboardQuery.matches) {
    dashboardMain.append(layoutAnnouncementsPanel);
    if (layoutAnnouncementWidgets) {
      dashboardMain.append(layoutAnnouncementWidgets);
    }
    supportStack.append(layoutAnnouncementsSidebar);
    announcementsLayout.hidden = true;
    return;
  }

  layoutAnnouncementsMain.append(layoutAnnouncementsPanel);
  if (layoutAnnouncementWidgets) {
    layoutAnnouncementsMain.append(layoutAnnouncementWidgets);
  }
  announcementsLayout.append(layoutAnnouncementsMain, layoutAnnouncementsSidebar);
  announcementsLayout.hidden = false;
  dashboardGrid.append(announcementsLayout);
};

desktopDashboardQuery.addEventListener("change", updateDashboardColumns);
updateDashboardColumns();

const privateDataCards = document.querySelectorAll(".fee-card, .backlog-card");

privateDataCards.forEach((card) => {
  card.addEventListener("pointerdown", (event) => {
    privateDataCards.forEach((item) => {
      if (item !== card) {
        item.classList.remove("data-visible");
      }
    });

    card.classList.toggle("data-visible");
    event.stopPropagation();
  });
});

document.addEventListener("pointerdown", () => {
  privateDataCards.forEach((card) => {
    card.classList.remove("data-visible");
  });
});

const academicTabs = document.querySelectorAll(".academic-tab");
const academicPanels = document.querySelectorAll(".academic-content");

academicTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelId = tab.dataset.panel;

    academicTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    academicPanels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

const modal = document.querySelector("#dashboard-modal");
const modalTitle = modal?.querySelector("#modal-title");
const modalBody = modal?.querySelector(".modal-body");
const modalOptions = document.querySelectorAll(".modal-option");
const conversationViewAll = document.querySelector(".conversation-view-all");
let lastModalTrigger = null;

const formatCurrency = (amount) => `₹ ${new Intl.NumberFormat("en-IN").format(amount)}`;

const updateFeeFilters = (root) => {
  const filterPanel = root?.querySelector("[data-fee-filters]");
  if (!filterPanel) return;

  const filters = {
    semester: filterPanel.querySelector('[data-fee-filter="semester"]')?.value || "all",
    year: filterPanel.querySelector('[data-fee-filter="year"]')?.value || "all",
    category: filterPanel.querySelector('[data-fee-filter="category"]')?.value || "all"
  };
  const items = [...root.querySelectorAll("[data-fee-item]")];
  const countNode = root.querySelector("[data-fee-filter-count]");
  const summaryTotal = root.querySelector("[data-fee-summary-total]");
  const totalNode = root.querySelector("[data-fee-total]");
  const emptyState = root.querySelector("[data-fee-empty]");
  const resetButton = root.querySelector("[data-fee-filter-reset]");
  let visibleCount = 0;
  let total = 0;

  items.forEach((item) => {
    const isMatch =
      (filters.semester === "all" || item.dataset.semester === filters.semester) &&
      (filters.year === "all" || item.dataset.year === filters.year) &&
      (filters.category === "all" || item.dataset.category === filters.category);

    item.classList.toggle("is-hidden", !isMatch);
    if (isMatch) {
      visibleCount += 1;
      total += Number(item.dataset.amount || 0);
    }
  });

  if (countNode) {
    countNode.textContent = `${visibleCount} shown`;
  }

  if (summaryTotal) {
    summaryTotal.textContent = formatCurrency(total);
  }

  if (totalNode) {
    totalNode.textContent = formatCurrency(total);
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  if (resetButton) {
    resetButton.disabled = Object.values(filters).every((value) => value === "all");
  }
};

const updateBacklogFilters = (root) => {
  const filterPanel = root?.querySelector("[data-backlog-filters]");
  if (!filterPanel) return;

  const filters = {
    semester: filterPanel.querySelector('[data-backlog-filter="semester"]')?.value || "all",
    year: filterPanel.querySelector('[data-backlog-filter="year"]')?.value || "all",
    type: filterPanel.querySelector('[data-backlog-filter="type"]')?.value || "all"
  };
  const items = [...root.querySelectorAll("[data-backlog-item]")];
  const countNode = root.querySelector("[data-backlog-filter-count]");
  const summaryCount = root.querySelector("[data-backlog-summary-count]");
  const emptyState = root.querySelector("[data-backlog-empty]");
  const resetButton = root.querySelector("[data-backlog-filter-reset]");
  let visibleCount = 0;

  items.forEach((item) => {
    const isMatch =
      (filters.semester === "all" || item.dataset.semester === filters.semester) &&
      (filters.year === "all" || item.dataset.year === filters.year) &&
      (filters.type === "all" || item.dataset.type === filters.type);

    item.classList.toggle("is-hidden", !isMatch);
    if (isMatch) visibleCount += 1;
  });

  const subjectLabel = visibleCount === 1 ? "Subject" : "Subjects";
  if (countNode) {
    countNode.textContent = `${visibleCount} shown`;
  }

  if (summaryCount) {
    summaryCount.textContent = `${String(visibleCount).padStart(2, "0")} ${subjectLabel}`;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  if (resetButton) {
    resetButton.disabled = Object.values(filters).every((value) => value === "all");
  }
};

const closeDashboardModal = () => {
  if (!modal || !modalBody) return;

  modal.hidden = true;
  modalBody.replaceChildren();
  document.body.classList.remove("modal-open");
  lastModalTrigger?.focus();
};

const openDashboardModalFromSource = (trigger, source, title) => {
  if (!modal || !modalTitle || !modalBody || !source) return;

  lastModalTrigger = trigger;
  modalTitle.textContent = title || trigger.textContent.trim();
  modalBody.replaceChildren(
    ...Array.from(source.children)
      .filter((child) => !child.classList.contains("panel-head"))
      .map((child) => child.cloneNode(true))
  );
  modal.hidden = false;
  document.body.classList.add("modal-open");
  syncAccountSettingsControls(modalBody);
  updateFeeFilters(modalBody);
  updateBacklogFilters(modalBody);
  modal.querySelector(".modal-close")?.focus();
};

modalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const source = option.parentElement?.querySelector(".modal-source");

    openDashboardModalFromSource(option, source, option.dataset.modalTitle || option.textContent.trim());
  });
});

conversationViewAll?.addEventListener("click", (event) => {
  event.preventDefault();
  const source = document.querySelector(".conversation-modal-source");
  openDashboardModalFromSource(
    conversationViewAll,
    source,
    conversationViewAll.dataset.modalTitle || "Conversation Details"
  );
});

document.querySelectorAll(".widget-view-all-link, .nav-notification-trigger, .account-settings-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const sourceId = trigger.dataset.sourceId;
    const source = document.getElementById(sourceId);
    if (document.body.classList.contains("nav-drawer-open")) {
      closeSidebarDrawer();
    }
    closeProfileMenus();
    openDashboardModalFromSource(trigger, source, trigger.dataset.modalTitle || trigger.textContent.trim());
  });
});

const applySelectedSettingsTheme = (shouldClose = false) => {
  if (!modalBody) return;
  const themeSelect = modalBody.querySelector("[data-settings-theme-select]");
  const nextTheme = dashboardThemes.includes(themeSelect?.value) ? themeSelect.value : "light";
  localStorage.setItem(dashboardThemeKey, nextTheme);
  setTheme(nextTheme);
  syncAccountSettingsControls(modalBody);
  syncQuickControls();

  if (shouldClose) {
    closeDashboardModal();
  }
};

modalBody?.addEventListener("click", (event) => {
  if (event.target.closest(".send-message")) {
    event.preventDefault();
  }

  if (event.target.closest("[data-settings-apply-theme]")) {
    event.preventDefault();
    applySelectedSettingsTheme(true);
  }

  const themeButton = event.target.closest("[data-settings-theme]");
  if (themeButton) {
    const nextTheme = dashboardThemes.includes(themeButton.dataset.settingsTheme)
      ? themeButton.dataset.settingsTheme
      : "light";
    localStorage.setItem(dashboardThemeKey, nextTheme);
    setTheme(nextTheme);
    syncAccountSettingsControls(modalBody);
  }

  const textPreset = event.target.closest("[data-settings-text-preset]");
  if (textPreset) {
    const color = textPreset.dataset.settingsTextPreset;
    if (isValidHexColor(color)) {
      localStorage.setItem(dashboardTextColorKey, color);
      applyDashboardColors();
      syncAccountSettingsControls(modalBody);
      syncQuickControls();
    }
  }

  const accentPreset = event.target.closest("[data-settings-accent-preset]");
  if (accentPreset) {
    const color = accentPreset.dataset.settingsAccentPreset;
    if (isValidHexColor(color)) {
      localStorage.setItem(dashboardAccentColorKey, color);
      applyDashboardColors();
      syncAccountSettingsControls(modalBody);
      syncQuickControls();
    }
  }

  if (event.target.closest("[data-settings-reset]")) {
    localStorage.removeItem(dashboardThemeKey);
    localStorage.removeItem(dashboardTextColorKey);
    localStorage.removeItem(dashboardAccentColorKey);
    localStorage.removeItem(dashboardBgColorKey);
    localStorage.removeItem(dashboardTextSizeKey);
    localStorage.removeItem(dashboardHighlightKey);
    localStorage.removeItem(dashboardHideTextKey);
    setTheme(prefersDarkTheme ? "dark" : "light");
    applyDashboardColors();
    applyQuickDisplaySettings();
    syncAccountSettingsControls(modalBody);
    syncQuickControls();
  }

  if (event.target.closest("[data-backlog-filter-reset]")) {
    modalBody.querySelectorAll("[data-backlog-filter]").forEach((select) => {
      select.value = "all";
    });
    updateBacklogFilters(modalBody);
  }

  if (event.target.closest("[data-fee-filter-reset]")) {
    modalBody.querySelectorAll("[data-fee-filter]").forEach((select) => {
      select.value = "all";
    });
    updateFeeFilters(modalBody);
  }
});

modalBody?.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-settings-theme-select]")) {
    const nextTheme = dashboardThemes.includes(target.value) ? target.value : "light";
    localStorage.setItem(dashboardThemeKey, nextTheme);
    setTheme(nextTheme);
    syncAccountSettingsControls(modalBody);
    syncQuickControls();
  }

  if (target.matches("[data-backlog-filter]")) {
    updateBacklogFilters(modalBody);
  }

  if (target.matches("[data-fee-filter]")) {
    updateFeeFilters(modalBody);
  }
});

modalBody?.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-account-settings-form]")) return;
  event.preventDefault();
  applySelectedSettingsTheme(true);
});

modalBody?.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches("[data-settings-text-color]") && isValidHexColor(target.value)) {
    localStorage.setItem(dashboardTextColorKey, target.value);
    applyDashboardColors();
    syncQuickControls();
  }

  if (target.matches("[data-settings-accent-color]") && isValidHexColor(target.value)) {
    localStorage.setItem(dashboardAccentColorKey, target.value);
    applyDashboardColors();
    syncQuickControls();
  }
});

modal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closeDashboardModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("nav-drawer-open")) {
    closeSidebarDrawer();
  }

  if (event.key === "Escape" && modal && !modal.hidden) {
    closeDashboardModal();
  }
});

const laterHeadingToggle = document.querySelector(".later-heading");
const laterLectures = document.querySelector(".lecture-cards");
const classFilterButtons = document.querySelectorAll(".class-filter");
const scheduleItems = document.querySelectorAll(".schedule-item");
const messageFilterButtons = document.querySelectorAll("[data-message-filter]");
const messageItems = document.querySelectorAll(".important-message-item");
const messageEmptyState = document.querySelector(".message-empty-state");

const classFilterSelect = document.querySelector(".class-filter-select");

classFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    classFilterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    if (classFilterSelect) {
      classFilterSelect.value = filter;
    }

    scheduleItems.forEach((item) => {
      const isMatch =
        filter === "all" ||
        item.dataset.status === filter ||
        item.dataset.period === filter;

      item.classList.toggle("is-hidden", !isMatch);
    });
  });
});

if (classFilterSelect) {
  classFilterSelect.addEventListener("change", (e) => {
    const filter = e.target.value;

    classFilterButtons.forEach((item) => {
      item.classList.toggle("active", item.dataset.filter === filter);
    });

    scheduleItems.forEach((item) => {
      const isMatch =
        filter === "all" ||
        item.dataset.status === filter ||
        item.dataset.period === filter;

      item.classList.toggle("is-hidden", !isMatch);
    });
  });
}

messageFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.messageFilter || "all";
    let visibleCount = 0;

    messageFilterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    messageItems.forEach((item) => {
      const isMatch =
        filter === "all" ||
        item.dataset.messageType === filter ||
        item.dataset.messageStatus === filter;

      item.classList.toggle("is-hidden", !isMatch);
      if (isMatch) visibleCount += 1;
    });

    if (messageEmptyState) {
      messageEmptyState.hidden = visibleCount > 0;
    }
  });
});

if (laterHeadingToggle && laterLectures) {
  if (window.innerWidth <= 980) {
    laterLectures.classList.add("collapsed");
    laterHeadingToggle.classList.add("collapsed");
    laterHeadingToggle.setAttribute("aria-expanded", "false");
  }

  laterHeadingToggle.addEventListener("click", () => {
    if (window.innerWidth > 980) return;
    const isExpanded = laterHeadingToggle.getAttribute("aria-expanded") === "true";
    laterHeadingToggle.setAttribute("aria-expanded", !isExpanded);
    laterLectures.classList.toggle("collapsed");
    laterHeadingToggle.classList.toggle("collapsed");
  });
}

const announcementHeadingToggle = document.querySelector(".announcement-head");
const announcementsPanel = document.querySelector(".announcements-panel");

if (announcementHeadingToggle && announcementsPanel) {
  if (window.innerWidth <= 980) {
    announcementsPanel.classList.add("collapsed");
    announcementHeadingToggle.setAttribute("aria-expanded", "false");
  }

  announcementHeadingToggle.addEventListener("click", () => {
    if (window.innerWidth > 980) return;
    const isExpanded = announcementHeadingToggle.getAttribute("aria-expanded") === "true";
    announcementHeadingToggle.setAttribute("aria-expanded", !isExpanded);
    announcementsPanel.classList.toggle("collapsed");
  });
}

const calendarHeadingToggle = document.querySelector(".calendar-head");
const calendarPanelObj = document.querySelector(".calendar-panel");
const calendarPanels = document.querySelectorAll(".calendar-panel");
const calendarState = new WeakMap();
const calendarMeetings = {
  "2026-05-15": "Meeting on",
  "2026-06-10": "Meeting on",
  "2026-07-08": "Meeting on"
};
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const renderCalendar = (panel) => {
  const state = calendarState.get(panel) || { year: 2026, month: 4, filter: "month" };
  const title = panel.querySelector(".calendar-head h2");
  const subtitle = panel.querySelector(".calendar-head span");
  const grid = panel.querySelector(".calendar-grid");
  const firstDay = new Date(state.year, state.month, 1);
  const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
  const leadingDays = firstDay.getDay();

  if (!grid) return;

  if (title) {
    title.textContent = monthFormatter.format(firstDay);
  }

  if (subtitle) {
    subtitle.textContent = state.filter === "meeting"
      ? "Meeting dates"
      : state.filter === "all"
        ? "All month view"
        : "This month";
  }

  grid.replaceChildren();
  weekdayLabels.forEach((label) => {
    const dayLabel = document.createElement("span");
    dayLabel.textContent = label;
    grid.append(dayLabel);
  });

  for (let cell = 0; cell < 42; cell += 1) {
    const dayNumber = cell - leadingDays + 1;
    const date = new Date(state.year, state.month, dayNumber);
    const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const dateKey = getDateKey(date);
    const isMeeting = Boolean(calendarMeetings[dateKey]);
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = date.getDate();
    button.dataset.calendarDay = `${isCurrentMonth ? "month" : "outside"}${isMeeting ? " meeting" : ""}`;

    if (!isCurrentMonth) {
      button.classList.add("outside-month");
    }

    if (isCurrentMonth && date.getDate() === 15 && state.month === 4 && state.year === 2026) {
      button.classList.add("today");
    }

    if (isMeeting) {
      button.classList.add("meeting-day");
      button.setAttribute("aria-label", `${date.getDate()} ${calendarMeetings[dateKey]}`);
    }

    if (state.filter === "month" && !isCurrentMonth) {
      button.disabled = true;
      button.textContent = "";
    }

    if (state.filter === "meeting" && !isMeeting) {
      button.classList.add("calendar-filter-muted");
    }

    grid.append(button);
  }
};

if (calendarHeadingToggle && calendarPanelObj) {
  if (window.innerWidth <= 980) {
    calendarPanelObj.classList.add("collapsed");
    calendarHeadingToggle.setAttribute("aria-expanded", "false");
  }

  calendarHeadingToggle.addEventListener("click", () => {
    if (window.innerWidth > 980) return;
    const isExpanded = calendarHeadingToggle.getAttribute("aria-expanded") === "true";
    calendarHeadingToggle.setAttribute("aria-expanded", !isExpanded);
    calendarPanelObj.classList.toggle("collapsed");
  });
}

calendarPanels.forEach((panel) => {
  calendarState.set(panel, { year: 2026, month: 4, filter: "all" });

  panel.querySelectorAll("[data-calendar-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const state = calendarState.get(panel);
      state.filter = button.dataset.calendarFilter || "month";

      panel.querySelectorAll("[data-calendar-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderCalendar(panel);
    });
  });

  const monthButtons = panel.querySelectorAll(".calendar-actions button");
  monthButtons[0]?.addEventListener("click", () => {
    const state = calendarState.get(panel);
    state.month -= 1;
    if (state.month < 0) {
      state.month = 11;
      state.year -= 1;
    }
    renderCalendar(panel);
  });

  monthButtons[1]?.addEventListener("click", () => {
    const state = calendarState.get(panel);
    state.month += 1;
    if (state.month > 11) {
      state.month = 0;
      state.year += 1;
    }
    renderCalendar(panel);
  });

  renderCalendar(panel);
});

document.querySelectorAll(".announcement-widget-tabs").forEach((tablist) => {
  tablist.addEventListener("click", (event) => {
    const button = event.target.closest("button[role='tab']");
    if (!button || button.classList.contains("active")) return;

    tablist.querySelectorAll("button[role='tab']").forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
  });
});

document.querySelectorAll(".conversation-tabs").forEach((tablist) => {
  tablist.addEventListener("click", (event) => {
    const button = event.target.closest("button[role='tab']");
    if (!button || button.classList.contains("selected")) return;

    tablist.querySelectorAll("button[role='tab']").forEach((tab) => {
      const isSelected = tab === button;
      tab.classList.toggle("selected", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });
  });
});

const conversationPanelHead = document.querySelector(".conversations .panel-head");
const conversationsPanel = document.querySelector(".conversations");

if (conversationPanelHead && conversationsPanel) {
  if (window.innerWidth <= 980) {
    conversationsPanel.classList.add("collapsed");
    conversationPanelHead.setAttribute("aria-expanded", "false");
  }

  conversationPanelHead.addEventListener("click", (event) => {
    if (window.innerWidth > 980) return;

    // Don't toggle if clicking on the "View All" link
    if (event.target.tagName.toLowerCase() === 'a') return;

    const isExpanded = conversationPanelHead.getAttribute("aria-expanded") === "true";
    conversationPanelHead.setAttribute("aria-expanded", !isExpanded);
    conversationsPanel.classList.toggle("collapsed");
  });
}

// Profile Modal Tabs Delegation
document.addEventListener("click", (event) => {
  const tab = event.target.closest(".profile-tab");
  if (!tab) return;

  const tabsContainer = tab.closest(".profile-tabs-section");
  if (!tabsContainer) return;

  const targetId = tab.dataset.tab;
  tabsContainer.dataset.profileTheme = targetId;

  // Deactivate all tabs in this container
  tabsContainer.querySelectorAll(".profile-tab").forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-selected", "false");
  });

  // Deactivate all panels in this container
  tabsContainer.querySelectorAll(".profile-panel").forEach(p => {
    p.classList.remove("active");
    p.hidden = true;
  });

  // Activate selected tab and panel
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  const targetPanel = tabsContainer.querySelector(`#tab-${targetId}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
    targetPanel.hidden = false;
  }

  updateProfileTableFilter(tabsContainer);
});

const updateProfileTableFilter = (tabsContainer) => {
  const filterBar = tabsContainer.querySelector(".profile-table-filter");
  const activePanel = tabsContainer.querySelector(".profile-panel.active");
  const table = activePanel?.querySelector(".profile-table");
  if (!filterBar || !table) return;

  const queryInput = filterBar.querySelector("[data-profile-filter-query]");
  const columnSelect = filterBar.querySelector("[data-profile-filter-column]");
  const resetButton = filterBar.querySelector("[data-profile-filter-reset]");
  const countNode = filterBar.querySelector("[data-profile-filter-count]");
  const headings = [...table.querySelectorAll("thead th")];
  const rows = [...table.querySelectorAll("tbody tr:not(.profile-empty-row):not(.suspension-empty-row)")];
  const activeTabLabel = tabsContainer.querySelector(".profile-tab.active span")?.textContent.trim() || "records";

  columnSelect.innerHTML = '<option value="all">All columns</option>';
  headings.forEach((heading, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = heading.textContent.trim();
    columnSelect.append(option);
  });

  queryInput.value = "";
  queryInput.placeholder = `Search ${activeTabLabel.toLowerCase()}...`;
  columnSelect.value = "all";
  resetButton.disabled = true;
  rows.forEach((row) => {
    row.hidden = false;
  });

  const existingNoMatch = table.querySelector(".profile-filter-empty-row");
  existingNoMatch?.remove();
  countNode.textContent = rows.length ? `${rows.length} record${rows.length === 1 ? "" : "s"}` : "No records";
};

document.querySelectorAll(".profile-tabs-section").forEach((tabsContainer) => {
  const filterBar = tabsContainer.querySelector(".profile-table-filter");
  if (!filterBar) return;

  const queryInput = filterBar.querySelector("[data-profile-filter-query]");
  const columnSelect = filterBar.querySelector("[data-profile-filter-column]");
  const resetButton = filterBar.querySelector("[data-profile-filter-reset]");
  const countNode = filterBar.querySelector("[data-profile-filter-count]");

  const applyProfileTableFilter = () => {
    const table = tabsContainer.querySelector(".profile-panel.active .profile-table");
    if (!table) return;

    const query = queryInput.value.trim().toLowerCase();
    const selectedColumn = columnSelect.value;
    const rows = [...table.querySelectorAll("tbody tr:not(.profile-empty-row):not(.suspension-empty-row)")];
    let visibleCount = 0;

    table.querySelector(".profile-filter-empty-row")?.remove();

    rows.forEach((row) => {
      const cells = [...row.cells];
      const searchableText = selectedColumn === "all"
        ? cells.map((cell) => cell.textContent).join(" ")
        : cells[Number(selectedColumn)]?.textContent || "";
      const isVisible = !query || searchableText.toLowerCase().includes(query);
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (query && rows.length && visibleCount === 0) {
      const noMatchRow = document.createElement("tr");
      noMatchRow.className = "profile-filter-empty-row";
      const cell = document.createElement("td");
      cell.colSpan = table.querySelectorAll("thead th").length;
      cell.textContent = "No matching records found";
      noMatchRow.append(cell);
      table.tBodies[0].append(noMatchRow);
    }

    resetButton.disabled = !query && selectedColumn === "all";
    countNode.textContent = rows.length
      ? `${visibleCount} of ${rows.length} record${rows.length === 1 ? "" : "s"}`
      : "No records";
  };

  queryInput.addEventListener("input", applyProfileTableFilter);
  columnSelect.addEventListener("change", applyProfileTableFilter);
  resetButton.addEventListener("click", () => {
    queryInput.value = "";
    columnSelect.value = "all";
    applyProfileTableFilter();
    queryInput.focus();
  });

  tabsContainer.dataset.profileTheme =
    tabsContainer.querySelector(".profile-tab.active")?.dataset.tab || "contact";
  updateProfileTableFilter(tabsContainer);
});

// Announcements Search and Category Dropdown Filtering
const announcementSearchInput = document.querySelector(".announcement-search input");
const announcementSelect = document.querySelector(".announcement-category-select");
const announcementRows = document.querySelectorAll(".announcement-list .announcement-row");

if (announcementRows.length > 0) {
  let activeCategory = "all";
  let searchQuery = "";

  const filterAnnouncements = () => {
    announcementRows.forEach((row) => {
      // Find category in the row (e.g. News, Academics, Activities)
      const metaSpan = row.querySelector(".announcement-meta span, .announcement-copy > span");
      const category = metaSpan ? metaSpan.textContent.trim().toLowerCase() : "";

      // Find title and text content
      const copy = row.querySelector(".announcement-copy");
      const fullText = copy ? copy.textContent.toLowerCase() : "";

      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const matchesSearch = searchQuery === "" || fullText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  };

  if (announcementSearchInput) {
    announcementSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterAnnouncements();
    });
  }

  if (announcementSelect) {
    announcementSelect.addEventListener("change", (e) => {
      activeCategory = e.target.value.trim().toLowerCase();
      filterAnnouncements();
    });
  }
}
