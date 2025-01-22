import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white py-4 shadow-lg">
      <div className="flex ml-5 items-center">
        {/* Logo/Title */}
        <h1 className="text-3xl font-bold ml-5">
          <Link
            to="/"
            className="hover:text-lime-400 hover:scale-105 transition-transform duration-300"
          >
            WikipediaLinkTree
          </Link>
        </h1>
        {/* Links */}
        <div className="ml-auto flex space-x-6 mr-0">
          <a
            href="https://www.mediawiki.org/wiki/API:Main_page"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-red-500 transition-all duration-300"
          >
            Wikipedia API
          </a>
          <a
            href="https://github.com/robinsrarf/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg pr-10 hover:text-teal-400 transition-all duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
