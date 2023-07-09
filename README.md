# Terminal-Simulation
Just a simple implementation of a website-based Terminal that looks just like one. This enables possiblity of intergrate this with REST APIs to expand its functionality and purposes.
# Screenshot
![image](https://github.com/bakaemon/Terminal-Simulation/assets/69375806/58794296-d720-447f-8478-d306ec691b28)
# How to add new command
List of commands can be found at `assets/commands.js`. Here are example of two default commands `time` and `echo`:
#### Time
```js

registerCommand({
    name: "time",
    description: "Display the current time",
    function: async () => {
        await printCommand("time", new Date().toLocaleTimeString() +
            " " + new Date().toLocaleDateString());
    }
});
```
#### Echo
```js
registerCommand({
    name: "echo",
    description: "Print the given arguments",
    function: async (...args) => {
        var message = args.join(" ");
        await printCommand("echo", message);
    }
});
```
# Typing Effects
The function `typingEffect` can be found at `assets/typing.js`. It can be used to achieve some cool terminal effects. The typing speed can be change at the function parameter.
It is recommended to use `printCommand` and `printCommandWithCallback` at `assets/core.js` instead as it is the wrapper function that simplify usage of `typingEffect`.
#### Delay effect
Delay effect is a built-in feature of `typingEffect` function. It can be used by adding [>X] where X is int number indicating miliseconds. Here is an example:
```js
printCommand('delay-command',
  'This will delay for 1 second [>1000] This is after the delay'
)
```
#### Waiting Effect
Waiting is another feature that allow the typing effect to delay until a callback/process finished. To use the effect, call the function `printCommandWithCallback` and put callbacks that need to be used to a array and pass it to the parameter. Here is the usage:
```js
await printCommandWithCallback(this.name, "Loading...[!0]", [async() => { await new Promise((resolve) => setTimeout(resolve, 10000)); return "Done!" }]);
```
The returning value will be put at where [!x] where x is the index of the callback array is located. In the above example the output would be: `Loading... Done!`
The Waiting Effect also can be interrupted by using Ctrl + C during its effect.



