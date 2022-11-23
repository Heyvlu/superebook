import React, {Suspense} from "react";
import './App.scss';
import routes from './routes';
import {useRoutes} from "react-router-dom";
import Loading from "./components/Loading";
import Confirm from "./components/Confirm";


function App() {
    const element=useRoutes(routes);
    console.log(process.env)
  return (
    <div className="App">
        <Suspense fallback={<Loading/>}>{element}</Suspense>
        <Confirm/>
    </div>
  );
}

export default App;
