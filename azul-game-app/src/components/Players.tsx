import React from "react";
import { useSnapshot } from "valtio";
import { state, PutToTable } from "../state/store";
import { nanoid } from "nanoid";

export function Players({ clientId, }: { clientId: number }) {

    const snap = useSnapshot(state)
    const playerdivs = []
    let templateTable = []
    let minusPointsTable: any[] = []


    let index: number
    for (index = 0; index < snap.game.numberOfPlayers; index++) {
        minusPointsTable = []
        templateTable = []
        let currentPlayer = snap.game.players[index]



        for (let index = 0; index < 5; index++) {
            let row = []

            for (let rowindex = 0; rowindex < 5; rowindex++) {

                row.push(
                    <td
                        key={nanoid(5)} className={(currentPlayer.tileTable[index][rowindex] === 0) ? " nottile" : " tile"}
                    ><img src={
                        currentPlayer.tileTable[index][rowindex] === 0 ? require("../img/" + snap.game.templateTileTable[index][rowindex] + "_.jpg") : require("../img/" + currentPlayer.tileTable[index][rowindex] + ".jpg")} alt="" /></td>
                )
            }
            templateTable.push(
                <tr key={index}>
                    {row}
                </tr>
            )
        }

        currentPlayer.minusPointsTable.forEach(element => {

            minusPointsTable.push(
                <td key={nanoid(5)} className={(element === 0) ? " nottile" : " tile"}><img src={require("../img/" + element + ".jpg")} alt=""
                    onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(0, true) } } else { window.alert("Upsz, that's not your table :(") } }}
                /></td>
            )
        });



        let handtiles = []
        for (let index = 0; index < snap.game.players[snap.game.currentPlayerID].choosenTile.number; index++) {
            handtiles.push(
                <img key={nanoid(5)} src={require("../img/" + snap.game.players[snap.game.currentPlayerID].choosenTile.type + ".jpg")} alt="" />
            )
        }



        playerdivs.push(
            <div className={"gameTable theTables player"+index} key={currentPlayer.id}>
                <div className="playerdata">
                    <span className="playerName"> {currentPlayer.name} </span>
                    <span className="playerPoints">  {currentPlayer.points} p</span>
                    <span className="playerHand">
                        {currentPlayer.choosenTile.type > 0 ?
                            <div className="tile ">
                                {handtiles}
                            </div>
                            :
                            <div className="empty">
                                <img src={require("../img/0.png")} alt="" />
                            </div>
                        }
                    </span>
                </div>
                <div className="theTables">
                    <div className={(state.game.currentStateID === 2 && state.clients[state.game.currentPlayerID].id === clientId && state.game.currentPlayerID === index) ? "playerTable activethings" : "playerTable"}>
                        <table><tbody>
                            <tr>
                                <td>  </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="empty">
                                    <img src={require("../img/arrow.png")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(0) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" />
                                </td>
                                <td className={(currentPlayer.collectorTable[0][0] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[0][0] + ".jpg")}
                                    onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(0) } } else { window.alert("Upsz, that's not your table :(") } }}
                                    alt="" /></td>
                            </tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="empty">
                                    <img src={require("../img/arrow.png")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(1) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" />
                                </td>
                                <td className={(currentPlayer.collectorTable[1][0] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[1][0] + ".jpg")}
                                    onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(1) } } else { window.alert("Upsz, that's not your table :(") } }}
                                    alt="" /></td>
                                <td className={(currentPlayer.collectorTable[1][1] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[1][1] + ".jpg")}
                                    onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(1) } } else { window.alert("Upsz, that's not your table :(") } }}
                                    alt="" /></td>
                            </tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td className="empty">
                                    <img src={require("../img/arrow.png")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(2) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" />
                                </td>
                                <td className={(currentPlayer.collectorTable[2][0] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[2][0] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(2) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[2][1] === 0) ? " nottile" : " tile"}> <img src={require("../img/" + currentPlayer.collectorTable[2][1] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(2) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[2][2] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[2][2] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(2) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                            </tr>

                            <tr>
                                <td></td>
                                <td className="empty">
                                    <img src={require("../img/arrow.png")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(3) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" />
                                </td>
                                <td className={(currentPlayer.collectorTable[3][0] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[3][0] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(3) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[3][1] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[3][1] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(3) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[3][2] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[3][2] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(3) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[3][3] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[3][3] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(3) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                            </tr>

                            <tr>
                                <td className="empty">
                                    <img src={require("../img/arrow.png")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" />
                                </td>
                                <td className={(currentPlayer.collectorTable[4][0] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[4][0] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[4][1] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[4][1] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[4][2] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[4][2] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[4][3] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[4][3] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                                <td className={(currentPlayer.collectorTable[4][4] === 0) ? " nottile" : " tile"}><img src={require("../img/" + currentPlayer.collectorTable[4][4] + ".jpg")} onClick={() => { if (snap.clients[currentPlayer.id].id === clientId) { if (snap.clients[snap.game.currentPlayerID].id === clientId) { PutToTable(4) } } else { window.alert("Upsz, that's not your table :(") } }} alt="" /></td>
                            </tr>
                        </tbody></table>
                    </div>

                    <div className="playerTable">
                        <table><tbody>
                            {templateTable}
                        </tbody></table>
                    </div>
                </div>
                <div>
                    <table className={(state.game.currentStateID === 2 && state.clients[state.game.currentPlayerID].id === clientId && state.game.currentPlayerID === index) ? "playerTable activethings" : "playerTable"}><tbody>
                        <tr>
                            {minusPointsTable}
                        </tr>
                    </tbody></table>
                </div>

            </div>
        )
    }







    return (
        <div className="grid2x2">
            {playerdivs}
        </div>

    );
}
