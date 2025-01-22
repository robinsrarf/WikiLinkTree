import { useNavigate } from "react-router";
import { useState } from "react";

export default function HomePage() {
  const [graphData, setGraphData] = useState({
    search: "pikachu",
    levels: 2,
    nodes: 3,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGraphData({
      ...graphData,
      [e.target.name]: e.target.value,
    });
  };
  const handleGraph = (e) => {
    e.preventDefault();
    
    navigate("/WikiLinkTree", { state: graphData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white flex flex-col items-center justify-center p-5">
      <div className="bg-slate-900 rounded-lg shadow-lg p-8 max-w-sm w-full">
        <form
          className="flex flex-col text-center font-medium space-y-6"
          onSubmit={handleGraph}
        >
          <div>
            <label htmlFor="Startpoint" className="block text-lg mb-2">
              search
            </label>
            <input
              className="w-full p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="Startpoint"
              type="text"
              name="search"
              placeholder="Enter the search point"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between space-x-4">
            <div>
              <label htmlFor="Levels" className="block text-lg mb-2">
                Levels
              </label>
              <input
                className="w-full p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="Levels"
                type="number"
                placeholder="2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nodes" className="block text-lg mb-2">
                nodes
              </label>
              <input
                className="w-full p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                id="nodes"
                type="number"
                placeholder="3"
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-500 hover:shadow-lg transition-all duration-300">
            Generate Graph
          </button>
        </form>
      </div>
    </div>
  );
}
