var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDomElement, getFromLocalStorage, httpGet, httpPost, changeInputState } from "./utils.js";
import host from "./host.js";
function newConvo() {
    return __awaiter(this, void 0, void 0, function* () {
        // don't want to throw an error here as we may or may not have it
        if (localStorage.getItem("user_id")) {
            var response = yield httpPost(host + "/new-conversation", { "user_id": localStorage.getItem("user_id") });
        }
        else {
            var response = yield httpGet(host + "/new-conversation");
        }
        // TODO: need to check all statuses here?
        if (response.status == "error") {
            return response;
        }
        localStorage.setItem("user_id", response.user_id);
        // temporarily store message
        localStorage.setItem("msgs", JSON.stringify(response.msg));
        return response;
    });
}
function loadConvo() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield httpPost(host + "/load-conversation", { "user_id": getFromLocalStorage("user_id") });
        // TODO: need to check all statuses here
        if (response.status == "error") {
            return response;
        }
        // temporarily store message
        localStorage.setItem("msgs", JSON.stringify(response.msg));
        return response;
    });
}
function buildLandingInput(executeConvo) {
    const input_box = document.createElement("div");
    input_box.id = "input-box";
    const input = document.createElement("input");
    input.classList.add("input");
    input.type = "text";
    input.id = "user-id-input";
    input.placeholder = "Type user ID here...";
    const input_btn_new = document.createElement("button");
    input_btn_new.classList.add("input");
    input_btn_new.classList.add("button_hover");
    input_btn_new.type = "button";
    input_btn_new.id = "new-convo-button";
    input_btn_new.innerHTML = "Start new conversation";
    input_btn_new.onclick = function () { takeLandingInput("new", executeConvo); };
    const input_btn_load = document.createElement("button");
    input_btn_load.classList.add("input");
    input_btn_load.classList.add("button_hover");
    input_btn_load.type = "button";
    input_btn_load.id = "load-convo-button";
    input_btn_load.innerHTML = "Load conversation";
    input_btn_load.onclick = function () { takeLandingInput("load", executeConvo); };
    const error = document.createElement("p");
    error.id = "error";
    error.style.color = "darkred";
    error.style.fontFamily = "Courier New";
    error.hidden = true;
    input_box.appendChild(input);
    input_box.appendChild(input_btn_new);
    input_box.appendChild(input_btn_load);
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(input_box);
    body.appendChild(error);
    window.addEventListener("load", (event) => {
        fillID();
    });
}
function fillID() {
    // may or may not have the user ID
    if (localStorage.getItem("user_id")) {
        let userIDInput = getDomElement("user-id-input");
        userIDInput.value = getFromLocalStorage("user_id");
    }
}
function takeLandingInput(mode, executeConvo) {
    return __awaiter(this, void 0, void 0, function* () {
        const input_ids = ["new-convo-button", "load-convo-button", "user-id-input"];
        changeInputState(input_ids, true);
        localStorage.setItem("mode", mode);
        const user_input_box = getDomElement("user-id-input");
        if (user_input_box) {
            localStorage.setItem("user_id", user_input_box.value);
        }
        if (getFromLocalStorage("mode") == "new") {
            var result = yield newConvo();
        }
        else {
            var result = yield loadConvo();
        }
        changeInputState(input_ids, false);
        if (result.status !== "error") {
            getDomElement("error").hidden = true;
            executeConvo();
        }
        else {
            getDomElement("error").innerText = result.msg;
            getDomElement("error").hidden = false;
            localStorage.clear();
        }
    });
}
export { buildLandingInput };
