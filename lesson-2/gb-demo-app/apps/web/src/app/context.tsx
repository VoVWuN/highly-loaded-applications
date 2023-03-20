import { createContext } from 'react';

type NewsType = {
  id: number;
  title: string;
  description: string;
  createdAt: number;
};

type InitialStateType = {
  news: NewsType[] | null;
};

const initialState = {
  news: [],
};

export const NewsContext = createContext<InitialStateType | null>(null);