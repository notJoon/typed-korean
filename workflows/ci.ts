import { getAction, Job, Workflow } from "../generated/index.js";

const checkout = getAction("actions/checkout@v4");
const setupNode = getAction("actions/setup-node@v4");

const build = new Job("ubuntu-latest")
  .addStep(checkout({ name: "Checkout" }))
  .addStep(
    setupNode({
      name: "Setup Node",
      with: { "node-version": "22", cache: "npm" },
    }),
  )
  .addStep({ name: "Install", run: "npm ci" })
  .addStep({ name: "Codegen", run: "npm run codegen" })
  .addStep({ name: "Verify Generated Files", run: "git diff --exit-code" })
  .addStep({ name: "Typecheck", run: "npm run typecheck" })
  .addStep({ name: "Test", run: "npm test" })
  .addStep({ name: "Format Check", run: "npm run format:check" });

const workflow = new Workflow({
  name: "CI",
  on: { push: { branches: ["**"] }, pull_request: {} },
}).addJob("build", build);

workflow.build("ci");
