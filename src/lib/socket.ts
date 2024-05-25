import {io} from 'socket.io-client';
import { updateStrikesResult } from './stores/strikes';
import { dbstatus } from './stores/dbstatus';

const socket = io("http://localhost:3000/");

socket.on("connect", () => {
    socket.on("getfirst", (data) => {
        if (data) {
            updateStrikesResult(data);
        }
    });

    socket.on("hasilnya", (data) => {
        if (data) {
            updateStrikesResult(data.data);
        }
    });

    console.log("svelte is connected");
    dbstatus.set("connected");
});

socket.on("disconnect", () => {
    console.log("svelte is DISKONEK !!!");
    dbstatus.set("disconnected");
});

export default socket;
