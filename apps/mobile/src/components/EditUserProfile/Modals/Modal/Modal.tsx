import React, { useEffect, useRef } from "react";
import {  Modal,  View,  Animated,  TouchableWithoutFeedback,  SafeAreaView,  ScrollView, StyleSheet} from "react-native";

const AppModal = ({ visible, onClose, children, title }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 30, duration: 200, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.backdrop, { opacity }]} />
            </TouchableWithoutFeedback>

            <SafeAreaView style={styles.centeredView} pointerEvents="box-none">
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                    {title && <View style={styles.header}>{/* you can add a title Text here if needed */}</View>}

                    <ScrollView 
                        style={styles.scrollContent} 
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    modalContainer: {
        maxHeight: "85%", // max height of modal
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        overflow: "hidden",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});

export default AppModal;
