import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../images/product9.jpg";

const Ecommerce = () => {
  const reportRef = useRef();
  const { currentColor } = useStateContext();
  const [dynamicEarnings, setDynamicEarnings] = useState(
    earningData.map((item) => ({
      ...item,
      currentAmount: parseInt(item.amount.replace(/,/g, ""), 10),
    }))
  );

  // New dynamic states for Revenue Updates
  const [dynamicBudget, setDynamicBudget] = useState({
    currentAmount: 81948,
    percentage: "23%",
  });

  const [dynamicExpense, setDynamicExpense] = useState({
    currentAmount: 48487,
    percentage: "12%",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicEarnings((prev) =>
        prev.map((item) => {
          const changePercent = Math.random() * 0.2 - 0.1;
          const newAmount =
            item.currentAmount + item.currentAmount * changePercent;
          const percentageChange = Math.round(changePercent * 100);

          return {
            ...item,
            currentAmount: newAmount,
            amount: Math.round(newAmount).toLocaleString(),
            percentage: `${
              percentageChange >= 0 ? "+" : ""
            }${percentageChange}%`,
          };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update Earnings (existing code)
      setDynamicEarnings((prev) =>
        prev.map((item) => {
          const changePercent = Math.random() * 0.2 - 0.1;
          const newAmount =
            item.currentAmount + item.currentAmount * changePercent;
          const percentageChange = Math.round(changePercent * 100);
          return {
            ...item,
            currentAmount: newAmount,
            amount: Math.round(newAmount).toLocaleString(),
            percentage: `${
              percentageChange >= 0 ? "+" : ""
            }${percentageChange}%`,
          };
        })
      );

      // Update Budget
      setDynamicBudget((prev) => {
        const changePercent = Math.random() * 0.1 - 0.05;
        const newAmount =
          prev.currentAmount + prev.currentAmount * changePercent;
        const percentageChange = Math.round(changePercent * 100);
        return {
          currentAmount: newAmount,
          percentage: `${percentageChange >= 0 ? "+" : ""}${percentageChange}%`,
        };
      });

      // Update Expense
      setDynamicExpense((prev) => {
        const changePercent = Math.random() * 0.1 - 0.05;
        const newAmount =
          prev.currentAmount + prev.currentAmount * changePercent;
        const percentageChange = Math.round(changePercent * 100);
        return {
          currentAmount: newAmount,
          percentage: `${percentageChange >= 0 ? "+" : ""}${percentageChange}%`,
        };
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const input = reportRef.current;
      const canvas = await html2canvas(input, { scale: 1.5 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save("Mukand.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const totalEarnings = dynamicEarnings.reduce(
    (total, item) => total + item.currentAmount,
    0
  );

  return (
    <div className="mt-12">
      {/* Earnings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap lg:flex-nowrap justify-center"
      >
        <motion.div
          className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-left"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Earnings</p>
              <p className="text-2xl">
                ${Math.round(totalEarnings).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
              size="md"
            />
          </div>
        </motion.div>

        {/* Earning Data Cards */}
        <motion.div
          className="flex m-3 flex-wrap justify-center gap-2 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {dynamicEarnings.map((item) => (
            <motion.div
              key={item.title}
              className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg w-full m-2 md:w-56 p-4 pt-9 rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <button
                type="button"
                style={{
                  color: item.iconColor,
                  backgroundColor: item.iconBg,
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span
                  className={`text-sm ${
                    item.percentage.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  } ml-2`}
                >
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm mt-1">{item.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Revenue Updates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-10 flex-wrap justify-center"
      >
        <motion.div
          className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl w-full md:w-760"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>

          <div
            className="flex mt-10 gap-10 flex-wrap justify-center"
            ref={reportRef}
          >
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">
                    ${Math.round(dynamicBudget.currentAmount).toLocaleString()}
                  </span>
                  <span
                    className={`p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white ${
                      dynamicBudget.percentage.startsWith("+")
                        ? "bg-green-400"
                        : "bg-red-400"
                    } ml-3 text-xs`}
                  >
                    {dynamicBudget.percentage}
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Budget</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">
                  ${Math.round(dynamicExpense.currentAmount).toLocaleString()}
                </p>
                <p className="text-gray-500 mt-1">Expense</p>
                <span
                  className={`p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white ${
                    dynamicExpense.percentage.startsWith("+")
                      ? "bg-green-400"
                      : "bg-red-400"
                  } ml-3 text-xs`}
                >
                  {dynamicExpense.percentage}
                </span>
              </div>

              <div className="mt-5">
                <SparkLine
                  currentColor={currentColor}
                  id="line-sparkline"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                />
              </div>
              <div className="mt-10">
                <motion.button
                  onClick={downloadPDF}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    backgroundColor: currentColor,
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Download Report
                </motion.button>
              </div>
            </div>

            <div>
              <Stacked width="320px" height="360px" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Ecommerce;
