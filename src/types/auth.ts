export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignUpFormData extends AuthFormData {
  displayName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  confirmPassword: string;
}

export interface AuthError {
  message: string;
}
