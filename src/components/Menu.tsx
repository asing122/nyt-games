import { SECTION } from "../App";
import { AceClubs } from "../icons/AceClubs";
import { SixDiamonds } from "../icons/SixDiamonds";
import { KingSpades } from "../icons/KingSpades";
import { QueenHearts } from "../icons/QueenHearts";
import "../styles/menu.css";
import { Dispatch, SetStateAction } from "react";
export type MenuProps = {
  setSection: Dispatch<SetStateAction<SECTION>>;
  connectionsDone: boolean;
  strandsDone: boolean;
  miniDone: boolean;
  vertexDone: boolean;
};

export default function Menu({
  setSection,
  connectionsDone,
  strandsDone,
  miniDone,
  vertexDone,
}: MenuProps) {
  return (
    <div
      className="menu-container"
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <div className="menu">
        <div
          className="game-card"
          onClick={() => setSection(SECTION.CONNECTIONS)}
        >
          {KingSpades(connectionsDone)}
        </div>
        <div className="game-card" onClick={() => setSection(SECTION.STRANDS)}>
          {SixDiamonds(strandsDone)}
        </div>
        <div className="game-card" onClick={() => setSection(SECTION.VERTEX)}>
          {QueenHearts(vertexDone)}
        </div>
        <div className="game-card" onClick={() => setSection(SECTION.MINI)}>
          {AceClubs(miniDone)}
        </div>
      </div>
    </div>
  );
}
