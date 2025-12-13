import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';

const EditCustomTypeModal = ({ visible, onClose, contentType, onUpdate }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (contentType && visible) {
      setName(contentType.name || '');
      setSlug(contentType.slug || '');
      setDescription(contentType.description || '');
    }
  }, [contentType, visible]);

  const handleSubmit = () => {
    if (name.trim() && slug.trim()) {
      onUpdate(contentType.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      onClose={handleCancel}
      title="Edit Content Type"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          <Text style={styles.label}>
            Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Projects, Recipes, Portfolio"
            placeholderTextColor="#888"
            style={styles.input}
            autoFocus
          />
        </View>

        <View style={styles.formContent}>
          <Text style={styles.label}>
            Slug *
          </Text>
          <TextInput
            value={slug}
            onChangeText={(text) => setSlug(text.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="e.g., projects, recipes"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

        <View style={styles.formContent}>
          <Text style={styles.label}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of this content type..."
            placeholderTextColor="#888"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formActions}>
          <Button 
            text="Cancel"
            color="coral"
            onPress={handleCancel}
            style={styles.actionBtn}
          />
          <Button 
            text="Save Changes"
            color="green"
            onPress={handleSubmit}
            disabled={!name.trim() || !slug.trim()}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DEFF',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#C5B3FF',
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'column',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0DEFF',
    marginTop: 20,
    width: '100%',
  },
  actionBtn: {
    minWidth: 150,
    width: '100%',
  },
});

export default EditCustomTypeModal;