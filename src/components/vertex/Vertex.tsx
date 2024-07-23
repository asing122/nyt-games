import { SECTION } from "../../App";
import { HomeIcon } from "../../icons/HomeIcon";
import "../../styles/vertex.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { spots, triangles } from "./TriangleCoords";
import { UndoButton } from "../../icons/Undo";

export type Triangle = {
  x1: number;
  x2: number;
  x3: number;
  y1: number;
  y2: number;
  y3: number;
  fill: string;
};

type VertexProps = {
  setSection: Dispatch<SetStateAction<SECTION>>;
  lines: number[][];
  setLines: Dispatch<SetStateAction<number[][]>>;
  confirmedTriangles: Triangle[];
  setConfirmedTriangles: Dispatch<SetStateAction<Triangle[]>>;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
};

export default function Vertex({
  setSection,
  lines,
  setLines,
  confirmedTriangles,
  setConfirmedTriangles,
  done,
  setDone,
}: VertexProps) {
  const [dragging, setDragging] = useState<boolean>(false);
  const [startCoords, setStartCoords] = useState<number[]>([]);
  const [endCoords, setEndCoords] = useState<number[]>([]);

  function handleMouseDown(e: any) {
    e.preventDefault();
    setDragging(true);
    const coords = getClosestNode(e.clientX, e.clientY, 10);
    if (coords[0] != 0 && coords[1] != 0) {
      setStartCoords(coords);
    }
  }

  function handleMouseMove(e: any) {
    if (dragging) {
      const coords: number[] = [e.clientX, e.clientY];
      setEndCoords(coords);
    }
  }

  function handleMouseUp() {
    setDragging(false);
    if (startCoords.length === 2 && endCoords.length === 2) {
      const end = getClosestNode(endCoords[0], endCoords[1], 6);
      if (end[0] != 0 && end[1] != 0) {
        setLines([...lines, [...startCoords, ...end]]);
      }
    }
    setStartCoords([]);
    setEndCoords([]);
  }

  function getClosestNode(x: number, y: number, threshold: number) {
    let minDistX = threshold;
    let minDistY = threshold;
    let minX: number = 0,
      minY: number = 0;
    spots
      .filter((coord) => x - coord[0] < threshold && y - coord[1] < threshold)
      .map((coord) => {
        if (
          Math.abs(x - coord[0]) < minDistX + numberOfCircles(coord) &&
          Math.abs(y - coord[1]) < minDistY + numberOfCircles(coord) &&
          numberOfCircles(coord) > 0
        ) {
          minDistX = Math.abs(x - coord[0] + numberOfCircles(coord) * 0.5);
          minDistY = Math.abs(y - coord[1] + numberOfCircles(coord) * 0.5);
          minX = coord[0];
          minY = coord[1];
        }
      });

    return [minX, minY];
  }

  function allLines(triangle: Triangle) {
    if (!isConfirmed(triangle)) {
      const returnVal =
        findLine(triangle.x1, triangle.y1, triangle.x2, triangle.y2).length >
          0 &&
        findLine(triangle.x1, triangle.y1, triangle.x3, triangle.y3).length >
          0 &&
        findLine(triangle.x2, triangle.y2, triangle.x3, triangle.y3).length > 0;
      if (returnVal) {
        setConfirmedTriangles([...confirmedTriangles, triangle]);
        const newLines = lines.filter(
          (line) =>
            confirmedTriangles.filter(
              (tri) =>
                ((tri.x1 == line[0] && tri.y1 == line[1]) ||
                  (tri.x2 == line[0] && tri.y2 == line[1]) ||
                  (tri.x3 == line[0] && tri.y3 == line[1])) &&
                ((tri.x1 == line[2] && tri.y1 == line[3]) ||
                  (tri.x2 == line[2] && tri.y2 == line[3]) ||
                  (tri.x3 == line[2] && tri.y3 == line[3]))
            ).length > 0 ||
            equalLines(
              findLine(triangle.x1, triangle.y1, triangle.x2, triangle.y2)[0],
              line
            ) ||
            equalLines(
              findLine(triangle.x1, triangle.y1, triangle.x3, triangle.y3)[0],
              line
            ) ||
            equalLines(
              findLine(triangle.x2, triangle.y2, triangle.x3, triangle.y3)[0],
              line
            )
        );
        setLines(newLines);
      }
      return returnVal;
    }
    return true;
  }

  function isConfirmed(triangle: Triangle) {
    return (
      confirmedTriangles.filter(
        (tri) =>
          tri.x1 === triangle.x1 &&
          tri.y1 === triangle.y1 &&
          tri.x2 === triangle.x2 &&
          tri.y2 === triangle.y2 &&
          tri.x3 === triangle.x3 &&
          tri.y3 === triangle.y3 &&
          tri.fill === triangle.fill
      ).length > 0
    );
  }

  function equalLines(line1: number[], line2: number[]) {
    return (
      line1[0] == line2[0] &&
      line1[1] == line2[1] &&
      line1[2] == line2[2] &&
      line1[3] == line2[3]
    );
  }

  function findLine(x1: number, y1: number, x2: number, y2: number) {
    return lines.filter(
      (coords) =>
        (coords[0] == x1 &&
          coords[1] == y1 &&
          coords[2] == x2 &&
          coords[3] == y2) ||
        (coords[0] == x2 &&
          coords[1] == y2 &&
          coords[2] == x1 &&
          coords[3] == y1)
    );
  }

  function undoLastLine() {
    let newLines = [...lines];
    const lastLine = newLines.pop() || null;
    const lineinTriangle =
      lastLine &&
      confirmedTriangles.filter(
        (tri) =>
          ((tri.x1 == lastLine[0] && tri.y1 == lastLine[1]) ||
            (tri.x2 == lastLine[0] && tri.y2 == lastLine[1]) ||
            (tri.x3 == lastLine[0] && tri.y3 == lastLine[1])) &&
          ((tri.x1 == lastLine[2] && tri.y1 == lastLine[3]) ||
            (tri.x2 == lastLine[2] && tri.y2 == lastLine[3]) ||
            (tri.x3 == lastLine[2] && tri.y3 == lastLine[3]))
      ).length > 0;
    if (!lineinTriangle) {
      setLines(newLines);
    }
  }

  function numberOfCircles(spot: number[]) {
    return triangles.filter(
      (triangle) =>
        !isConfirmed(triangle) &&
        ((triangle.x1 == spot[0] && triangle.y1 == spot[1]) ||
          (triangle.x2 == spot[0] && triangle.y2 == spot[1]) ||
          (triangle.x3 == spot[0] && triangle.y3 == spot[1]))
    ).length;
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [startCoords, endCoords]);

  useEffect(() => {
    if (
      triangles.filter((triangle) => isConfirmed(triangle)).length ==
      triangles.length
    ) {
      setDone(true);
    }
  }, [confirmedTriangles]);

  useEffect(() => {
    triangles.map((triangle) => allLines(triangle));
  }, [lines]);

  return (
    <>
      <div className="home" onClick={() => setSection(SECTION.NONE)}>
        {HomeIcon}
      </div>
      <div
        className="vertex-board"
        style={{ width: "100%", height: window.innerHeight }}
      >
        <div className="spots">
          {confirmedTriangles.map((triangle) => (
            <svg className="strands-svg" key={triangle.toString()}>
              {
                <polygon
                  points={
                    triangle.x1.toString() +
                    "," +
                    triangle.y1.toString() +
                    " " +
                    triangle.x2.toString() +
                    "," +
                    triangle.y2.toString() +
                    " " +
                    triangle.x3.toString() +
                    "," +
                    triangle.y3.toString()
                  }
                  style={{
                    fill: triangle.fill,
                    stroke: "black",
                    strokeWidth: "0",
                  }}
                />
              }
            </svg>
          ))}
          {spots.map(
            (spot) =>
              numberOfCircles(spot) > 0 && (
                <svg
                  className="vertex-svg"
                  key={spot.toString() + Math.random() * 100}
                  style={{ zIndex: 5 }}
                >
                  <circle
                    r={numberOfCircles(spot) + 5}
                    cx={spot[0]}
                    cy={spot[1]}
                    fill="white"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                  <text
                    x={spot[0]}
                    y={spot[1]}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={numberOfCircles(spot) + 3}
                    fill="black"
                  >
                    {numberOfCircles(spot)}
                  </text>
                </svg>
              )
          )}
          {startCoords.length == 2 && endCoords.length == 2 && (
            <svg
              className="vertex-lines"
              key={
                startCoords.toString() +
                endCoords.toString() +
                Math.random() * 100
              }
              style={{ zIndex: -5 }}
            >
              <line
                x1={startCoords[0]}
                y1={startCoords[1]}
                x2={endCoords[0]}
                y2={endCoords[1]}
                stroke="black"
                strokeWidth="2"
                strokeDasharray={"5, 5"}
              />
            </svg>
          )}
          {lines.map((line) => (
            <svg
              className="vertex-lines"
              key={
                startCoords.toString() +
                endCoords.toString() +
                Math.random() * 100
              }
              style={{ zIndex: -5 }}
            >
              <line
                x1={line[0]}
                y1={line[1]}
                x2={line[2]}
                y2={line[3]}
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          ))}
        </div>
      </div>
      {done ? (
        <button
          className="submit"
          style={{ position: "fixed", bottom: 20, left: 10, minWidth: "10em" }}
        >
          Congrats!
        </button>
      ) : (
        <button
          onClick={undoLastLine}
          className="vertex-undo"
          style={{ bottom: 19, left: 14.2, position: "fixed" }}
        >
          {UndoButton}
        </button>
      )}
    </>
  );
}
