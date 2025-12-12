#!/usr/bin/env bash
set -e

echo "== Build frontend =="
cd frontend
npm ci
npm run build

echo "== Install backend deps =="
cd ../backend
npm ci

echo "== Done =="
