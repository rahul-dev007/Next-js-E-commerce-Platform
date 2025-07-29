"use client";

import { Provider } from "react-redux";
import { store } from "../store/store"; // Relative path ব্যবহার করে store ইম্পোর্ট করা হচ্ছে

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}