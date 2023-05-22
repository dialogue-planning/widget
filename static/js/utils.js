var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getDomElement(id) {
    const element = document.getElementById(id);
    if (element == null) {
        throw new Error("Could not find the " + id + " DOM element.");
    }
    return element;
}
function getFromLocalStorage(id) {
    const element = localStorage.getItem(id);
    if (element == null) {
        throw new Error("Could not find the " + id + " in local storage.");
    }
    return element;
}
function httpGet(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const json = yield response.json();
        return json;
    });
}
function httpPost(url, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        };
        const response = yield fetch(url, options);
        const json = yield response.json();
        return json;
    });
}
function changeInputState(input_ids, disabled) {
    var input_elems = [];
    input_ids.forEach((elem) => {
        input_elems.push((getDomElement(elem)));
    });
    input_elems.forEach(elem => {
        elem.disabled = disabled;
    });
    input_elems.forEach(elem => {
        if (elem.nodeName === "BUTTON") {
            if (disabled)
                elem.classList.remove("button_hover");
            else
                elem.classList.add("button_hover");
        }
    });
}
export { getDomElement, getFromLocalStorage, httpGet, httpPost, changeInputState };
