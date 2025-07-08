import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { ClientVideoData } from '@/hooks/useClientVideos';
import { VideoTableHeader } from './table/VideoTableHeader';
import { VideoTableRow } from './table/VideoTableRow';

interface ClientVideoTableProps {
  videos: ClientVideoData[];
  selectedVideos: string[];
  deletingVideoId: string | null;
  clientName: string;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onSelectAllVisible: () => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
}

export const ClientVideoTable = ({
  videos,
  selectedVideos,
  deletingVideoId,
  clientName,
  onVideoSelect,
  onSelectAllVisible,
  onEditVideo,
  onDeleteVideo
}: ClientVideoTableProps) => {
  const allSelected = videos.length > 0 && videos.every(video => selectedVideos.includes(video.id));

  return (
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <VideoTableHeader
          allSelected={allSelected}
          onSelectAllVisible={onSelectAllVisible}
        />
        <TableBody>
          {videos.map((video, index) => (
            <VideoTableRow
              key={video.id}
              video={video}
              index={index}
              isSelected={selectedVideos.includes(video.id)}
              clientName={clientName}
              deletingVideoId={deletingVideoId}
              onVideoSelect={onVideoSelect}
              onEditVideo={onEditVideo}
              onDeleteVideo={onDeleteVideo}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};