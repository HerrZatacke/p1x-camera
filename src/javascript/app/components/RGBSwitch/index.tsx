/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Switch, { switchClasses } from '@mui/material/Switch';
import type { SwitchProps } from '@mui/material/Switch/Switch';

type Channel = 'r'|'g'|'b';

interface Props extends SwitchProps {
  rgbChannel: Channel,
}

const getColors = (channel: Channel) => {
  switch (channel) {
    case 'r':
      return {
        active: '#f33',
        inactive: '#822',
      };
    case 'g':
      return {
        active: '#3f3',
        inactive: '#282',
      };
    case 'b':
    default:
      return {
        active: '#33f',
        inactive: '#228',
      };
  }
};

function RGBSwitch(props: Props) {
  const colors = getColors(props.rgbChannel);

  const styles = {
    padding: '6px 12px',
    height: '26px',
    [`& .${switchClasses.switchBase}`]: {
      top: '-6px',
      color: colors.inactive,
      [`&.${switchClasses.checked}`]: {
        color: colors.active,
        [`& + .${switchClasses.track}`]: {
          backgroundColor: colors.active,
        },
      },
    },
    [`& .${switchClasses.track}`]: {
      backgroundColor: colors.inactive,
    },
  };

  return (
    <Switch {...props} sx={styles} />
  );
}

export default RGBSwitch;
