# 💠 Titan Compressor (SOTA)

High-performance, cross-platform compression utility powered by the **Ultra-X Engine**. Built with Tauri 2.0 for extreme performance and minimal footprint.

## 🚀 Features
- **LZ-Ultra Engine**: Deep dictionary matching for massive data.
- **Titan-Glass**: Transparent random-access compression (read without extraction).
- **AmitUltra-X**: High-precision arithmetic coding prototype.
- **Cross-Platform**: Native `.exe` for Windows and `.apk` for Android.
- **Glassmorphic UI**: Premium, futuristic interface with real-time stats.

## 🛠️ Automated Build (.exe & .apk)
This project is configured with **GitHub Actions**. To generate your binaries:
1. Push this folder to a GitHub Repository.
2. Go to the **Actions** tab in your repository.
3. Once the workflow finishes, check the **Releases** or **Artifacts** section.

> [!TIP]
> For Android, the workflow will generate an unsigned APK. For a signed production APK, you will need to set up `ANDROID_KEYSTORE` secrets in your GitHub repository.


## 💻 Local Development
If you have Rust and Node.js installed:
```bash
npm install
npm run tauri dev
```

## 📂 Project Structure
- `ui/`: Frontend logic and engines (JS/CSS/HTML).
- `src-tauri/`: Native Rust configuration and backend.
- `.github/workflows/`: CI/CD pipeline for automated builds.
