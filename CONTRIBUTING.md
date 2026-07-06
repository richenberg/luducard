# Contributing to Luducard

Thank you for your interest in contributing to **Luducard**! 

Join our community on [Discord](https://discord.gg/U2DEbDqgm) to discuss features, get help, or coordinate development!

Luducard is a community-driven project. As the main application has been built and developed with the support of AI coding assistants, contributions of any kind are welcome.

## Ways to Contribute

1. **Bug Reports & Feature Requests**: Feel free to open an issue in the repository. Please describe the issue/request clearly and include details such as system specs or screenshots if relevant.
2. **Code Contributions**:
   - The application frontend is built using **React**, **Vite**, and **Tailwind CSS v4** (in the `/ui` folder).
   - The backend and desktop bridge are built using **Tauri v2** and **Rust** (in the `/src-tauri` folder).
3. **Localization**: Translating the application interface into other languages is highly appreciated. Language files are stored under the `/lang` directory.

## Development Setup

To run a development version of Luducard locally:

### 1. Install UI Dependencies
Navigate to the frontend directory and install Node.js dependencies (using `pnpm` or your preferred package manager):
```bash
cd ui
pnpm install
```

### 2. Run in Development Mode
Run the Tauri dev server from the root of the project:
```bash
npm run tauri dev
```

### 3. Build Production Executable
To compile a standalone production build (`Luducard.exe`):
```bash
npm run tauri build
```
