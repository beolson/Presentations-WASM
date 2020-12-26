using System;
using Wasmtime;

namespace WasmHost
{
    class Program
    {
        static void Main(string[] args)
        {
            SayHello();
            DoSomeMath();

        }

        #region hello
        private static readonly string helloWat = @"
                    (module 
                        (func $hello (import """" ""hello"")) 
                        (func (export ""run"") (call $hello))
                     )
                    ";

        static void SayHello()
        {
            using var engine = new Engine();

            using var module = Module.FromText(
                engine,
                "hello",
                helloWat
            );

            using var host = new Host(engine);

            using var function = host.DefineFunction(
                "",
                "hello",
                () => Console.WriteLine("Hello from C#!")
            );


            using dynamic instance = host.Instantiate(module);
            instance.run();
        }
        #endregion;


        #region work

        private static readonly string workWat = @"
                    (module 
                        (func (export ""add"") (param i32 i32) (result i32)
                            local.get 0
                            local.get 1
                            i32.add)
                     )";

        static void DoSomeMath()
        {
            using var engine = new Engine();

            using var module = Module.FromText(
                engine,
                "work",
                workWat
            );


            using var host = new Host(engine);

            using dynamic instance = host.Instantiate(module);
            Console.WriteLine(instance.add(2, 2));
        }
        #endregion

    }
}
