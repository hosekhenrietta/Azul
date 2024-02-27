import React from "react";
import { Statement } from "typescript";
import { useSnapshot } from "valtio";
import { End } from "./End";
import { Markets } from "./Markets";
import { Players } from "./Players";
import { state } from "../state/store";

export function Game({ room, clientId }: { room: string; clientId: number }) {
  const snap = useSnapshot(state);

  return (
    <div className="Game">
      {state.game.currentStateID === 5 ? (
        <End />
      ) : state.game.players.length !== 0 ? (
        <div>
          <div className="main-container">
            <Markets clientId={clientId as number} />
            <Players clientId={clientId as number} />
          </div>
        </div>
      ) : (
        <div></div>
      )}

    </div>
  );
}
