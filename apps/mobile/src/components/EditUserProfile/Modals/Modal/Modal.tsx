import React, { useEffect, useRef } from "react";
import { 
    Modal, 
    View, 
    Text, 
    Pressable, 
    StyleSheet, 
    Animated, 
    TouchableWithoutFeedback,
    SafeAreaView 
} from "react-native";

const AppModal = ({ visible, onClose, children, title }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 30,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.backdrop, { opacity }]} />
            </TouchableWithoutFeedback>

            <SafeAreaView style={styles.centeredView} pointerEvents="box-none">
                <Animated.View 
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] }
                    ]}
                >
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>

                            <Pressable onPress={onClose} style={styles.closeBtn}>
                                <Text style={styles.closeText}>×</Text>
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.content}>
                        {children}
                    </View>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingTop: 10,
        width: "100%",
        maxHeight: "85%",
        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,

        elevation: 6,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
    },

    closeBtn: {
        padding: 4,
        borderRadius: 4,
    },

    closeText: {
        fontSize: 28,
        color: "#666",
        marginTop: -6,
    },

    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    }
});

export default AppModal;
