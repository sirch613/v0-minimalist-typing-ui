(() => {
  // Don't inject on sirch.ai itself
  if (window.location.hostname === "sirch.ai") return;

  let isOpen = false;

  // Create trigger line
  const trigger = document.createElement("div");
  trigger.id = "sirch-trigger";
  document.body.appendChild(trigger);

  // Create overlay container
  const overlay = document.createElement("div");
  overlay.id = "sirch-overlay";
  overlay.innerHTML = `
    <div id="sirch-backdrop"></div>
    <iframe id="sirch-frame" src="about:blank" allow="clipboard-read; clipboard-write"></iframe>
  `;
  document.body.appendChild(overlay);

  const frame = document.getElementById("sirch-frame");
  const backdrop = document.getElementById("sirch-backdrop");
  let frameLoaded = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    // Load iframe on first open
    if (!frameLoaded) {
      frame.src = "https://sirch.ai";
      frameLoaded = true;
    }
    overlay.classList.add("active");
    trigger.style.opacity = "0";
    trigger.style.pointerEvents = "none";
    // Focus the iframe so keyboard works
    setTimeout(() => frame.focus(), 100);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove("active");
    trigger.style.opacity = "";
    trigger.style.pointerEvents = "";
  }

  // Trigger: mouse leaves viewport at the top (goes above the trigger line)
  trigger.addEventListener("mouseenter", () => {
    // Start watching for mouse leaving the page
    const onLeave = (e) => {
      if (e.clientY <= 0) {
        open();
        document.removeEventListener("mouseleave", onLeave);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    // Cancel if mouse moves away from trigger without leaving
    trigger.addEventListener("mouseleave", () => {
      document.removeEventListener("mouseleave", onLeave);
    }, { once: true });
  });

  // Also open if mouse moves to y=0 while near the trigger
  document.addEventListener("mousemove", (e) => {
    if (!isOpen && e.clientY === 0 && e.clientX > window.innerWidth / 2 - 100 && e.clientX < window.innerWidth / 2 + 100) {
      open();
    }
  });

  // Close: mouse re-enters viewport from the top (cursor comes back on screen)
  document.addEventListener("mouseenter", (e) => {
    if (isOpen && e.clientY <= 5) {
      close();
    }
  });

  // Close: click backdrop
  backdrop.addEventListener("click", close);

  // Close: Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      close();
    }
  });

  // Listen for Command+J from background script
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "toggle-sirch") {
      if (isOpen) close();
      else open();
    }
  });
})();
