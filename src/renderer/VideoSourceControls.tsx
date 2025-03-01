import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { OurDisplayType } from 'main/types';
import { configSchema } from 'main/configSchema';
import InfoIcon from '@mui/icons-material/Info';
import { useSettings, setConfigValues } from './useSettings';

const ipc = window.electron.ipcRenderer;

const switchStyle = {
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#fff',
      '+.MuiSwitch-track': {
        backgroundColor: '#bb4220',
        opacity: 1.0,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
};

const VideoSourceControls: React.FC = () => {
  const [config, setConfig] = useSettings();
  const [displays, setDisplays] = useState<OurDisplayType[]>([]);
  const initialRender = React.useRef(true);

  React.useEffect(() => {
    const getDisplays = async () => {
      const allDisplays = await ipc.invoke('getAllDisplays', []);
      setDisplays(allDisplays);
    };

    getDisplays();

    // The reset of this effect handles config changes, so if it's the
    // initial render then just return here.
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setConfigValues({
      obsCaptureMode: config.obsCaptureMode,
      monitorIndex: config.monitorIndex,
      captureCursor: config.captureCursor,
    });

    ipc.sendMessage('settingsChange', []);
  }, [config.monitorIndex, config.obsCaptureMode, config.captureCursor]);

  const setOBSCaptureMode = (
    _event: React.MouseEvent<HTMLElement>,
    mode: string
  ) => {
    if (mode === null) {
      return;
    }

    setConfig((prevState) => {
      return {
        ...prevState,
        obsCaptureMode: mode,
      };
    });
  };

  const setMonitor = (
    _event: React.MouseEvent<HTMLElement>,
    display: number
  ) => {
    if (display === null) {
      return;
    }

    setConfig((prevState) => {
      return {
        ...prevState,
        monitorIndex: display,
      };
    });
  };

  const setCaptureCursor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prevState) => {
      return {
        ...prevState,
        captureCursor: event.target.checked,
      };
    });
  };

  const getToggleButton = (
    value: string | number,
    display: string | number
  ) => {
    return (
      <ToggleButton
        value={value}
        key={value}
        sx={{
          color: 'white',
          height: '40px',
          '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: '#bb4420',
          },
        }}
      >
        {display}
      </ToggleButton>
    );
  };

  const getCaptureModeToggle = () => {
    return (
      <FormControlLabel
        control={
          <ToggleButtonGroup
            value={config.obsCaptureMode}
            exclusive
            onChange={setOBSCaptureMode}
            sx={{ border: '1px solid white', height: '40px' }}
          >
            {getToggleButton('window_capture', 'window')}
            {getToggleButton('game_capture', 'game')}
            {getToggleButton('monitor_capture', 'monitor')}
          </ToggleButtonGroup>
        }
        label="Capture Mode"
        labelPlacement="top"
        sx={{ color: 'white' }}
      />
    );
  };

  const getMonitorToggle = () => {
    if (config.obsCaptureMode !== 'monitor_capture') {
      return <></>;
    }

    return (
      <FormControlLabel
        control={
          <ToggleButtonGroup
            value={config.monitorIndex}
            exclusive
            onChange={setMonitor}
            sx={{ border: '1px solid white', height: '40px' }}
          >
            {displays.map((display: OurDisplayType) =>
              getToggleButton(display.index, display.index + 1)
            )}
          </ToggleButtonGroup>
        }
        label="Monitor"
        labelPlacement="top"
        sx={{ color: 'white' }}
      />
    );
  };

  const getCursorToggle = () => {
    return (
      <FormControlLabel
        control={
          <Switch
            sx={switchStyle}
            checked={config.captureCursor}
            onChange={setCaptureCursor}
          />
        }
        label="Capture Cursor"
        labelPlacement="top"
        sx={{
          color: 'white',
        }}
      />
    );
  };

  const getInfoIcon = () => {
    const helptext = [
      ['Capture Mode', configSchema.obsCaptureMode.description].join('\n'),
      ['Monitor', configSchema.monitorIndex.description].join('\n'),
      ['Capture Cursor', configSchema.captureCursor.description].join('\n'),
    ].join('\n\n');

    return (
      <Tooltip title={<div style={{ whiteSpace: 'pre-line' }}>{helptext}</div>}>
        <IconButton>
          <InfoIcon style={{ color: 'white' }} />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {getCaptureModeToggle()}
      {getMonitorToggle()}
      {getCursorToggle()}
      {getInfoIcon()}
    </Box>
  );
};

export default VideoSourceControls;
