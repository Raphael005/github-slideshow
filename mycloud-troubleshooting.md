# myCloud Desktop Troubleshooting

## Restarting the Application

The myCloud Desktop application can be restarted using the built-in restarter script.

### Correct Command

```zsh
"/Applications/myCloud Desktop/app/restarter.sh"
```

> **Important:** The path must be quoted because it contains a space (`myCloud Desktop`).

### Common Error

Running the command without quotes will fail:

```zsh
# ❌ Incorrect - will fail with "no such file or directory"
/Applications/myCloud Desktop/app/restarter.sh

# ✅ Correct - path is quoted
"/Applications/myCloud Desktop/app/restarter.sh"
```

### Verifying the Restart

To confirm the application restarted successfully:

```zsh
pgrep -fl myCloud
```

A successful restart will show processes like:
- `myCloud Desktop.app/Contents/MacOS/JavaApplicationStub` (main application)
- `finderExtension.appex` (Finder integration)
