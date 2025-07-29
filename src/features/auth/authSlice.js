import { createSlice } from '@reduxjs/toolkit';

// একটি ফাংশন তৈরি করুন যা শুধুমাত্র ক্লায়েন্ট সাইডে localStorage অ্যাক্সেস করবে
const getInitialState = () => {
  // প্রথমে চেক করুন কোডটি ব্রাউজারে চলছে কিনা
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken ? storedToken : null,
    };
  }

  // যদি সার্ভারে চলে, তাহলে initialState হবে null
  return {
    user: null,
    token: null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // localStorage-এ সেভ করার সময়ও চেক করা ভালো, যদিও reducers ক্লায়েন্টেই চলে
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      }
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;