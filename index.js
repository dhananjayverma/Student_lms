 
const hour = new Date().getHours();
const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";
const greetingNode = document.querySelector(".hero-copy > span");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar-menu");
const sidebarToggleButton = document.querySelector(".sidebar-toggle-button");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
const themeToggleButtons = document.querySelectorAll(".theme-toggle-button, .drawer-theme-toggle");
const themeChoiceButtons = document.querySelectorAll("[data-theme-value]");
const shell = document.querySelector(".shell");
const mobileSidebarQuery = window.matchMedia("(max-width: 980px)");
const desktopDashboardQuery = window.matchMedia("(min-width: 1181px)");

if (greetingNode) {
  greetingNode.textContent = greeting;
}

const setTheme = (theme) => {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-theme", isDark);
  themeToggleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
  themeChoiceButtons.forEach((button) => {
    const isActive = button.dataset.themeValue === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const savedTheme = localStorage.getItem("dashboard-theme");
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDarkTheme ? "dark" : "light"));

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("dashboard-theme", nextTheme);
    setTheme(nextTheme);
  });
});

themeChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = button.dataset.themeValue;
    localStorage.setItem("dashboard-theme", nextTheme);
    setTheme(nextTheme);
  });
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
    event.preventDefault();
    event.stopPropagation();

    const privateScroller = event.target.closest(".menu-submenu-inner");
    const canScrollSubmenu = privateScroller && privateScroller.scrollHeight > privateScroller.clientHeight;

    if (canScrollSubmenu) {
      privateScroller.scrollTop += event.deltaY;
      return;
    }

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
    if (layoutAnnouncementWidgets) {
      dashboardMain.append(layoutAnnouncementWidgets);
    }
    dashboardMain.append(layoutAnnouncementsPanel);
    supportStack.append(layoutAnnouncementsSidebar);
    announcementsLayout.hidden = true;
    return;
  }

  if (layoutAnnouncementWidgets) {
    layoutAnnouncementsMain.prepend(layoutAnnouncementWidgets);
  }
  layoutAnnouncementsMain.append(layoutAnnouncementsPanel);
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
let lastModalTrigger = null;

const closeDashboardModal = () => {
  if (!modal || !modalBody) return;

  modal.hidden = true;
  modalBody.replaceChildren();
  document.body.classList.remove("modal-open");
  lastModalTrigger?.focus();
};

modalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const source = option.parentElement?.querySelector(".modal-source");

    if (!modal || !modalTitle || !modalBody || !source) return;

    lastModalTrigger = option;
    modalTitle.textContent = option.dataset.modalTitle || option.textContent.trim();
    modalBody.replaceChildren(
      ...Array.from(source.children)
        .filter((child) => !child.classList.contains("panel-head"))
        .map((child) => child.cloneNode(true))
    );
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close")?.focus();
  });
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

const conversationPanelHead = document.querySelector(".conversations .panel-head");
const conversationsPanel = document.querySelector(".conversations");

if (conversationPanelHead && conversationsPanel) {
  if (window.innerWidth <= 980) {
    conversationsPanel.classList.add("collapsed");
    conversationPanelHead.setAttribute("aria-expanded", "false");
  }

  conversationPanelHead.addEventListener("click", () => {
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
  
  // Deactivate all tabs in this container
  tabsContainer.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("active"));
  
  // Deactivate all panels in this container
  tabsContainer.querySelectorAll(".profile-panel").forEach(p => {
    p.classList.remove("active");
    p.hidden = true;
  });
  
  // Activate selected tab and panel
  tab.classList.add("active");
  const targetPanel = tabsContainer.querySelector(`#tab-${targetId}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
    targetPanel.hidden = false;
  }
});
