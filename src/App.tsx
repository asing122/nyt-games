import { useState } from "react";
import Menu from "./components/Menu";
import Connections, { Row } from "./components/connections/Connections";
import Strands from "./components/strands/Strands";
import Vertex, { Triangle } from "./components/vertex/Vertex";
import Mini from "./components/mini/Mini";

export enum SECTION {
  NONE,
  CONNECTIONS,
  STRANDS,
  SPELLINGBEE,
  VERTEX,
  MINI,
  APP,
}

function App() {
  const [section, setSection] = useState<SECTION>(SECTION.NONE);
  const [rows, setRows] = useState<Row[]>([]);
  const [noShow, setNoShow] = useState<string[]>([]);
  const [finalLines, setFinalLines] = useState<any[]>([]);
  const [pangramLines, setPangramLines] = useState<any[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundPangram, setFoundPangram] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[][]>([
    [".", ".", "", "", "", ".", "."],
    [".", "", "", "", "", "", "."],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    [".", "", "", "", "", "", "."],
    [".", ".", "", "", "", ".", "."],
  ]);
  const [connectionsDone, setConnectionsDone] = useState<boolean>(false);
  const [strandsDone, setStrandsDone] = useState<boolean>(false);
  const [miniDone, setMiniDone] = useState<boolean>(false);
  const [vertexDone, setVertexDone] = useState<boolean>(false);
  const [lines, setLines] = useState<number[][]>([]);
  const [confirmedTriangles, setConfirmedTriangles] = useState<Triangle[]>([]);

  return (
    <div
      className="App"
      style={{
        width: window.innerWidth,
      }}
    >
      {section == SECTION.NONE && (
        <Menu
          setSection={setSection}
          connectionsDone={connectionsDone}
          strandsDone={strandsDone}
          miniDone={miniDone}
          vertexDone={vertexDone}
        />
      )}
      {section == SECTION.CONNECTIONS && (
        <Connections
          setSection={setSection}
          rows={rows}
          setRows={setRows}
          noShow={noShow}
          setNoShow={setNoShow}
          done={connectionsDone}
          setDone={setConnectionsDone}
        />
      )}
      {section == SECTION.STRANDS && (
        <Strands
          setSection={setSection}
          finalLines={finalLines}
          setFinalLines={setFinalLines}
          pangramLines={pangramLines}
          setPangramLines={setPangramLines}
          wordCount={wordCount}
          setWordCount={setWordCount}
          foundWords={foundWords}
          setFoundWords={setFoundWords}
          foundPangram={foundPangram}
          setFoundPangram={setFoundPangram}
          done={strandsDone}
          setDone={setStrandsDone}
        />
      )}
      {section == SECTION.VERTEX && (
        <Vertex
          setSection={setSection}
          lines={lines}
          setLines={setLines}
          confirmedTriangles={confirmedTriangles}
          setConfirmedTriangles={setConfirmedTriangles}
          done={vertexDone}
          setDone={setVertexDone}
        />
      )}
      {section == SECTION.MINI && (
        <Mini
          setSection={setSection}
          answer={answer}
          setAnswer={setAnswer}
          done={miniDone}
          setDone={setMiniDone}
        />
      )}
    </div>
  );
}

export default App;
