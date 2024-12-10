#!/bin/bash

# Exit on any error
set -e

# Step 1: Create a changeset (only if there are new changes)
echo "Creating a changeset..."
npx changeset

# Step 2: Version the package and update package.json
echo "Versioning the package..."
npx changeset version

# Step 3: Build the package (if needed, or modify according to your project)
echo "Building the package..."
npm run build

# Step 4: Commit changes (new version, changelog, etc.)
echo "Committing the changes..."
git add .  # Add the changes (package.json, changelog, etc.)
git commit -m "chore: update version and changelog"  # Commit the changes

# Step 5: Push the changes to GitHub
echo "Pushing changes to GitHub..."
git push origin main  # Replace 'main' with your default branch if different

# Step 6: Publish to npm
echo "Publishing package to npm..."
npm publish --access public  # Publish to npm

# Step 7: Clean up (optional) - you can add any cleanup steps here if needed
echo "Done!"
