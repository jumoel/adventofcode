let getInput = () => {
  let argv = Core.Sys.get_argv();
  if (argv |> Array.length != 2) {
    Console.warn("Specify a single input file");
    exit(1);
  };

  let filename = argv[1];
  let exists = Core.Sys.file_exists(filename);

  if (exists == `No) {
    Console.warn("File '" ++ filename ++ "' does not exist.");
    exit(1);
  };

  Core.In_channel.read_all(filename);
};
