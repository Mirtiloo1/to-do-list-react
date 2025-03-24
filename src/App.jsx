import './App.css'
import TopPage from './components/TopPage';
import Content from './components/Content'

function App() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col gap-y-10">
      <TopPage />
      <Content />
    </div>

  );
}

export default App;
