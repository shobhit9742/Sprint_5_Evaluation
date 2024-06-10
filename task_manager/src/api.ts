import axios from "axios";

const API_KEY = "MasaiSchool";
const API_TOKEN = "ATATT3xFfGF0Ke3rroVsXV5iM1lfTOzZ3g4q91gLMUzkYACWEJRSwNZrVSkY5llD3lj8CBm-I4VZokjDyS-k44pqcgOXwVobhbYkyPhyF0bWmURjhM9AMsQPL3Zr460HB6GzNCqn_liMpr6xl0N5kv4gmj1wNCVZFfkv2E0O1y0wmgI4nOrN2Fw=2C06F9E3";

const instance = axios.create({
  baseURL: "https://api.trello.com/1",
  params: {
    key: API_KEY,
    token: API_TOKEN,
  },
});

export const getBoards = () => instance.get("/members/me/boards");
export const createBoard = (name: string) =>
  instance.post("/boards/", { name });
export const deleteBoard = (id: string) => instance.delete(`/boards/${id}`);
export const getLists = (boardId: string) =>
  instance.get(`/boards/${boardId}/lists`);
export const createList = (boardId: string, name: string) =>
  instance.post(`/boards/${boardId}/lists`, { name });
export const deleteList = (id: string) => instance.delete(`/lists/${id}`);
export const getCards = (listId: string) =>
  instance.get(`/lists/${listId}/cards`);
export const createCard = (listId: string, name: string) =>
  instance.post(`/cards`, { idList: listId, name });
export const deleteCard = (id: string) => instance.delete(`/cards/${id}`);
