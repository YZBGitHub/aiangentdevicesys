import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HardwareAgent from './pages/HardwareAgent';
import AILab from './pages/AILab';
import OperationReport from './pages/OperationReport';
import OperationDashboard from './pages/OperationDashboard';
import FAQ from './pages/FAQ';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hardware-agent" element={<HardwareAgent />} />
          <Route path="ai-lab" element={<AILab />} />
          <Route path="operation-report" element={<OperationReport />} />
          <Route path="operation-dashboard" element={<OperationDashboard />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </Router>
  );
}
