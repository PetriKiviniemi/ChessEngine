import axios, { AxiosResponse } from "axios";

export interface ChessMoveData {
  legalMoves: string[];
  bestMoves: string;
}

const API_URL = "https://localhost:8080/api/chess/";
const api = axios.create({
  baseURL: API_URL,
});

export const fetchMoveData = async (
  boardState: string
): Promise<ChessMoveData | null> => {
  try {
    const response: AxiosResponse<ChessMoveData> = await api.post(
      "/get-move-data",
      boardState
    );
    return response.data;
  } catch (error) {
    console.error("FAILED TO POST TO API");
    return null;
  }
};
