import React from "react";
import { 
  GridComponent, 
  Inject, 
  ColumnsDirective, 
  ColumnDirective, 
  Search, 
  Page 
} from "@syncfusion/ej2-react-grids";
import { employeesData, employeesGrid } from "../data/dummy";
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

// Child variants for individual elements
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.6 } 
  },
};

const Employees = () => {
  const toolbarOptions = ["Search"];
  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <motion.div
      className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Header */}
      <motion.div variants={childVariants}>
        <Header category="Page" title="Employees" />
      </motion.div>

      {/* Animated Grid Component */}
      <motion.div variants={childVariants}>
        <GridComponent
          dataSource={employeesData}
          width="auto"
          allowPaging
          allowSorting
          pageSettings={{ pageCount: 5 }}
          editSettings={editing}
          toolbar={toolbarOptions}
        >
          <ColumnsDirective>
            {employeesGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Page]} />
        </GridComponent>
      </motion.div>
    </motion.div>
  );
};

export default Employees;
