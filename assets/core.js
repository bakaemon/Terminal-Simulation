const terminalElement = document.getElementById("terminal-content");
let commandList = {};

function registerCommand({ name, description, function: func }) {
    commandList[name] = {
        description: description,
        function: func
    };
}

async function executeCommand(command) {
    var id = Math.random().toString(36).substr(2, 9);
    const enterCommand = document.createElement("div");
    enterCommand.setAttribute("id", "cmd-" + id);
    enterCommand.innerHTML = "> &nbsp;" + command + "<br>";
    terminalElement.appendChild(enterCommand);
    // save the command to local storage
    if (localStorage.getItem("commands") === null) {
        localStorage.setItem("commands", JSON.stringify([command]));
    } else {
        const commands = JSON.parse(localStorage.getItem("commands"));
        commands.push(command);
        localStorage.setItem("commands", JSON.stringify(commands));
    }
    // Process the command and generate the output
    await processCommand(command);

}

async function printCommand(command, output, speed = 25) { 
    // output div, which is a child of the terminal div
    var id = Math.random().toString(36).substr(2, 9);
    const outputE = document.createElement("div");
    outputE.setAttribute("id", 'output-' + id);
    outputE.classList.add("terminal");
    outputE.style.wordBreak = "break-all";
    terminalElement.appendChild(outputE);
    const outputElement = document.getElementById('output-' + id);
    outputElement.style.wordBreak = "break-all";
    
    await typeEffect(outputElement, output, speed);
}

// print command with callback using [!X] where X is the index of the callback
async function printCommandWithCallback(command, output, callbacks, speed = 25) {
    // output div, which is a child of the terminal div
    var id = Math.random().toString(36).substr(2, 9);
    const outputE = document.createElement("div");
    outputE.setAttribute("id", 'output-' + id);
    outputE.classList.add("terminal");
    outputE.style.wordBreak = "break-all";
    terminalElement.appendChild(outputE);
    const outputElement = document.getElementById('output-' + id);
    outputElement.style.wordBreak = "break-all";
    // check of output has \n, remove it and print each line separately
    if (output.includes("\n")) {
        const lines = output.split("\n");
        for (let i = 0; i < lines.length; i++) {
            await typeEffectEvent(outputElement, lines[i], speed, callbacks);
            if (i !== lines.length - 1) {
                outputElement.innerHTML += "<br>";
            }
        }
    } else {
        await typeEffectEvent(outputElement, output, speed, callbacks);
    }
}




async function processCommand(command) {
    const args = command.split(" ");
    const commandName = args[0];
    args.shift();
    if (commandName in commandList) {
        await commandList[commandName].function(...args);
    } else {
        await printCommand(command, "Command not found: " + commandName);
    }
}

const commandHistory = JSON.parse(localStorage.getItem("commands"));
let currentCommandIndex = commandHistory.length - 1;
// register key up and down events for the command input
const terminalInput = document.getElementById("terminal-input");
terminalInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    // navigate through the command history
    if (event.keyCode === 38) {
        if (currentCommandIndex >= 0) {
            terminalInput.value = commandHistory[currentCommandIndex];
            currentCommandIndex--;
        }
    }

    // on key down, go down the command history, if reached the end, clear the input    
    if (event.keyCode === 40) {
        if (currentCommandIndex < commandHistory.length - 1) {
            currentCommandIndex++;
            terminalInput.value = commandHistory[currentCommandIndex];
        } else {
            terminalInput.value = "";
        }
    }
    
});



