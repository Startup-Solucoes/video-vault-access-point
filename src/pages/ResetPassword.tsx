
import React from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  console.log('🔄 ResetPassword page component mounted');
  console.log('Current location:', window.location.href);
  
  return <ResetPasswordForm />;
};

export default ResetPassword;
