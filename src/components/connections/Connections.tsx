import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../../styles/connections.css";
import { SECTION } from "../../App";
import { HomeIcon } from "../../icons/HomeIcon";

export type Row = {
  category: string;
  level: number;
  items: string[];
};

type ConnectionsProps = {
  setSection: Dispatch<SetStateAction<SECTION>>;
  rows: Row[];
  setRows: Dispatch<SetStateAction<Row[]>>;
  noShow: string[];
  setNoShow: Dispatch<SetStateAction<string[]>>;
  done: boolean;
  setDone: Dispatch<SetStateAction<boolean>>;
};

export default function Connections({
  setSection,
  rows,
  setRows,
  noShow,
  setNoShow,
  done,
  setDone,
}: ConnectionsProps) {
  // edited to match NYT Connections from 23/07/2024
  let correct: Row[] = [
    {
      category: "Impostor",
      level: 1,
      items: ["Charlatan", "Fraud", "Quack", "Sham"],
    },
    {
      category: "Utterance",
      level: 3,
      items: ["Noise", "Peep", "Sound", "Word"],
    },
    {
      category: "One who likes showing off",
      level: 2,
      items: ["Ham", "Hot Dog", "Peacock", "Showboat"],
    },
    {
      category: "Looney tunes characters minus a letter",
      level: 4,
      items: ["Bug", "Pork", "Speed", "Tweet"],
    },
  ];

  let items = [
    "Hot Dog",
    "Word",
    "Bug",
    "Tweet",
    "Peep",
    "Pork",
    "Peacock",
    "Quack",
    "Ham",
    "Sham",
    "Speed",
    "Sound",
    "Fraud",
    "Noise",
    "Showboat",
    "Charlatan",
  ];

  const backgrounds = [
    "rgb(249, 223, 109)",
    "rgb(176, 196, 239)",
    "rgb(160, 195, 90)",
    "rgb(186, 129, 197)",
  ];

  useEffect(() => {
    if (rows.length == 4) {
      setDone(true);
    }
  }, [rows]);

  function setSubmitFill() {
    document.getElementById("submit")!.style.backgroundColor = "rgb(0, 0, 0)";
    document.getElementById("submit")!.style.color = "rgb(255, 255, 255)";
    document.getElementById("submit")!.style.border = "none";
  }

  function setSubmitDefault() {
    document.getElementById("submit")!.style.backgroundColor =
      "rgb(255, 255, 255)";
    document.getElementById("submit")!.style.color = "rgb(127, 127, 127)";
    document.getElementById("submit")!.style.borderColor = "rgb(127, 127, 127)";
    document.getElementById("submit")!.style.borderStyle = "solid";
    document.getElementById("submit")!.style.borderWidth = "1px";
  }

  function selectItem(el: any) {
    if (el.tagName == "P") {
      el = el.parentNode;
    }
    if (document.querySelectorAll(".selected").length < 4) {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      } else {
        el.classList.add("selected");
      }
    } else {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      }
    }

    if (document.querySelectorAll(".selected").length == 4) {
      setSubmitFill();
    } else {
      setSubmitDefault();
    }
  }

  function correctItems(value: Row) {
    setSubmitDefault();
    document.querySelectorAll(".selected").forEach((item) => {
      item.classList.remove("selected");
    });
    setNoShow([...noShow, ...value.items]);

    setRows([...rows, value]);
  }

  function checkItems() {
    let submitted: string[] = [];
    document
      .querySelectorAll(".selected")
      .forEach((item) => submitted.push(item.textContent || ""));
    if (submitted.length == 4) {
      correct.map(
        (row) =>
          row.items
            .sort()
            .filter((item, index) => item == submitted.sort()[index]).length ==
            4 && correctItems(row)
      );
    }
  }

  return (
    <>
      <div className="home" onClick={() => setSection(SECTION.NONE)}>
        {HomeIcon}
      </div>
      <div className="body" style={{ height: window.innerHeight }}>
        <div className="board">
          {rows.map((item) => (
            <div
              className="row"
              style={{ backgroundColor: backgrounds[item.level - 1] }}
            >
              <p className="row-category">{item.category}</p>
              <p className="row-items">
                {item.items.toString().replaceAll(",", ", ")}
              </p>
            </div>
          ))}
          {items.map(
            (item) =>
              !noShow.includes(item) && (
                <div
                  className="item"
                  onClick={(e) => selectItem(e.target)}
                  id={item}
                >
                  <p>{item}</p>
                </div>
              )
          )}
        </div>
        <div className="footer">
          {rows.length != 4 ? (
            <button className="submit" id="submit" onClick={checkItems}>
              Submit
            </button>
          ) : (
            <button
              className="submit"
              style={{ minWidth: "10em", color: "rgb(0, 0, 0)" }}
            >
              Congrats!
            </button>
          )}
        </div>
      </div>
    </>
  );
}
