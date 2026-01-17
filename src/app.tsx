import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';
// global CSS
import globalCss from './style.css';
// CSS modules
import { stylesheet } from './style.module.css';
import { createSignal, ParentProps } from 'solid-js';
import ModuleManager, { P } from './features/module/api/ModuleManager';
import Mod from './features/module/api/Module';
import Category, { CategoryInfo, categoryInfoSet } from './features/module/api/Category';
import logger from './utils/loggers';

const ACCENT_COLOR = "#0b8405";

function Module({ mod }: ParentProps<{ mod: Mod }>) {
  const { name, enabled } = mod;
  const bind = undefined; // TODO: bind system
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
        mod.toggle();
        setToggled(mod.enabled);
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

function CategoryPanel(category: string, info: CategoryInfo) {
  const mods = ModuleManager.findModules(P.byCategory(Category[category]));
  logger.info(`Found mods in ${category}: ${mods}`);
  return <div>
    <div
      style={{
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem"
      }}>
      <img src={info.iconURL} loading='lazy' />
      <div>{info.data.name}</div>
    </div>
    <div>
      {
        mods.map((m, i) => {
          return <div>
            <Module mod={m}></Module>
            {i >= ModuleManager.modules.length - 1 ? undefined : <Spacer size={"4px"}></Spacer>}
          </div>;
        })
      }
    </div>
  </div>;
}

// Inject global CSS
GM_addStyle(globalCss);

// we have to inject early in order to modify the script, and the script is in the `<head>`, so it will execute before us if we use document-body or document-load.
if (document.body === null) {
  await new Promise<void>(res => {
    document.addEventListener("DOMContentLoaded", () => res());
  });
}

let catIdx = 0;
// let lastLength = 0;

const priority = {
  combat: 2,
  blatant: 3,
  render: 4,
  utility: 5,
  world: 6,
  inventory: 7,
  minigames: 8,
} as const;

// Render modules for each category
for (const [cat, info] of Object.entries(categoryInfoSet).sort(([an], [bn]) => {
  return (priority[an] ?? 99) - (priority[bn] ?? 99);
})) {
  // Create a movable panel using @violentmonkey/ui
  const categoryPanel = getPanel({
    theme: 'dark',
    style: stylesheet,
  });

  // lastLength = tl.width;
  const left = 4 + catIdx++ % 8 * 138;
  const top = 60 + (catIdx > 6 ? 360 : 0);

  Object.assign(categoryPanel.wrapper.style, {
    top: `${top}px`,
    left: `${left}px`,
  });

  categoryPanel.wrapper.addEventListener("mousedown", () => {
    categoryPanel.wrapper.style.cursor = "grabbing";
  });
  categoryPanel.wrapper.addEventListener("mouseup", () => {
    categoryPanel.wrapper.style.cursor = "auto";
  });
  categoryPanel.setMovable(true);
  categoryPanel.show();
  render(() => CategoryPanel(cat, info), categoryPanel.body);
}

