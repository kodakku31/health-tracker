export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
};

export const isSupabaseError = (error: any): boolean => {
  return error?.message && error?.code && error?.details;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (isSupabaseError(error)) {
    switch (error.code) {
      case '23505':
        return '既に存在するデータです。';
      case 'P0001':
        return 'データの制約違反が発生しました。';
      default:
        return 'データベースエラーが発生しました。';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '予期せぬエラーが発生しました。';
};

export const handleAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return 'メールアドレスまたはパスワードが正しくありません。';
    }
    
    if (message.includes('email not confirmed')) {
      return 'メールアドレスが確認されていません。メールをご確認ください。';
    }
    
    if (message.includes('rate limit')) {
      return 'アクセスが集中しています。しばらく待ってから再度お試しください。';
    }
  }
  
  return 'ログインに失敗しました。';
};
