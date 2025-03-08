import React from "react";
import { motion } from "framer-motion";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";

import { kanbanData, kanbanGrid } from "../data/dummy";
import { Header } from "../components";

// Container animation for a smooth entrance
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

// Animation for child components
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.6 },
  },
};

const Kanban = () => (
  <motion.div
    className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Animated Header */}
    <motion.div variants={childVariants}>
      <Header category="App" title="Todos" />
    </motion.div>

    {/* Animated Kanban Board */}
    <motion.div variants={childVariants}>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={kanbanData}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
      >
        <ColumnsDirective>
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </motion.div>
  </motion.div>
);

export default Kanban;
