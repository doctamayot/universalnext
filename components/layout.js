import Navigation from "../components/Navigation";
// import styles from "../styles/sass/main.module.scss";
// import Switch from "react-input-switch";

// import { useContext } from "react";
// import { Store } from "../utils/Store.js";
import Footer from "./Footer";

const Layout = ({ children }) => {
  // const { state } = useContext(Store);
  // const { darkMode } = state;

  // const darkModeChangeHandler = () => {
  //   dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
  // };

  return (
    <div>
      {/* <div className={styles.switch}>
        <p>Darkmode</p>
        <Switch value={darkMode} onChange={darkModeChangeHandler} />
      </div> */}

      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
