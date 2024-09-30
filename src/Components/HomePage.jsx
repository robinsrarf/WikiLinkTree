export default function HomePage() {
  return (
    <>
      <h1 className="text-5xl text-center pb-20">WikiPedia Link Tree</h1>
      <div className="bg-slate-950 ml-auto mr-auto max-w-fit ">
        <form className="flex flex-col w-72 p-10 text-center font-semibold space-y-2">
          <label htmlFor="Startpoint">Start</label>
          <input
            className="text-slate-950 font-semibold"
            id="Startpoint"
            type="text"
            name="start"
          />

          <label htmlFor="destination">Destination</label>
          <input
            className="text-slate-950 font-semibold"
            id="destination"
            type="text"
            name="destination"
          />
          <div className="flex space-x-2">
            <label htmlFor="Levels">Levels</label>
            <input
              className="text-slate-950 font-semibold w-10"
              id="Levels"
              type="number"
            />
            <label htmlFor="Nodes">Nodes</label>
            <input
              className="text-slate-950 font-semibold w-10"
              id="Nodes"
              type="number"
            />
          </div>

          <button className=" hover:text-teal-600 hover:font-bold transition-all duration-300 ease-in-out">
            Graph
          </button>
        </form>
      </div>
    </>
  );
}
