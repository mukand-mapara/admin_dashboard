import React, { useState, useCallback } from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
} from "@syncfusion/ej2-react-grids";
import { ordersData, ordersGrid } from "../data/dummy";
import { Header } from "../components";
import { motion } from "framer-motion";

// Container variants for a smooth entrance with staggered children
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.8,
      staggerChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.6 },
  },
};

const Orders = () => {
  const [searchText, setSearchText] = useState("");
  const [gridData, setGridData] = useState(ordersData);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setGridData(ordersData);
      return;
    }

    // Filter the data based on all searchable columns
    const filteredData = ordersData.filter((item) => {
      return ordersGrid.some((column) => {
        const fieldValue = item[column.field]?.toString().toLowerCase();
        return fieldValue?.includes(searchValue.toLowerCase());
      });
    });

    setGridData(filteredData);
  }, []);

  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <motion.div
      className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <Header category="Page" title="Orders" />
      </motion.div>

      <motion.div variants={childVariants} className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search orders..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </motion.div>

      <motion.div variants={childVariants}>
        <GridComponent
          dataSource={gridData}
          width="auto"
          allowPaging
          allowSorting
          pageSettings={{ pageCount: 5 }}
          editSettings={editing}
        >
          <ColumnsDirective>
            {ordersGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Page]} />
        </GridComponent>
      </motion.div>
    </motion.div>
  );
};

export default Orders;
