import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {useDispatch, useSelector} from 'react-redux';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

import axiosInstance from '../../utils/api-client';
import FilePickerUpload from '../pickerSelect/FilePickerUpload';
import SafeAreaViewComponent from './SafeAreaViewComponent';
import FormButton from '../form/FormButton';
import {windowWidth} from '../../utils/Dimensions';
import ScrollViewSpace from './ScrollViewSpace';
import {checkDriverProfile} from '../../services/userServices';
import {getUser} from '../../redux/features/user/userSlice';
import {COLORS} from '../../themes/themes';

const DriverNotVerifiedComponent = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  const hasVerificationData = userProfle?.User?.verification;

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [selectedFiles, setSelectedFiles] = useState({});
  console.log(
    'hasVerificationData',
    hasVerificationData,
    selectedFiles,
    userProfle,
  );

  const REQUIRED_KEYS = ['driverLicense', 'proofOfAddress'];
  const areAllRequiredFilesSelected = () => {
    return REQUIRED_KEYS?.every(key => selectedFiles[key]?.uri);
  };

  const generateUniquePath = async (basePath, fileName) => {
    let name = fileName;
    let i = 1;

    const extIndex = fileName.lastIndexOf('.');
    const nameOnly = extIndex !== -1 ? fileName.slice(0, extIndex) : fileName;
    const extension = extIndex !== -1 ? fileName.slice(extIndex) : '';

    while (await RNFS.exists(`${basePath}/${name}`)) {
      name = `${nameOnly} (${i})${extension}`;
      i++;
    }

    return `${basePath}/${name}`;
  };

  const safeCopyFile = async (fileUri, fileName) => {
    const newPath = await generateUniquePath(
      RNFS.DocumentDirectoryPath,
      fileName,
    );
    await RNFS.copyFile(fileUri, newPath);
    return 'file://' + newPath;
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Calling fleet manager...', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Call', onPress: () => console.log('Calling...')},
    ]);
  };

  const beginVerification = async () => {
    const verificationData = {
      contactInfo: {
        email: userProfle?.User?.email,
        phone: userProfle?.phoneNumber,
        address: userProfle?.address,
      },
    };
    console.log('verificationData', verificationData);
    setLoading(true);
    try {
      await axiosInstance({
        url: 'api/verification/verify',
        method: 'POST',
        data: verificationData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          console.log('beginVerification res', res?.data);

          if (res?.data) {
            console.log('beginVerification data', res?.data);
            uploadDocuments();
          }
        })
        .catch(err => {
          console.log('beginVerification err', err?.response);
          setLoading(false);
        });
    } catch (error) {
      console.log('beginVerification error', error?.response);
      setLoading(false);
    }
  };

  const uploadDocuments = async () => {
    const formData = new FormData();

    Object.values(selectedFiles).forEach(file => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: 1024,
      });
    });

    console.log('formData', formData);
    setLoading(true);

    try {
      await axiosInstance({
        url: 'api/verification/upload',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
        .then(res => {
          console.log('res', res?.data);
          setLoading(false);

          if (res?.data) {
            console.log('uploadDocuments data', res?.data);
            checkDriverProfile(dispatch, getUser, axiosInstance, setLoading);
          }
        })
        .catch(err => {
          console.log('uploadDocuments err', err?.response);
          setLoading(false);
          setFormError('An error occured while uploading your documents');
        });
    } catch (error) {
      console.log('uploadDocuments error', error?.response);
      setLoading(false);
      setFormError('An error occured while uploading your documents');
    }
  };

  const pickDocument = async key => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log('Selected file:', result);
      const pickedFile = result[0];

      const safeUri = await safeCopyFile(pickedFile?.uri, pickedFile?.name);

      setSelectedFiles(prev => ({
        ...prev,
        [key]: {
          ...pickedFile,
          uri: safeUri,
        },
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.log('Unknown error:', err);
      }
    }
  };

  const previewSelectedFile = key => {
    const file = selectedFiles[key];
    if (!file?.uri) {
      return;
    }

    FileViewer.open(file.uri, {showOpenWithDialog: true})
      .then(() => console.log('Opened'))
      .catch(error => console.log('Preview error:', error));
  };

  const removeSelectedFile = key => {
    setSelectedFiles(prev => {
      const updatedFiles = {...prev};
      delete updatedFiles[key];
      return updatedFiles;
    });
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    checkDriverProfile(dispatch, getUser, axiosInstance, setLoading);
  }, []);

  return (
    <SafeAreaViewComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.vtbBtnColor}
            style={{zIndex: 999}}
          />
        }>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.truckIcon}>🚛</Text>
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Verification Required</Text>
        <Text style={styles.subtitle}>
          To start driving, please complete your verification process. Upload
          your required documents now to get verified.
        </Text>

        <FilePickerUpload
          formTitle="Drivers License *"
          onOpenGallery={() => pickDocument('driverLicense')}
          image={selectedFiles?.driverLicense?.uri}
          previewFile={() => previewSelectedFile('driverLicense')}
          removeFile={() => removeSelectedFile('driverLicense')}
        />

        <FilePickerUpload
          formTitle="Proof of Address (Utility Bill) *"
          onOpenGallery={() => pickDocument('proofOfAddress')}
          image={selectedFiles?.proofOfAddress?.uri}
          previewFile={() => previewSelectedFile('proofOfAddress')}
          removeFile={() => removeSelectedFile('proofOfAddress')}
        />

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <FormButton
            title={'Upload Documents'}
            onPress={!hasVerificationData ? beginVerification : uploadDocuments}
            loading={loading}
            disabled={loading || !areAllRequiredFilesSelected()}
            formError={formError}
          />

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={handleContactSupport}
            activeOpacity={0.7}>
            <Text style={styles.tertiaryButtonText}>
              📞 Contact Fleet Manager
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.boldText}>Pro Tip:</Text> Verification
            typically takes 5-15 minutes during peak hours
          </Text>
          <Text style={styles.infoText}>
            - Upload files in PDF or doc format
          </Text>
        </View>
        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default DriverNotVerifiedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 24,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    // lineHeight: 24,
  },
  actionContainer: {
    justifyContent: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    width: windowWidth / 1.2,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
