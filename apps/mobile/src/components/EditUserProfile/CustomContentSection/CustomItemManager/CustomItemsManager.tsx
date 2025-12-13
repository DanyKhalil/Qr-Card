import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions
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

  const handleSaveAndClose = () => {
    onUpdateItems(contentType.id, items);
    onClose();
  };

  // Helper function to get image URL from value
  const getImageUrl = (value) => {
    if (!value) return null;
    
    let url = null;
    
    // Handle different value types
    if (typeof value === 'string') {
      url = value;
    } else if (value && typeof value === 'object') {
      // Handle File objects or image data objects
      if (value.uri) {
        url = value.uri;
      } else if (value.url) {
        url = value.url;
      }
    }
    
    // Validate if it's actually an image URL
    if (!url || typeof url !== 'string') return null;
    
    // Check if it's a valid image URL pattern
    const isImageUrlPattern = (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('file://') ||
      url.startsWith('/') ||
      url.includes('blob:') ||
      url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i)
    );
    
    return isImageUrlPattern ? url : null;
  };

  // Helper function to check if value should display as image
  const shouldDisplayAsImage = (value, fieldType) => {
    if (fieldType === 'image') return true;
    
    // Check if value looks like an image
    const url = getImageUrl(value);
    return !!url;
  };

  // Helper function to get display text for non-image values
  const getDisplayText = (value) => {
    if (value === null || value === undefined || value === '') {
      return '[Empty]';
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle File/Image objects
    if (value && typeof value === 'object') {
      if (value.name) {
        return `📄 ${value.name}`;
      }
      
      // Check if it's an empty object
      if (Object.keys(value).length === 0) {
        return '[Empty Object]';
      }
      
      // Try to stringify, but limit length
      try {
        const str = JSON.stringify(value);
        return str.length > 50 ? str.substring(0, 50) + '...' : str;
      } catch (e) {
        return '[Object]';
      }
    }
    
    // Handle strings and numbers
    const stringValue = String(value);
    
    // Truncate very long text
    if (stringValue.length > 100) {
      return stringValue.substring(0, 100) + '...';
    }
    
    return stringValue;
  };

  // Get display value for field
  const getDisplayValue = (value, fieldType) => {
    const isImage = shouldDisplayAsImage(value, fieldType);
    const imageUrl = isImage ? getImageUrl(value) : null;
    
    return {
      isImage,
      imageUrl,
      displayText: getDisplayText(value),
      isFileObject: value && typeof value === 'object' && value.name
    };
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage ${contentType?.name || 'Items'}`}
      size="large"
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

        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={true}>
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
                      <Text style={styles.itemDate}>
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemActions}>
                    <TouchableOpacity 
                      style={[styles.itemActionBtn, styles.editBtn]}
                      onPress={() => {
                        setCurrentItem(item);
                        setEditItemModalVisible(true);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#6B63FF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.itemActionBtn, styles.deleteBtn]}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#C5B3FF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemValues}>
                  {item.values && item.values.length > 0 ? (
                    <View style={styles.valuesGrid}>
                      {item.values.map((value, index) => {
                        const display = getDisplayValue(value.value, value.field_type);
                        
                        return (
                          <View key={index} style={[
                            styles.valueItem,
                            display.isImage && styles.imageValueItem
                          ]}>
                            <Text style={styles.valueLabel}>
                              {value.field_label || value.field_name}:
                            </Text>
                            
                            {display.isImage && display.imageUrl ? (
                              <View style={styles.imageValueContent}>
                                <View style={styles.imagePreviewWrapper}>
                                  <Image 
                                    source={{ uri: display.imageUrl }} 
                                    style={styles.itemImagePreview}
                                    resizeMode="contain"
                                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                                  />
                                </View>
                                {display.isFileObject && (
                                  <View style={styles.imageFileInfo}>
                                    <Text style={styles.fileInfoText}>
                                      📎 {value.value.name}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View style={styles.valueContent}>
                                <Text style={styles.valueText}>
                                  {display.displayText}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
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

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  itemsManager: {
    height: 500,
    flexDirection: 'column',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DEFF',
  },
  itemsDescription: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#6B63FF',
    flex: 1,
    marginRight: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  addItemBtn: {
    backgroundColor: '#6B63FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addItemBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  itemsList: {
    flex: 1,
    marginBottom: 16,
  },
  emptyItems: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyItemsText: {
    color: '#818cf8',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  itemCard: {
    backgroundColor: '#F8F6FF',
    borderWidth: 1,
    borderColor: '#D6C9FF',
    borderRadius: 8,
    padding: 16,
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
    color: '#4338ca',
    marginBottom: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  itemMeta: {
    flexDirection: 'row',
  },
  itemDate: {
    fontSize: 12,
    color: '#6B63FF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  itemActionBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D6C9FF',
    borderRadius: 6,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#D6C9FF',
    borderColor: '#6B63FF',
  },
  deleteBtn: {
    backgroundColor: '#F0E0FF',
    borderColor: '#A9A1FF',
  },
  itemValues: {
    borderTopWidth: 1,
    borderTopColor: '#D6C9FF',
    paddingTop: 12,
  },
  valuesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  valueItem: {
    gap: 6,
  },
  imageValueItem: {
    // Image items can have special styling
  },
  valueLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  valueContent: {
    borderWidth: 1,
    borderColor: '#D6C9FF',
    backgroundColor: '#F8F6FF',
    padding: 10,
    borderRadius: 4,
    minHeight: 40,
  },
  valueText: {
    fontSize: 14,
    color: '#4338ca',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 20,
  },
  // Image display styles
  imageValueContent: {
    borderWidth: 1,
    borderColor: '#D6C9FF',
    backgroundColor: '#F8F6FF',
    borderRadius: 4,
    padding: 8,
    overflow: 'hidden',
  },
  imagePreviewWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#EDE6FF',
    borderRadius: 4,
    minHeight: 120,
  },
  itemImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
  imageFileInfo: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#E0DEFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C9BEFF',
  },
  fileInfoText: {
    fontSize: 12,
    color: '#4338ca',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  noValues: {
    alignItems: 'center',
    padding: 16,
  },
  noValuesText: {
    color: '#818cf8',
    fontStyle: 'italic',
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  itemsManagerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0DEFF',
  },
});

export default CustomItemsManager;