import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../../styles/mini.css";
import { createFileLevelUniqueName } from "typescript";
import { across, down } from "./Clues";
import { HomeIcon } from "../../icons/HomeIcon";
import { SECTION } from "../../App";
import { match } from "assert";

export type Clues = {
  clueNumber: number;
  clue: string;
  index: number[];
  answer: string;
};

type MiniProps = {
  setSection: Dispatch<SetStateAction<SECTION>>;
  answer: string[][];
  setAnswer: Dispatch<SetStateAction<string[][]>>;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
};

export default function Mini({
  setSection,
  answer,
  setAnswer,
  done,
  setDone,
}: MiniProps) {
  const [rowOrientation, setRowOrientation] = useState<boolean>(true);

  const finalAnswer = [
    [".", ".", "C", "D", "T", ".", "."],
    [".", "A", "L", "O", "H", "A", "."],
    ["C", "O", "A", "G", "U", "L", "A"],
    ["O", "N", "S", "E", "R", "V", "E"],
    ["M", "E", "S", "A", "M", "I", "S"],
    [".", "S", "A", "R", "A", "N", "."],
    [".", ".", "S", "S", "N", ".", "."],
  ];

  useEffect(() => {
    answer.filter(
      (row, rowIndex) =>
        row.filter(
          (cell, index) => cell.toUpperCase() != finalAnswer[rowIndex][index]
        ).length != 0
    ).length == 0 && setDone(true);
  }, [answer]);

  const [focusedCell, setFocusedCell] = useState<{
    rowIndex: number;
    colIndex: number;
  }>({ rowIndex: 2, colIndex: 0 });

  useEffect(() => {
    console.log(focusedCell);
    const updateClueHighlight = () => {
      document.querySelectorAll(".clue").forEach((el: any) => {
        el.style.backgroundColor = "white";
      });

      const matchedClue = rowOrientation
        ? across.find((clue) => clue.index[0] === focusedCell.rowIndex + 1)
        : down.find((clue) => clue.index[1] === focusedCell.colIndex + 1);

      if (matchedClue) {
        document.getElementById(
          `${rowOrientation ? "across" : "down"}-${matchedClue.clueNumber}`
        )!.style.backgroundColor = "#a7d8ff";
      }
    };

    updateClueHighlight();
  }, [focusedCell, rowOrientation]);

  function handleChangeCell(e: any, rowIndex: number, index: number) {
    e.preventDefault();
    if (e.key === "Backspace") {
      if (rowOrientation) {
        e.target.value = "";
        if (index != 0) {
          document
            .getElementById((rowIndex * 7 + index - 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex, colIndex: index - 1 });
        }
      } else {
        e.target.value = "";
        if (rowIndex != 0) {
          document
            .getElementById((index * 7 + rowIndex - 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex - 1, colIndex: index });
        }
      }
    } else if (e.shiftKey && e.keyCode == 9) {
      if (rowOrientation) {
        if (rowIndex != 0) {
          const lastRow = answer.filter((row, i) => i == rowIndex - 1)[0];
          const cellIndex =
            lastRow
              .map((cell, i) => {
                if (cell != ".") {
                  return i;
                }
              })
              .filter((num) => num != undefined)[0] || 0;
          document
            .getElementById((rowIndex * 7 - 7 + cellIndex).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex - 1, colIndex: cellIndex });
        }
      } else {
        if (index != 0) {
          const lastRow = answer.filter((row, i) => i == index - 1)[0];
          const cellIndex =
            lastRow
              .map((cell, i) => {
                if (cell != ".") {
                  return i;
                }
              })
              .filter((num) => num != undefined)[0] || 0;
          document
            .getElementById((index * 7 - 7 + cellIndex).toString())
            ?.focus();
          setFocusedCell({ rowIndex: cellIndex, colIndex: index - 1 });
        }
      }
    } else if (e.key === "Tab") {
      if (rowOrientation) {
        if (rowIndex != answer.length - 1) {
          const nextRow = answer.filter((row, i) => i == rowIndex + 1)[0];
          const cellIndex =
            nextRow
              .map((cell, i) => {
                if (cell != ".") {
                  return i;
                }
              })
              .filter((num) => num != undefined)[0] || 0;
          document
            .getElementById((rowIndex * 7 + 7 + cellIndex).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex + 1, colIndex: cellIndex });
        }
      } else {
        if (index != answer.length - 1) {
          const nextRow = answer.filter((row, i) => i == index + 1)[0];
          const cellIndex =
            nextRow
              .map((cell, i) => {
                if (cell != ".") {
                  return i;
                }
              })
              .filter((num) => num != undefined)[0] || 0;
          document
            .getElementById((index * 7 + cellIndex + 7).toString())
            ?.focus();
          setFocusedCell({ rowIndex: cellIndex, colIndex: index + 1 });
        }
      }
    } else if (e.keyCode == 37) {
      if (rowOrientation) {
        if (index != 0) {
          document
            .getElementById((rowIndex * 7 + index - 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex, colIndex: index - 1 });
        }
      } else {
        setFocusedCell({ rowIndex: rowIndex, colIndex: index });
        setRowOrientation(!rowOrientation);
      }
    } else if (e.keyCode == 38) {
      if (rowOrientation) {
        setFocusedCell({ rowIndex: rowIndex, colIndex: index });
        setRowOrientation(!rowOrientation);
      } else {
        if (rowIndex != 0) {
          document
            .getElementById((index * 7 + rowIndex - 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex - 1, colIndex: index });
        }
      }
    } else if (e.keyCode == 39) {
      if (rowOrientation) {
        if (index != answer[0].length - 1) {
          document
            .getElementById((rowIndex * 7 + index + 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex, colIndex: index + 1 });
        }
      } else {
        setFocusedCell({ rowIndex: rowIndex, colIndex: index });
        setRowOrientation(!rowOrientation);
      }
    } else if (e.keyCode == 40) {
      if (rowOrientation) {
        setFocusedCell({ rowIndex: rowIndex, colIndex: index });
        setRowOrientation(!rowOrientation);
      } else {
        if (rowIndex != answer[0].length - 1) {
          document
            .getElementById((index * 7 + rowIndex + 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex + 1, colIndex: index });
        }
      }
    } else if (e.key.match(/^[a-zA-Z ]$/)) {
      if (rowOrientation) {
        if (
          answer[rowIndex][index + 1] == "." ||
          index + 1 >= answer[0].length
        ) {
          e.target.value = e.key;
        } else {
          e.target.value = e.key;
          document
            .getElementById((rowIndex * 7 + index + 1).toString())
            ?.focus();
          setFocusedCell({ rowIndex: rowIndex, colIndex: index + 1 });
        }
      } else {
        if (rowOrientation) {
          if (
            answer[index][rowIndex + 1] == "." ||
            rowIndex + 1 >= answer[0].length
          ) {
            e.target.value = e.key;
          } else {
            e.target.value = e.key;
            document
              .getElementById((index * 7 + rowIndex + 1).toString())
              ?.focus();
            setFocusedCell({ rowIndex: rowIndex, colIndex: index + 1 });
          }
        } else {
          if (
            answer[index][rowIndex + 1] == "." ||
            rowIndex + 1 >= answer[0].length
          ) {
            e.target.value = e.key;
          } else {
            e.target.value = e.key;
            document
              .getElementById((index * 7 + rowIndex + 1).toString())
              ?.focus();
            setFocusedCell({ rowIndex: rowIndex + 1, colIndex: index });
          }
        }
      }
    }
    saveAnswers(rowOrientation);
  }

  function saveAnswers(row: boolean) {
    let newAnswers: string[][] = [];
    if (row) {
      Array.from({ length: 7 }).map((_, colI) => {
        let newRow: string[] = [];
        Array.from({ length: 7 }).map((_, rowI) => {
          const newVal = (
            document.getElementById(
              (colI * 7 + rowI).toString()
            ) as HTMLInputElement
          )?.value;
          newVal == undefined
            ? newRow.push(".")
            : newVal == ""
            ? newRow.push("")
            : newRow.push(newVal);
        });
        newAnswers.push(newRow);
      });
    } else {
      Array.from({ length: 7 }).map((_, colI) => {
        let newRow: string[] = [];
        Array.from({ length: 7 }).map((_, rowI) => {
          const newVal = (
            document.getElementById(
              (rowI * 7 + colI).toString()
            ) as HTMLInputElement
          )?.value;
          newVal == undefined
            ? newRow.push(".")
            : newVal == ""
            ? newRow.push("")
            : newRow.push(newVal);
        });
        newAnswers.push(newRow);
      });
    }
    setAnswer(newAnswers);
  }

  function handleRowToCol(e: any, rowIndex: number, index: number) {
    setFocusedCell({ rowIndex, colIndex: index });
    setRowOrientation(!rowOrientation);
  }

  function handleColToRow(e: any, rowIndex: number, colIndex: number) {
    setFocusedCell({
      rowIndex: rowIndex,
      colIndex: colIndex,
    });
    setRowOrientation(!rowOrientation);
  }

  const handleClueSelect = (e: any) => {
    // setRowOrientation(e.target.value.index[0] - 1 === focusedCell.rowIndex);
    // setFocusedCell({
    //   rowIndex: e.target.value.index[0] - 1,
    //   colIndex: e.target.value.index[1] - 1,
    // });
  };

  return (
    <>
      <div className="home" onClick={() => setSection(SECTION.NONE)}>
        {HomeIcon}
      </div>
      <div
        className="mini-body"
        style={{ height: window.innerHeight, overflow: "hidden" }}
      >
        <div className="clues across">
          <p className="clues-title">Across</p>
          {across.map((clue) => (
            <div
              className="clue"
              onClick={handleClueSelect}
              id={"across-" + clue.clueNumber}
            >
              <p className="clue-card-number">{clue.clueNumber}</p>
              <p className="clue-text">{clue.clue}</p>
            </div>
          ))}
        </div>
        <div className="mini-board">
          {rowOrientation
            ? answer.map((row, rowIndex) => (
                <div className="mini-row">
                  {row.map((cell, index) =>
                    cell == "." ? (
                      <div
                        className={"cell-container"}
                        style={
                          index == 0
                            ? rowIndex == 0
                              ? {
                                  backgroundColor: "black",
                                  borderRightColor: "dimgray",
                                  borderBottomColor: "dimgray",
                                }
                              : {
                                  backgroundColor: "black",
                                  borderRightColor: "dimgray",
                                  borderTopColor: "dimgray",
                                }
                            : rowIndex == 0
                            ? {
                                backgroundColor: "black",
                                borderLeftColor: "dimgray",
                                borderBottomColor: "dimgray",
                              }
                            : {
                                backgroundColor: "black",
                                borderLeftColor: "dimgray",
                                borderTopColor: "dimgray",
                              }
                        }
                      ></div>
                    ) : (
                      <div
                        className="cell-container"
                        onDoubleClick={(e) =>
                          handleRowToCol(e, rowIndex, index)
                        }
                        onClick={(e) =>
                          setFocusedCell({ rowIndex, colIndex: index })
                        }
                      >
                        {down.filter(
                          (clue: Clues) =>
                            clue.index[0] == rowIndex + 1 &&
                            clue.index[1] == index + 1
                        ).length > 0 && (
                          <p className="clue-number">
                            {
                              down.filter(
                                (clue: Clues) =>
                                  clue.index[0] == rowIndex + 1 &&
                                  clue.index[1] == index + 1
                              )[0].clueNumber
                            }
                          </p>
                        )}
                        {across.filter(
                          (clue: Clues) =>
                            clue.index[0] == rowIndex + 1 &&
                            clue.index[1] == index + 1
                        ).length > 0 &&
                          down.filter(
                            (clue: Clues) =>
                              clue.index[0] == rowIndex + 1 &&
                              clue.index[1] == index + 1
                          ).length == 0 && (
                            <p className="clue-number">
                              {
                                across.filter(
                                  (clue: Clues) =>
                                    clue.index[0] == rowIndex + 1 &&
                                    clue.index[1] == index + 1
                                )[0].clueNumber
                              }
                            </p>
                          )}
                        <input
                          className="cell"
                          id={(rowIndex * 7 + index).toString()}
                          onKeyDown={(e) =>
                            handleChangeCell(e, rowIndex, index)
                          }
                          autoComplete="off"
                          value={cell}
                          autoFocus={
                            index == focusedCell.colIndex &&
                            rowIndex == focusedCell.rowIndex
                          }
                          disabled={done}
                        />
                      </div>
                    )
                  )}
                </div>
              ))
            : Array.from({ length: 7 }).map((_, colIndex) => (
                <div className="mini-col" key={colIndex}>
                  {answer.map((row, rowIndex) =>
                    row[colIndex] === "." ? (
                      <div
                        className={"cell-container"}
                        key={rowIndex}
                        style={
                          rowIndex === 0
                            ? colIndex === 0
                              ? {
                                  backgroundColor: "black",
                                  borderRightColor: "dimgray",
                                  borderBottomColor: "dimgray",
                                }
                              : {
                                  backgroundColor: "black",
                                  borderRightColor: "dimgray",
                                  borderTopColor: "dimgray",
                                }
                            : colIndex === 0
                            ? {
                                backgroundColor: "black",
                                borderLeftColor: "dimgray",
                                borderBottomColor: "dimgray",
                              }
                            : {
                                backgroundColor: "black",
                                borderLeftColor: "dimgray",
                                borderTopColor: "dimgray",
                              }
                        }
                      ></div>
                    ) : (
                      <div
                        className="cell-container"
                        key={rowIndex}
                        onClick={(e) =>
                          setFocusedCell({
                            rowIndex: rowIndex,
                            colIndex: colIndex,
                          })
                        }
                        onDoubleClick={(e) =>
                          handleColToRow(e, rowIndex, colIndex)
                        }
                      >
                        {down
                          .filter(
                            (clue: Clues) =>
                              clue.index[0] === rowIndex + 1 &&
                              clue.index[1] === colIndex + 1
                          )
                          .map((clue) => (
                            <p className="clue-number" key={clue.clueNumber}>
                              {clue.clueNumber}
                            </p>
                          ))}
                        {across
                          .filter(
                            (clue: Clues) =>
                              clue.index[0] === rowIndex + 1 &&
                              clue.index[1] === colIndex + 1
                          )
                          .map((clue) => (
                            <p className="clue-number" key={clue.clueNumber}>
                              {clue.clueNumber}
                            </p>
                          ))}
                        <input
                          className="cell"
                          id={(colIndex * 7 + rowIndex).toString()}
                          onKeyDown={(e) =>
                            handleChangeCell(e, rowIndex, colIndex)
                          }
                          autoComplete="off"
                          value={row[colIndex]}
                          autoFocus={
                            rowIndex == focusedCell.rowIndex &&
                            colIndex == focusedCell.colIndex
                          }
                          disabled={done}
                        />
                      </div>
                    )
                  )}
                </div>
              ))}
        </div>
        <div className="clues down">
          <p className="clues-title">Down</p>
          {down.map((clue) => (
            <div
              className="clue"
              onClick={handleClueSelect}
              id={"down-" + clue.clueNumber}
            >
              <p className="clue-card-number">{clue.clueNumber}</p>
              <p className="clue-text">{clue.clue}</p>
            </div>
          ))}
          <button
            className="submit"
            style={{
              visibility: done ? "visible" : "hidden",
              minWidth: "10em",
            }}
          >
            Congrats!
          </button>
        </div>
      </div>
    </>
  );
}
