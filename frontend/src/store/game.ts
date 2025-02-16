import { defineStore } from "pinia";
import socket from "../lib/socket";
import type { GameRoom, Message, Player } from "../types/game";

const defaultState = {
  logged: false,
  username: null as string | null,
  socket: {
    connected: false,
    id: null as string | null,
  },
  game: {
    initalized: false,
    room: null as GameRoom | null,
    player: null as Player | null,
    players: [] as Player[],
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

      socket.on("game:setup", (gameRoom, player, players) => {
        this.game.room = gameRoom;
        this.game.players = players;
        this.game.player = player;
        this.game.initalized = true;
        console.log("setup");
      });

      socket.on("disconnect", () => {
        this.socket.id = null;
        this.socket.connected = false;
      });

      socket.on("chat:receive", (message) => {
        this.game.chat.push(message);
      });

      socket.on("awser:receive", (message) => {
        this.game.awsers.push(message);
      });

      socket.on("player:joined", (player) => {
        this.game.players.push(player);
      });

      socket.on("player:left", (socketId) => {
        this.game.players = this.game.players.filter(
          (player) => player.socketId !== socketId,
        );
      });
    },

    joinGame(roomTag: string) {
      if (!this.username) return;
      this.resetGame();
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Game setup timout"));
        }, 500);

        socket.once("game:setup", () => {
          clearTimeout(timeout);
          resolve();
        });

        socket.emit("room:join", roomTag, this.username!);
      });
    },

    leaveGame() {
      if (!this.game.room) return;
      socket.emit("room:leave", this.game.room.tag);
      this.resetGame();
      this.router.replace("/rooms");
    },

    resetGame() {
      this.game.initalized = false;
      this.game.room = null;
      this.game.player = null;
      this.game.players = [];
      this.game.awsers = [];
      this.game.chat = [];
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
