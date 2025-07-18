import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DocumentPreviewList = ({documents, onPreview, onRemove}) => {
  if (!documents || documents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No documents uploaded yet</Text>
      </View>
    );
  }

  const renderItem = ({item, index}) => (
    <View style={styles.itemContainer}>
      <View style={styles.fileInfo}>
        <Ionicons name="document-text-outline" size={20} color="#555" />
        <Text style={styles.fileName}>{item.filename || 'Unnamed File'}</Text>
      </View>

      <View style={styles.actions}>
        {onPreview && (
          <TouchableOpacity onPress={() => onPreview(item)}>
            <Ionicons name="eye-outline" size={20} color="#007bff" />
          </TouchableOpacity>
        )}
        {onRemove && (
          <TouchableOpacity onPress={() => onRemove(index)}>
            <Ionicons
              name="trash-outline"
              size={20}
              color="#dc3545"
              style={styles.trashIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={documents}
      keyExtractor={(item, index) => `${item?.name}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default DocumentPreviewList;

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContainer: {
    paddingBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileName: {
    fontSize: 15,
    marginLeft: 8,
    color: '#333',
    maxWidth: 200,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  trashIcon: {
    marginLeft: 16,
  },
});
