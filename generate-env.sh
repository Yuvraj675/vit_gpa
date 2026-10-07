#!/bin/bash

rm -rf dist
mkdir -p dist

find . -maxdepth 1 -type f \
  ! -name '.env.js' \
  ! -name 'generate-env.sh' \
  ! -name 'netlify.toml' \
  ! -name '.*' \
  -exec cp {} dist/ \;

cat > dist/supabase-config.js <<EOF
window.SUPABASE_CONFIG = {
  url: '$SUPABASE_URL',
  anonKey: '$SUPABASE_ANON_KEY',
};
EOF
