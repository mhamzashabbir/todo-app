"use client";

import React, { useState } from "react";
import CheckCircleIcon from "../assets/icons/CheckCircleIcon";
import DotIcon from "../assets/icons/DotIcon";
import { CSSTransition } from "react-transition-group";
import { toast } from 'react-toastify';
import axios from 'axios';


const Task = ({ task ,onTaskUpdate, onTaskDelete}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleComplete = () => {
    const updatedTask = {
      isCompleted: !task.isCompleted,
      completedAt: task.isCompleted ? null : new Date(),
    };

    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`, updatedTask)
      .then(response => {
        onTaskUpdate(response.data);
      })
      .catch(error => {
        toast.error("Error Deleting Task", {
          position: "top-right",
          autoClose: 2000,
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        });
      });
  };

  const handleDelete = () => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`)
      .then(response => {
        onTaskDelete(task._id);
      })
      .catch(error => {
        toast.error("Error Deleting Task", {
          position: "top-right",
          autoClose: 2000,
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        });
      });
  };

  return (
    <div className="bg-white bg-opacity-70 w-[90vw] md:w-[35vw] mb-1 flex flex-col items-center justify-between border-b-2 border-gray-500 rounded-lg">
      <div className="flex items-center justify-between w-full p-2">
        <button className="p-2 " onClick={handleComplete}>
          {task.isCompleted ? (
            <CheckCircleIcon width="24" height="24" fill="green" />
          ) : (
            <CheckCircleIcon
              width="24"
              height="24"
              fill="white"
              stroke="black"
            />
          )}
        </button>
        <h2 className="text-xl">{task.name}</h2>
        <button
          className="p-2 border-1 "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <DotIcon width="24" height="24" fill="black" />
        </button>
      </div>
    <CSSTransition
        in={isExpanded}
        timeout={200}
        classNames="roll"
        unmountOnExit
    >
        <div className="flex flex-col text-left w-[100%] border-t-2 border-gray-300 bg-gray-100">
            <p>{task.details}</p>
            <div className="h-28 p-2 mt-2">
              <p>Created at: {new Date(task.createdAt).toLocaleString()}</p>
              <p>Completed at: {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Not completed yet'}</p>
              <button className="mt-2 p-1 w-[95%] bg-red-200 bg-opacity-75 text-red-600 rounded-lg hover:bg-black" onClick={handleDelete}>
                Delete
              </button>
            </div>
      </div>


    </CSSTransition>
    </div>
  );
};

export default Task;
