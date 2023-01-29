import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Task, url } from "../pages";
import axios from "axios";

interface Props {
  tasks: Task[];
  setTasks: any;
}

const CompleteAll: React.FC<Props> = ({ tasks, setTasks }) => {
  const determineDefaultValue = () => {
    if (tasks.every((x) => x.completed === true)) {
      return true;
    } else if (tasks.every((x) => x.completed === false)) {
      return false;
    } else if (tasks.find((x) => x.completed === true)) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    setChecked(determineDefaultValue());
  }, [tasks]);
  const [checked, setChecked]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    const newTasks = tasks.map((task) => {
      axios.put(url + "/" + task._id, {
        completed: e.target.checked,
      });
      return { ...task, completed: e.target.checked };
    });
    setTasks(newTasks);
  };

  return (
    <div>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <label>{checked ? "Uncheck All" : "Complete all"}</label>
    </div>
  );
};

export default CompleteAll;
