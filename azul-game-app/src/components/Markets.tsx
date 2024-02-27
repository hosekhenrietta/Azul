import React from "react";
import { useSnapshot } from "valtio";
import { state, GetMarkets, PutFromMarket } from "../state/store";
import { nanoid } from "nanoid";

export function Markets({ clientId }: { clientId: number }) {
    const snap = useSnapshot(state)
    let marketdivs = []
    for (let index = 1; index < snap.game.numberOfmarkets; index++) {

        marketdivs.push(
            <div key={index} className="markets">

                <div className="marketsLine">
                    <div className={(GetMarkets(index, 0) === 0) ? "marketsTile empty" : "marketsTile tile"}><img src={require("../img/" + GetMarkets(index, 0) + ((GetMarkets(index, 0) === 0) ? ".png" : ".jpg"))} onClick={() => { if (snap.clients[snap.game.currentPlayerID].id === clientId) PutFromMarket(index, 0); }} alt="" /></div>
                    <div className={(GetMarkets(index, 1) === 0) ? "marketsTile empty" : "marketsTile tile"}><img src={require("../img/" + GetMarkets(index, 1) + ((GetMarkets(index, 1) === 0) ? ".png" : ".jpg"))} onClick={() => { if (snap.clients[snap.game.currentPlayerID].id === clientId) PutFromMarket(index, 1); }} alt="" /></div>
                </div>
                <div className="marketsLine">
                    <div className={(GetMarkets(index, 2) === 0) ? "marketsTile empty" : "marketsTile tile"}><img src={require("../img/" + GetMarkets(index, 2) + ((GetMarkets(index, 2) === 0) ? ".png" : ".jpg"))} onClick={() => { if (snap.clients[snap.game.currentPlayerID].id === clientId) PutFromMarket(index, 2); }} alt="" /></div>
                    <div className={(GetMarkets(index, 0) === 0) ? "marketsTile empty" : "marketsTile tile"}><img src={require("../img/" + GetMarkets(index, 3) + ((GetMarkets(index, 3) === 0) ? ".png" : ".jpg"))} onClick={() => { if (snap.clients[snap.game.currentPlayerID].id === clientId) PutFromMarket(index, 3); }} alt="" /></div>
                </div>

            </div>
        )
    }
    let row = []
    for (let index = 0; index < snap.game.markets[0].length; index++) {
        const element = snap.game.markets[0][index];
        row.push(
            <div key={index} className={(element === 0) ? "marketsTile nottile" : "marketsTile tile"} >
                <img src={require("../img/" + element + ".jpg")} onClick={() => {
                    if (snap.clients[snap.game.currentPlayerID].id === clientId) PutFromMarket(0, index); console.log(snap.clients[snap.game.currentPlayerID].id === clientId);
                }} alt="" />
            </div>
        )
    }

    marketdivs.push(
        <div key={nanoid(10)} className="lastmarket" >
            {row}
        </div>
    )


    return (
        <div className="Markets">
            <div className= {(state.game.currentStateID === 1 && state.clients[state.game.currentPlayerID].id === clientId )? "row-1 activethings": "row-1"}>
                {marketdivs}
            </div>
        </div>

    );
}
