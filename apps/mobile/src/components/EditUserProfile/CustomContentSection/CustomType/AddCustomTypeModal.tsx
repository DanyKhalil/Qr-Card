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

const AddCustomTypeModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setSlug('');
      setDescription('');
    }
  }, [visible]);

  const handleNameChange = (text) => {
    setName(text);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(text.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleSlugChange = (text) => {
    setSlug(text.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = () => {
    if (name.trim() && slug.trim()) {
      onAdd({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setSlug('');
    setDescription('');
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      onClose={handleCancel}
      title="Add Content Type"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          <Text style={styles.label}>
            Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
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
            onChangeText={handleSlugChange}
            placeholder="e.g., projects, recipes"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <Text style={styles.slugHint}>
            Used in URLs. Only lowercase letters, numbers, and hyphens.
          </Text>
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
            text="Add Content Type"
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
  slugHint: {
    fontSize: 12,
    color: '#6B63FF',
    marginTop: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0DEFF',
    marginTop: 20,
  },
  actionBtn: {
    minWidth: 150,
  },
});

export default AddCustomTypeModal;