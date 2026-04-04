import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Resources from './pages/Resources'
import Pomodoro from './pages/Pomodoro'
import Adkar from './pages/Adkar'
import Quiz from './pages/Quiz'
import Teachers from './pages/Teachers'
import Contributors from './pages/Contributors'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="resources" element={<Resources />} />
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="adkar" element={<Adkar />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="contributors" element={<Contributors />} />
            </Route>
        </Routes>
    )
}

export default App