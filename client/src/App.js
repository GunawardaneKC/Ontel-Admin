import React from 'react';
import {BrowserRouter as Router, useLocation} from 'react-router-dom';
import {DataProvider} from './GlobalState';
import Header from './components/headers/Header';
import MainPages from './components/mainpages/Pages';

function Layout() {
  const location = useLocation();
  return (
    <div className="">
      {location.pathname !== '/' && <Header />}
      <MainPages />
      {/* <Footer /> */}
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout />
      </Router>
    </DataProvider>
  );
}

export default App;