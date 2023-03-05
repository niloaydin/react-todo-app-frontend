import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Created a component holding base url, so it will easier to make changes
const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log("base url", BASE_URL);

//Configure the api callbacks from which I will get data,
//and send the information to components to use

export const getTodos = createAsyncThunk("getTodos", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const addTodo = createAsyncThunk("addTodo", async (payload) => {
  const response = await axios.post(BASE_URL, payload);

  return response.data;
});

export const deleteTodo = createAsyncThunk("deleteTodo", async (payload) => {
  const response = await axios.delete(BASE_URL + `${payload._id}`);

  return response.data;
});

export const toggleTodo = createAsyncThunk("toggleTodo", async (payload) => {
  const response = await axios.patch(BASE_URL + `${payload._id}`, payload);

  return response.data;
});
export const editTodo = createAsyncThunk("editTodo", async (payload) => {
  console.log("main function payload", payload);
  const response = await axios.patch(BASE_URL + `${payload._id}`, payload);

  return response.data;
});

//Created the initial states
const initialState = {
  todos: [],
  loading: false,
  isEditing: false,
  error: "",
  editingId: null,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    //This reducer is changing the state of isEditing so that I can use modal in components
    changeIsEditing: (state, action) => {
      state.isEditing = action.payload.isEditing;
      state.editingId = action.payload.editingId;
    },
  },

  extraReducers: {
    //Handled the async data in here, and used these functions in components
    [getTodos.fulfilled]: (state, action) => {
      state.todos = action.payload;
    },

    //I get the action payload from api calls and send the new todo to todos array
    [addTodo.fulfilled]: (state, action) => {
      state.todos.push(action.payload);
    },

    [deleteTodo.fulfilled]: (state, action) => {
      //Find the todo from the todos state whose id does match the deleted todo's id
      state.todos = state.todos.filter(
        (todo) => todo._id !== action.payload._id
      );
    },

    [toggleTodo.fulfilled]: (state, action) => {
      //Find the todo from the todos state whose id matches with toggled Todo
      const findTheTodoToToggle = state.todos.find(
        (todo) => todo._id === action.payload._id
      );
      //After I find the todo, I change its completed property with data coming from async functions payload
      findTheTodoToToggle.completed = action.payload.completed;
      state.loading = false;
    },

    [editTodo.pending]: (state) => {
      state.isEditing = true;
    },

    [editTodo.fulfilled]: (state, action) => {
      //Find the todo from the todos state whose id matches with edited Todo
      const findTheTodoToEdit = state.todos.find(
        (todo) => todo._id === action.payload._id
      );
      //After I find the todo, I change its text with data coming from async functions payload
      findTheTodoToEdit.text = action.payload.text;
      state.isEditing = false;
    },
  },
});

export const { changeIsEditing } = todoSlice.actions;

export default todoSlice.reducer;