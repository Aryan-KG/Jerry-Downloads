/**
 * docs.js - Interactive Documentation Portal Engine
 */

// Search database of documentation topics
const DOCS_INDEX = [
  {
    id: "installation",
    title: "Installation & Setup",
    lead: "Download the pre-compiled binary for macOS, Windows, or Linux and complete initial setup.",
    keywords: "install download macos dmg windows exe deb appimage setup permissions accessibility screen recording",
  },
  {
    id: "bring-your-own-api",
    title: "AI Providers & Custom APIs",
    lead: "Configure your own API keys, OpenAI-compatible endpoints, Anthropic, Groq, Ollama, or LM Studio.",
    keywords: "api key openai openrouter groq xai anthropic claude ollama lm studio vllm custom endpoint base url",
  },
  {
    id: "bots-and-instructions",
    title: "Creating & Managing Bots",
    lead: "Customize personas, assign working folders, and maintain long-term memory.",
    keywords: "bots agent create persona instructions working directory folder workspace memory context",
  },
  {
    id: "connected-apps",
    title: "Connected Apps & Integrations",
    lead: "Authorize Gmail, Slack, GitHub, Notion, Google Calendar, and web search for your bots.",
    keywords: "integrations apps connect gmail slack github notion calendar tools auth composio",
  },
  {
    id: "computer-use",
    title: "Computer & Browser Control",
    lead: "Allow bots to operate your desktop, interact with native apps, and automate web tasks with approval gates.",
    keywords: "computer use desktop screen capture browser mouse click keyboard automation permissions safety gates",
  },
  {
    id: "automations",
    title: "Scheduled Routines & Automations",
    lead: "Set up morning briefings, continuous repository watchers, and background cron schedules.",
    keywords: "cron schedule routine morning briefing background tasks automations trigger recurring",
  },
  {
    id: "mobile-companion",
    title: "Mobile Companion Mode",
    lead: "Securely link your iPhone or mobile companion device with peer-to-peer end-to-end encryption.",
    keywords: "ios mobile companion pairing phone qr code remote chat approvals on the go",
  },
  {
    id: "privacy-and-storage",
    title: "Privacy, Data Storage & Backups",
    lead: "Local-first storage architecture, zero cloud telemetry, and workspace export.",
    keywords: "privacy local-first security storage backup json sqlite export air-gapped credentials",
  },
  {
    id: "faq",
    title: "Troubleshooting & FAQs",
    lead: "Answers to common setup questions, permission resets, and offline operation.",
    keywords: "troubleshooting faq help permission denied port error offline models reset",
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initDocNavigation();
  initSearch();
  initCodeCopy();
  initMobileNav();
});

// Handle doc section switching and hash changes
function initDocNavigation() {
  const navLinks = document.querySelectorAll(".docs-nav-link");
  const sections = document.querySelectorAll(".doc-section");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");

  function showSection(targetId) {
    let found = false;
    sections.forEach((sec) => {
      if (sec.id === targetId) {
        sec.classList.add("active-doc");
        found = true;
      } else {
        sec.classList.remove("active-doc");
      }
    });

    if (!found && sections.length > 0) {
      targetId = sections[0].id;
      sections[0].classList.add("active-doc");
    }

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${targetId}`) {
        link.classList.add("active");
        if (breadcrumbCurrent) {
          breadcrumbCurrent.textContent = link.textContent.trim();
        }
      } else {
        link.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle click on sidebar links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      history.pushState(null, "", `#${targetId}`);
      showSection(targetId);

      // On mobile, close search panel if open
      const resultsPanel = document.getElementById("search-results-panel");
      if (resultsPanel) resultsPanel.classList.remove("open");
    });
  });

  // Listen to popstate / back button
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "") || "installation";
    showSection(hash);
  });

  // Initial load
  const initialHash = window.location.hash.replace("#", "") || "installation";
  showSection(initialHash);
}

// Client-side instant search
function initSearch() {
  const searchInput = document.getElementById("docs-search-input");
  const resultsPanel = document.getElementById("search-results-panel");

  if (!searchInput || !resultsPanel) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length < 2) {
      resultsPanel.classList.remove("open");
      resultsPanel.innerHTML = "";
      return;
    }

    const matches = DOCS_INDEX.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.lead.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
      );
    });

    if (matches.length === 0) {
      resultsPanel.innerHTML = `<div style="font-size:13px; color:var(--color-mute); padding:6px 8px;">No matching documentation found.</div>`;
      resultsPanel.classList.add("open");
      return;
    }

    resultsPanel.innerHTML = matches
      .map(
        (m) => `
        <a href="#${m.id}" class="search-result-item" data-target="${m.id}">
          <div class="search-result-title">${escapeHtml(m.title)}</div>
          <div class="search-result-snippet">${escapeHtml(m.lead)}</div>
        </a>
      `
      )
      .join("");

    resultsPanel.classList.add("open");

    // Click handler for search items
    resultsPanel.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", (evt) => {
        evt.preventDefault();
        const targetId = item.getAttribute("data-target");
        history.pushState(null, "", `#${targetId}`);
        const link = document.querySelector(`.docs-nav-link[href="#${targetId}"]`);
        if (link) link.click();
        resultsPanel.classList.remove("open");
        searchInput.value = "";
      });
    });
  });

  // Close search panel when clicking outside
  document.addEventListener("click", (evt) => {
    if (!searchInput.contains(evt.target) && !resultsPanel.contains(evt.target)) {
      resultsPanel.classList.remove("open");
    }
  });
}

// Code snippet copy helper
function initCodeCopy() {
  document.querySelectorAll(".btn-code-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const codeBlock = btn.closest(".code-block")?.querySelector("pre");
      if (!codeBlock) return;

      const codeText = codeBlock.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        const originalText = btn.innerHTML;
        btn.innerHTML = "Copied!";
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error("Copy failed", err);
      }
    });
  });
}

// Mobile navigation toggle
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
