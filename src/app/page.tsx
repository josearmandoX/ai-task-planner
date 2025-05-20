"use client";
import { useState } from "react";

interface Subtask {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
}

function mockBreakdown(taskText: string): Subtask[] {
  // Simple mock: split by words, assign time
  const steps = [
    `Plan: ${taskText}`,
    `Do: ${taskText}`,
    `Review: ${taskText}`,
  ];
  const times = ["15 min", "30 min", "10 min"];
  return steps.map((text, i) => ({
    id: i + 1,
    text,
    time: times[i] || "10 min",
    completed: false,
  }));
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      subtasks: mockBreakdown(input.trim()),
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mt-8 mb-2">AI Task Planner</h1>
      <p className="mb-8 text-lg text-gray-300">Your productivity, supercharged by AI.</p>
      <div className="flex w-full max-w-xl mb-8">
        <input
          className="flex-1 p-3 rounded-l bg-gray-800 border border-gray-700 outline-none text-white"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <button
          className="px-5 py-3 rounded-r bg-blue-600 hover:bg-blue-700 font-semibold"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <div className="w-full max-w-xl space-y-6">
        {tasks.length === 0 && (
          <div className="text-center text-gray-500">No tasks yet. Add your first task above!</div>
        )}
        {tasks.map(task => (
          <div key={task.id} className="bg-gray-900 rounded-lg p-5 shadow">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mr-3 w-5 h-5 accent-blue-600"
              />
              <span className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</span>
            </div>
            <div className="ml-8 mt-2">
              <div className="text-gray-400 text-sm mb-1">Plan:</div>
              <ul className="space-y-1">
                {task.subtasks.map(st => (
                  <li key={st.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(task.id, st.id)}
                      className="mr-2 w-4 h-4 accent-green-500"
                    />
                    <span className={st.completed ? 'line-through text-gray-500' : ''}>{st.text}</span>
                    <span className="ml-2 text-xs text-gray-400">({st.time})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

