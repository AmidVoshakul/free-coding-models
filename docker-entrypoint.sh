#!/bin/sh
set -e

CONFIG_FILE="$HOME/.free-coding-models.json"
LOG_FILE="$HOME/.free-coding-models-daemon.log"
DAEMON_PORT_FILE="$HOME/.free-coding-models-daemon.port"

touch "$CONFIG_FILE" "$LOG_FILE" 2>/dev/null || true
# 📖 Config file holds API keys — keep it 0600 so only the fcm user can read it.
chmod 600 "$CONFIG_FILE" 2>/dev/null || true
chmod 640 "$LOG_FILE" 2>/dev/null || true

if [ ! -s "$CONFIG_FILE" ] || [ "$(cat "$CONFIG_FILE")" = "{}" ]; then
  API_KEYS_JSON=""
  for KEY_VAR in NVIDIA_API_KEY GROQ_API_KEY CEREBRAS_API_KEY GOOGLE_API_KEY \
    CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID DEEPINFRA_API_KEY \
    HUGGINGFACE_API_KEY PERPLEXITY_API_KEY SAMBANOVA_API_KEY \
    FIREWORKS_API_KEY HYPERBOLIC_API_KEY REPLICATE_API_TOKEN \
    CODESTRAL_API_KEY ZAI_API_KEY SCALEWAY_API_KEY DASHSCOPE_API_KEY \
    SILICONFLOW_API_KEY CHUTES_API_KEY TOGETHER_API_KEY IFLOW_API_KEY \
    OPENROUTER_API_KEY OVH_AI_ENDPOINTS_ACCESS_TOKEN MISTRAL_API_KEY \
    GITHUB_TOKEN; do
    VAL=$(eval echo "\$${KEY_VAR}")
    if [ -n "$VAL" ]; then
      PROVIDER=$(echo "$KEY_VAR" | sed 's/_API_KEY$//' | sed 's/_API_TOKEN$//' | sed 's/_ACCESS_TOKEN$//' | sed 's/_ACCOUNT_ID$//' | tr '[:upper:]' '[:lower:]')
      if [ -n "$API_KEYS_JSON" ]; then
        API_KEYS_JSON="${API_KEYS_JSON},"
      fi
      API_KEYS_JSON="${API_KEYS_JSON}\"${PROVIDER}\":\"${VAL}\""
    fi
  done

  cat > "$CONFIG_FILE" << ENDCONFIG
{
  "apiKeys": {${API_KEYS_JSON}},
  "providers": {},
  "settings": {
    "hideUnconfiguredModels": true,
    "favoritesPinnedAndSticky": false,
    "theme": "auto",
    "footerHidden": false,
    "shellEnvEnabled": false,
    "versionAlertsEnabled": false
  },
  "favorites": [],
  "telemetry": { "enabled": false, "consentVersion": 1 },
  "endpointInstalls": [],
  "router": { "enabled": true }
}
ENDCONFIG
  echo "Config generated from environment variables"
else
  echo "Using existing config file"
fi

FCM_HOST="${FCM_HOST:-0.0.0.0}"
FCM_PORT="${FCM_PORT:-19280}"

echo "FCM_HOST: ${FCM_HOST}"
echo "FCM_PORT: ${FCM_PORT}"

echo "${FCM_PORT}" > "${DAEMON_PORT_FILE}"

echo "Starting FCM router daemon..."
# 📖 Use --daemon (foreground) instead of --daemon-bg so the container's
# 📖 lifecycle is tied to the daemon process. If the daemon dies, the
# 📖 container exits and Docker's restart policy can recover it.
cd /app
FCM_HOST="${FCM_HOST}" node bin/free-coding-models.js --daemon 2>&1 | sed "s/^/[daemon] /" &
DAEMON_PID=$!
echo "Daemon started with PID ${DAEMON_PID}"

echo "Waiting for daemon to be ready..."
for i in $(seq 1 30); do
  if wget -qO- "http://127.0.0.1:${FCM_PORT}/health" > /dev/null 2>&1; then
    echo "Daemon is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "WARNING: Daemon did not become ready after 30s, continuing anyway..."
  else
    sleep 1
  fi
done

echo "FCM container is running."
echo "  - Daemon: http://127.0.0.1:${FCM_PORT}/health"
echo "  - Web:    http://${FCM_HOST}:${FCM_PORT}/"

cleanup() {
  echo "Received shutdown signal, stopping daemon..."
  kill -TERM "$DAEMON_PID" 2>/dev/null || true
  wait "$DAEMON_PID" 2>/dev/null || true
  echo "Daemon stopped."
  exit 0
}

trap cleanup TERM INT

# 📖 Wait directly on the daemon PID — if the daemon crashes, the container
# 📖 exits and Docker's restart policy can recover it cleanly.
wait "$DAEMON_PID"
EXIT_CODE=$?
echo "Daemon exited with code ${EXIT_CODE}"
exit "$EXIT_CODE"