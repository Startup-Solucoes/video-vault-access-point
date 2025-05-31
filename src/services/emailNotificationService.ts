
import { supabase } from '@/integrations/supabase/client';

interface VideoNotificationData {
  videoTitle: string;
  videoDescription?: string;
  categories: string[];
  clientIds: string[];
  adminId: string;
}

interface ClientConfirmationData {
  clientName: string;
  clientEmail: string;
}

export const sendVideoNotifications = async (data: VideoNotificationData): Promise<boolean> => {
  try {
    console.log('Sending video notifications:', data);

    const { data: response, error } = await supabase.functions.invoke('send-video-notification', {
      body: data
    });

    if (error) {
      console.error('Error sending video notifications:', error);
      return false;
    }

    console.log('Video notifications sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error in sendVideoNotifications:', error);
    return false;
  }
};

export const sendClientConfirmationEmail = async (data: ClientConfirmationData): Promise<boolean> => {
  try {
    console.log('Sending client confirmation email:', data);

    const { data: response, error } = await supabase.functions.invoke('send-client-confirmation', {
      body: data
    });

    if (error) {
      console.error('Error sending client confirmation email:', error);
      return false;
    }

    console.log('Client confirmation email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error in sendClientConfirmationEmail:', error);
    return false;
  }
};

export const getUserAuthInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-user-auth-info', {
      body: { user_id: userId }
    });

    if (error) {
      console.error('Error getting user auth info:', error);
      return { email_confirmed_at: null, last_sign_in_at: null };
    }

    return data;
  } catch (error) {
    console.error('Error in getUserAuthInfo:', error);
    return { email_confirmed_at: null, last_sign_in_at: null };
  }
};
