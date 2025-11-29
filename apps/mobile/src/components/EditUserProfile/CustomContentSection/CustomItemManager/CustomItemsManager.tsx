import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet 
} from 'react-native';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import { Ionicons } from '@expo/vector-icons';

const CustomItemsManager = ({ visible, onClose, contentType, onUpdateItems }) => {
  const [items, setItems] = useState([]);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (contentType && visible) {
      setItems([...contentType.items]);
    }
  }, [contentType, visible]);

  const handleAddItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updatedItems = [...items, itemWithId];
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleUpdateItem = (itemId, updatedItem) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updatedItem } : item
    );
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedItems = items.filter(item => item.id !== itemId);
            setItems(updatedItems);
            onUpdateItems(contentType.id, updatedItems);
          }
        }
      ]
    );
  };

  const handleToggleVisibility = (itemId) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, visibility: !item.visibility } : item
    );
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleSaveAndClose = () => {
    onUpdateItems(contentType.id, items);
    onClose();
  };

  const truncateValue = (value, maxLength = 100) => {
    const stringValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value || '');
    
    return stringValue.length > maxLength 
      ? stringValue.substring(0, maxLength) + '...' 
      : stringValue;
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage ${contentType?.name || 'Items'}`}
    >
      <View style={styles.itemsManager}>
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsDescription}>
            Manage your {contentType?.name?.toLowerCase() || 'content'} items.
          </Text>
          <TouchableOpacity 
            style={styles.addItemBtn}
            onPress={() => setAddItemModalVisible(true)}
          >
            <Text style={styles.addItemBtnText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.itemsList}>
          {items.length === 0 ? (
            <View style={styles.emptyItems}>
              <Text style={styles.emptyItemsText}>No items yet. Add your first item to get started.</Text>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleSection}>
                    <Text style={styles.itemTitle}>{item.title || 'Untitled Item'}</Text>
                    <View style={styles.itemMeta}>
                      {/* <View style={[
                        styles.itemVisibility,
                        item.visibility ? styles.visible : styles.hidden
                      ]}>
                        <Text style={styles.visibilityText}>
                          {item.visibility ? 'Visible' : 'Hidden'}
                        </Text>
                      </View>
                      <Text style={styles.itemDate}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text> */}
                    </View>
                  </View>
                  
                  <View style={styles.itemActions}>
                    {/* <TouchableOpacity 
                      style={[styles.itemActionBtn, styles.visibilityBtn]}
                      onPress={() => handleToggleVisibility(item.id)}
                    >
                      <Ionicons 
                        name={item.visibility ? "eye-outline" : "eye-off-outline"} 
                        size={18} 
                        color="#333" 
                      />
                    </TouchableOpacity> */}
                    <TouchableOpacity 
                      style={[styles.itemActionBtn, styles.editBtn]}
                      onPress={() => {
                        setCurrentItem(item);
                        setEditItemModalVisible(true);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#2196f3" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.itemActionBtn, styles.deleteBtn]}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemValues}>
                  {item.values && item.values.length > 0 ? (
                    <View style={styles.valuesGrid}>
                      {item.values.map((value, index) => (
                        <View key={index} style={styles.valueItem}>
                          <Text style={styles.valueLabel}>
                            {value.field_label || value.field_name}:
                          </Text>
                          <View style={styles.valueContent}>
                            <Text style={styles.valueText}>
                              {truncateValue(value.value)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.noValues}>
                      <Text style={styles.noValuesText}>No field values set</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.itemsManagerActions}>
          <Button 
            text="Done"
            color="green"
            onPress={handleSaveAndClose}
          />
        </View>

        <AddItemModal
          visible={addItemModalVisible}
          onClose={() => setAddItemModalVisible(false)}
          onAdd={handleAddItem}
          contentType={contentType}
        />

        <EditItemModal
          visible={editItemModalVisible}
          onClose={() => setEditItemModalVisible(false)}
          item={currentItem}
          onUpdate={handleUpdateItem}
          contentType={contentType}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  itemsManager: {
    flex: 1,
    maxHeight: 700,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  itemsDescription: {
    color: '#666',
    flex: 1,
    marginRight: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  addItemBtn: {
    backgroundColor: '#82c294',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addItemBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  itemsList: {
    flex: 1,
    marginBottom: 16,
  },
  emptyItems: {
    alignItems: 'center',
    padding: 48,
  },
  emptyItemsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#fffafa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitleSection: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  itemVisibility: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  visible: {
    backgroundColor: '#e8f5e8',
  },
  hidden: {
    backgroundColor: '#fff3e0',
  },
  visibilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  itemActionBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 6,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityBtn: {
    // Default styles
  },
  editBtn: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  deleteBtn: {
    backgroundColor: '#f3a7b2',
    borderColor: '#f44336',
  },
  itemValues: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  valuesGrid: {
    gap: 12,
  },
  valueItem: {
    gap: 4,
  },
  valueLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  valueContent: {
    borderWidth: 1,
    borderColor: '#FF8559',
    backgroundColor: '#fdf2ee',
    padding: 8,
    borderRadius: 4,
  },
  valueText: {
    fontSize: 14,
    color: '#333',
  },
  noValues: {
    alignItems: 'center',
    padding: 12,
  },
  noValuesText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 14,
  },
  itemsManagerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
});

export default CustomItemsManager;