/*
very rough tests that get the job done
feel free to improve!
*/

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { Settings } from "luxon";
import run from "../src/action";
import * as core from "@actions/core";

// mocks
jest.mock("@actions/core");
const getInputMock = core.getInput as jest.MockedFunction<typeof core.getInput>;

describe("run", () => {
  let originalArgv: string[];
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalArgv = process.argv;
    originalEnv = { ...process.env };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
  });

  test("should handle invalid date input gracefully", async () => {
    process.env.GITHUB_ACTIONS = "true";
    getInputMock.mockImplementation((name: string) => {
      if (name === "date") return "invalid-date";
      return "";
    });

    await expect(run()).rejects.toThrow(
      "Invalid timezone or date input: invalid-date",
    );
  });

  test("should handle missing date and default to UTC", async () => {
    process.env.GITHUB_ACTIONS = "true";

    getInputMock.mockImplementation(() => "");
    await run();

    expect(core.setOutput).toHaveBeenCalledWith(
      "iso8601",
      expect.stringContaining("+00:00"),
    );
    expect(core.setOutput).toHaveBeenCalledWith(
      "formatted",
      expect.any(String),
    );
  });

  test("should correctly format date when 'format' input is provided", async () => {
    process.env.GITHUB_ACTIONS = "true";
    // Provide a mapping so that each input name returns the correct value
    getInputMock.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        format: "yyyy-MM-dd HH:mm:ss",
        date: "2025-02-19T10:00:00",
        timezone: "Etc/Utc",
        locale: "",
      };
      return inputs[name] || "";
    });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith(
      "formatted",
      "2025-02-19 10:00:00",
    );
  });

  test("should handle timezone input", async () => {
    process.env.GITHUB_ACTIONS = "true";

    //  we only care about the timezone input
    getInputMock.mockImplementation((name: string) => {
      if (name === "timezone") return "America/New_York";
      return "";
    });

    getInputMock.mockImplementationOnce(() => "2025-02-19T10:00:00");

    await run();
    expect(core.setOutput).toHaveBeenCalledWith(
      "iso8601",
      expect.stringContaining("2025-02-19"),
    );
  });

  test("should fallback to default locale 'en-US' if locale is not provided", async () => {
    process.env.GITHUB_ACTIONS = "true";
    getInputMock.mockImplementation((name: string) => {
      if (name === "locale") return ""; // Simulate missing locale input
      return "";
    });

    await run();

    expect(Settings.defaultLocale).toBe("en-US");
  });

  test("should correctly handle command-line arguments in local environment", async () => {
    process.env.GITHUB_ACTIONS = "false";
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    process.argv = [
      "node",
      "script.js",
      "--format",
      "yyyy-MM-dd",
      "--date",
      "2025-02-19T10:00:00",
      "--timezone",
      "Asia/Tokyo",
      "--locale",
      "ja-JP",
    ];

    await run();

    // With a format of "yyyy-MM-dd", formattedDateTime becomes "2025-02-19".
    expect(logSpy).toHaveBeenCalledWith("2025-02-19");
    logSpy.mockRestore();
  });

  test("should handle default values in local environment", async () => {
    process.env.GITHUB_ACTIONS = "false";
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    process.argv = ["node", "script.js"];

    await run();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("+00:00"));
    logSpy.mockRestore();
  });
});
