import host from "./host.js";
import { buildLandingInput } from "./landing.js";
import { initConvo } from "./convo.js";
function addCss() {
    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/dialogue-planning/widget/static/css/style.css";
    head.appendChild(link);
}
addCss();
export { host, buildLandingInput, initConvo };
