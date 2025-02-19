import { DateTime, Settings } from "luxon";
import { getInput, setOutput } from "@actions/core";
import minimist from "minimist";

export default async function run() {
  try {
    const args = minimist(process.argv.slice(2));
    const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

    // Get inputs
    let format: string | undefined; // can be null
    let dateInput: string | undefined; // can be null
    let timezone: string;
    let locale: string;

    if (isGitHubActions) {
      format = getInput("format") || undefined;
      dateInput = getInput("date") || undefined;
      timezone = getInput("timezone") || "Etc/Utc";
      locale = getInput("locale") || "en-US";
    } else {
      format = args.format || undefined;
      dateInput = args.date || undefined;
      timezone = args.timezone || "Etc/Utc";
      locale = args.locale || "en-US";
    }

    Settings.defaultLocale = locale;

    let dateTime: DateTime;

    // needs some refactoring, but does the job for now
    if (dateInput) {
      dateTime = DateTime.fromISO(dateInput, { zone: timezone });
    } else {
      dateTime = DateTime.utc().setZone(timezone);
    }

    if (!dateTime.isValid) {
      throw new Error(`Invalid timezone or date input: ${dateInput}`);
    }

    // Outputs
    const outDateTime = dateTime.toISO();
    const formattedDateTime = format
      ? dateTime.toFormat(format)
      : dateTime.toISO();

    // CLI Output
    if (!isGitHubActions) {
      return console.log(
        outDateTime == formattedDateTime ? outDateTime : formattedDateTime,
      );
    }

    // Set output
    setOutput("iso8601", outDateTime);
    setOutput("formatted", formattedDateTime);
    // Log it for visibility
    console.log(`ISO8601: ${outDateTime}`);
    console.log(`formatted: ${formattedDateTime}`);
  } catch (error: unknown) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
