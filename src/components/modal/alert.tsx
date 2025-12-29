import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
    visible: boolean;
    type?: AlertType;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    showCancelButton?: boolean;
    icon?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    onClose,
    showCancelButton = false,
    icon,
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return {
                    name: 'check-circle',
                    color: '#51cf66',
                    bg: '#e7f5e7',
                };
            case 'error':
                return {
                    name: 'alert-circle',
                    color: '#ff6b6b',
                    bg: '#ffe5e5',
                };
            case 'warning':
                return {
                    name: 'alert-triangle',
                    color: '#ffa94d',
                    bg: '#fff4e6',
                };
            case 'info':
            default:
                return {
                    name: 'info',
                    color: '#4dabf7',
                    bg: '#e7f5ff',
                };
        }
    };

    const handleConfirm = () => {
        onConfirm?.();
        onClose?.();
    };

    const handleCancel = () => {
        onCancel?.();
        onClose?.();
    };

    const iconConfig = getIconConfig();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.alertContainer}>
                            {/* Icon */}
                            <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
                                <Feather name={icon || iconConfig.name} size={40} color={iconConfig.color} />
                            </View>

                            {/* Title */}
                            {title && <Text style={styles.title}>{title}</Text>}

                            {/* Message */}
                            <Text style={styles.message}>{message}</Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {showCancelButton && (
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={handleCancel}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                        { backgroundColor: iconConfig.color },
                                        showCancelButton && { flex: 1 },
                                    ]}
                                    onPress={handleConfirm}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    confirmButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

export default CustomAlert;