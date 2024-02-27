import React from "react";
import { state } from "../state/store";
import { nanoid } from "nanoid";
import { useSnapshot } from "valtio";

export function End() {
  const snap = useSnapshot(state)
  return (
    <div className="End">
      <div className="endcard">
        <p>The game is over </p>
        <span>WINNERS TABLE </span>
        <div className="playerlist">
          <table>
            <thead>
              <th>Name</th>
              <th>Points</th>
            </thead>
            <tbody>
            {snap.game.players.map((el) => (
              <tr key={nanoid(5)}>
                <td className="tablename">{el.name}</td>
                <td className="tablepoints">{el.points}{" "}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <button className="saveNameButton copyButton" onClick={() => { window.location.reload() }} ><span>home</span></button>   
      </div>
    </div>
  );
}
