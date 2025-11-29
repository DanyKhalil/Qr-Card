import React, { useState } from 'react';
import { View,  Text,  TouchableOpacity, Alert,StyleSheet } from 'react-native';
import CustomFieldsManager from './CustomField/CustomFieldsManager';
import CustomItemsManager from './CustomItemManager/CustomItemsManager';
import EditCustomTypeModal from './CustomType/EditCustomTypeModal';
import { Ionicons } from '@expo/vector-icons';

const CustomContentTypeCard = ({ 
  contentType, 
  onUpdateType, 
  onDeleteType,
  onUpdateFields,
  onUpdateItems 
}) => {
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [manageFieldsModalVisible, setManageFieldsModalVisible] = useState(false);
  const [manageItemsModalVisible, setManageItemsModalVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Content Type',
      `Are you sure you want to delete "${contentType.name}"? This will also delete all its items.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteType(contentType.id)
        }
      ]
    );
  };

  return (
    <View style={styles.contentTypeCard}>
      <View style={styles.contentTypeHeader}>
        <View style={styles.contentTypeInfo}>
          <View style={styles.typeNameContainer}>
            <Text style={styles.typeName}>
              {contentType.name}
            </Text>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => setEditTypeModalVisible(true)}
            >
              <Ionicons name="pencil-outline" size={20} color="#2196f3" />
            </TouchableOpacity>
          </View>
          
          {/* <Text style={styles.typeSlug}>{contentType.slug}</Text> */}
          
          {contentType.description && (
            <Text style={styles.typeDescription}>{contentType.description}</Text>
          )}
        </View>
        
        <View style={styles.contentTypeStats}>
          <View style={styles.stat}>
            <Text style={styles.statText}>{contentType.fields?.length || 0} fields</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{contentType.items?.length || 0} items</Text>
          </View>
        </View>

        <View style={styles.contentTypeActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.fieldsBtn]}
            onPress={() => setManageFieldsModalVisible(true)}
          >
            <Ionicons name="list-outline" size={20} color="#9c27b0" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.itemsBtn]}
            onPress={() => setManageItemsModalVisible(true)}
          >
            <Ionicons name="albums-outline" size={20} color="#4caebb" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      <EditCustomTypeModal
        visible={editTypeModalVisible}
        onClose={() => setEditTypeModalVisible(false)}
        contentType={contentType}
        onUpdate={onUpdateType}
      />

      <CustomFieldsManager
        visible={manageFieldsModalVisible}
        onClose={() => setManageFieldsModalVisible(false)}
        contentType={contentType}
        onUpdateFields={onUpdateFields}
      />

      <CustomItemsManager
        visible={manageItemsModalVisible}
        onClose={() => setManageItemsModalVisible(false)}
        contentType={contentType}
        onUpdateItems={onUpdateItems}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentTypeCard: {
    borderWidth: 1,
    borderColor: '#FF8559',
    backgroundColor: '#fdf2ee',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  contentTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  contentTypeInfo: {
    flex: 1,
  },
  typeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  typeSlug: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  typeDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  contentTypeStats: {
    gap: 4,
    minWidth: 80,
  },
  stat: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  contentTypeActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    marginLeft: 4,
  },
  fieldsBtn: {
    backgroundColor: '#9cdaa7',
    borderColor: '#9c27b0',
  },
  itemsBtn: {
    backgroundColor: '#c0dafa',
    borderColor: '#4caebb',
  },
  deleteBtn: {
    backgroundColor: '#f3a7b2',
    borderColor: '#f44336',
  },
});

export default CustomContentTypeCard;