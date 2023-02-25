import React, { memo } from 'react';
import { FABDefault } from './components/FABDefault/FABDefault';
import { FABGroup } from './components/FABGroup/FABGroup';
import { FABProps } from './FAB.props';
import equals from 'react-fast-compare';
import R from '@app/assets/R';

const FABComponent = (props: FABProps) => {
  const { type = 'default', icon = R.images.ic_headphone, style = {} } = props;
  return type === 'default' ? <FABDefault {...{ ...props, icon, style }} /> : <FABGroup {...{ ...props, icon, style }} />;
};
export const FAB = memo(FABComponent, equals);
