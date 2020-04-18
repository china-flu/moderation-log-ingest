async function test() {
  console.log("Hello World 2!");
}

setImmediate(async () => await test());
