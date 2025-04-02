import React, { useState } from "react";

function TrainerDashboard() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", notes: "", demoGif: "" },
  ]);
  const [workouts, setWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState("");

  // GIF options truncated for brevity; use your full array:
  const availableGifs = [
    { value: "", label: "None" },
    { value: "abdutora.gif", label: "Abdutora" },
    { value: "adutora.gif", label: "Adutora" },
    { value: "abinfra.gif", label: "Abdominal Infra" },
    { value: "absupra.gif", label: "Abdominal Supra" },
    { value: "prancha.gif", label: "Abdominal Prancha" },
    { value: "agachamentolivre.gif", label: "Agachamento Livre" },

    { value: "agachamentosmith.gif", label: "Agachamento Smith" },
    { value: "agachamentosumo.gif", label: "Agachamento Sumo" },
    { value: "bulgaro.gif", label: "Bulgaro" },
    { value: "cadeiraflexora.gif", label: "Cadeira Flexora" },
    { value: "crossover.gif", label: "Crossover" },
    { value: "crucifixohalteres.gif", label: "Crucifixo" },
    { value: "crucifixoinclinado.gif", label: "Crucifixo Inclinado" },
    { value: "crucifixoinverso.gif", label: "Crucifixo Inverso" },
    {
      value: "desenvolvimentohalteres.gif",
      label: "Desenvolvimento c/ Halteres",
    },
    { value: "elevacaofrontal.gif", label: "Elevação Frontal" },
    { value: "elevacaolateral.gif", label: "Elevação Lateral" },
    { value: "elevacaopelvica.gif", label: "Elevação Pelvica" },
    { value: "extensora.gif", label: "Extensora" },
    { value: "facepull.gif", label: "Face Pull" },
    { value: "hack.gif", label: "Agachamento Hack" },
    { value: "hiperextensão.gif", label: "Hiperextensão Lombar" },
    { value: "legpress.gif", label: "Leg Press 45" },
    { value: "levantamentoterra.gif", label: "Levantamento Terra" },
    { value: "mesaflexora.gif", label: "Mesa Flexora" },
    { value: "puxadaalta.gif", label: "Puxada Alta" },
    { value: "panturrilhaempé.gif", label: "Panturrilha Em Pé" },
    { value: "panturrilhasentado.gif", label: "Panturrilha Sentado" },
    { value: "peckdeck.gif", label: "Peck Deck" },
    { value: "passada.gif", label: "Passada" },
    { value: "remadaalta.gif", label: "Remada Alta" },
    { value: "remadaarticuladapron.gif", label: "Remada Articulada Pronada" },
    { value: "remadabaixa.gif", label: "Remada Baixa" },
    { value: "remadacurvadapronada.gif", label: "Remada Curvada Pronada" },
    { value: "remadacurvadasupinada.gif", label: "Remada Curvada Supinada" },
    { value: "rolinho.gif", label: "Abdominal Rolinho" },
    { value: "roscaalternada.gif", label: "Rosca Alternada" },
    { value: "roscadireta.gif", label: "Rosca Direta" },
    { value: "roscadiretacabo.gif", label: "Rosca Direta Pulley" },
    { value: "roscamartelo.gif", label: "Rosca Martelo" },
    { value: "roscascott.gif", label: "Rosca Scott" },
    { value: "roscascottmaquina.gif", label: "Rosca Scott Máquina" },
    { value: "stiff.gif", label: "Stiff" },
    {
      value: "supinoinclinadohalteres.gif",
      label: "Supino Inclinado c/ Halteres",
    },
    { value: "supinoreto.gif", label: "Supino Reto Barra" },
    { value: "supinodeclinado.gif", label: "Supino Declinado Máquina" },
    { value: "supinoinclinado.gif", label: "Supino Inclinado Barra" },
    { value: "supinoinclinadoart.gif", label: "Supino Inclinado Articulado" },
    { value: "tricepspulley.gif", label: "Triceps Pulley" },
    { value: "tricepstestacabo.gif", label: "Triceps Testa Cabo" },
  ];

  // ------------------ PASSCODE AUTH ------------------
  const handlePasscodeSubmit = () => {
    if (passcode === "trainer123") setAuthenticated(true);
    else alert("Wrong passcode!");
  };
  const handlePasscodeKeyPress = (e) => {
    if (e.key === "Enter") handlePasscodeSubmit();
  };

  // ------------------ FETCH WORKOUTS ------------------
  const handleFetchWorkouts = async () => {
    if (!code) {
      alert("Please enter a client code!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${code.toLowerCase()}`
      );
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data.workouts);
        setSelectedWorkout("");
        setExercises([
          { name: "", sets: "", reps: "", notes: "", demoGif: "" },
        ]);
        setWorkoutName("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch workouts");
    }
  };

  // ------------------ DELETE WORKOUT ------------------
  const handleDeleteWorkout = async (workoutNameToDelete) => {
    if (!window.confirm(`Delete "${workoutNameToDelete}"?`)) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${code.toLowerCase()}/${workoutNameToDelete}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      console.log(data);
      alert("Workout deleted!");
      await handleFetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout");
    }
  };

  // ------------------ SELECT WORKOUT ------------------
  const handleSelectWorkout = (wName) => {
    setSelectedWorkout(wName);
    setWorkoutName(wName);
    setExercises(
      workouts[wName]?.exercises || [
        { name: "", sets: "", reps: "", notes: "", demoGif: "" },
      ]
    );
  };

  // ------------------ EXERCISES ADD/REMOVE ------------------
  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: "", reps: "", notes: "", demoGif: "" },
    ]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  // ------------------ SAVE WORKOUT ------------------
  const handleSubmit = async () => {
    if (!workoutName) {
      alert("Please enter a workout name!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toLowerCase(),
          workoutName,
          exercises,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Workout saved!");
        setExercises([
          { name: "", sets: "", reps: "", notes: "", demoGif: "" },
        ]);
        setWorkoutName("");
        setSelectedWorkout("");
        handleFetchWorkouts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  // ------------------ RENDER ------------------
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#f68635]">
            Enter Passcode
          </h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyPress={handlePasscodeKeyPress}
            className="p-3 w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635] mb-4"
          />
          <button
            onClick={handlePasscodeSubmit}
            className="px-6 py-2 w-full sm:w-auto bg-[#f68635] text-white rounded-lg hover:bg-[#d66e2c] transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#f68635]">
          Trainer Dashboard
        </h1>

        {/* Client Code Input */}
        <div className="flex flex-col sm:flex-row mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <label className="mr-4 self-center">Client Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., JS1234"
            className="p-3 w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
          />
          <button
            onClick={handleFetchWorkouts}
            className="px-4 py-2 w-full sm:w-auto bg-[#f68635] text-white rounded-lg hover:bg-[#d66e2c] transition duration-200"
          >
            View Workouts
          </button>
        </div>

        {/* Existing Workouts */}
        {workouts && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-[#f68635]">
              Existing Workouts
            </h2>
            <select
              value={selectedWorkout}
              onChange={(e) => handleSelectWorkout(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            >
              <option value="">Select a workout to edit</option>
              {Object.keys(workouts)
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((wName) => (
                  <option key={wName} value={wName}>
                    {wName}
                  </option>
                ))}
            </select>

            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {Object.keys(workouts)
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((wName) => (
                  <li
                    key={wName}
                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg"
                  >
                    <span>{wName}</span>
                    <button
                      onClick={() => handleDeleteWorkout(wName)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Workout Name */}
        <div className="mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <label className="mr-4">Workout Name:</label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Back and Biceps"
            className="p-3 w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
          />
        </div>

        {/* Exercises: Grid Layout */}
        {exercises.map((exercise, index) => (
          <div
            key={index}
            // 1 column on small screens, 6 columns on md+ screens
            className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4"
          >
            {/* Exercise Name */}
            <input
              type="text"
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[index].name = e.target.value;
                setExercises(newExercises);
              }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            />

            {/* Sets */}
            <input
              type="text"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[index].sets = e.target.value;
                setExercises(newExercises);
              }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            />

            {/* Reps */}
            <input
              type="text"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[index].reps = e.target.value;
                setExercises(newExercises);
              }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            />

            {/* Notes */}
            <input
              type="text"
              placeholder="Notes"
              value={exercise.notes}
              onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[index].notes = e.target.value;
                setExercises(newExercises);
              }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            />

            {/* Demo Gif */}
            <select
              value={exercise.demoGif}
              onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[index].demoGif = e.target.value;
                setExercises(newExercises);
              }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f68635]"
            >
              {availableGifs.map((gif) => (
                <option key={gif.value} value={gif.value}>
                  {gif.label}
                </option>
              ))}
            </select>

            {/* Remove Button */}
            <button
              onClick={() => handleRemoveExercise(index)}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add Exercise / Save Workout */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleAddExercise}
            className="px-4 py-2 w-full sm:w-auto bg-[#f68635] text-white rounded-lg hover:bg-[#d66e2c] transition duration-200"
          >
            Add Exercise
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-full sm:w-auto bg-[#f68635] text-white rounded-lg hover:bg-[#d66e2c] transition duration-200"
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainerDashboard;
