import { json } from "d3";
import { useState } from "react";

function MiniWiki({ Name }) {
  //const [loading, setLoading] = useState(true);

  return (
    <>
      <WikiArticle />
    </>
  );
  //   return <>{loading ? <LoadingWiki /> : <WikiArticle />}</>;
}

function LoadingWiki() {
  return <></>;
}

function WikiArticle() {
  return (
    <>
      <div
      className=""
      >
        <iframe src={`https://en.wikipedia.org/wiki/${Name}`}></iframe>
      </div>
    </>
  );
}
