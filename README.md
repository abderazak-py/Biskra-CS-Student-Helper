<p align="center">
  <img src="icon.png" alt="Biskra CS Student Helper Logo" width="128">
  <h1 align="center">Biskra CS Student Helper</h1>
  <p align="center">
    A modern Progressive Web App (PWA) built with React to assist Computer Science students at the University of Biskra with their academic needs.
    <br />
    <a href="https://github.com/abderazak-py/Biskra-CS-Student-Helper/issues">Report Bug</a>
    ·
    <a href="https://github.com/abderazak-py/Biskra-CS-Student-Helper/issues">Request Feature</a>
  </p>
</p>

---

## About The Project

This project is a comprehensive toolkit for Computer Science students at Biskra University. It started as a simple semester average calculator and has grown to include several modules to help students with their studies and daily productivity. 

The application has been completely rewritten in **React** with **Vite** for a modern, fast, and maintainable codebase. Being a Progressive Web App, it is installable on any device and works entirely offline.

---

## 🛠️ Built With

- [React 18](https://react.dev/) - Modern UI library
- [Vite 5](https://vitejs.dev/) - Next generation frontend tooling
- [React Router DOM 6](https://reactrouter.com/) - Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Vite PWA](https://vite-pwa-org.netlify.app/) - PWA plugin with Workbox

---

## ✨ Features

*   📱 **Progressive Web App**: Installable on desktop and mobile devices for a native app-like experience.
*   🔌 **Full Offline Support**: Use all features without an internet connection.
*   💾 **Local Data Persistence**: All your data is saved securely on your device using localStorage.
*   📊 **Semester Calculators**: Specialized calculators for semesters S1 through S6, with accurate module coefficients.
*   🍅 **Pomodoro Timer**: A built-in Pomodoro timer to enhance focus and manage study sessions.
*   ❓ **CS Quiz**: Test your knowledge with a fun quiz covering various computer science topics.
*   📿 **Adkar Counter**: A digital counter for daily Adkar.
*   📚 **Resources**: Curated learning resources for CS students.
*   👨‍🏫 **Teachers**: Directory of CS department teachers.
*   🤝 **Contributors**: Recognition page for project contributors.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/abderazak-py/Biskra-CS-Student-Helper.git
   ```

2. **Navigate to the react-app directory**
   ```sh
   cd react-app
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```sh
npm run preview
```

---

## 📁 Project Structure

```
react-app/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Layout.jsx    # Main layout with navigation
│   ├── data/             # Static data files
│   │   ├── adkar.js      # Adkar data
│   │   ├── modules.js    # Semester modules & coefficients
│   │   ├── quiz.js       # Quiz questions
│   │   ├── resources.js  # Learning resources
│   │   └── teachers.js   # Teachers directory
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Calculator.jsx
│   │   ├── Pomodoro.jsx
│   │   ├── Quiz.jsx
│   │   ├── Adkar.jsx
│   │   ├── Resources.jsx
│   │   ├── Teachers.jsx
│   │   └── Contributors.jsx
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js        # Vite + PWA configuration
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔧 Usage

The application is designed to be intuitive and easy to use. Upon opening, you will be greeted with the main dashboard. From there, you can navigate to the different modules:

*   **Calculator**: Select your semester and enter your grades to calculate your average.
*   **Pomodoro**: Start the timer and get to work!
*   **Quiz**: Choose a category and test your knowledge.
*   **Adkar**: Use the counter for your daily remembrances.
*   **Resources**: Browse curated learning materials.
*   **Teachers**: View the CS department teachers directory.

To install the app, look for the "Install" button in your browser's address bar or menu.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Don't forget to give the project a star! Thanks again!

---

## 📝 License

This project is free to use for all Biskra University CS students. For more details, see the `LICENSE` file (if one is added).

---

## 👥 Credits

This project was made possible by:

*   **Abderazak Achour** - [GitHub](https://github.com/abderazak-py/)
*   **Farhat** - [GitHub](https://github.com/Farhat-141)
*   **Taha** - [GitHub](https://github.com/t1mtr9)
*   **Ibtihal** - [GitHub](https://github.com/ibtihal0666)

---

## 📮 Support

If you encounter any issues or have questions, please:
1. Open a GitHub issue.
2. Contact the developers directly.

---

**Happy Studying! 🎓📊**