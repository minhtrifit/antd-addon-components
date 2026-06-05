import { createAction } from '@reduxjs/toolkit';
import { BlogType, UserType } from '@/types';

export const toggleSidebar = createAction('users/toggleSidebar');
export const setSidebar = createAction<boolean>('users/setSidebar');
export const setUser = createAction<UserType>('users/setUser');
export const clearUser = createAction('users/clearUser');

export const updateBlog = createAction<BlogType>('users/updateBlog');
export const clearBlog = createAction('users/clearBlog');
