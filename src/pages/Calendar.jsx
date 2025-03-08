import React from "react";
import { motion } from "framer-motion";
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { scheduleData } from "../data/dummy";
import { Header } from "../components";

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
    transition: { type: "tween", ease: "easeOut", duration: 0.6 },
  },
};

const Calendar = () => {
  return (
    <motion.div
      className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Header */}
      <motion.div variants={childVariants}>
        <Header category="App" title="Calendar" />
      </motion.div>

      {/* Animated Schedule Component */}
      <motion.div variants={childVariants}>
        <ScheduleComponent
          height="650px"
          eventSettings={{ dataSource: scheduleData }}
          selectedDate={new Date(2021, 0, 10)}
        >
          <Inject services={[Day, Week, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
      </motion.div>
    </motion.div>
  );
};

export default Calendar;
