import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SideBar from "./containers/sideBar";

function App() {
    return (
        <BrowserRouter>
            <SideBar/>
        </BrowserRouter>
    );
}

export default App;
