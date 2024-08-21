import { Platform, useWindowDimensions } from 'react-native';

const useResponsiveStyles = () => {
    const { width, height } = useWindowDimensions();

    const isTablet = width >= 768 && height >= 1024;
    const isPhone = width < 768;

    let deviceType = 'Unknown';

    if (Platform.OS === 'ios') {
        if (isTablet) {
            deviceType = 'iPad';
        } else if (isPhone) {
            deviceType = 'iPhone';
        }
    } else if (Platform.OS === 'android') {
        if (isTablet) {
            deviceType = 'Android Tablet';
        } else if (isPhone) {
            deviceType = 'Android Phone';
        }
    }

    let inputWidth = width;
    let space = width;
    let imageWidth = width;
    let imageHeight = height;
    let fontSize = width;
    let size = width;
    let padding = 0;
    let paddingSize = 0;
    let fontSizeBtn = width;
    let heightBtn = 0;
    let modalWidth = 0
    let top = 0
    let left = 0

    if (deviceType === 'iPad' || deviceType === 'Android Tablet') {
        inputWidth = width * 0.9;
        space = width * 0.05;
        imageWidth = width * 0.25;
        imageHeight = width * 0.25;
        fontSize = width * 0.025;
        size = 0.5;
        padding = 18;
        paddingSize = 0.5;
        fontSizeBtn = width * 0.055;
        heightBtn = 65;
        modalWidth = width * 0.4
        top = width * 0.095
        left = width * 0.05
    } else {
        inputWidth = width * 0.9;
        space = width * 0.08;
        imageWidth = width * 0.25;
        imageHeight = width * 0.25;
        fontSize = width * 0.04;
        size = 1;
        padding = 15;
        paddingSize = 0.4;
        fontSizeBtn = width * 0.04;
        heightBtn = 55;
        modalWidth = width * 0.6
        top = width * 0.22
        left = width * 0.1
    }

    return {
        inputWidth,
        space,
        imageWidth,
        imageHeight,
        fontSize,
        size,
        padding,
        paddingSize,
        fontSizeBtn,
        heightBtn,
        modalWidth,
        left,
        top
    };
};

export default useResponsiveStyles;
