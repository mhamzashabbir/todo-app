"use client";
import Task from "@/components/task";
import { useState, useEffect } from "react";
import UserIcon from "../assets/images/profile.jpg";
import Image from "next/image";
import ListIcon from "../assets/icons/ListIcon";
import ChevronIcon from "..//assets/icons/ChevronIcon";
import { CSSTransition } from "react-transition-group";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`)
      .then((response) => {
        console.log("Tasks fetched:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const onTaskUpdate = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    if (updatedTask.isCompleted) {
      toast.success("Task Completed", {
        position: "top-right",
        autoClose: 2000,
        style: {
          background: "#000000",
          color: "#ffffff",
        },
      });
    }
  };

  const onTaskDelete = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
    toast.success("Task Deleted Successfully", {
      position: "top-right",
      autoClose: 2000,
      style: {
        background: "#000000",
        color: "#ffffff",
      },
    });
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      toast.error("Please add the name of task", {
        position: "top-right",
        autoClose: 2000,
        style: {
          background: "#000000",
          color: "#ffffff",
        },
      });
      return;
    }

    const taskData = {
      name: newTask,
      createdAt: new Date(),
      completedAt: null,
      isCompleted: false,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, taskData)
      .then((response) => {
        console.log("Task created:", response.data);
        const newTasks = [...tasks, response.data];
        console.log("New tasks state:", newTasks);
        setTasks(newTasks);
        setNewTask("");
        toast.success("Task Added Successfully", {
          position: "top-right",
          autoClose: 2000,
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        });
      })
      .catch((error) => {
        alert("Error creating task");
      });
  };

  return (
    <>
      <div className="flex-col flex  items-center justify-center h-screen">
      <ToastContainer />
        <div className="flex-col p-1 bg-white bg-opacity-50 rounded-full items-center justify-center">
          <div className="w-24 h-24 relative">
            <Image
              src={UserIcon}
              alt="User Icon"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex items-center bg-white mb-2 rounded-lg justify-between w-[90vw] md:w-[35vw] mt-4">
          <input
            type="text"
            className="focus:border-transparent border-1 p-2 rounded-md ml-4 w-full"
            placeholder=" Add new task"
            value={newTask}
            onChange={handleInputChange}
          />
          <button
            className="p-1 border-1 bg-gray-100 w-10 h-8 mr-1 rounded-lg hover:bg-black hover:text-white text-3xl ml-2 flex items-center justify-center"
            onClick={handleAddTask}
          >
            +
          </button>
        </div>

        <div className="bg-transparent text-black border-[1px] border-gray-300 w-[90vw] md:w-[35vw]  mb-5 flex flex-col items-center justify-between rounded-lg backdrop-blur">
          <div className="flex items-center justify-between w-full">
            <button className="p-2 ">
              {" "}
              <ListIcon width="24" height="24" fill="black" />
            </button>
            <h2 className="text-md">Your Tasks</h2>
            <button
              className="p-2 border-1 "
              onClick={() => setIsVisible(!isVisible)}
            >
              <ChevronIcon
                width="24"
                height="24"
                fill="black"
                style={{
                  transform: `rotate(${isVisible ? 180 : 0}deg)`,
                  transition: "transform 0.3s",
                }}
              />
            </button>
          </div>
        </div>

        <CSSTransition
          in={isVisible}
          timeout={300}
          classNames="roll"
          unmountOnExit
        >
          <div className="overflow-hidden">
            <div className="flex-col items-center w-[90vw] md:w-[35vw] h-52 overflow-auto overflow-x-hidden custom-scrollbar">
              {tasks.length > 0 ? (
                [...tasks].reverse().map((task) => (
                  <Task
                    key={task._id}
                    task={task}
                    onTaskUpdate={onTaskUpdate}
                    onTaskDelete={onTaskDelete}
                  />
                ))
              ) : (
                <div className="bg-white bg-opacity-75 p-2 rounded-lg h-40 flex items-center justify-center">
                  <p>No task today</p>
                </div>

              )}

            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  );
}
