
import React from 'react';
import { useResetPassword } from '@/hooks/useResetPassword';
import { LoadingState } from './reset-password/LoadingState';
import { InvalidTokenState } from './reset-password/InvalidTokenState';
import { SuccessState } from './reset-password/SuccessState';
import { ResetPasswordFormContent } from './reset-password/ResetPasswordFormContent';

export const ResetPasswordForm = () => {
  console.log('🔄 ResetPasswordForm component mounted');
  
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isValidToken,
    isSuccess,
    handleResetPassword
  } = useResetPassword();

  console.log('ResetPasswordForm state:', { isValidToken, isSuccess, isLoading });

  if (isValidToken === null) {
    console.log('📊 Showing LoadingState');
    return <LoadingState />;
  }

  if (isValidToken === false) {
    console.log('📊 Showing InvalidTokenState');
    return <InvalidTokenState />;
  }

  if (isSuccess) {
    console.log('📊 Showing SuccessState');
    return <SuccessState />;
  }

  console.log('📊 Showing ResetPasswordFormContent');
  return (
    <ResetPasswordFormContent
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      onSubmit={handleResetPassword}
    />
  );
};
