import React from 'react';
import { useEffect, useState } from 'react'
import './App.css';
import { proxy, useSnapshot } from 'valtio'
import * as Y from "yjs";
import { bindProxyAndYMap } from "valtio-yjs";
import { WebsocketProvider } from "y-websocket";
import { state, addClient, NewGame, initStore } from "./state/store";
import { nanoid } from "nanoid";
import { RoomMaker } from './components/RoomMaker';
import { WaitingRoom } from './components/WaitingRoom';
import { Game } from './components/Game';

const waitForSync = (websocketProvider : WebsocketProvider) =>
  new Promise<void>((resolve, reject) => {
    const timerId = setTimeout(() => reject("timeout"), 5000);
    websocketProvider.on("sync", (isSynced : boolean) => {
      if (isSynced) {
        clearTimeout(timerId);
        resolve();
      }
    });
  });
const createSyncedStore = async (room: string, state: any) => {
  try {
    const ydoc = new Y.Doc();
    const websocketProvider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      room,
      ydoc
    );
    await waitForSync(websocketProvider);
    // console.log("synced", websocketProvider.synced);
    const yStore = ydoc.getMap("store");
    // console.log(yStore.toJSON());
    // console.log(snapshot(store));
    bindProxyAndYMap(state, yStore);
    // console.log(yStore.toJSON());
    // console.log(snapshot(store));
    return { clientId: ydoc.clientID };
  } catch (e) {
    console.error(e);
  }
};

function App() {

  const [room, setRoom] = useState(nanoid(10));
  const [host, setHost] = useState(false);
  const [clientId, setClientId] = useState<number | null>(null);


  const [roomIsCreated, setRoomISCreated] = useState(false)
  const [gameIsStarted, setGameIsStarted] = useState(false)
  const [nameIsCreated, setNameIsCreated] = useState(false)
  const [nickname, setNickname] = useState("")

  
  const snap = useSnapshot(state)
  const synced = snap.synced


  const isEmptySnapshot = Object.keys(snap).length === 0
  const handleCreate = async () => {
    let result = await createSyncedStore(room, state)
    const clientId  = result!.clientId
    console.log(state.clients);
    
    if(state.clients === undefined)
    {
      setRoomISCreated(true)
      setClientId(clientId);
      initStore()
      addClient(clientId)
      setHost(true)
    }
    else
    {
      alert("This room is already created! Change the name to an unused roomname or try to join to the prevoius.")
    }
  };
  
  const handleJoin = async () => {
    let result = await createSyncedStore(room, state)
    const clientId  = result!.clientId;
    if(state.clients !== undefined)
    {
      setClientId(clientId);
      setRoomISCreated(true)
      addClient(clientId);
    }
    else
    {
      alert("This room is not created yet! If you click on CREATE NEW ROOM you will create it.")
    }
    
    
  };



  useEffect(() => {
    if (clientId && synced) {
      addClient(clientId);
    }
  }, [synced, clientId]);



  const handleSetRoomEvent = (e: string) => { setRoom(e) }
  const handleSetGameISStartedEvent = (e: boolean) => { setGameIsStarted(e) }
  const handleNewGameEvent = () => { NewGame() }
  const handlesetNicknameEvent = (e: string) => { setNickname(e) }
  const handlesetNameIsCreatedEvent = (e: boolean) => { setNameIsCreated(e) }



  return (
    <div className='App'>

      {!roomIsCreated ?

        <RoomMaker room={room} createRoomEvent={handleCreate} handleJoinRoom={handleJoin} setRoomEvent={handleSetRoomEvent} />
        :
        isEmptySnapshot ? null : snap.game.currentStateID === -1 ?
          <WaitingRoom room={room} host={host} clientId={clientId as number} nickname={nickname} clients={state.clients} state={state} NewGameEvent={handleNewGameEvent} setGameIsStartedEvent={handleSetGameISStartedEvent} setNicknameEvent={handlesetNicknameEvent} setNameIsCreatedEvent={handlesetNameIsCreatedEvent} />
          :
          <Game room={room} clientId={clientId as number} />
      }
    </div >
  );
}

export default App;
