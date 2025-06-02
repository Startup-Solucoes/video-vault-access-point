
import React from 'react';
import { useResetPassword } from '@/hooks/useResetPassword';
import { LoadingState } from './reset-password/LoadingState';
import { InvalidTokenState } from './reset-password/InvalidTokenState';
import { SuccessState } from './reset-password/SuccessState';
import { ResetPasswordFormContent } from './reset-password/ResetPasswordFormContent';

export const ResetPasswordForm = () => {
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

  if (isValidToken === null) {
    return <LoadingState />;
  }

  if (isValidToken === false) {
    return <InvalidTokenState />;
  }

  if (isSuccess) {
    return <SuccessState />;
  }

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
