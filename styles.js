import {StyleSheet} from 'react-native';
import {
  widthAdapter,
  heightAdapter,
  fontscale,
  deviceWidth,
} from './uttils/adapterUtil';
import Colors from './uttils/Colors';
import FontsSize from './uttils/FontsSize';
import FontsWeight from './uttils/FontsWeight';
import fontFamily from './uttils/FontFamily';

export default StyleSheet.create({
  header: {
    height: heightAdapter(120),
    backgroundColor: Colors.primaryAppColor,
    width: deviceWidth, //'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    fontSize: FontsSize.headerName,
    fontWeight: FontsWeight.header,
    color: Colors.primaryFontColor,
    fontFamily: fontFamily.primaryFontFamily,
  },
  Footer: {
    flexDirection: 'row',
    height: heightAdapter(150),
    backgroundColor: Colors.footerBgColor,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  footerCopyRights: {
    fontSize: FontsSize.copyRights,
    color: Colors.copyRights,
    fontFamily: fontFamily.primaryFontFamily,
  },
  footerLogoName: {
    fontSize: FontsSize.copyRights,
    color: Colors.primaryAppColor,
    fontFamily: fontFamily.primaryFontFamily,
  },
  primaryBtn: {
    width: '100%',
    height: heightAdapter(100),
    // borderWidth: widthAdapter(2),
    backgroundColor: Colors.primaryAppColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthAdapter(5),
  },
  btnName: {
    fontSize: FontsSize.primaryBtnName,
    color: Colors.primaryFontColor,
    fontWeight: 'bold',
    fontFamily: fontFamily.primaryFontFamily,
  },
  textInputContainer: {
    height: heightAdapter(100),
    width: '100%',
    marginTop: heightAdapter(20),
    marginBottom: heightAdapter(20),
    fontFamily: fontFamily.primaryFontFamily,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  textInput: {
    height: '100%',
    width: '100%',
    fontSize: FontsSize.textInput,
    color: '#666',
    borderWidth: fontscale(1),
    borderRadius: fontscale(3),
    padding: widthAdapter(10),
    fontFamily: fontFamily.primaryFontFamily,
  },
  captionText: {
    position: 'absolute',
    top: fontscale(-15),
    left: widthAdapter(30),
    // height: widthAdapter(50),
    fontSize: fontscale(20),
    backgroundColor: Colors.white,
    // padding: widthAdapter(10),
    fontFamily: fontFamily.primaryFontFamily,
    // color: '#22caff',
    // color: 'Black',
  },
  roundBtn: {
    height: widthAdapter(150),
    width: widthAdapter(150),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    width: widthAdapter(100),
    height: heightAdapter(100),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'white',
    // borderWidth: 2,
  },
  menuLine: {
    width: widthAdapter(75),
    height: heightAdapter(5),
    backgroundColor: Colors.white,
    margin: widthAdapter(10),
    borderRadius: widthAdapter(5),
  },
});
