import { supabase } from '@/lib/supabase';
import { AppError } from './error';
import type { PaginationParams } from '@/types';

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new AppError('ユーザー情報の取得に失敗しました。', 'AUTH_ERROR', 401);
  }
  
  if (!user) {
    throw new AppError('ログインが必要です。', 'AUTH_REQUIRED', 401);
  }
  
  return user;
};

export const getPaginatedData = async <T>(
  table: string,
  userId: string,
  params: PaginationParams,
  additionalQuery?: (query: any) => any
) => {
  const { page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from(table)
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  if (additionalQuery) {
    query = additionalQuery(query);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new AppError('データの取得に失敗しました。', 'DATABASE_ERROR', 500);
  }
  
  return {
    data: data as T[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
};

export const createRecord = async <T>(
  table: string,
  data: Partial<T>
) => {
  const { data: record, error } = await supabase
    .from(table)
    .insert([data])
    .select()
    .single();
  
  if (error) {
    throw new AppError('データの作成に失敗しました。', 'DATABASE_ERROR', 500);
  }
  
  return record as T;
};

export const updateRecord = async <T>(
  table: string,
  id: string,
  data: Partial<T>
) => {
  const { data: record, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new AppError('データの更新に失敗しました。', 'DATABASE_ERROR', 500);
  }
  
  return record as T;
};

export const deleteRecord = async (
  table: string,
  id: string
) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new AppError('データの削除に失敗しました。', 'DATABASE_ERROR', 500);
  }
};
