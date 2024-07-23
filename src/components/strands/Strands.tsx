import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { SECTION } from "../../App";
import { HomeIcon } from "../../icons/HomeIcon";
import "../../styles/strands.css";

type StrandsProps = {
  setSection: Dispatch<SetStateAction<SECTION>>;
  finalLines: any[];
  setFinalLines: Dispatch<SetStateAction<any[]>>;
  pangramLines: any[];
  setPangramLines: Dispatch<SetStateAction<any[]>>;
  wordCount: number;
  setWordCount: Dispatch<SetStateAction<number>>;
  foundWords: string[];
  setFoundWords: Dispatch<SetStateAction<string[]>>;
  foundPangram: string[];
  setFoundPangram: Dispatch<SetStateAction<string[]>>;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
};

export default function Strands({
  setSection,
  finalLines,
  setFinalLines,
  pangramLines,
  setPangramLines,
  wordCount,
  setWordCount,
  foundWords,
  setFoundWords,
  foundPangram,
  setFoundPangram,
  done,
  setDone,
}: StrandsProps) {
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [letterElems, setLetterElems] = useState<any[]>([]);
  const initial = [
    ["D", "I", "P", "L", "O", "K", "I", "T"],
    ["S", "U", "I", "T", "S", "M", "A", "M"],
    ["I", "N", "E", "V", "N", "O", "C", "S"],
    ["E", "N", "C", "E", "G", "O", "O", "D"],
    ["W", "A", "T", "C", "H", "L", "I", "P"],
    ["T", "L", "I", "V", "E", "T", "S", "L"],
    ["S", "L", "L", "E", "S", "E", "R", "A"],
    ["A", "A", "O", "N", "G", "F", "S", "C"],
    ["P", "T", "H", "M", "Y", "A", "A", "E"],
    ["A", "N", "A", "C", "O", "F", "L", "L"],
  ];

  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedLetters, setDraggedLetters] = useState<string[]>([]);
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    if (dragging && letterElems.length > 1) {
      const newLines = letterElems.map((elem, index) => {
        if (index === 0) return null;
        const start = letterElems[index - 1].getBoundingClientRect();
        const end = elem.getBoundingClientRect();
        return {
          x1: start.left + start.width / 2,
          y1: start.top + start.height / 2,
          x2: end.left + end.width / 2,
          y2: end.top + end.height / 2,
        };
      });
      setLines(newLines.filter(Boolean));
    }
  }, [letterElems, dragging]);

  useEffect(() => {
    if (wordCount == 8) {
      setDone(true);
    }
  }, [wordCount]);

  function handleMouseDown(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    e.preventDefault();
    setDragging(true);
    setSelectedWord("");
    setLetterElems([e.currentTarget]);
    setDraggedLetters([e.currentTarget.id]);
    e.currentTarget.classList.add("strands-selected");
  }

  function handleMouseOver(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    if (dragging) {
      const newLetter = e.currentTarget.id;
      if (draggedLetters.includes(newLetter)) {
        let newDraggedLetters = draggedLetters;
        newDraggedLetters.pop();
        setDraggedLetters(newDraggedLetters);
        letterElems[letterElems.length - 1]?.classList.remove(
          "strands-selected"
        );
        let newLetterElems = letterElems;
        newLetterElems.pop();
        setLetterElems(newLetterElems);
        setSelectedWord(
          draggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("")
        );
        let newLines = lines;
        newLines.pop();
        setLines(newLines);
      } else {
        const newDraggedLetters = [...draggedLetters, newLetter];
        setLetterElems([...letterElems, e.currentTarget]);
        setDraggedLetters(newDraggedLetters);
        e.currentTarget.classList.add("strands-selected");
        setSelectedWord(
          draggedLetters
            .map((id) => document.getElementById(id)?.innerText)
            .join("") + e.currentTarget.innerText
        );
      }
    } else {
      letterElems.forEach((e) => e.classList.remove("strands-selected"));
    }
  }

  function handleMouseUp() {
    setDragging(false);
    setSelectedWord(
      draggedLetters
        .map((id) => document.getElementById(id)?.innerText)
        .join("")
    );

    checkWord();
    letterElems.forEach((e) => e.classList.remove("strands-selected"));
    setDraggedLetters([]);
    setLetterElems([]);
    setSelectedWord("");
  }

  const correct = [
    "DIPLOMAT",
    "SUITS",
    "KIMSCONVENIENCE",
    "GOODPLACE",
    "PASTLIVES",
    "CHALLENGERS",
    "ANATOMYOFAFALL",
  ];

  const pangram = "WATCHLIST";

  function checkWord() {
    const chosenWord = draggedLetters
      .map((id) => document.getElementById(id)?.innerText)
      .join("");
    if (correct.filter((word) => word == chosenWord).length == 1) {
      letterElems.forEach(
        (e) =>
          (document.getElementById(e.id)!.style.backgroundColor = "#aedfee")
      );
      setFinalLines([...finalLines, ...lines]);
      setWordCount(wordCount + 1);
      setFoundWords([...foundWords, ...draggedLetters]);
    } else if (chosenWord == pangram) {
      letterElems.forEach(
        (e) =>
          (document.getElementById(e.id)!.style.backgroundColor = "#f8cb2c")
      );
      setPangramLines(lines);
      setWordCount(wordCount + 1);
      setFoundPangram([...draggedLetters]);
    }
    setLines([]);
  }

  return (
    <>
      <div className="home" onClick={() => setSection(SECTION.NONE)}>
        {HomeIcon}
      </div>
      <div className="strands" style={{ height: window.innerHeight }}>
        <div className="left">
          <div className="riddle">
            <div className="theme">Today's theme</div>
            <div className="theme-text">As seen on Letterboxd</div>
          </div>
          {wordCount == 8 && (
            <button
              className="submit"
              style={{ minWidth: "10em", color: "rgb(0, 0, 0)" }}
            >
              Congrats!
            </button>
          )}
        </div>
        <div className="strands-body">
          <input className="display-word" readOnly value={selectedWord} />
          <svg className="strands-svg">
            {finalLines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#aedfee"
                strokeWidth="8"
              />
            ))}
            {pangramLines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#f8cb2c"
                strokeWidth="8"
              />
            ))}
            {lines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgb(219, 216, 197)"
                strokeWidth="8"
              />
            ))}
          </svg>
          <div
            className="strands-board"
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            {initial.map((row, rowIndex) => (
              <div className="strands-row" key={rowIndex}>
                {row.map((letter, colIndex) => {
                  const id = `${letter}-${rowIndex}-${colIndex}`;
                  return (
                    <p
                      className="letter"
                      id={`${letter}-${rowIndex}-${colIndex}`}
                      key={`${letter}-${rowIndex}-${colIndex}`}
                      onMouseDown={handleMouseDown}
                      onMouseOver={handleMouseOver}
                      onMouseUp={handleMouseUp}
                      style={{
                        backgroundColor: foundWords.includes(id)
                          ? "#aedfee"
                          : foundPangram.includes(id)
                          ? "#f8cb2c"
                          : "none",
                      }}
                    >
                      {letter}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
