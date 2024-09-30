import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className="flex flex-row mt-2 mb-5">
        <h1 className=" font-bold text-3xl ml-5  hover:text-lime-600 hover:font-bold transition-all duration-300 ease-in-out">
          <Link to="/">WikipediaLinkTree</Link>
        </h1>

        <a
          href="https://www.mediawiki.org/wiki/API:Main_page"
          target="blank"
          className="ml-auto mr-3 text-lg hover:text-red-600 hover:font-bold transition-all duration-300 ease-in-out"
        >
          wikipediaAPI
        </a>
        <a
          href="https://github.com/robinsrarf/"
          target="blank"
          className=" mr-10 text-lg hover:text-teal-600 hover:font-bold transition-all duration-300 ease-in-out"
        >
          github
        </a>
      </div>
    </>
  );
}

export default Navbar;
