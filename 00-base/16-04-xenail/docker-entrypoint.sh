#!/bin/bash -e

# echo "-- coder-zero: $0 start"

if [[ $# > 0 && $1 == "bash" ]]; then
  echo "-- coder-zero: Caller wants bash..."
  /bin/bash
  exit 0
fi

# echo "-- coder-zero: Get the rest of the source"

# Grab the rest of the source (node_modules were handled in the Dockerfile)

# rsync has --progress for verbose, and --quiet for quiet. Use neither for summary
rsync -av -quiet   /src/  /usr/src/nodejs/app                --exclude node_modules

# Run the command
# echo "-- coder-zero: Go!!!!"
node "$@"

