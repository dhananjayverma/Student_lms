 
const hour = new Date().getHours();
const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";
const greetingNode = document.querySelector(".hero-copy > span");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar-menu");
const sidebarToggleButton = document.querySelector(".sidebar-toggle-button");

if (greetingNode) {
  greetingNode.textContent = greeting;
}

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
  let sidebarAnimationTimer;

  sidebarToggleButton.addEventListener("click", () => {
    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    document.body.classList.add("sidebar-animating");
    sidebarToggleButton.setAttribute("aria-pressed", String(isCollapsed));
    sidebarToggleButton.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Shrink sidebar");

    clearTimeout(sidebarAnimationTimer);
    sidebarAnimationTimer = setTimeout(() => {
      document.body.classList.remove("sidebar-animating");
    }, 420);
  });
}

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
  if (event.key === "Escape" && modal && !modal.hidden) {
    closeDashboardModal();
  }
});
