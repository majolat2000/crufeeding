import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

type Props = {
  size?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
};

export function CrawfordLogo({ size = 72, style, resizeMode = 'contain' }: Props) {
  return (
    <Image
      source={require('../../assets/crawford-crest.png')}
      resizeMode={resizeMode}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      accessible
      accessibilityLabel="Crawford University logo"
    />
  );
}
