import {getDomElement, getFromLocalStorage, httpGet, httpPost, changeInputState} from "./utils.js";
import host from "./host.js";


async function newConvo(){
    // don't want to throw an error here as we may or may not have it
    if(localStorage.getItem("user_id")){
        var response = await httpPost(host + "/new-conversation", {"user_id": localStorage.getItem("user_id")});
    }
    else{
        var response = await httpGet(host + "/new-conversation");
    }
    // TODO: need to check all statuses here?
    if(response.status == "error"){
        return response;
    }
    localStorage.setItem("user_id", response.user_id);
    // temporarily store message
    localStorage.setItem("msgs", JSON.stringify(response.msg));
    return response;
}

async function loadConvo(){
    const response = await httpPost(host + "/load-conversation", {"user_id": getFromLocalStorage("user_id")});
    // TODO: need to check all statuses here
    if(response.status == "error"){
        return response;
    }
    // temporarily store message
    localStorage.setItem("msgs", JSON.stringify(response.msg));
    return response;
}

function buildLandingInput(executeConvo: Function){
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
    input_btn_new.onclick = function(){takeLandingInput("new", executeConvo)};

    const input_btn_load = document.createElement("button");
    input_btn_load.classList.add("input");
    input_btn_load.classList.add("button_hover");
    input_btn_load.type = "button";
    input_btn_load.id = "load-convo-button";
    input_btn_load.innerHTML = "Load conversation";
    input_btn_load.onclick = function(){takeLandingInput("load", executeConvo)};

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

function fillID(){
    // may or may not have the user ID
    if(localStorage.getItem("user_id")){
        let userIDInput = <HTMLInputElement>getDomElement("user-id-input");
        userIDInput.value = getFromLocalStorage("user_id");
    }
}

async function takeLandingInput(mode: string, executeConvo: Function){
    const input_ids = ["new-convo-button", "load-convo-button", "user-id-input"];
    changeInputState(input_ids, true);
    localStorage.setItem("mode", mode);
    const user_input_box = (<HTMLInputElement>getDomElement("user-id-input"));
    if(user_input_box){
        localStorage.setItem("user_id", user_input_box.value);
    }
    if(getFromLocalStorage("mode") == "new"){
        var result = await newConvo();
    }
    else{
        var result = await loadConvo();
    }
    changeInputState(input_ids, false);
    if(result.status !== "error"){
        getDomElement("error").hidden = true;
        executeConvo();
    }
    else{
        getDomElement("error").innerText = result.msg;
        getDomElement("error").hidden = false;
        localStorage.clear();
    }
}

export {buildLandingInput};