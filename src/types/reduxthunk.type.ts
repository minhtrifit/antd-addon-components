import { AsyncThunk } from '@reduxjs/toolkit';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
