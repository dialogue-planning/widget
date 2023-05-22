function getDomElement(id: string){
    const element = document.getElementById(id);
    if(element == null){
        throw new Error("Could not find the "+ id + " DOM element.");
    }
    return element;
}

function getFromLocalStorage(id: string){
    const element = localStorage.getItem(id);
    if(element == null){
        throw new Error("Could not find the "+ id + " in local storage.");
    }
    return element;
}

async function httpGet(url: RequestInfo | URL){
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

async function httpPost(url: RequestInfo | URL, params: { user_id: string | null; msg?: string; }){
    const options = {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
}

function changeInputState(input_ids: any[], disabled: boolean){
    var input_elems:HTMLInputElement [] = [];
    input_ids.forEach((elem: string) => {
        input_elems.push(<HTMLInputElement>(getDomElement(elem)));
    })
    input_elems.forEach(elem => {
        elem.disabled = disabled;
    })
    input_elems.forEach(elem => {
        if(elem.nodeName === "BUTTON"){
            if(disabled)
                elem.classList.remove("button_hover");
            else
                elem.classList.add("button_hover");
        }
    })
}

export {getDomElement, getFromLocalStorage, httpGet, httpPost, changeInputState};