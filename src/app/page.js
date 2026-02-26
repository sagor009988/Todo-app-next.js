"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
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

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/add-todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title }),
      });

      if (!res.ok) throw new Error("Failed to add");

      reset();
      fetchTodos();
      showToastMessage("Todo added successfully!", "success");
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

      if (!res.ok) throw new Error("Failed to delete");

      fetchTodos();
      showToastMessage("Todo deleted successfully!", "error");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setValue("editTitle", todo.title);
  };

  const handleUpdate = async (data) => {
    try {
      const res = await fetch("/api/edit-todo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title: data.editTitle,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEditId(null);
      fetchTodos();
      showToastMessage("Todo updated successfully!", "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[95%] md:w-2/3 mx-auto my-10 border p-4 shadow relative">
      <div className="text-center p-2">
        <p className="font-extrabold text-2xl">
          Next.js MongoDB Full Stack Todo APP
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-2">
        <input
          type="text"
          {...register("title", { required: "Todo is required" })}
          className="border w-full p-2 rounded"
          placeholder="Add Todo"
        />
        <button
          type="submit"
          className="mx-2 py-2 text-white bg-green-600 rounded px-5"
        >
          Add
        </button>
      </form>

      {errors.title && (
        <p className="text-red-500 text-sm px-2">{errors.title.message}</p>
      )}

      <div className="border rounded-lg shadow mt-4">
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
                <div className="flex w-full items-center">
                  <p className="px-3">{i + 1}</p>

                  {editId === todo._id ? (
                    <form
                      onSubmit={handleSubmit(handleUpdate)}
                      className="flex w-full"
                    >
                      <input
                        {...register("editTitle", {
                          required: "Title is required",
                        })}
                        className="border rounded px-2 w-full"
                      />
                      <button
                        type="submit"
                        className="mx-2 bg-blue-500 text-white px-4 rounded"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <p className="font-semibold">{todo.title}</p>
                  )}
                </div>

                {editId !== todo._id && (
                  <div className="flex">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="mx-1 bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`px-4 py-2 rounded shadow-lg text-white font-semibold ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;