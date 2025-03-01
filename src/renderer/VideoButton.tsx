import {
  Box,
  Button,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderIcon from '@mui/icons-material/Folder';
import React, { useEffect, useState } from 'react';
import { RendererVideo, TNavigatorState } from 'main/types';
import {
  getPlayerClass,
  getPlayerName,
  getPlayerRealm,
  getPlayerSpecID,
  getResultColor,
  isArenaUtil,
  isBattlegroundUtil,
  isMythicPlusUtil,
  isRaidUtil,
  getFormattedDuration,
  getWoWClassColor,
  getVideoTime,
  getVideoDate,
} from './rendererutils';
import * as Images from './images';
import ArenaCompDisplay from './ArenaCompDisplay';
import DungeonCompDisplay from './DungeonCompDisplay';
import RaidEncounterInfo from './RaidEncounterInfo';
import BattlegroundInfo from './BattlegroundInfo';
import DungeonInfo from './DungeonInfo';
import ArenaInfo from './ArenaInfo';
import RaidCompAndResult from './RaidCompAndResult';

interface IProps {
  video: RendererVideo;
  categoryState: RendererVideo[];
  selected: boolean;
  setNavigation: React.Dispatch<React.SetStateAction<TNavigatorState>>;
}

export default function VideoButton(props: IProps) {
  const { video, categoryState, selected, setNavigation } = props;
  const { isProtected, fullPath, imagePath } = video;
  const formattedDuration = getFormattedDuration(video);
  const isMythicPlus = isMythicPlusUtil(video);
  const isRaid = isRaidUtil(video);
  const isBattleground = isBattlegroundUtil(video);
  const isArena = isArenaUtil(video);
  const resultColor = getResultColor(video);
  const playerName = getPlayerName(video);
  const playerRealm = getPlayerRealm(video);
  const playerClass = getPlayerClass(video);
  const playerClassColor = getWoWClassColor(playerClass);
  const playerSpecID = getPlayerSpecID(video);
  const videoTime = getVideoTime(video);
  const videoDate = getVideoDate(video);
  const specIcon = Images.specImages[playerSpecID];
  const bookmarkOpacity = isProtected ? 1 : 0.2;
  const deleteOpacity = selected ? 0.2 : 1;

  const [ctrlDown, setCtrlDown] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        setCtrlDown(false);
      }
    });
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        setCtrlDown(true);
      }
    });
  });

  const [deletePopoverAnchor, setDeletePopoverAnchor] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(deletePopoverAnchor);

  const openDeletePopover = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDeletePopoverAnchor(deletePopoverAnchor ? null : event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDeletePopoverAnchor(null);
  };

  const deleteVideo = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // We need to decrement the videoIndex in-case the final video in the list
    // is selected. The delete causes the list to shrink and we don't want to
    // end up attempting to dereference an undefined variable off the end of
    // the list.
    setNavigation((prevState) => {
      return {
        ...prevState,
        videoIndex:
          prevState.videoIndex > 0
            ? prevState.videoIndex - 1
            : prevState.videoIndex,
      };
    });

    window.electron.ipcRenderer.sendMessage('videoButton', [
      'delete',
      fullPath,
    ]);
  };

  const protectVideo = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    window.electron.ipcRenderer.sendMessage('videoButton', ['save', fullPath]);
  };

  const openLocation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    window.electron.ipcRenderer.sendMessage('videoButton', ['open', fullPath]);
  };

  const deleteClicked = (event: React.MouseEvent<HTMLElement>) => {
    if (ctrlDown) {
      deleteVideo(event);
    } else {
      openDeletePopover(event);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '80px',
      }}
    >
      <Box
        sx={{
          height: '80px',
          width: '200px',
        }}
      >
        <Box
          component="img"
          src={imagePath}
          sx={{
            border: '1px solid black',
            borderRadius: '5px',
            boxSizing: 'border-box',
            height: '80px',
            width: '200px',
            objectFit: 'contain',
            backgroundColor: 'black',
          }}
        />
      </Box>

      <Box
        sx={{
          border: '1px solid black',
          borderRadius: '5px',
          boxSizing: 'border-box',
          bgcolor: resultColor,
          ml: 2,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '15% 25% 20% 8% 8% 8% 15%',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={specIcon}
            sx={{
              height: '25px',
              width: '25px',
              border: '1px solid black',
              borderRadius: '15%',
              boxSizing: 'border-box',
              objectFit: 'cover',
            }}
          />

          <Typography
            sx={{
              color: playerClassColor,
              fontWeight: '600',
              fontFamily: '"Arial",sans-serif',
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {playerName}
          </Typography>

          <Typography
            sx={{
              color: 'white',
              fontWeight: '600',
              fontFamily: '"Arial",sans-serif',
              fontSize: '0.7rem',
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {playerRealm}
          </Typography>
        </Box>

        <Box
          sx={{
            gridColumnStart: 2,
            gridColumnEnd: 3,
          }}
        >
          {isArena && <ArenaInfo video={video} />}
          {isMythicPlus && <DungeonInfo video={video} />}
          {isRaid && <RaidEncounterInfo video={video} />}
          {isBattleground && <BattlegroundInfo video={video} />}
        </Box>

        <Box
          sx={{
            gridColumnStart: 3,
            gridColumnEnd: 4,
          }}
        >
          {isArena && <ArenaCompDisplay video={video} />}
          {isMythicPlus && <DungeonCompDisplay video={video} />}
          {isRaid && (
            <RaidCompAndResult
              video={video}
              raidCategoryState={categoryState}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gridColumnStart: 4,
            gridColumnEnd: 5,
          }}
        >
          <HourglassBottomIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              color: 'white',
              fontWeight: '600',
              fontFamily: '"Arial",sans-serif',
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {formattedDuration}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gridColumnStart: 5,
            gridColumnEnd: 6,
          }}
        >
          <AccessTimeIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              color: 'white',
              fontWeight: '600',
              fontFamily: '"Arial",sans-serif',
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {videoTime}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gridColumnStart: 6,
            gridColumnEnd: 7,
          }}
        >
          <EventIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              color: 'white',
              fontWeight: '600',
              fontFamily: '"Arial",sans-serif',
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {videoDate}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gridColumnStart: 7,
            gridColumnEnd: 8,
            p: 2,
          }}
        >
          <Tooltip title="Never age out">
            <IconButton onClick={protectVideo}>
              <BookmarksIcon
                sx={{ color: 'white', opacity: bookmarkOpacity }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open location">
            <IconButton onClick={openLocation}>
              <FolderIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <div>
              <IconButton disabled={selected} onClick={deleteClicked}>
                <DeleteForeverIcon
                  sx={{ color: 'white', opacity: deleteOpacity }}
                />
              </IconButton>
            </div>
          </Tooltip>
          <Popover
            anchorEl={deletePopoverAnchor}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid white',
                borderRadius: '5px',
                p: 1,
                width: '250px',
                bgcolor: '#272e48',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '0.75rem', m: 1 }}>
                Are you sure you want to permanently delete this video? Hint:
                Hold CTRL to skip this prompt.
              </Typography>
              <Button
                key="delete-video-button"
                variant="outlined"
                onClick={deleteVideo}
                sx={{
                  m: '4px',
                  color: 'white',
                  width: '100px',
                  borderColor: 'white',
                  ':hover': {
                    color: '#bb4420',
                    borderColor: '#bb4420',
                  },
                }}
              >
                Yes
              </Button>
            </Box>
          </Popover>
        </Box>
      </Box>
    </Box>
  );
}
