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
    borderColor: '#A29BFF',       // soft lavender border
    backgroundColor: '#F5F4FF',   // very light lavender background
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  contentTypeHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  contentTypeInfo: {
    flex: 1,
  },
  typeNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E2B5F', // dark indigo
  },
  typeDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  contentTypeStats: {
    flexDirection: 'row',
    gap: 4,
    minWidth: 80,
  },
  stat: {
    backgroundColor: '#EDEBFF', // lavender stat background
    borderWidth: 1,
    borderColor: '#D1CFFF',     // soft lavender border
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#4B47A1', // medium indigo
  },
  contentTypeActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 20,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#D1CFFF', // light lavender
    borderColor: '#6C63FF',     // indigo border
  },
  fieldsBtn: {
    backgroundColor: '#E8E4FF', // very light lavender
    borderColor: '#9C94FF',     // soft indigo
  },
  itemsBtn: {
    backgroundColor: '#EDE8FF', // light lavender
    borderColor: '#7F78D2',     // medium indigo
  },
  deleteBtn: {
    backgroundColor: '#FFE6E6', // light red
    borderColor: '#F44336',     // classic danger red
  },
});


export default CustomContentTypeCard;