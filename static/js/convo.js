var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-check
const typing = [".        ", ". .      ", ". . .    ", ". . . .  ", ". . . . ."];
import { getDomElement, getFromLocalStorage, httpPost, changeInputState } from "./utils.js";
import host from "./host.js";
function initConvo() {
    buildConvoBox();
    loadAllMsgs();
}
function buildConvoBox() {
    const convo_window = document.createElement("div");
    convo_window.id = "convo-window";
    const convo_box = document.createElement("div");
    convo_box.classList.add("conversation");
    convo_box.classList.add("box");
    convo_box.id = "convo-box";
    const input_box = document.createElement("div");
    input_box.classList.add("conversation");
    input_box.classList.add("input_box");
    input_box.id = "input-box";
    const send_btn = document.createElement("button");
    send_btn.classList.add("input");
    send_btn.classList.add("button_hover");
    send_btn.id = "send-button";
    send_btn.onclick = function () { sendUserMsg(); };
    send_btn.innerHTML = "Send";
    const input = document.createElement("input");
    input.classList.add("input");
    input.type = "text";
    input.id = "input";
    input.placeholder = "Type something here...";
    input_box.appendChild(send_btn);
    input_box.appendChild(input);
    convo_window.appendChild(convo_box);
    convo_window.appendChild(input_box);
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(convo_window);
}
function addMsg(user, message) {
    let convo_box = getDomElement("convo-box");
    let msgbox = document.createElement("div");
    msgbox.classList.add("message-box");
    let bubble = document.createElement("div");
    bubble.classList.add("message");
    let icon = document.createElement("img");
    icon.classList.add("icon");
    if (user) {
        bubble.classList.add("user");
        icon.setAttribute("src", "https://cdn.jsdelivr.net/gh/dialogue-planning/widget/static/css/user.png");
        msgbox.appendChild(bubble);
        msgbox.appendChild(icon);
    }
    else {
        icon.setAttribute("src", "https://cdn.jsdelivr.net/gh/dialogue-planning/widget/static/css/robot.png");
        msgbox.appendChild(icon);
        msgbox.appendChild(bubble);
    }
    bubble.innerHTML += message;
    convo_box.appendChild(msgbox);
    convo_box.scrollTop = bubble.offsetTop;
}
function loadAllMsgs() {
    // loads all agent and user messages
    const msgs = getFromLocalStorage("msgs");
    if (msgs == null) {
        throw new Error("Messages not found in local storage.");
    }
    const msgsJson = JSON.parse(msgs);
    msgsJson.forEach((msg) => {
        if ("HOVOR" in msg) {
            addMsg(false, msg["HOVOR"]);
        }
        else if ("USER" in msg) {
            addMsg(true, msg["USER"]);
        }
    });
    // add user id info
    const input_box = getDomElement("input-box");
    const user_id_info = document.createElement("div");
    user_id_info.classList.add("input");
    const user_id = getFromLocalStorage("user_id");
    if (user_id == null) {
        throw new Error("Could not find the user ID in local storage.");
    }
    user_id_info.innerHTML = user_id;
    user_id_info.style.color = "black";
    user_id_info.style.backgroundColor = "white";
    input_box.appendChild(user_id_info);
    // disable if conversation done (and reset if necessary)
    if (Object.keys(msgsJson)[Object.keys(msgsJson).length - 1] == "GOAL REACHED") {
        changeInputState(["send-button", "input"], true);
    }
    else {
        changeInputState(["send-button", "input"], false);
    }
}
function sendUserMsg() {
    return __awaiter(this, void 0, void 0, function* () {
        var input = getDomElement("input");
        if (input.value.length > 0) {
            const value = input.value;
            input.value = "";
            changeInputState(["send-button", "input"], true);
            addMsg(true, value);
            const msgs = JSON.parse(getFromLocalStorage("msgs"));
            msgs.push({ "USER": value });
            localStorage.setItem("msgs", JSON.stringify(msgs));
            let idx = 0;
            addMsg(false, "<pre>" + typing[idx] + "</pre>");
            let bubble = document.getElementsByClassName("message");
            if (bubble == null) {
                throw new Error("Could not find the 'message' DOM elements.");
            }
            let lastMsg = bubble[bubble.length - 1];
            let timer = setInterval(frame, 500);
            function frame() {
                idx += 1;
                if (idx >= typing.length) {
                    idx = 0;
                }
                lastMsg.innerHTML = "<pre>" + typing[idx] + "</pre>";
            }
            const response = yield httpPost(host + "/new-message", { "user_id": getFromLocalStorage("user_id"), "msg": value });
            clearInterval(timer);
            // TODO: need to check status here
            if (response.hasOwnProperty("msg")) {
                // since the agent always goes first and a "typing" response would always follow a
                // user response, this should never throw an error
                if (lastMsg.parentNode == null) {
                    throw new Error("No parent node to this message found.");
                }
                else if (lastMsg.parentNode.parentNode == null) {
                    throw new Error("No grandparent node to this message found.");
                }
                lastMsg.parentNode.parentNode.removeChild(lastMsg.parentNode);
                response.msg.forEach((msg) => {
                    addMsg(false, msg["HOVOR"]);
                    msgs.push(msg);
                    localStorage.setItem("msgs", JSON.stringify(msgs));
                });
                if (response.status !== "Plan complete!") {
                    changeInputState(["send-button", "input"], false);
                    msgs.push({ "GOAL REACHED": "Plan complete!" });
                    localStorage.setItem("msgs", JSON.stringify(msgs));
                }
            }
        }
    });
}
export { initConvo };
