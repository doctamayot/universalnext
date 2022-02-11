import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Navigation = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={showSidebar} closeSidebar={closeSidebar} />
    </>
  );
};

export default Navigation;
