# DateTime Action

Simple Action using Luxon to pull the time in a workflow.

[![GitHub Tag](https://img.shields.io/github/v/tag/hudsonm62/datetime-action?label=latest)](https://github.com/hudsonm62/datetime-action/releases) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/hudsonm62/datetime-action/ci.yml?label=%F0%9F%A7%AA%20%20CI)](https://github.com/hudsonm62/datetime-action/actions/workflows/ci.yml) ![GitHub top language](https://img.shields.io/github/languages/top/hudsonm62/datetime-action?link=%20)

## Basic Usage

- See [Inputs / Outputs](#inputs--outputs)

### Get UTC Time

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime

- run: echo {{ $steps.datetime.outputs.iso8601 }}
# 2025-02-18T05:45:17.055+00:00
```

### Format a Date

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime
  with:
    date: "2025-01-01T00:00Z"
    format: yyyy-MM-dd

- run: echo {{ $steps.datetime.outputs.formatted }}
# Jan 1, 2025, 12:00 AM
```

### Get Time in Timezone & Format

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime
  with:
    timezone: Australia/Sydney
    format: yyyy-MM-dd

- run: echo {{ $steps.datetime.outputs.formatted }}
# 2025-12-31
```

### Locale & Luxon Macro

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime
  with:
    locale: ja-JP
    format: ff

- run: echo {{ $steps.datetime.outputs.formatted }}
# 2025年2月18日 16:45
```

### Convert to UTC

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime
  with:
    date: "2025-01-01T00:00:00+09:00"
    format: ff

- run: echo {{ $steps.datetime.outputs.formatted }}
# Dec 31, 2024, 3:00 PM
```

### Convert to a different timezone

```yaml
- uses: hudsonm62/datetime-action@v1
  id: datetime
  with:
    date: "2025-01-01T00:00:00+09:00"
    timezone: Australia/Sydney
    format: ff

- run: echo {{ $steps.datetime.outputs.formatted }}
# Jan 1, 2025, 2:00 AM
```

- [See it in Action!](https://github.com/hudsonm62/datetime-action/actions/workflows/ci.yml) 🥁

## Inputs / Outputs

### Inputs

| Name       | Description                                                                            | Default   |
| ---------- | -------------------------------------------------------------------------------------- | --------- |
| `format`   | Custom format for output (e.g., `MMMM dd, yyyy`). Defaults to ISO8601 if not provided. |           |
| `date`     | ISO8601 date to use instead of the Action runtime.                                     |           |
| `timezone` | IANA Tz Identifier for timezone to use or convert to                                   | `Etc/Utc` |
| `locale`   | Locale for formatting - See <https://moment.github.io/luxon/#/intl?id=default-locale>  | `en-US`   |

### Outputs

| Name        | Description                            |
| ----------- | -------------------------------------- |
| `iso8601`   | ISO8601 of the final time              |
| `formatted` | Formatted timecode from `format` input |

## Contributing

```bash
npm ci

npm test
npm run package
```

You can also use `dist/index.js` as a dirty little CLI tool - pass in inputs as arguments:

```bash
node . --timezone Asia/Tokyo --locale ja-jp --format ff --date "2025-01-01T00:00Z"
# 2025年1月01日 09:00
```
