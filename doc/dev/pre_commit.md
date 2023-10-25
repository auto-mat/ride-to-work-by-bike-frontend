Install and use pre-commit hook JS lib with `yarn add -D husky, lint-staged`

- create husky hook config file ./.husky/pre-commit with
  `yarn husky add .husky/pre-commit "yarn lint-staged"`

Manual installation with `npx husky install` or to automatically have
Git hooks enabled after install, edit package.json.

```json
{
  "private": true, // ← your package is private, you only need postinstall
  "scripts": {
    "postinstall": "husky install"
  }
}
```

https://typicode.github.io/husky/getting-started.html#manual

- lint-staged config file ./.lintstagedrc

```json
{
  "*.{js,ts,vue}": [
    "eslint --fix",
    "prettier --ignore-path .gitignore --write"
  ],
  "*.{scss,html,md,json}": ["prettier --ignore-path .gitignore --write"]
}
```

https://github.com/lint-staged/lint-staged#configuration
