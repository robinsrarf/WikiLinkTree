import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation } from "react-router";
import MiniWiki from "./MiniWiki";

// Hook to get window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const ForceDirectedTree = () => {
  const location = useLocation();
  const svgRef = useRef();
  const [graphData, setGraphData] = useState(null);
  const { height, width } = useWindowSize();
  const [loading, setLoading] = useState(false);

  const [levels, setLevels] = useState(location.state.levels); // || useState(2);
  const [nodes, setNodes] = useState(location.state.nodes); //|| useState(2);
  const [search, setSearch] = useState(location.state.search); //|| useState("Pokémon");
  const [selectedNode, setSelectedNode] = useState(null);

  const debouncedSearch = (callback, delay) => {
    const timeoutRef = useRef(null);

    const debouncedFn = (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    };

    return debouncedFn;
  };

  const debouncedSetSearch = debouncedSearch((value) => setSearch(value), 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BuildGraph(search, levels, nodes);
      setGraphData(data);
      setLoading(false);
    };

    fetchData();
  }, [search, levels, nodes]);

  useEffect(() => {
    if (!graphData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // const zoomHandler = d3.zoom().on("zoom", (event) => {
    //   svg.attr("transform", event.transform);
    // });
    // d3.select(svgRef.current).call(zoomHandler);

    const root = d3.hierarchy(graphData);

    const simulation = d3
      .forceSimulation(root.descendants())
      .force("link", d3.forceLink(root.links()).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter((width * 0.75) / 2, height / 2))
      .force("collide", d3.forceCollide(50));

    const links = svg
      .append("g")
      .selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    const nodes = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#67a9e0")
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedNode(d.data.name)) // Handle click event
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("dy", 5)
      .attr("x", 25)
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => d.data.name);

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [graphData, width, height]);

  return (
    <div className="flex bg-slate-900">
      {/* Left-side panel to display the Wikipedia page */}
      <MiniWiki selectedNode={selectedNode} />

      {/* Main graph rendering area */}
      <div className="flex-1 p-5">
        <div className="flex justify-center space-x-4 mb-5">
          <div>
            <label htmlFor="Search" className="mr-2 text-lg font-semibold">
              WikiSearch:
            </label>
            <input
              type="text"
              id="Search"
              placeholder="Search"
              className="p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="Levels" className="mr-2 text-lg font-semibold">
              Levels:
            </label>
            <input
              type="number"
              id="Levels"
              value={levels}
              className="p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setLevels(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="Nodes" className="mr-2 text-lg font-semibold">
              Nodes:
            </label>
            <input
              type="number"
              id="Nodes"
              value={nodes}
              className="p-2 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setNodes(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-xl text-teal-500">Loading...</div>
        )}
        <svg
          ref={svgRef}
          className="w-full h-[800px] bg-gray-900 mx-auto"
        ></svg>
      </div>
    </div>
  );
};

// Helper function: Fetch Wikipedia links
async function fetchLinks(search, limit = "max") {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${search}&prop=links&pllimit=${limit}&format=json&origin=*`
    );
    if (!response.ok) throw new Error("Failed to fetch Wikipedia data.");
    const data = await response.json();
    return data.query.pages;
  } catch (error) {
    console.error(error);
  }
}
// BFS Graph Builder
async function BuildGraph(search, levels, limit) {
  const queue = [{ name: search, depth: 0 }];
  const visited = new Set();
  let graph = {};

  while (queue.length) {
    const { name, depth } = queue.shift();
    if (depth >= levels || visited.has(name)) continue;

    visited.add(name);
    const pageLinks = await fetchLinks(name, limit);
    const page = pageLinks[Object.keys(pageLinks)[0]];

    const children = (page.links || []).map((link) => ({
      name: link.title,
      children: [],
    }));
    if (depth === 0) {
      graph = { name, children };
    } else {
      addChildren(graph, name, children);
    }

    queue.push(
      ...children.map((child) => ({ name: child.name, depth: depth + 1 }))
    );
  }

  return graph;
}

function addChildren(root, target, children) {
  if (root.name === target) {
    root.children = children;
    return;
  }
  root.children.forEach((child) => addChildren(child, target, children));
}

export default ForceDirectedTree;
