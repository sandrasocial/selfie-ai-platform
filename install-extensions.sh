#!/bin/bash

# VS Code Extensions Installation Script
echo "Installing VS Code extensions..."

extensions=(
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "bradlc.vscode-tailwindcss-intellisense"
    "infeng.vscode-react-typescript"
    "formulahendry.auto-rename-tag"
    "christian-kohler.path-intellisense"
    "pulkitgangwar.nextjs-snippets"
    "dsznajder.es7-react-js-snippets"
    "burkeholland.simple-react-snippets"
    "eamodio.gitlens"
    "donjayamanne.githistory"
    "aaron-bond.better-comments"
    "CoenraadS.bracket-pair-colorizer-2"
    "oderwat.indent-rainbow"
    "Gruntfuggly.todo-tree"
    "GitHub.copilot"
    "GitHub.copilot-chat"
    "rangav.vscode-thunder-client"
    "Prisma.prisma"
    "cweijan.vscode-database-client2"
    "PKief.material-icon-theme"
    "zhuangtongfa.material-theme"
)

for extension in "${extensions[@]}"; do
    echo "Installing $extension..."
    code --install-extension "$extension"
    if [ $? -eq 0 ]; then
        echo "✅ Successfully installed $extension"
    else
        echo "❌ Failed to install $extension"
    fi
done

echo "Extension installation complete!"
