
import { supabase } from '@/integrations/supabase/client';

interface VideoNotificationData {
  videoTitle: string;
  videoDescription?: string;
  clientIds: string[];
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
