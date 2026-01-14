import modifyCode from "./replacement";

async function execute(src: string, oldScript?: HTMLScriptElement) {
  if (oldScript) oldScript.type = "javascript/blocked";
  const fixed = await fetch(src).then((e) => e.text()).then(modifyCode);
  if (oldScript) oldScript.type = 'module';


  const newScript = document.createElement("script");
  newScript.type = "module";
  newScript.crossOrigin = "";
  newScript.textContent = fixed;
  const head = document.querySelector("head");
  head.appendChild(newScript);
  newScript.textContent = "";
  newScript.remove();
}

function isIndexScript(src: string) {
  if (src.length === 0) return false;
  const url = new URL(src);
  return url.pathname.startsWith("/assets/index-") &&
    url.pathname.endsWith(".js");
}

export default function hook() {
  if (navigator.userAgent.indexOf("Firefox") != -1) {
    window.addEventListener("beforescriptexecute", function (e) {
      const script = e.target as HTMLScriptElement;
      if (isIndexScript(script.src)) {
        e.preventDefault();
        e.stopPropagation();
        execute(script.src, script);
      }
    }, false);
  } else {
    new MutationObserver(async (mutations, observer) => {
      const oldScript = mutations
        .flatMap((e) => [...Array.from(e.addedNodes)])
        .map((e) => e as HTMLScriptElement)
        .filter((e) => e.tagName == "SCRIPT")
        .find((e) => isIndexScript(e.src));

      if (oldScript) {
        observer.disconnect();
        execute(oldScript.src, oldScript);
      }
    }).observe(document, {
      childList: true,
      subtree: true,
    });
  }
}

hook();
