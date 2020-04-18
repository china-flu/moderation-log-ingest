async function test() {
  console.log("Hello World!");
}

setImmediate(async () => await test());
