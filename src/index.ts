import { setFailed } from "@actions/core";
import run from "./action.js";

try {
  await run();
} catch (error: unknown) {
  if (error instanceof Error) {
    setFailed(error.message);
  } else {
    setFailed(String(error));
  }
}
