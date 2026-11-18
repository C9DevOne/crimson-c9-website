#!/bin/sh
# Swaps the running image of a stage. Called by GitHub Actions over SSH with a restricted key:
#   authorized_keys:  command="/opt/c9-website/deploy/deploy.sh",restrict ssh-ed25519 AAAA… github-deploy-c9-website
#   GitHub runs:      echo "$GITHUB_TOKEN" | ssh root@server "deploy prod sha-<commit>"
# The short-lived job token arrives on stdin and is only used to pull from ghcr.io.
# By hand on the server (e.g. rollback):  echo "$TOKEN" | /opt/c9-website/deploy/deploy.sh deploy prod sha-<commit>
#
# Deliberately does NOT git pull: compose files on the server only change when an admin pulls them,
# so a commit to main can change the app image but never the container setup (mounts, ports, networks).
#
# "staging" is accepted so adding deploy/staging/ later is a directory and a Caddy block, not a
# change to this script — but only deploy/prod exists today, and the .env check below is what
# tells you so.
set -eu

# shellcheck disable=SC2086
set -- ${SSH_ORIGINAL_COMMAND:-$*}
ACTION="${1:-}"; STAGE="${2:-}"; TAG="${3:-}"

fail() { echo "deploy: $*" >&2; exit 1; }
[ "$ACTION" = "deploy" ] || fail "usage: deploy <staging|prod> <sha-…>"
case "$STAGE" in staging|prod) ;; *) fail "unknown stage '$STAGE'" ;; esac
echo "$TAG" | grep -Eq '^sha-[0-9a-f]{7,40}$' || fail "bad tag '$TAG'"

IMAGE=ghcr.io/c9devone/crimson-c9-website
DIR="$(cd "$(dirname "$0")" && pwd)/$STAGE"
[ -d "$DIR" ] || fail "stage '$STAGE' is not set up on this server ($DIR missing)"
cd "$DIR"
[ -f .env ] || fail "$DIR/.env missing"

# One deploy at a time
exec 9>/tmp/c9-website-deploy.lock
flock -w 300 9 || fail "another deploy is still running"

if [ ! -t 0 ]; then
  read -r TOKEN || true
  if [ -n "${TOKEN:-}" ]; then
    printf '%s\n' "$TOKEN" | docker login ghcr.io -u c9devone --password-stdin >/dev/null
    TOKEN=
  fi
fi
docker pull -q "$IMAGE:$TAG" >/dev/null || { docker logout ghcr.io >/dev/null 2>&1; fail "pull of $TAG failed"; }
docker logout ghcr.io >/dev/null 2>&1 || true

PREV=$(sed -n 's/^IMAGE_TAG=//p' .env)
set_tag() { sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$1/" .env; }
set_tag "$TAG"

# --wait blocks until the healthcheck passes, which is the whole safety net: a build that
# starts but can't serve /api/health never replaces the running site.
if docker compose up -d --wait --wait-timeout 120 app; then
  echo "deploy: $STAGE now runs $TAG (was ${PREV:-none})"
else
  echo "deploy: $TAG did not become healthy – rolling back to ${PREV:-nothing}" >&2
  docker compose logs --tail 40 app >&2 || true
  if [ -n "$PREV" ]; then set_tag "$PREV"; docker compose up -d --wait --wait-timeout 120 app || true; fi
  exit 1
fi

# Free disk: drop our images that no container uses any more (other apps' images are untouched)
docker image prune -af --filter "label=org.opencontainers.image.source=https://github.com/C9DevOne/crimson-c9-website" >/dev/null || true
