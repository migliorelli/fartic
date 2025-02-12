import { Room } from "@/models/rooms";
import axiosClient from "@/services/axios-service";
import { AxiosError } from "axios";

interface CreateRoomBody {
  themeId: number;
  visible: boolean;
  points: number;
  playerLimit: number;
}

export const createRoom = async (data: CreateRoomBody) => {
  try {
    const response = await axiosClient.post("/rooms/create", data);
    return { room: response.data as Room & { visible: boolean } };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    if (error.response) {
      return { error: error.response.data.message };
    }

    return { error: error.message };
  }
};

export const getRoomByPublicId = async (publicId: string) => {
  try {
    const response = await axiosClient.get(`/rooms/publicid/${publicId}`);
    if (response.data === null) {
      return { error: true };
    }

    return {
      room: response.data as Room,
    };
  } catch (err) {
    const error = err as AxiosError;
    if (error.response && error.response.status === 404) {
      return {
        error: true,
      };
    }
  }
};
