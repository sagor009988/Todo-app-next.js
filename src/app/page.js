"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch("/api/add-todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setNewTodo("");
      fetchTodos();
      openModal("Todo added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/delete-todo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      fetchTodos();
      openModal("Todo deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch("/api/edit-todo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, title: editTitle.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      setEditId(null);
      setEditTitle("");
      fetchTodos();
      openModal("Todo updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[95%] md:w-2/3 mx-auto my-10 border p-1 shadow relative">
      <div className="text-center p-2">
        <p className="font-extrabold font-serif text-2xl">
          Next.js MongoDB Full Stack Todo APP
        </p>
      </div>

      <div className="flex items-center p-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 h-12 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Add Todo"
        />
        <button
          onClick={handleAdd}
          className="mx-1 my-2 py-3 text-white bg-green-700 hover:bg-green-800 rounded-lg px-5"
        >
          Add
        </button>
      </div>

      <div className="border rounded-lg shadow">
        <div className="text-center p-2">
          <p className="text-2xl">Todo List</p>
        </div>

        <div className="p-2">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : todos.length === 0 ? (
            <p className="text-center">No todos found</p>
          ) : (
            todos.map((todo, i) => (
              <div
                key={todo._id}
                className="flex justify-between items-center p-2 border m-2 rounded"
              >
                <div className="flex justify-start w-full">
                  <p className="font-semibold font-serif px-3">{i + 1}</p>
                  {editId === todo._id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-gray-400 rounded px-2"
                    />
                  ) : (
                    <p className="font-semibold font-serif">{todo.title}</p>
                  )}
                </div>

                <div className="flex items-center w-full justify-end">
                  {editId === todo._id ? (
                    <button
                      onClick={handleUpdate}
                      className="mx-1 text-white bg-blue-400 hover:bg-yellow-500 rounded-full px-5 py-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(todo)}
                      className="mx-1 text-white bg-blue-400 hover:bg-yellow-500 rounded-full px-5 py-2"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-white bg-red-700 hover:bg-red-800 rounded-full px-5 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-700 p-5 rounded shadow-lg text-center">
            <p className="text-lg font-semibold">{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;