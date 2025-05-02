const { useState } = React;

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [editingDeadline, setEditingDeadline] = useState("");

    const addTask = () => {
        if (newTask.trim() === "" || newDeadline.trim() === "") return;

        const task = {
            id: tasks.length + 1,
            content: newTask,
            deadline: newDeadline,
        };
        setTasks([...tasks, task]);
        setNewTask("");
        setNewDeadline("");
    };

    //edycja zadań
    const startEditing = (task) => {
        setEditingTask(task);
        setEditingContent(task.content);
        setEditingDeadline(task.deadline);
    }

    //zapis edytowanych zadań
    const saveEdit = () => {
        if (!editingTask) return;

        const updatedTasks = tasks.map(task => {
            if (task.id === editingTask.id) {
                return {
                    ...task,
                    content: editingContent,
                    deadline: editingDeadline,
                };
            }
            return task;
        });

        setTasks(updatedTasks);
        setEditingTask(null);
        setEditingContent("");
        setEditingDeadline("");
    }
    //zapis danych do pliku json
    const saveTasks = () => {
        const formattedTasks = tasks.map((task, index) => ({
            id: index + 1,
            content: task.content,
            deadline: task.deadline,
        }))
        const blob = new Blob([JSON.stringify(formattedTasks, null, 2)], { type: "application/json" })
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tasks.json";
        link.click();
    }
    //Import z pliku JSON
    const loadTasks = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedTasks = JSON.parse(e.target.result);
                setTasks(loadedTasks);
            } catch (error) {
                alert("Błąd podczas wczytywania pliku: " + error.message);
            }
        };
        reader.readAsText(file)
    }
    //Usuwanie zadań
    const removeTask = (TaskToRemove) => {
        const updatedTasks = tasks
            .filter((task) => task.id !== TaskToRemove.id)
            .map((task, index) => ({
                id: index + 1,
                content: task.content,
                deadline: task.deadline
            }));
        setTasks(updatedTasks);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="max-w-2xl w-full p-4 sm:p-6 bg-white shadow-md rounded-xl space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">📝 Lista zadań</h1>
      
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <input
                type="file"
                accept="application/json"
                onChange={loadTasks}
                className="text-sm text-gray-600"
              />
              <button
                onClick={saveTasks}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
              >
                💾 Zapisz zadania
              </button>
            </div>
      
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nowe zadanie"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={addTask}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
              >
                ➕ Dodaj
              </button>
            </div>
      
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Zadania do zrobienia: <span className="text-blue-600">{tasks.length}</span>
              </h3>
      
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded p-3 shadow-sm bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    {editingTask && editingTask.id === task.id ? (
                      <div className="flex flex-col gap-2 w-full">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="p-2 border rounded"
                        />
                        <input
                          type="date"
                          value={editingDeadline}
                          onChange={(e) => setEditingDeadline(e.target.value)}
                          className="p-2 border rounded"
                        />
                        <button
                          onClick={saveEdit}
                          className="self-start bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          💾 Zapisz
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="text-base font-medium text-gray-800 break-words">
                            {task.content}
                          </p>
                          <p className="text-sm text-gray-500">⏰ Deadline: {task.deadline}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <button
                            onClick={() => startEditing(task)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-full sm:w-auto"
                          >
                            ✏️ Edytuj
                          </button>
                          <button
                            onClick={() => removeTask(task)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                          >
                            🗑️ Usuń
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );      
}
ReactDOM.render(<App />, document.getElementById("app"));
