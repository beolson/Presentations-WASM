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

onmessage = function (input) {
  wasmBrowserInstantiate("./index.wasm").then((wasmModule) => {
    const result = wasmModule.instance.exports.fib(input.data);

    // const result = e.data[0] * e.data[1];

    // const workerResult = result;
    postMessage(result);
  });
};
