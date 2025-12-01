import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView,StyleSheet } from 'react-native';
import CustomContentTypeCard from './CustomContentTypeCard';
import AddCustomTypeModal from './CustomType/AddCustomTypeModal';

const CustomContentSection = ({ 
  customContent = [], 
  setCustomContent,
  style = {} 
}) => {
  const [addTypeModalVisible, setAddTypeModalVisible] = useState(false);

  const handleAddType = (newType) => {
    const slug = newType.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newTypeWithId = {
      ...newType,
      slug: slug,
      id: `temp-${Date.now()}`,
      fields: [],
      items: []
    };
    setCustomContent([...customContent, newTypeWithId]);
  };

  const handleUpdateType = (typeId, updatedType) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { 
        ...type, 
        name: updatedType.name,
        description: updatedType.description 
      } : type
    ));
  };

  const handleDeleteType = (typeId) => {
    setCustomContent(customContent.filter(type => type.id !== typeId));
  };

  const handleUpdateFields = (typeId, fields) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { ...type, fields } : type
    ));
  };

  const handleUpdateItems = (typeId, items) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { ...type, items } : type
    ));
  };

  return (
    <View style={[styles.customContentSection, style]}>
      <View style={styles.customContentHeader}>
        <Text style={styles.customContentTitle}>Custom Content</Text>
        <TouchableOpacity 
          style={styles.addTypeBtn}
          onPress={() => setAddTypeModalVisible(true)}
        >
          <Text style={styles.addTypeBtnText}>+ Add Content Type</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.customTypesGrid}>
        {customContent.map((contentType) => (
          <CustomContentTypeCard
            key={contentType.id}
            contentType={contentType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
            onUpdateFields={handleUpdateFields}
            onUpdateItems={handleUpdateItems}
          />
        ))}
        
        {customContent.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No custom content types yet.</Text>
            <Text style={styles.emptyStateText}>Click "Add Content Type" to get started.</Text>
          </View>
        )}
      </ScrollView>

      <AddCustomTypeModal
        visible={addTypeModalVisible}
        onClose={() => setAddTypeModalVisible(false)}
        onAdd={handleAddType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  customContentSection: {
    marginVertical: 80,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  customContentHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  customContentTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
    lineHeight: 32,
  },
  addTypeBtn: {
    backgroundColor: '#82c294',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addTypeBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  customTypesGrid: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
  },
});

export default CustomContentSection;