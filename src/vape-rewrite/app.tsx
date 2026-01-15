import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';
// global CSS
import globalCss from './style.css';
// CSS modules
import { stylesheet } from './style.module.css';
import { createSignal, ParentProps } from 'solid-js';
import ModuleManager from './features/module/api/ModuleManager';
import Mod from './features/module/api/Module';


const ACCENT_COLOR = "#0b8405";

function Module({ mod }: ParentProps<{ mod: Mod }>) {
  const { name, enabled } = mod;
  const bind = undefined; // TODO: bind system
  // TODO: at some point, there will probably be commands.
  //       One of the commands will be able to toggle stuff, how are we going to sync the ClickGUI with the actual module state?
  const [getToggled, setToggled] = createSignal<boolean>(enabled, { name: "Module toggled Signal" });

  return (
    <div
      style={{
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        "background-color": getToggled() ? ACCENT_COLOR : "#120707ff",
      }}
    >
      <button style={{ background: "none", border: "none", cursor: "pointer" }} on:click={() => {
        mod.toggle()
        setToggled(mod.enabled)
      }}>
        <div style={{ color: "white" }}>{name}</div>

        {bind !== undefined ? (
          <p
            style={{ "margin-left": "auto" }}
            aria-details={`${name} is bound to ${bind}`}
          >
            {bind}
          </p>
        ) : undefined}
      </button>
      {bind === undefined
        ? <button style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img
            style={{ "margin-left": "auto" }}
            src={GM_getResourceURL("bind")}
            loading="lazy"
            alt="Click to bind"
          />
        </button>
        : undefined
      }
    </div>
  );
}

function Spacer(props: ParentProps<{ size: string }>) {
  return <div style={`height: ${props.size}`}></div>
}

function ClickGUIPanel() {
  return <div>
    {
      ModuleManager.modules.map((m, i) => {
        return <div>
          <Module mod={m}></Module>
          {i >= ModuleManager.modules.length - 1 ? undefined : <Spacer size={"4px"}></Spacer>}
        </div>;
      })
    }
  </div>;
}

// function ClickGUI() {
//   return <></>;
// }

// Inject CSS
GM_addStyle(globalCss);

// we have to inject early in order to modify the script, and the script is in the `<head>`, so it will execute before us if we use document-body or document-load.
if (document.body === null) {
  await new Promise<void>(res => {
    document.addEventListener("DOMContentLoaded", () => res());
  });
}

// Let's create a movable panel using @violentmonkey/ui
const panel = getPanel({
  theme: 'dark',
  // If shadowDOM is enabled for `getPanel` (by default), `style` will be injected to the shadow root.
  // Otherwise, it is roughly the same as `GM_addStyle(stylesheet)`.
  style: stylesheet,
});

Object.assign(panel.wrapper.style, {
  top: '10vh',
  left: '10vw',
});
panel.wrapper.addEventListener("mousedown", () => {
  panel.wrapper.style.cursor = "grabbing";
});
panel.wrapper.addEventListener("mouseup", () => {
  panel.wrapper.style.cursor = "auto";
});
panel.setMovable(true);
panel.show();
render(ClickGUIPanel, panel.body);
