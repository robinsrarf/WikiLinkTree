function MiniWiki({ selectedNode }) {
  return (
    <div className="flex items-center justify-center w-1/4 h-screen border-r border-gray-300 p-4 bg-slate-600 overflow-y-auto">
      
      {selectedNode ? (
        <iframe
          src={`https://en.wikipedia.org/wiki/${encodeURIComponent(
            selectedNode
          )}`}
          title={selectedNode}
          className="w-full h-[95%] border"
        ></iframe>
      ) : (
        <p className="text-lg">
          Click on a node to view its Wikipedia page.
        </p>
      )}
    </div>
  );
}

export default MiniWiki;
