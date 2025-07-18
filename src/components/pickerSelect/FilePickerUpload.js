import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {COLORS} from '../../themes/themes';
import FormInputTitle from '../form/FormInputTitle';
import UploadButtons from '../form/UploadButtons';

const FilePickerUpload = ({
  formTitle,
  image,
  onOpenGallery,
  previewFile,
  removeFile,
}) => {
  return (
    <View style={styles.coverArtContainer}>
      <FormInputTitle formTitle={formTitle} />

      {!image ? (
        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.uploadContainer]}
            onPress={onOpenGallery}>
            <Ionicons
              name="folder-outline"
              color={COLORS.vtbBtnColor}
              size={50}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewWrapper}>
          <TouchableOpacity
            activeOpacity={0.9}
            // style={[styles.uploadContainer]}
            onPress={previewFile}>
            <Image source={{uri: image}} style={styles.uploadContainer} />
          </TouchableOpacity>
          {/* Floating 'X' Button */}
          <TouchableOpacity style={styles.cancelIcon} onPress={removeFile}>
            <Ionicons name="close-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FilePickerUpload;

const styles = StyleSheet.create({
  coverArtContainer: {
    width: windowWidth / 1.1,
    height: windowHeight / 4,
    // backgroundColor: 'red',
    // marginLeft: 20,
    justifyContent: 'center',
    alignContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
    // marginBottom: 20,
    // marginTop: 20,
  },
  uploadContainer: {
    width: windowWidth / 1.1,
    height: 150,
    // backgroundColor: COLORS.rendezvousRed,
    // marginLeft: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // borderWidth: 1,
    // borderStyle: 'dashed',
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.vtbBtnColor,
  },
  // cancelIcon: {
  //   position: 'absolute',
  //   zIndex: 999,
  //   opacity: 0.9,
  //   backgroundColor: 'black',
  //   right: 0,
  //   top: 0,
  // },
  imageContainer: {
    width: windowWidth / 1.1,
    height: windowHeight / 5,
    // backgroundColor: 'green',
    // marginLeft: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    marginBottom: 10,
  },
  imageUpload: {
    // width: 67,
    // height: 67,
    // backgroundColor: 'green',
    // marginLeft: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    borderColor: COLORS.ndonuBlueColor,
    borderStyle: 'dashed',
    borderRadius: 40,
    borderWidth: 1,
  },
  uploadImageArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadedImage: {
    width: 67,
    height: 67,
    borderRadius: 40,
  },
  paddingTips: {
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.appGrey4,
    borderRadius: 16,
  },
  paddingTipsText: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.appGrey5,
  },
  previewWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    // zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
});
