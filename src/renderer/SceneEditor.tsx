import { Box } from '@mui/material';
import React from 'react';
import { RecStatus } from 'main/types';
import RecorderPreview from './RecorderPreview';
import ChatOverlayControls from './ChatOverlayControls';
import VideoSourceControls from './VideoSourceControls';
import AudioSourceControls from './AudioSourceControls';
import VideoBaseControls from './VideoBaseControls';

interface IProps {
  recorderStatus: RecStatus;
}

const boxColor = '#141b2d';

const SceneEditor: React.FC<IProps> = (props: IProps) => {
  const { recorderStatus } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Box sx={{ width: '100%', height: '60%' }}>
        <RecorderPreview />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '50%',
          overflowY: 'scroll',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '1em',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: boxColor,
            border: '1px solid rgba(0, 0, 0, 0.6)',
            borderRadius: '5px',
            boxShadow: 3,
            p: 1,
            mt: 2,
            mx: 2,
            my: 1,
          }}
        >
          <VideoSourceControls />
        </Box>
        <Box
          sx={{
            backgroundColor: boxColor,
            border: '1px solid rgba(0, 0, 0, 0.6)',
            borderRadius: '5px',
            boxShadow: 3,
            p: 1,
            mx: 2,
            my: 1,
          }}
        >
          <VideoBaseControls recorderStatus={recorderStatus} />
        </Box>
        <Box
          sx={{
            backgroundColor: boxColor,
            border: '1px solid rgba(0, 0, 0, 0.6)',
            borderRadius: '5px',
            boxShadow: 3,
            p: 1,
            mx: 2,
            my: 1,
          }}
        >
          <AudioSourceControls />
        </Box>
        <Box
          sx={{
            backgroundColor: boxColor,
            border: '1px solid rgba(0, 0, 0, 0.6)',
            borderRadius: '5px',
            boxShadow: 3,
            p: 1,
            mx: 2,
            mt: 1,
            mb: 2,
          }}
        >
          <ChatOverlayControls />
        </Box>
      </Box>
    </Box>
  );
};

export default SceneEditor;
