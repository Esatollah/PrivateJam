import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Routes/Homepage"
import Room from "./Routes/Rooms";

const App = () => {
  return (
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/rooms/:rid' element={<Room />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
