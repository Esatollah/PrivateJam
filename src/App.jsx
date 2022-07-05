import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Routes/Homepage"

const App = () => {
  return (
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='room/:rid' element={<Homepage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
