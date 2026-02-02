(function () {
  // --- Styles ---
  const style = document.createElement("style");
  style.textContent = `
    #appLoaderOverlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 12, 16, 0.45);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      z-index: 100000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    #appLoaderCard {
      width: min(420px, 92vw);
      background: rgba(255,255,255,0.95);
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 16px 48px rgba(0,0,0,0.25);
      border-radius: 14px;
      padding: 18px 18px 14px;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
      color: #0b1220;
      transform: translateY(10px);
      opacity: 0;
      animation: appLoaderPop .18s ease-out forwards;
    }

    @keyframes appLoaderPop {
      to { transform: translateY(0); opacity: 1; }
    }

    #appLoaderTop {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #appLoaderSpinner {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 3px solid rgba(0,0,0,0.12);
      border-top-color: rgba(0,0,0,0.65);
      animation: appLoaderSpin 0.8s linear infinite;
      flex: 0 0 auto;
    }

    @keyframes appLoaderSpin {
      to { transform: rotate(360deg); }
    }

    #appLoaderText {
      font-size: 14px;
      line-height: 1.3;
      font-weight: 600;
      margin: 0;
      flex: 1 1 auto;
      word-break: break-word;
    }

    #appLoaderSub {
      margin: 10px 0 0;
      font-size: 12px;
      line-height: 1.35;
      color: rgba(11,18,32,0.72);
    }

    #appLoaderActions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 12px;
    }

    #appLoaderBtn {
      pointer-events: auto;
      border: 1px solid rgba(0,0,0,0.12);
      background: rgba(255,255,255,0.9);
      padding: 8px 12px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      color: rgba(11,18,32,0.9);
      transition: transform .05s ease, background .15s ease;
    }
    #appLoaderBtn:hover { background: rgba(255,255,255,1); }
    #appLoaderBtn:active { transform: scale(0.98); }

    body.appLoaderLock {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  // --- DOM ---
  let overlay = document.getElementById("appLoaderOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "appLoaderOverlay";
    overlay.innerHTML = `
      <div id="appLoaderCard" role="dialog" aria-modal="true" aria-live="polite">
        <div id="appLoaderTop">
          <div id="appLoaderSpinner" aria-hidden="true"></div>
          <p id="appLoaderText">Cargando...</p>
        </div>
        <div id="appLoaderSub">Esto puede tardar unos segundos.</div>
        <div id="appLoaderActions">
          <button id="appLoaderBtn" type="button">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const textEl = overlay.querySelector("#appLoaderText");
  const subEl  = overlay.querySelector("#appLoaderSub");
  const btnEl  = overlay.querySelector("#appLoaderBtn");

  let hideTimer = null;

  function _clearTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function _show() {
    overlay.style.display = "flex";
    document.body.classList.add("appLoaderLock");
  }

  function _hide() {
    _clearTimer();
    overlay.style.display = "none";
    document.body.classList.remove("appLoaderLock");
  }

  // Cerrar con botón / click fuera / ESC
  btnEl.addEventListener("click", _hide);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) _hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") _hide();
  });

  // --- Public API ---
  window.showLoader = function (text = "Cargando...", opts = {}) {
    const { timeoutMs = 60000, subtext = "Esto puede tardar unos segundos." } = opts;

    if (textEl) textEl.textContent = text;
    if (subEl) subEl.textContent = subtext;

    _show();

    _clearTimer();
    if (timeoutMs && timeoutMs > 0) {
      hideTimer = setTimeout(() => {
        _hide();
      }, timeoutMs);
    }
  };

  window.hideLoader = function () {
    _hide();
  };
})();
