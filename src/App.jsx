import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { AnimatePresence } from "framer-motion";

import "./App.css";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import Loader from "./components/Loader";
import {
  Ecommerce,
  Orders,
  Calendar,
  Employees,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorPicker,
  ColorMapping,
  Editor,
} from "./pages";
import { useStateContext } from "./contexts/ContextProvider";

const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        {/* Loader Component */}
        <AnimatePresence>{loading && <Loader />}</AnimatePresence>

        {!loading && (
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <TooltipComponent content="Settings" position="TopCenter">
                <button
                  type="button"
                  style={{ borderRadius: "50%", backgroundColor: currentColor }}
                  className="text-3xl p-3 text-white hover:drop-shadow-xl hover:bg-light-gray"
                  onClick={() => setThemeSettings(true)}
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div>

            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}

            <div
              className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
                activeMenu ? "md:ml-72" : " flex-2"
              }`}
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                <Navbar />
              </div>

              <div>
                {themeSettings && <ThemeSettings />}

                <Routes>
                  <Route path="/" element={<Ecommerce />} />
                  <Route path="/ecommerce" element={<Ecommerce />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/todos" element={<Kanban />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/color-picker" element={<ColorPicker />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/area" element={<Area />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/color-mapping" element={<ColorMapping />} />
                  <Route path="/pyramid" element={<Pyramid />} />
                  <Route path="/stacked" element={<Stacked />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
