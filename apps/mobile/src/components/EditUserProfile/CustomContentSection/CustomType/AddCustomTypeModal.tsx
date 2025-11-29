import React, { useState, useEffect } from 'react';
import { View, Text,   TextInput,ScrollView, StyleSheet } from 'react-native';
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
      <ScrollView style={styles.container}>
        <View style={styles.formContent}>
          <Text style={styles.label}>
            Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="e.g., Projects, Recipes, Portfolio"
            style={styles.input}
            autoFocus
          />
        </View>

        {/* <View style={styles.formContent}>
          <Text style={styles.label}>
            Slug *
          </Text>
          <TextInput
            value={slug}
            onChangeText={handleSlugChange}
            placeholder="e.g., projects, recipes"
            style={styles.input}
          />
          <Text style={styles.slugHint}>
            Used in URLs. Only lowercase letters, numbers, and hyphens.
          </Text>
        </View> */}

        <View style={styles.formContent}>
          <Text style={styles.label}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of this content type..."
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
    paddingBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#FF8559',
    backgroundColor: '#fdf2ee',
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  slugHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginTop: 20,
  },
  actionBtn: {
    minWidth: 150,
  },
});

export default AddCustomTypeModal;