import React from 'react';
import './App.css';
import ChartComponent from './components/ChartComponent';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Charting Application</h1>
            </header>
            <ChartComponent />
        </div>
    );
};

export default App;
