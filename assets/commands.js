registerCommand({
    name: "help",
    description: "List all available commands",
    function: async () => {
        await printCommand("help", "Available commands:\n" + Object.keys(commandList).join("\n"));
    }
});

registerCommand({
    name: "clear",
    description: "Clear the terminal",
    function: async () => {
        terminalElement.innerHTML = "";
    }
});

// time command
registerCommand({
    name: "time",
    description: "Display the current time",
    function: async () => {
        await printCommand("time", new Date().toLocaleTimeString() +
            " " + new Date().toLocaleDateString());
    }
});

registerCommand({
    name: "echo",
    description: "Print the given arguments",
    function: async (...args) => {
        var message = args.join(" ");
        await printCommand("echo", message);
    }
});

registerCommand({
    name: "clear-history",
    description: "Clear the command history",
    function: async () => {
        localStorage.setItem("commands", JSON.stringify([]));
        await printCommand("clear-history", "Command history cleared.");
    }
});

registerCommand({
    name: "history",
    description: "Display the command history",
    function: async () => {
        await printCommand("history", JSON.parse(localStorage.getItem("commands"), 0).join("\n"));
    }
});


