/**
 * main.js - Landing Page Interactions & OS Auto-Detection
 */

document.addEventListener("DOMContentLoaded", () => {
  initOsDetection();
  initCopyButtons();
  initFaqAccordion();
  initMobileNav();
});

// Detect user OS to tailor the primary download button
function initOsDetection() {
  const downloadBtn = document.getElementById("primary-download-btn");
  const downloadLabel = document.getElementById("download-label");
  const downloadSub = document.getElementById("download-sub");

  if (!downloadBtn || !downloadLabel) return;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || "";

  const GITHUB_RELEASE_BASE = "https://github.com/Aryan-KG/Jerry-Downloads/releases/download/Jerry0186";

  if (/iphone|ipad|ipod/.test(userAgent)) {
    downloadLabel.textContent = "Download iOS (.IPA)";
    downloadBtn.setAttribute("href", `${GITHUB_RELEASE_BASE}/Jerry-Companion.ipa`);
    if (downloadSub) downloadSub.textContent = "iPhone & iPad • iOS 17+";
  } else if (/android/.test(userAgent)) {
    downloadLabel.textContent = "Download Android (.APK)";
    downloadBtn.setAttribute("href", `${GITHUB_RELEASE_BASE}/Jerry-Companion.apk`);
    if (downloadSub) downloadSub.textContent = "Phone & Tablet • Android 8.0+";
  } else if (platform.includes("mac") || userAgent.includes("macintosh")) {
    downloadLabel.textContent = "Download for macOS";
    downloadBtn.setAttribute("href", `${GITHUB_RELEASE_BASE}/Jerry-0.1.86-arm64.dmg`);
    if (downloadSub) downloadSub.textContent = "Universal DMG (Apple Silicon & Intel) • macOS 12+";
  } else if (platform.includes("win") || userAgent.includes("windows")) {
    downloadLabel.textContent = "Download for Windows";
    downloadBtn.setAttribute("href", `${GITHUB_RELEASE_BASE}/Jerry-0.1.86-x64.exe`);
    if (downloadSub) downloadSub.textContent = "64-bit Installer (.exe) • Windows 10/11";
  } else if (platform.includes("linux") || userAgent.includes("linux")) {
    downloadLabel.textContent = "Download for Linux";
    downloadBtn.setAttribute("href", `${GITHUB_RELEASE_BASE}/Jerry-0.1.86-x86_64.AppImage`);
    if (downloadSub) downloadSub.textContent = "Standalone AppImage • Ubuntu / Debian / Fedora";
  } else {
    downloadLabel.textContent = "Download Jerry";
    downloadBtn.setAttribute("href", "#downloads");
    if (downloadSub) downloadSub.textContent = "Available for macOS, Windows, Linux, iOS & Android";
  }
}

// Copy to clipboard helper
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalContent = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="font-size:12px; margin-left:4px;">Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalContent;
        }, 2000);
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    });
  });
}

// FAQ Accordion interaction
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = answer.style.display !== "none";
      answer.style.display = isOpen ? "none" : "block";
      const icon = question.querySelector(".faq-icon");
      if (icon) {
        icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
      }
    });
  });
}

// Mobile nav toggle
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
  });
}
