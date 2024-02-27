import React from "react";

export function RoomMaker({ room, createRoomEvent, handleJoinRoom, setRoomEvent }: { room: string, createRoomEvent: any, handleJoinRoom: any, setRoomEvent: any }) {

  return (
    <div className="RoomMaker">

      <img className="logoimg" src={require("../img/logo.webp")} alt="" />
      <input type="text" value={room} onChange={(e) => setRoomEvent(e.target.value)} />

      <div className='ButtonDiv'>
        <button onClick={() => (room.length == 0 || room == null) ? window.alert("The input cannot be empty") : createRoomEvent()} className="roomButton" role="button"><span className="text">Create new Room</span></button>
        <button onClick={() => (room.length == 0 || room == null) ? window.alert("The input cannot be empty") : handleJoinRoom()} className="roomButton" role="button"><span className="text">Join Existing Room</span></button>
      </div>

    </div>

  );
}
