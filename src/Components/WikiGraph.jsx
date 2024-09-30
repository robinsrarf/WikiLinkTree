import React, { useEffect, useRef, useState } from "react";
import GetWindowSize from "./GetWindowSize";
import * as d3 from "d3";

const ForceDirectedTree = () => {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState(null);
  const { height, width } = GetWindowSize();
  const [loading, setLoading] = useState(true);

  const SearchRef = useRef(null);
  const LevelRef = useRef(null);
  const NodeRef = useRef(null);
  const [levels, setLevels] = useState(2);
  const [nodes, setNodes] = useState(2);
  const [Search, setSearch] = useState("Pokémon");

  const ChangeSearch = () => {
    setSearch(SearchRef.current.value);
  };

  const ChangeLevels = () => {
    setLevels(LevelRef.current.value);
  };

  const ChangeNodes = () => {
    setNodes(NodeRef.current.value);
  };

  // Fetch the graph data when the component mounts
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await BuildGraph(Search, levels, nodes);
      setLoading(false);
      setGraphData(data); // Update state with the fetched data
    }
    fetchData();
  }, [Search, levels, nodes]);

  useEffect(() => {
    if (!graphData) return; // Wait for the data to be available

    // Clear any previous content in the SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create a D3 hierarchical layout
    const root = d3.hierarchy(graphData);

    // Set up the force simulation
    const simulation = d3
      .forceSimulation(root.descendants())
      .force("link", d3.forceLink(root.links()).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(50));

    // Set up the SVG canvas
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // Create links (edges)
    const link = svg
      .append("g")
      .selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Create nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#697565")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
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

    // Add labels
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("fill", "#ECDFCC")
      .attr("dy", 4)
      .attr("x", 25)
      .text((d) => d.data.name);

    // Update positions of nodes and links on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [graphData]); // Re-run when graphData is available

  return (
    <>
      <div className="flex justify-center space-x-2">
        <label htmlFor="Search">WikiSearch</label>
        <input
          type="text"
          id="Search"
          placeholder="Search"
          onChange={ChangeSearch}
          ref={SearchRef}
        />

        <label htmlFor="Levels">Levels</label>
        <input
          type="number"
          id="Levels"
          value={levels}
          onChange={ChangeLevels}
          ref={LevelRef}
        />

        <label htmlFor="Nodes">Nodes</label>
        <input
          type="number"
          id="Nodes"
          value={nodes}
          onChange={ChangeNodes}
          ref={NodeRef}
        />
      </div>

      <div className=" overflow-hidden">
        <h1 className={loading ? " text-center text-amber-600" : "hidden"}>Loading....</h1>
        <svg className=" overflow-hidden" ref={svgRef}></svg>
      </div>
    </>
  );
};

// Helper function: Fetch Wikipedia links and build the graph
async function fetchLinks(search, nodes = "max") {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${search}&prop=links&pllimit=${nodes}&format=json&origin=*`
    );
    if (!response.ok) {
      throw new Error("Unable to Fetch Data");
    }
    const data = await response.json();
    return data.query.pages;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

let visitedNodes = {};
let Graph = {};
let head;
let queue = [];

// BFS (Breadth-First Search) to build the graph
async function BuildGraph(Search, Levels, nodes) {
  Search = Search.replace(" ", "%20");
  head = Search;
  queue = [{ name: head, depth: 0 }]; // Store nodes with their depth level
  visitedNodes = {}; // Reset visited nodes

  while (queue.length > 0) {
    let current = queue.shift();
    let currentName = current.name;
    let currentDepth = current.depth;

    if (currentDepth >= Levels) break; // Stop when we reach the desired level depth

    // Skip if already visited
    if (visitedNodes[currentName]) {
      continue;
    }

    visitedNodes[currentName] = true;

    // Fetch the links from the Wikipedia API
    let jsonData = await fetchLinks(currentName, nodes);
    let page = jsonData[Object.keys(jsonData)[0]];

    if (!page || !page.links) {
      continue; // If no links are available, skip this node
    }

    // Extract child links and update the graph
    let children = page.links.map((link) => ({
      name: link.title,
      children: [],
    }));

    if (currentDepth === 0) {
      // Initialize the root of the graph if it's the first node
      Graph = {
        name: currentName,
        children: children,
      };
    } else {
      // Find where to insert the children in the graph
      insertChildren(Graph, currentName, children);
    }

    // Add children to the queue for further exploration at the next depth level
    children.forEach((child) => {
      if (!visitedNodes[child.name]) {
        queue.push({ name: child.name, depth: currentDepth + 1 });
      }
    });
  }

  return Graph;
}

// Function to recursively insert children into the graph at the right position
function insertChildren(node, targetName, children) {
  if (node.name === targetName) {
    node.children = children;
    return;
  }

  for (let child of node.children) {
    insertChildren(child, targetName, children);
  }
}

export default ForceDirectedTree;
