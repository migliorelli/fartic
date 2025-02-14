import { defineStore } from "pinia";
import socket from "../lib/socket";
import type { Message, Player, Room } from "../types/game";

const defaultState = {
  logged: false,
  username: null as string | null,
  socket: {
    connected: false,
    id: null as string | null,
  },
  game: {
    room: null as Room | null,
    player: null as Player | null,
    players: [] as Omit<Player, "_id">[],
    awsers: [] as Message[],
    chat: [] as Message[],
  },
};

const useGameStore = defineStore("game", {
  state: () => defaultState,
  actions: {
    bindEvents() {
      socket.on("connect", () => {
        if (socket.id) {
          this.socket.id = socket.id.toString();
          this.socket.connected = true;
        }
      });

      socket.on("chat:receive", (roomId, title, content, type) => {
        this.game.chat.push({ roomId, title, content, type });
      });

      socket.on("awser:receive", (roomId, title, content, type) => {
        this.game.chat.push({ roomId, title, content, type });
      });

      socket.on("player:joined", (socketId, username, tag) => {
        this.game.players.push({ socketId, username, tag, score: 0 });
      });

      socket.on("player:left", (socketId) => {
        this.game.players = this.game.players.filter(
          (player) => player.socketId !== socketId,
        );
      });
    },

    joinGame(roomId: string) {
      if (this.username) {
        socket.emit("room:join", roomId, this.username);
      }
    },

    leaveGame(roomId: string) {
      socket.emit("room:leave", roomId);

      this.game.awsers = [];
      this.game.chat = [];
      this.game.players = [];
      this.game.player = null;
      this.game.room = null;

      this.router.replace("/rooms");
    },

    login(username: string) {
      this.logged = true;
      this.username = username;
    },

    logout() {
      this.logged = false;
      this.username = null;
      this.router.replace({ name: "Login" });
    },
  },
  persist: {
    storage: sessionStorage,
  },
});

export default useGameStore;
