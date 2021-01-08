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

const calculateFib = async (event) => {
  event.preventDefault();

  const wasmModule = await wasmBrowserInstantiate("./index.wasm");

  const input = document.querySelector("#fibonacci_input").value;
  const result = wasmModule.instance.exports.fib(input);
  document.querySelector("#fibonacci_output").innerText = `result = ${result}`;
};

const sayHello = async (event) => {
  event.preventDefault();

  const wasmArrayBuffer = await fetch("./index.wasm").then((response) =>
    response.arrayBuffer()
  );

  const wasmModule = await loader.instantiate(wasmArrayBuffer);

  const { __newString, __getString, __retain, __release } = wasmModule.exports;

  const input = document.querySelector("#hello_world_input").value;

  let inputPtr = __retain(__newString(input));

  var resultPtr = wasmModule.instance.exports.sayHello(inputPtr);

  let result = __getString(resultPtr);

  __release(inputPtr);
  __release(resultPtr);

  document.querySelector(
    "#hello_world_output"
  ).innerText = `result = ${result}`;
};

const myWorker = new Worker("worker.js");

myWorker.onmessage = function (e) {
  document.querySelector(
    "#fibonacci_thread_output"
  ).innerText = `result = ${e.data}`;
};

const calculateFibThread = (event) => {
  event.preventDefault();
  const input = document.querySelector("#fibonacci_thread_input").value;
  myWorker.postMessage(input);
};

(async () => {
  document
    .querySelector("#fibonacci_calculator")
    .addEventListener("submit", calculateFib);

  document.querySelector("#hello_world").addEventListener("submit", sayHello);

  document
    .querySelector("#fibonacci_thread_calculator")
    .addEventListener("submit", calculateFibThread);
})();
