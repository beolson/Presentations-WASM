const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
  let response = undefined;

  if (!importObject) {
    importObject = {
      env: {
        abort: () => console.log("Abort!"),
      },
    };
  }

  const fetchAndInstantiateTask = async () => {
    const wasmArrayBuffer = await fetch(wasmModuleUrl).then((response) =>
      response.arrayBuffer()
    );
    return WebAssembly.instantiate(wasmArrayBuffer, importObject);
  };
  response = await fetchAndInstantiateTask();

  return response;
};

var wasmModule = undefined;

const calculateFib = (event) => {
  event.preventDefault();
  const input = document.querySelector("#fibonacci_input").value;
  var result = wasmModule.instance.exports.fib(input);
  document.querySelector("#fibonacci_output").innerText = `result = ${result}`;
};

const sayHello = (event) => {
  event.preventDefault();
  const input = document.querySelector("#hello_world_input").value;
  var result = wasmModule.instance.exports.fib(input);
  document.querySelector(
    "#hello_world_output"
  ).innerText = `result = ${result}`;
};

const calculateFibThread = (event) => {
  event.preventDefault();
  const input = document.querySelector("#fibonacci_thread_input").value;
  var result = wasmModule.instance.exports.fib(input);
  document.querySelector(
    "#fibonacci_thread_output"
  ).innerText = `result = ${result}`;
};

(async () => {
  wasmModule = await wasmBrowserInstantiate("./index.wasm");

  document
    .querySelector("#fibonacci_calculator")
    .addEventListener("submit", calculateFib);

  document.querySelector("#hello_world").addEventListener("submit", sayHello);

  document
    .querySelector("#fibonacci_thread_calculator")
    .addEventListener("submit", calculateFibThread);
})();
