// global CSS
import globalCss from "../style.css";

// Inject global CSS
GM_addStyle(globalCss);

import "./wait"; // putting the file's contents in this file would make Rollup position it after these imports.
import "./CategoryPanel";
