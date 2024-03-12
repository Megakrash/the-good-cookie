#!/bin/bash

# Chemin vers le fichier de suivi des versions
VERSION_FILE="VERSION.txt"

# Vérifier si le fichier de suivi des versions existe
if [ ! -f "$VERSION_FILE" ]; then
    echo "1.0.0" > "$VERSION_FILE"
fi

# Lire la dernière version du fichier de suivi des versions
CURRENT_VERSION=$(tail -n 1 "$VERSION_FILE")

# Extraire les parties majeure, mineure et de correctif de la version actuelle
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Incrémenter le numéro de version mineure
((MINOR++))

# Construire la nouvelle version
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Mettre à jour le fichier de suivi des versions avec la nouvelle version
echo "$NEW_VERSION" >> "$VERSION_FILE"

# Afficher la nouvelle version générée
echo "$NEW_VERSION"
