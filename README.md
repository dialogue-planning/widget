![landing](widget_landing.png) 

# Doing a test run
First, you need to have a Hovor server running. See the [contingent-plan-executor](https://github.com/dialogue-planning/contingent-plan-executor) repo for details.  
With npm installed, clone and cd into the repository and run `npx live-server`.  

# Embedding into your site
![chat](widget_chat.png)
You can add the UI to your site in a couple lines of code:

```
<script type="module">
    import {buildLandingInput, initConvo} from "https://cdn.jsdelivr.net/gh/dialogue-planning/widget/static/js/export.js";
    buildLandingInput(initConvo(), [HOST]); 
</script>
```

`buildLandingInput` is a function that creates a text input and 2 buttons for the user to enter their user ID and whether they want to start a new conversation or load an existing one. The first parameter of `buildLandingInput` is a function which is executed when the user input is accepted as valid. Here, we are just calling the `initConvo()` function which constructs the "conversation box" and executes the conversation. However, you may also want to construct the box after changing the page (seen in `index.html` and `conversation.html` in this example), move the box to a different location on the page, add additional authentication, etc., so feel free to write your own custom function. Secondly, `[HOST]` defines where your [contingent-plan-executor](https://github.com/dialogue-planning/contingent-plan-executor) server is running. i.e. for a local server, it could be `http://localhost:8080/`. Redefine it before executing the code.   

Feel free to change the style of the elements for your own use cases. `buildConvoBox()` in `convo.ts` and `buildLandingInput` in `landing.ts` show how the DOM is structured.

# For developers
With typescript installed (easiest way is through npm), use the .ts (not .js) files to update functionality. Convert ts -> js with `tsc -p tsconfig.json`.