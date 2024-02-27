import { proxy } from "valtio"


export interface IStore {
    "game": {
        "templateTileTable": Array<number>[],
        "tileBag": number[],
        "numberOfPlayers": number,

        "currentPlayerID": number,
        "currentStateID": number, // -1 - nem kezdodott 0- betolt 1- csempehuzas 2-lerakom 3-ellorzes(átsiklik,pontok,vége)

        "players": player[],

        "numberOfmarkets": number,
        "markets": Array<number[]>

    },
    synced: boolean,
    clients: user[],

}

export const state = proxy<IStore>(undefined);

type user = {
    id: number,
    nickname: string
}

type player = {
    id: number,
    name: string,
    points: number,
    choosenTile: {
        "type": number,
        "number": number,
        "market": number
    },
    collectorTable: Array<number[]>,
    tileTable: Array<number[]>,
    minusPointsTable: number[]
}

// -1 - nem kezdodott 0- betolt 1- csempehuzas 2-lerakom 3-ellorzes(átsiklik,pontok,vége) 5-vege

export const SetMarkets = () => {
    state.game.numberOfPlayers === 2 ? state.game.numberOfmarkets = 6 : (state.game.numberOfPlayers === 3 ? state.game.numberOfmarkets = 8 : (state.game.numberOfPlayers === 4 ? state.game.numberOfmarkets = 10 : state.game.numberOfmarkets = 2))
    state.game.markets = [[-1]] //0.index
    for (let index = 1; index < state.game.numberOfmarkets; index++) {
        state.game.markets.push([0, 0, 0, 0])
    }

    GenerateMarkets();
}
export const GenerateMarkets = () => {
    state.game.markets[0] = [-1]
    for (let index = 1; index < state.game.numberOfmarkets; index++) {

        for (let i = 0; i < 4; i++) {
            state.game.markets[index][i] = state.game.tileBag.pop() as number //2 // state.game.tileBag.shift()!

        }

    }
}
export const GetMarkets = (x: number, y: number) => {
    return state.game.markets[x][y]
}
export const SetPlayers = (x: number) => {
    state.game.numberOfPlayers = x
    let index: number
    for (index = 0; index < (x); index++) {
        state.game.players.push(
            {
                id: index,
                name: (state.clients[index].nickname.length > 0 ? state.clients[index].nickname : ("PLAYER" + index)),
                points: 0,
                choosenTile: {
                    "type": 0,
                    "number": 0,
                    "market": -2
                },
                collectorTable: [
                    [0],
                    [0, 0],
                    [0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ],
                tileTable: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ],
                minusPointsTable:
                    [0, 0, 0, 0, 0, 0, 0]
            })
    }

}
export const NewGame = () => {
    state.game.currentStateID = 0
    SetPlayers(state.clients.length)
    GenerateTilebag();
    SetMarkets();
    state.game.currentPlayerID = 0;
    state.game.currentStateID = 1
}
export const nextPlayer = () => {

    if (state.game.currentPlayerID + 1 < state.game.numberOfPlayers) {
        state.game.currentPlayerID++
    } else {
        state.game.currentPlayerID = 0
    }

}
export const GenerateTilebag = () => {
    state.game.tileBag = []
    for (let index = 0; index < 20; index++) {
        state.game.tileBag.push(1)
        state.game.tileBag.push(2)
        state.game.tileBag.push(3)
        state.game.tileBag.push(4)
        state.game.tileBag.push(5)

    }

    //randomize:
    state.game.tileBag.sort(() => Math.random() - 0.5)
}
export const freePlacesInCollectorTable = (player: number, row: number) => {
    let count = 0
    state.game.players[player].collectorTable[row].forEach((element: number) => {

        if (element === 0) {
            count++
        }
    });
    return count
}
export const CanPutInTheRow = (player: number, collectorRow: number, colorValue: number) => {
    let can = false
    if (freePlacesInCollectorTable(player, collectorRow) > 0) {
        can = true
        state.game.players[player].collectorTable[collectorRow].forEach(element => {
            if (element !== 0 && element !== colorValue) {
                can = false
            }
        });

    }
    return can

}
export const minusPointsTableLength = (player: number) => {
    let result = state.game.players[player].minusPointsTable.filter(x => x !== 0).length

    return result
}
export const DeleteTilesFromMarket = (market: number, color: number) => {
    let colorValue = state.game.markets[market][color]
    let numberOftales = 0

    if (market === 0) {
        if (state.game.markets[market][0] === -1) {
            let i = 0
            while (state.game.players[state.game.currentPlayerID].minusPointsTable[i] !== 0) {
                i++
            }
            state.game.players[state.game.currentPlayerID].minusPointsTable[i] = state.game.markets[market].shift() as number
        }

        for (var i = 0; i < state.game.markets[market].length; i++) {
            if (state.game.markets[market][i] === colorValue) {
                state.game.markets[market].splice(i, 1);
                i--
                numberOftales++
            }

        }

    } else {

        for (let index = 0; index < 4; index++) {

            if (state.game.markets[market][index] === colorValue) {
                state.game.markets[market][index] = 0
                numberOftales++
            } else {
                state.game.markets[0].push(state.game.markets[market][index])
                state.game.markets[market][index] = 0
            }
        }

    }

    return numberOftales
}
export const PutFromMarket = (market: number, color: number) => {

    let colorValue = state.game.markets[market][color]
    if (state.game.currentStateID === 1 && (state.game.players[state.game.currentPlayerID].choosenTile.type === 0) && colorValue > 0) {

        let numberOftales = DeleteTilesFromMarket(market, color)
        let player = state.game.currentPlayerID

        state.game.players[player].choosenTile.number = numberOftales
        state.game.players[player].choosenTile.type = colorValue
        state.game.players[player].choosenTile.market = market

        state.game.currentStateID = 2

    }
}
export const PutToTable = (collectorRow: number, minustable = false) => {

    if (state.game.currentStateID === 2) {

        let player = state.game.currentPlayerID
        let colorValue = state.game.players[player].choosenTile.type
        if (minustable || !state.game.players[player].tileTable[collectorRow].includes(colorValue)) {

            // if (state.game.players[state.game.currentPlayerID].choosenTile.type == 0) return
            let numberOftales = state.game.players[player].choosenTile.number
            if (minustable) {
                let minus = numberOftales

                state.game.players[player].choosenTile.number = 0
                state.game.players[player].choosenTile.type = 0

                if (minusPointsTableLength(player) < 7) {

                    let firstindex = minusPointsTableLength(player)
                    let lastindex = (minus + firstindex) < 7 ? (minus + firstindex) : 7
                    for (let index = firstindex; index < lastindex; index++) {

                        state.game.players[player].minusPointsTable[index] = colorValue
                    }
                }

            } else {

                if (freePlacesInCollectorTable(player, collectorRow) >= numberOftales) {
                    if (CanPutInTheRow(player, collectorRow, colorValue)) {

                        for (let index = 0; index < state.game.players[player].collectorTable[collectorRow].length; index++) {
                            const element = state.game.players[player].collectorTable[collectorRow][index];
                            if (element === 0 && numberOftales > 0) {
                                state.game.players[player].collectorTable[collectorRow][index] = colorValue
                                numberOftales--
                            }
                        }
                        state.game.players[player].choosenTile.number = 0
                        state.game.players[player].choosenTile.type = 0
                        state.game.players[player].choosenTile.market = -2
                    } else {
                        window.alert("This color is not matching with the ones you are collecting here!")
                        return
                    }

                }
                else {
                    let minus = numberOftales - freePlacesInCollectorTable(player, collectorRow)

                    for (let index = 0; index < state.game.players[player].collectorTable[collectorRow].length; index++) {
                        const element = state.game.players[player].collectorTable[collectorRow][index];
                        if (element === 0) {
                            state.game.players[player].collectorTable[collectorRow][index] = colorValue
                        }
                    }
                    state.game.players[player].choosenTile.number = 0
                    state.game.players[player].choosenTile.type = 0

                    let firstindex = minusPointsTableLength(player)
                    let lastindex = (minus + firstindex) <= 7 ? (minus + firstindex) : 7
                    for (let index = firstindex; index < lastindex; index++) {
                        state.game.players[player].minusPointsTable[index] = colorValue
                    }

                }

            }



            state.game.currentStateID = 3

            if (CheckRoundEnds()) {
                RoundEnds()
            } else {
                nextPlayer()
                state.game.currentStateID = 1
            }



        } else {
            window.alert("You already have this color in your table!")
        }
    }

}
export const PutFromCollectorToTileTable = (playerID: number, row: number) => {

    if (state.game.players[playerID].collectorTable[row].includes(0)) {
        return
    } else {

        let color = state.game.players[playerID].collectorTable[row][0]

        for (let index = 0; index < state.game.players[playerID].collectorTable[row].length; index++) {
            state.game.players[playerID].collectorTable[row][index] = 0
        }

        let index = 0
        let found = false
        while (index < 5 && !found) {
            if (state.game.templateTileTable[row][index] === color) {
                found = true
            } else {
                index++
            }
        }

        state.game.players[playerID].tileTable[row][index] = color
        calculatePoints(playerID, row, index)
    }
}
export const PutAllFromCollectorToTileTable = () => {

    for (let playerindex = 0; playerindex < state.game.numberOfPlayers; playerindex++) {

        for (let rowindex = 0; rowindex < 5; rowindex++) {

            PutFromCollectorToTileTable(playerindex, rowindex)

        }
    }

}
export const calculatePoints = (playerID: number, row: number, column: number) => {

    let table = state.game.players[playerID].tileTable
    let rowpoints = 0
    let columnpoints = 0
    let x = 0
    let rowUp = true
    let rowDown = true
    let columnRight = true
    let columnLeft = true

    rowpoints = 1

    while (rowUp || rowDown || columnRight || columnLeft) {
        x++
        /** A sorból származó pontok összeszámolása. */
        if (row - x < 0) {
            rowUp = false
        }

        if (rowUp) {
            table[row - x][column] !== 0 ? rowpoints++ : rowUp = false
        }

        if (row + x > 4) {
            rowDown = false
        }

        if (rowDown) {
            table[row + x][column] !== 0 ? rowpoints++ : rowDown = false
        }

        /** Az oszlopból származó pontok összeszámolása. */
        if (column - x < 0) {
            columnLeft = false
        }

        if (columnLeft) {
            table[row][column - x] !== 0 ? columnpoints++ : columnLeft = false
        }

        if (column + x > 4) {
            columnRight = false
        }

        if (columnRight) {
            table[row][column + x] !== 0 ? columnpoints++ : columnRight = false
        }


    }

    if (columnpoints > 0) {
        columnpoints++
    }


    state.game.players[playerID].points += (rowpoints + columnpoints)

    // plusz pontok kalkulálása
    let pluspoints = 0
    if (rowpoints === 5) pluspoints += 2
    if (columnpoints === 5) pluspoints += 7
    let allcolors = true

    x = 0
    while (allcolors && x < 5) {
        if (!table[x].includes(table[row][column])) allcolors = false
        x++
    }

    if (allcolors) pluspoints += 10

    state.game.players[playerID].points += pluspoints
    state.game.players[playerID].points -= calculateMinusPoints(playerID)

}
export const calculateMinusPoints = (playerID: number) => {
    let index = 0
    let minuspoints = 0
    let minusPointsArray = [1, 1, 2, 2, 2, 3, 3]
    while (state.game.players[playerID].minusPointsTable[index] !== 0 && index < 7) {
        if (state.game.players[playerID].minusPointsTable[index] === -1) state.game.currentPlayerID = playerID
        state.game.players[playerID].minusPointsTable[index] = 0
        minuspoints += minusPointsArray[index]
        index++
    }


    return minuspoints
}
export const NewRound = () => {

    if (state.game.currentStateID === 0) {
        if (state.game.tileBag.length === 0) {
            GenerateTilebag()
        }
        else {
            GenerateMarkets()
        }

        state.game.currentStateID = 1

    }




}
export const CheckRoundEnds = () => {
    let end = state.game.markets[0].length === 0

    let i = 1
    while (end && i < state.game.markets.length) {
        const market = state.game.markets[i]

        for (let index = 0; index < market.length; index++) {
            const tile = market[index];
            if (tile !== 0) {
                end = false
            }

        }

        i++
    }

    return end
}
export const CheckEndGame = () => {
    let end = false
    let playerindex = 0

    while (!end && playerindex < state.game.numberOfPlayers) {
        let playertable = state.game.players[playerindex].tileTable
        let i = 0
        while (!end && i < 5) {
            if (!playertable[i].includes(0)) end = true
            i++
        }
        playerindex++
    }

    return end
}
export const RoundEnds = () => {

    if (state.game.currentStateID === 3) {

        PutAllFromCollectorToTileTable()
        state.game.currentStateID = 0
        //NewRound()
        //vége a játéknak?
        if (CheckEndGame()) {

            GameEnds()
        } else {
            NewRound()
        }
    }

}
export const GameEnds = () => {
    state.game.currentStateID = 5

    state.game.players.sort((a, b) => b.points - a.points)

}

export function initStore() {
    Object.assign(state, {
        "game": {
            "templateTileTable": [
                [1, 2, 3, 4, 5],
                [5, 1, 2, 3, 4],
                [4, 5, 1, 2, 3],
                [3, 4, 5, 1, 2],
                [2, 3, 4, 5, 1]
            ],
            "tileBag": [0],
            "numberOfPlayers": 4,

            "currentPlayerID": 0,
            "currentStateID": -1, // -1 - nem kezdodott 0- betolt 1- csempehuzas 2-lerakom 3-ellorzes(átsiklik,pontok,vége)

            "players": [] as player[],

            "numberOfmarkets": 9,
            "markets": [
                [-1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]

        },
        synced: false,
        clients: [] as user[],

    });
}

export function addClient(clientId: number) {
    state.clients.push({ id: clientId, nickname: "" });
}
export function setSynced() {
    state.synced = true;
}