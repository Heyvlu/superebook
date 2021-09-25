import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import Detail from './Components/Detail/detail.jsx';

function App(){
  return(
    <div>
      <Router>
      <Link to="/detail">detail</Link>
      <Route path="/detail" component={Detail}/>
      </Router>
    </div>
  )
}

export default App;