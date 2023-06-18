# Marlin - Frontend

## ⚒️ Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

> NOTE : use node version >= 16.16.0

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## 🧑‍💻 Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## 🏗️ Project Structure

This is a top-level overview of how this project is structured.

```bash
├── src/
│   ├── lib/
│   ├── logos/
│   ├── routes/
│   ├── app.css
│   ├── app.d.ts
│   └── app.html
├── static/
├── .env.example
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── svelte.config.js
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

- `src/`: This is the heart of the project, inside it we have the `lib/` and the `routes/` folder. All routing, utils, components, pages and etc. reside in here.
- `static/`: Any static assets like images and logos.
- `.env.example`: contains an example `.env` file that needs to be added to ensure that the project runs runs correctly.
- `.eslintignore`: Files and folders to ignore while linting.
- `.eslintrc.cjs`: Configuration file for ESLint.
- `.gitignore`: Git files and folders to ignore.
- `.npmrc`: contains config for customizing npm behaviour.
- `.prettierignore`: contains glob patterns to ignore files/directories in your working directory while formatting code.
- `.prettierrc`: Configuration file for customisizing code formatting rules for prettier.
- `package-lock.json`: Dependancy tree generated based on `package.json`.
- `package.json`: Project dependencies and scripts.
- `postcss.config.cjs`: Configuration file for postcss.
- `svelte.config.js`: Configuration file for svelte and sveltekit.
- `tailwind.config.cjs`: Configuration file for tailwind css.
- `tsconfig.json`: Configuration file containing typechecking rules for TypeScript.
- `vite.config.ts`: Configuration file for vite.

> Check out other `README`'s inside specific folders for more details.

## 📦 Dependencies

Here are some of the main dependancies of the projects:

- [ethers](https://docs.ethers.org/v5/): A complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.
- [daisyui](https://daisyui.com/docs/install/): A component library for tailwind css.
- [svelte-awesome](https://docs.robbrazier.com/svelte-awesome/icons): Icon library for svelte.
- [web3onboard](https://onboard.blocknative.com/docs/overview/introduction): A library for connecting and managing web3 wallets for dapps.

> For a full list of dependencies, check out the `package.json` file.
