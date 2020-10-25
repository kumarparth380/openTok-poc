import {Dimensions, StatusBar, Platform, PixelRatio} from 'react-native';

// iphone 11
const designWidth = 828;

const designHeight = 1792;

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export function widthAdapter(pt) {
  return (pt / designWidth) * deviceWidth;
}

export function heightAdapter(pt) {
  return (pt / designHeight) * deviceHeight;
}

export const fontscale = size => {
  console.log('PixelRatio.get() ', PixelRatio.get());
  const ratio = Platform.OS === 'android' ? 4 : 3;
  let val = (size/ratio) * PixelRatio.get() // size * PixelRatio.getFontScale();
  return val;
};

export function getStatusBarHeight() {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight;
  }
  return 20;
}

export const statusBarHeight = getStatusBarHeight();
